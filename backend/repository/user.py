
from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException, status
from ..hashing import Hash


def create(request: schemas.User, db: Session):
    new_user = models.User(
        name=request.name, email=request.email, password=Hash.bcrypt(request.password), dateOfBirth=request.dateOfBirth, level=request.level)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# def create(request: schemas.User, db: Session):
#     new_user = models.User(
#         goal=request.goal, gender=request.gender, selectedBodyParts=request.selectedBodyParts)
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user

def update_user_data(user_email, item, db):
    update_data = item.dict()
    visitor = db.query(models.User).filter(models.User.email == user_email).first()
    if not visitor:
        raise HTTPException(status_code=404, detail=f"Visitor with ID {user_email} not found")

    for key, value in update_data.items():
        setattr(visitor, key, value)

    db.commit()
    return {"message": f"Visitor with ID {user_email} updated successfully"}

def show(id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available")
    return user

def get_user_data(user_email, db):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"user {user_email} not found")
    return user