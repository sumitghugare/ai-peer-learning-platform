# from sqlalchemy import Column, Integer, String, DateTime
# from datetime import datetime

# from app.database import Base


# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True, nullable=False)
#     email = Column(String, unique=True, index=True, nullable=False)
#     password_hash = Column(String, nullable=False)
#     reputation = Column(Integer, default=0)
#     created_at = Column(DateTime, default=datetime.utcnow)
from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)

    # 🔐 IMPORTANT: this must be hashed_password
    hashed_password = Column(String, nullable=False)

    reputation = Column(Integer, default=0)
