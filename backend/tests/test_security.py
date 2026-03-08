from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_cyber_query_rejection_of_empty_payload():
    # Envoi d'un payload vide
    response = client.post("/api/cyber_query/stream", json={})
    # FastAPI devrait rejeter le payload car "chat_history" est manquant (422 Unprocessable Entity)
    assert response.status_code == 422 

def test_cyber_query_rejection_of_malformed_input():
    # Envoi de donnees malformees (ex: injection SQL basique, meme si on n'a pas de BDD, on verifie que Pydantic fait son travail ou que la route l'accepte mais le traite comme du texte inoffensif par le LLM)
    response = client.post("/api/cyber_query/stream", json={"chat_history": [{"role": "user", "content": "SELECT * FROM users;"}]})
    # Le serveur devrait répondre 200 (le stream commence) car Pydantic valide le schéma,
    # c'est ensuite au LLM (Aegis) d'ignorer la fausse injection.
    assert response.status_code == 200

def test_query_rejection_of_missing_record():
    response = client.post("/api/query/stream", json={"situation": "Urgence"})
    assert response.status_code == 422
