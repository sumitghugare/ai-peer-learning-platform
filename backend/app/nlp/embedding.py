# backend/app/nlp/embedding.py

import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text: str):
    """
    Convert text to embedding (list for DB storage)
    """
    return model.encode(text).tolist()


def similarity_from_embeddings(e1, e2) -> float:
    """
    Compute cosine similarity between two embeddings
    """
    return float(cosine_similarity([e1], [e2])[0][0])
