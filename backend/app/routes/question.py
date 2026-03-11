# # from fastapi import APIRouter, Depends
# # from sqlalchemy.orm import Session

# # from app.database import get_db
# # from app.models.question import Question
# # from app.schemas.question import QuestionCreate

# # router = APIRouter(
# #     prefix="/questions",
# #     tags=["Questions"]
# # )

# # @router.get("/")
# # def get_questions(db: Session = Depends(get_db)):
# #     return db.query(Question).all()

# # @router.post("/")
# # def create_question(
# #     question: QuestionCreate,
# #     db: Session = Depends(get_db)
# # ):
# #     new_question = Question(
# #         title=question.title,
# #         body=question.body,
# #         tags=question.tags,
# #         user_id=question.user_id
# #     )

# #     db.add(new_question)
# #     db.commit()
# #     db.refresh(new_question)

# #     return new_question

# # from fastapi import Query

# # @router.get("/search")
# # def search_questions(
# #     q: str = Query("", description="Search keyword"),
# #     tag: str = Query("", description="Filter by tag"),
# #     db: Session = Depends(get_db)
# # ):
# #     query = db.query(Question)

# #     if q:
# #         query = query.filter(
# #             Question.title.ilike(f"%{q}%") |
# #             Question.body.ilike(f"%{q}%")
# #         )

# #     if tag:
# #         query = query.filter(
# #             Question.tags.ilike(f"%{tag}%")
# #         )

# #     return query.order_by(Question.id.desc()).all()

# # from app.nlp.embedding import similarity

# # @router.post("/check-duplicate")
# # def check_duplicate_question(
# #     title: str,
# #     body: str,
# #     db: Session = Depends(get_db)
# # ):
# #     text = f"{title} {body}"

# #     questions = db.query(Question).all()

# #     results = []
# #     for q in questions:
# #         existing_text = f"{q.title} {q.body}"
# #         score = similarity(text, existing_text)

# #         if score > 0.8:
# #             results.append({
# #                 "id": q.id,
# #                 "title": q.title,
# #                 "similarity": round(score, 2)
# #             })

# #     return sorted(results, key=lambda x: x["similarity"], reverse=True)[:3]

# from fastapi import APIRouter, Depends, Query
# from sqlalchemy.orm import Session
# import json

# from app.database import get_db
# from app.models.question import Question
# from app.schemas.question import QuestionCreate
# from app.nlp.embedding import get_embedding, similarity_from_embeddings

# router = APIRouter(
#     prefix="/questions",
#     tags=["Questions"]
# )

# # -----------------------------
# # GET ALL QUESTIONS
# # -----------------------------
# @router.get("/")
# def get_questions(db: Session = Depends(get_db)):
#     return db.query(Question).order_by(Question.id.desc()).all()


# # -----------------------------
# # CREATE QUESTION (PHASE 3)
# # -----------------------------
# @router.post("/")
# def create_question(
#     question: QuestionCreate,
#     db: Session = Depends(get_db)
# ):
#     # 🔹 Combine text
#     text = f"{question.title} {question.body}"

#     # 🔹 Generate embedding ONCE
#     embedding = get_embedding(text)

#     new_question = Question(
#         title=question.title,
#         body=question.body,
#         tags=question.tags,
#         user_id=question.user_id,
#         embedding=json.dumps(embedding)  # ✅ STORE EMBEDDING
#     )

#     db.add(new_question)
#     db.commit()
#     db.refresh(new_question)

#     return new_question


# # -----------------------------
# # SEARCH QUESTIONS
# # -----------------------------
# @router.get("/search")
# def search_questions(
#     q: str = Query("", description="Search keyword"),
#     tag: str = Query("", description="Filter by tag"),
#     db: Session = Depends(get_db)
# ):
#     query = db.query(Question)

#     if q:
#         query = query.filter(
#             Question.title.ilike(f"%{q}%") |
#             Question.body.ilike(f"%{q}%")
#         )

#     if tag:
#         query = query.filter(
#             Question.tags.ilike(f"%{tag}%")
#         )

#     return query.order_by(Question.id.desc()).all()


# # -----------------------------
# # DUPLICATE CHECK (PHASE 3)
# # -----------------------------
# @router.post("/check-duplicate")
# def check_duplicate_question(
#     title: str,
#     body: str,
#     db: Session = Depends(get_db)
# ):
#     # 🔹 New question embedding
#     new_text = f"{title} {body}"
#     new_embedding = get_embedding(new_text)

#     questions = db.query(Question).filter(Question.embedding != None).all()

#     results = []

#     for q in questions:
#         existing_embedding = json.loads(q.embedding)

#         score = similarity_from_embeddings(
#             new_embedding,
#             existing_embedding
#         )

#         if score > 0.7:  # calibrated threshold
#             results.append({
#                 "id": q.id,
#                 "title": q.title,
#                 "similarity": round(score, 2)
#             })

#     return sorted(results, key=lambda x: x["similarity"], reverse=True)[:3]
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models.question import Question
from app.schemas.question import QuestionCreate
from app.nlp.embedding import get_embedding, similarity_from_embeddings

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)

# --------------------------------------------------
# GET ALL QUESTIONS
# --------------------------------------------------
@router.get("/")
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).order_by(Question.id.desc()).all()


# --------------------------------------------------
# CREATE QUESTION (STORE EMBEDDING)
# --------------------------------------------------
# @router.post("/")
# def create_question(
#     question: QuestionCreate,
#     db: Session = Depends(get_db)
# ):

from app.dependencies.auth import get_current_user
from app.models.user import User

@router.post("")
def create_question(
    question: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    text = f"{question.title} {question.body}"
    embedding = get_embedding(text)

    new_question = Question(
        title=question.title,
        body=question.body,
        tags=question.tags,
        user_id=current_user.id,  # ✅ IMPORTANT
        embedding=json.dumps(embedding)
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question



# --------------------------------------------------
# SEARCH QUESTIONS
# --------------------------------------------------
@router.get("/search")
def search_questions(
    q: str = Query("", description="Search keyword"),
    tag: str = Query("", description="Filter by tag"),
    db: Session = Depends(get_db)
):
    query = db.query(Question)

    if q:
        query = query.filter(
            Question.title.ilike(f"%{q}%") |
            Question.body.ilike(f"%{q}%")
        )

    if tag:
        query = query.filter(
            Question.tags.ilike(f"%{tag}%")
        )

    return query.order_by(Question.id.desc()).all()


# --------------------------------------------------
# DUPLICATE QUESTION CHECK (PHASE 3 – WORKING)
# --------------------------------------------------
@router.get("/check-duplicate")
def check_duplicate_question(
    title: str = Query(..., description="Question title"),
    body: str = Query(..., description="Question body"),
    db: Session = Depends(get_db)
):
    # 🔹 New question embedding
    new_text = f"{title} {body}"
    new_embedding = get_embedding(new_text)

    # 🔹 Only compare with questions that have embeddings
    questions = db.query(Question).filter(
        Question.embedding.isnot(None)
    ).all()

    results = []

    for q in questions:
        existing_embedding = json.loads(q.embedding)

        score = similarity_from_embeddings(
            new_embedding,
            existing_embedding
        )

        # 🔥 calibrated similarity threshold
        if score >= 0.65:
            results.append({
                "id": q.id,
                "title": q.title,
                "similarity": round(score, 2)
            })

    # 🔹 Return top 3 most similar
    return sorted(
        results,
        key=lambda x: x["similarity"],
        reverse=True
    )[:3]
