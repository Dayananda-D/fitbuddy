from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class UserAuthorized(BaseModel):
    name:str
    email:str
    password:str
class User(BaseModel):
    name:str
    email:str
    password:str
    dateOfBirth: str
    level:str

class UpdateUser(BaseModel):
    selectedBodyParts:list
    goal:str
    gender:str

class UserDetails(BaseModel):
    name:str
    email:str
    dateOfBirth: str
    weight: str
    height:str
    gender:str
    level:str

class ShowUser(BaseModel):
    name:str | None = None
    email:str| None = None
    dateOfBirth: str| None = None
    weight: str| None = None
    height:str| None = None
    gender:str| None = None
    level:str| None = None
    created_at: datetime | None = None  # Allow datetime type
    selectedBodyParts: list| None = None
    goal:str| None = None

    class Config:
        orm_mode = True

    # blogs : List[Blog] =[]
    # class Config():
    #     orm_mode = True

class ShowBlog(BaseModel):
    title: str
    body:str
    creator: ShowUser

    class Config():
        orm_mode = True

class Login(BaseModel):
    username: str
    password:str


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str


class TokenData(BaseModel):
    email: Optional[str] = None

class UserWorkout(BaseModel):
    email: str| None = None
    name: str| None = None
    type: str| None = None
    gender: str| None = None
    workoutName: str| None = None
    workoutGIF: str| None = None
    workoutDuration: str| None = None
    targettedBodyPart: str| None = None
    equipment: str| None = None
    level: str| None = None
    suitableFor: str| None = None
    isCompleted: bool |None = False
    isSkipped: bool| None = False
    totalCalBurnt: str| None = None
    calBurnPerRep: str| None = None
    reps:int | None = None
    date: datetime | None = datetime.utcnow()