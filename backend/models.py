from sqlalchemy import Column, Integer, String, DateTime, Date, Float, Text
from .database import Base
from datetime import datetime
# from sqlalchemy.orm import relationship


# class Blog(Base):
#     __tablename__ = 'blogs'

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String)
#     body = Column(String)
#     user_id = Column(Integer, ForeignKey('users.id'))

#     creator = relationship("User", back_populates="blogs")


# class User(Base):
#     __tablename__ = 'users'

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String)
#     email = Column(String)
#     password = Column(String)

#     blogs = relationship('Blog', back_populates="creator")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    dateOfBirth = Column(Date, nullable=True)  # Date type for date of birth
    weight = Column(Float, nullable=True)  # Float type for weight
    height = Column(Float, nullable=True)  # Float type for height
    gender = Column(String(50), nullable=True)  # String for gender
    level = Column(String(50), nullable=True)  # Existing level column
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


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