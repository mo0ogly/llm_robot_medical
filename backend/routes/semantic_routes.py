import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np

router = APIRouter()

class SemanticScoreRequest(BaseModel):
    text_a: str
    text_b: str

# Lazy loading of the model to avoid blocking startup if not used
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            # Using a fast, small model for real-time scoring
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except ImportError:
            raise HTTPException(status_code=500, detail="sentence-transformers is not installed")
    return _model

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    # Ensure float type and handle zero division
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

@router.post("/api/semantic/score")
async def semantic_score(req: SemanticScoreRequest):
    try:
        model = get_model()
        
        # Calculate embeddings
        emb_a = model.encode(req.text_a)
        emb_b = model.encode(req.text_b)
        
        # Calculate similarity and divergence (1 - similarity)
        # Bounded between 0 and 1
        sim = cosine_similarity(emb_a, emb_b)
        divergence = max(0.0, min(1.0, 1.0 - sim))
        
        # Determine label based on roadmap thresholds
        # 0-30% : NORMAL
        # 30-60% : SUSPICIOUS
        # 60-100% : COMPROMISED
        percent = divergence * 100
        if percent < 30:
            label = "NORMAL"
        elif percent < 60:
            label = "SUSPICIOUS"
        else:
            label = "COMPROMISED"
            
        return {
            "score": round(divergence, 4),
            "percentage": round(percent, 1),
            "label": label
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
