from fastapi import FastAPI
from . import  models
from .database import engine
from .routers import user, authentication, importsvg, workout
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(authentication.router)
# app.include_router(importsvg.router)
app.include_router(user.router)
app.include_router(workout.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)