from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json

_model = None  # global cache


def get_model():
    global _model
    if _model is None:
        print("🔄 Loading NLP model (one-time)...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def generate_embedding(text: str):
    model = get_model()
    embedding = model.encode([text])[0]
    return embedding.tolist()


def find_duplicates(new_embedding, existing_questions, threshold=0.75):
    duplicates = []

    for q in existing_questions:
        if not q.embedding:
            continue

        old_embedding = json.loads(q.embedding)

        score = cosine_similarity(
            [new_embedding], [old_embedding]
        )[0][0]

        if score >= threshold:
            duplicates.append({
                "id": q.id,
                "title": q.title,
                "similarity": round(float(score), 2)
            })

    return duplicates
