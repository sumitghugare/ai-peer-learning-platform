from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base

# 🔥 IMPORTANT: IMPORT MODELS (THIS FIXES YOUR ERROR)
from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer
from app.models.vote import Vote

from app.routes import auth, question, answer, vote

# ✅ NOW tables will be created correctly
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Peer Learning Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(question.router)
app.include_router(answer.router)
app.include_router(vote.router)

@app.get("/")
def root():
    return {"status": "Backend running successfully"}
