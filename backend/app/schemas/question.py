from pydantic import BaseModel
from typing import Optional


class QuestionCreate(BaseModel):
    """
    Schema used when a user creates a new question.
    This will appear as JSON request body in Swagger.
    """
    title: str
    body: str
    tags: str
    




    class Config:
        orm_mode = True
