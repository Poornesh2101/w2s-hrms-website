# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.modules.auth.auth_route import router as auth_router
# Mukkiyamaana import:
from app.modules.users.user_model import User, Role, UserRole 

# Idhu dhaan tables-ai create pannum
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Industrial HRMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)