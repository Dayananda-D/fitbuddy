from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from .. import schemas, database, models, oauth2
from sqlalchemy.orm import Session
from ..repository import workout

router = APIRouter(
    prefix="/wokout",
    tags=['workout']
)

get_db = database.get_db

@router.post('/', response_model=schemas.UserWorkout)
def create_user_workout(request: schemas.UserWorkout, db: Session = Depends(get_db), current_user: schemas.UserAuthorized = Depends(oauth2.get_current_user)):
    return workout.create_user_workout(request, db)

@router.get("/{email}")
def get_user_workout(email: str, db: Session = Depends(get_db), current_user: schemas.UserAuthorized = Depends(oauth2.get_current_user)):
    return workout.get_user_workout(email, db)

@router.put("/{email}/{id}")
def update_user_workout(email: str, id:int, user_workout:dict, db: Session = Depends(get_db), current_user: schemas.UserAuthorized = Depends(oauth2.get_current_user)):
    return workout.update_user_workout(email,id, user_workout, db)

@router.delete("/{email}/{id}", response_model=dict)
def delete_user_workout(email: str, id:int, db: Session = Depends(get_db), current_user: schemas.UserAuthorized = Depends(oauth2.get_current_user)):
    return workout.delete_user_workout(email, id, db)
