# app/models/hrms_models.py
import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Role(Base):
    __tablename__ = "roles_master"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False) # admin, hr, manager, employee

class User(Base):
    __tablename__ = "users_master"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = Column(Integer, unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    is_active = Column(Boolean, default=True)

class UserRole(Base):
    __tablename__ = "user_roles"
    user_id = Column(String(36), ForeignKey("users_master.id"), primary_key=True)
    role_id = Column(String(36), ForeignKey("roles_master.id"), primary_key=True)