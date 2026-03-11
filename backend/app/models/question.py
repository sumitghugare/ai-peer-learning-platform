from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from datetime import datetime
from app.database import Base


class Question(Base):
    __tablename__ = "questions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    tags = Column(String)

    # NLP embedding (Phase 2)
    embedding = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
