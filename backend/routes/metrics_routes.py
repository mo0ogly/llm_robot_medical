from fastapi import APIRouter
from pydantic import BaseModel
import math

try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

router = APIRouter()

class DeltaScoreRequest(BaseModel):
    safe_text: str
    hacked_text: str

def cosine_similarity(v1, v2):
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))
    if norm_v1 == 0 or norm_v2 == 0:
        return 0
    return dot_product / (norm_v1 * norm_v2)

@router.post("/api/query/deltascore")
async def calculate_deltascore(req: DeltaScoreRequest):
    if not req.safe_text and not req.hacked_text:
        return {"score": 0, "method": "empty"}
        
    if not OLLAMA_AVAILABLE or not req.safe_text or not req.hacked_text:
        # Fallback to simple length diff if ollama is missing
        diff = abs(len(req.safe_text) - len(req.hacked_text))
        max_len = max(len(req.safe_text), len(req.hacked_text), 1)
        return {"score": int((diff / max_len) * 100), "method": "fallback"}
    
    try:
        # Use llama3.2 for embeddings by default
        emb_safe = ollama.embeddings(model="llama3.2", prompt=req.safe_text)["embedding"]
        emb_hacked = ollama.embeddings(model="llama3.2", prompt=req.hacked_text)["embedding"]
        
        cos_sim = cosine_similarity(emb_safe, emb_hacked)
        
        # 1 = identical, 0 = orthogonal, -1 = opposite
        # We map (1 - cos_sim) to a 0-100 score, scaling it so 0.5 diff is 100% anomaly.
        divergence = max(0, min(100, int((1 - cos_sim) * 150)))
        
        return {"score": divergence, "method": "cosine"}
    except Exception as e:
        return {"score": 0, "method": "error", "error": str(e)}
