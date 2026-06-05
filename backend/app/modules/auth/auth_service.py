from sqlalchemy.orm import Session
from app.modules.users.user_model import User, UserRole, Role
from app.core.security import verify_password, create_access_token

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    
    # Role separately query pannanum
    role_data = db.query(Role.name).join(UserRole).filter(
        UserRole.user_id == user.id
    ).first()
    
    role = role_data[0] if role_data else "employee"
    
    return create_access_token({
        "sub": user.email,
        "user_id": user.id,
        "role": role
    })