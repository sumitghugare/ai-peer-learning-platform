from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.answer import Answer
from app.schemas.answer import AnswerCreate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/answers",
    tags=["Answers"]
)

@router.post("/")
def create_answer(
    answer: AnswerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_answer = Answer(
        body=answer.body,
        question_id=answer.question_id,
        user_id=current_user.id   # ✅ IMPORTANT
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    return new_answer


@router.get("/question/{question_id}")
def get_answers(question_id: int, db: Session = Depends(get_db)):
    return db.query(Answer).filter(
        Answer.question_id == question_id
    ).all()
