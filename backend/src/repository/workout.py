from sqlalchemy.orm import Session
from src import models, schemas
from fastapi import HTTPException
from sqlalchemy import and_, func
from datetime import datetime, date

def create_user_workout(request: schemas.UserWorkout, db: Session):
    # db_user = db.query(models.UserWorkout).filter(models.UserWorkout.email == request.email).first()
    # if db_user:
    #     raise HTTPException(status_code=400, detail="Email already registered")
    existing_workout = db.query(models.UserWorkout).filter(
        models.UserWorkout.email == request.email,                # Match email
        func.date(models.UserWorkout.date) == request.date.date(), # Match date
        models.UserWorkout.workoutName == request.workoutName,      # Match workoutName 
        models.UserWorkout.type == request.type                #Match type
        ).first()

    if existing_workout:
        return update_user_workout(existing_workout.email, existing_workout.id, request, db)
    else:
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

# def get_user_today_workout(js_date:str, email: str, db: Session):
#     parsed_datetime = datetime.strptime(js_date, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
#     today = parsed_datetime.date()  # Extract only the date part
#     user_workouts = (
#         db.query(models.UserWorkout)
#         .filter(models.UserWorkout.email == email, func.date(models.UserWorkout.date) == today)
#         .all()
#     )
#     if not user_workouts:
#         raise HTTPException(status_code=404, detail="No workouts found for today")
#     return user_workouts
def get_user_today_workout(js_date: str, email: str, db: Session):
    # Remove the parenthesized timezone name
    js_date_cleaned = js_date.split(" (")[0]  # Removes " (India Standard Time)"
    
    # Parse the cleaned datetime string
    parsed_datetime = datetime.strptime(js_date_cleaned, "%a %b %d %Y %H:%M:%S GMT%z")
    
    # Extract only the date part
    today = parsed_datetime.date()
    
    # Query the database
    user_workouts = (
        db.query(models.UserWorkout)
        .filter(models.UserWorkout.email == email, func.date(models.UserWorkout.date) == today)
        .all()
    )
    
    if not user_workouts:
        return {"message": "No workouts found for today"}
    
    return {"message": "Workouts found for today", "workouts": user_workouts}

def update_user_workout(email: str, id: int, user_workout: dict, db: Session):
    # Query the database for the user workout
    db_user_workout = db.query(models.UserWorkout).filter(
        models.UserWorkout.email == email,
        models.UserWorkout.id == id
    ).first()
    
    # Check if the workout exists
    if not db_user_workout:
        raise HTTPException(status_code=404, detail="User workout not found")
    
    if type(user_workout) is dict:
        # Update fields dynamically
        for key, value in user_workout.items():  # Directly use user_workout as it is a dictionary
            setattr(db_user_workout, key, value)
    else:
        user_workout_dict = user_workout.dict()  # If it's a Pydantic model
        for key, value in user_workout_dict.items():
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

