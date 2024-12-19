from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException

def create_user_workout(request: schemas.UserWorkout, db: Session):
    # db_user = db.query(models.UserWorkout).filter(models.UserWorkout.email == request.email).first()
    # if db_user:
    #     raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.UserWorkout(**request.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_workout(email:str, db: Session):
    user_workouts = db.query(models.UserWorkout).filter(models.UserWorkout.email == email).all()
    if not user_workouts:
        raise HTTPException(status_code=404, detail="User not found")
    return user_workouts

def update_user_workout(email: str, id: int, user_workout: dict, db: Session):
    # Query the database for the user workout
    db_user_workout = db.query(models.UserWorkout).filter(
        models.UserWorkout.email == email,
        models.UserWorkout.id == id
    ).first()
    
    # Check if the workout exists
    if not db_user_workout:
        raise HTTPException(status_code=404, detail="User workout not found")
    
    # Update fields dynamically
    for key, value in user_workout.items():  # Directly use user_workout as it is a dictionary
        setattr(db_user_workout, key, value)
    
    # Commit changes to the database
    db.commit()
    db.refresh(db_user_workout)
    
    return db_user_workout

def delete_user_workout(email: str, id:int, db:Session):
    user_workout = db.query(models.UserWorkout).filter(models.UserWorkout.email == email, models.UserWorkout.id == id).first()
    if not user_workout:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user_workout)
    db.commit()
    return {"message": "User deleted successfully"}

