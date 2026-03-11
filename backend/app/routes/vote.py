# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from app.database import get_db
# from app.models.vote import Vote
# from app.schemas.vote import VoteCreate

# router = APIRouter(
#     prefix="/votes",
#     tags=["Votes"]
# )
# # @router.post("/")
# # def vote_answer(vote: VoteCreate, db: Session = Depends(get_db)):
# #     existing = db.query(Vote).filter(
# #         Vote.user_id == vote.user_id,
# #         Vote.answer_id == vote.answer_id
# #     ).first()

# #     if existing:
# #         # Same vote clicked again → remove vote
# #         if existing.value == vote.value:
# #             db.delete(existing)
# #             db.commit()
# #             return {"status": "vote removed"}
# #         else:
# #             # Change vote
# #             existing.value = vote.value
# #             db.commit()
# #             return {"status": "vote updated"}

# #     new_vote = Vote(
# #         user_id=vote.user_id,
# #         answer_id=vote.answer_id,
# #         value=vote.value
# #     )
# #     db.add(new_vote)
# #     db.commit()
# #     return {"status": "vote added"}

# from app.dependencies.auth import get_current_user
# from app.models.user import User

# @router.post("/")
# def vote_answer(
#     vote: VoteCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):

#     existing_vote = db.query(Vote).filter(
#         Vote.answer_id == vote.answer_id,
#         Vote.user_id == current_user.id
#     ).first()

#     if existing_vote:
#         existing_vote.value = vote.value
#     else:
#         new_vote = Vote(
#             user_id=current_user.id,
#             answer_id=vote.answer_id,
#             value=vote.value
#         )
#         db.add(new_vote)

#     db.commit()
#     return {"message": "Vote recorded"}


# @router.get("/answer/{answer_id}")
# def get_vote_count(answer_id: int, db: Session = Depends(get_db)):
#     votes = db.query(Vote).filter(Vote.answer_id == answer_id).all()
#     score = sum(v.value for v in votes)
#     return {"score": score}
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.vote import Vote
from app.schemas.vote import VoteCreate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/votes", tags=["Votes"])


# -----------------------------
# POST VOTE (Protected)
# -----------------------------
@router.post("/")
def vote_answer(
    vote: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # find existing vote
    existing_vote = db.query(Vote).filter(
        Vote.answer_id == vote.answer_id,
        Vote.user_id == current_user.id
    ).first()

    # 🟡 If user hasn’t voted before:
    if not existing_vote:
        new_vote = Vote(
            user_id=current_user.id,
            answer_id=vote.answer_id,
            value=vote.value
        )
        db.add(new_vote)
        db.commit()
        return {"message": "Vote recorded", "new_value": vote.value}

    # 🟡 If clicked the SAME vote again → remove it (reset)
    if existing_vote.value == vote.value:
        db.delete(existing_vote)
        db.commit()
        return {"message": "Vote removed", "new_value": 0}

    # 🟡 If different vote → switch
    existing_vote.value = vote.value
    db.commit()

    return {"message": "Vote switched", "new_value": vote.value}

# -----------------------------
# GET VOTE COUNT (Public)
# -----------------------------
@router.get("/answer/{answer_id}")
def get_vote_count(answer_id: int, db: Session = Depends(get_db)):
    votes = db.query(Vote).filter(
        Vote.answer_id == answer_id
    ).all()

    score = sum(v.value for v in votes)

    return {"score": score}
