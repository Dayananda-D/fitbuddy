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
    name:str
    email:str
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
    email: Optional[str] = None

class UserWorkout(BaseModel):
    email: str
    name: str
    workoutName: str
    workoutGIF: str
    workoutDuration: str
    targettedBodyPart: str
    equipment: str
    level: str
    suitableFor: str
    isCompleted: bool |None = False
    isSkipped: bool
    totalCalBurnt: int
    calBurnPerRep: int
    date: datetime | None = datetime.utcnow()