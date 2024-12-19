from fastapi import APIRouter
from .. import database, schemas, models
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, status
from ..repository import user

router = APIRouter(
    prefix="/user",
    tags=['Users']
)

get_db = database.get_db

@router.post('/signup', response_model=schemas.ShowUser)
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    return user.create(request, db)

@router.put("/{user_email}")
async def update_visitor_data(user_email: str, item: schemas.UpdateUser, db: Session = Depends(get_db)):
    return  user.update_user_data(user_email, item, db)


# @router.get('/{id}', response_model=schemas.ShowUser)
# def get_user(id: int, db: Session = Depends(get_db)):
#     return user.show(id, db)
