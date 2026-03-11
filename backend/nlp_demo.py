from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 1️⃣ Load lightweight model (CPU friendly)
model = SentenceTransformer("all-MiniLM-L6-v2")

# 2️⃣ Existing questions (pretend DB)
existing_questions = [
    "What is FastAPI?",
    "How does FastAPI work?",
    "Explain Django framework",
]

# 3️⃣ New user question
new_question = "What is FastAPI framework?"

# 4️⃣ Convert text → embeddings
existing_embeddings = model.encode(existing_questions)
new_embedding = model.encode([new_question])

# 5️⃣ Calculate similarity
similarities = cosine_similarity(new_embedding, existing_embeddings)[0]

# 6️⃣ Show results
for q, score in zip(existing_questions, similarities):
    print(f"Similarity with '{q}': {score:.2f}")
