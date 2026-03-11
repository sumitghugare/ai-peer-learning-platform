from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.database import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)   # 🔥 WHO voted
    answer_id = Column(Integer, ForeignKey("answers.id"))
    value = Column(Integer)     # +1 or -1

    __table_args__ = (
        UniqueConstraint("user_id", "answer_id", name="unique_user_answer_vote"),
    )
