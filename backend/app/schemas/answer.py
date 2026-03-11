from pydantic import BaseModel

class AnswerCreate(BaseModel):
    body: str
    question_id: int
