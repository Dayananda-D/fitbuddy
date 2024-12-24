from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = 'sqlite:///./fitbuddy.db'
SQLALCHEMY_DATABASE_URL = f'postgresql://fitbuddy_user:fYNXIj4Kf7I5ZGh0FJ5zYmCdBy2QprTQ@dpg-ctkot21opnds7380sns0-a/fitbuddy'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False,)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()