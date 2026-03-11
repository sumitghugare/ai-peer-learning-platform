# from pydantic import BaseModel, EmailStr

# class UserCreate(BaseModel):
#     username: str
#     email: EmailStr
#     password: str


# class UserLogin(BaseModel):
#     username: str
#     password: str


# class UserResponse(BaseModel):
#     id: int
#     username: str
#     email: str
#     reputation: int

#     class Config:
#         from_attributes = True  # Pydantic v2

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    reputation: int

    class Config:
        from_attributes = True
