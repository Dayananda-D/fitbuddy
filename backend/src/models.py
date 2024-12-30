from sqlalchemy import Column, Integer, String, DateTime, Date, Float, Text, JSON, Boolean
from src.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    dateOfBirth = Column(String, nullable=True)  # Date type for date of birth
    weight = Column(Float, nullable=True)  # Float type for weight
    height = Column(Float, nullable=True)  # Float type for height
    gender = Column(String(50), nullable=True)  # String for gender
    level = Column(String(50), nullable=True)  # Existing level column
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    selectedBodyParts = Column(JSON, nullable=True)
    goal = Column(String, nullable=True)


class Exercise(Base):
    __tablename__ = 'exercises'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(100))
    body_part = Column(String(100))
    equipment = Column(String(100))
    level = Column(String(50))
    rating = Column(Float)
    rating_description = Column(Text)

class UserWorkout(Base):
    __tablename__= 'user_workout'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)
    type = Column(String, nullable=True)
    gender = Column(String(50), nullable=True)
    email = Column(String, index=True, nullable=True)
    workoutName = Column(String, nullable=True)
    workoutGIF = Column(String, nullable=True)
    workoutDuration = Column(String, nullable=True)
    targettedBodyPart = Column(String, nullable=True)
    equipment = Column(String, nullable=True)
    level = Column(String, nullable=True)
    suitableFor = Column(String, nullable=True)
    isCompleted = Column(Boolean, default=False, nullable=True)
    isSkipped = Column(Boolean, nullable=True)
    totalCalBurnt = Column(String, nullable=True)
    calBurnPerRep = Column(String, nullable=True)
    reps= Column(Integer,default=0, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, nullable=True)