from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from datetime import datetime
from app.database import Base


# class Answer(Base):
#     __tablename__ = "answers"

#     id = Column(Integer, primary_key=True, index=True)
#     question_id = Column(Integer, ForeignKey("questions.id"))
#     user_id = Column(Integer, ForeignKey("users.id"))
#     body = Column(Text, nullable=False)
#     score = Column(Integer, default=0)
#     created_at = Column(DateTime, default=datetime.utcnow)


from sqlalchemy import Column, Integer, Text, ForeignKey
from app.database import Base

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    body = Column(Text, nullable=False)

    question_id = Column(Integer, ForeignKey("questions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))  # ✅ ADD THIS
