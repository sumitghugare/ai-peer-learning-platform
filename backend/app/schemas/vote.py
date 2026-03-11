from pydantic import BaseModel

class VoteCreate(BaseModel):
    # user_id: int
    answer_id: int
    value: int  # +1 or -1

