from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.modules.auth.auth_schema import (
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest
)
from app.modules.auth.auth_service import authenticate_user

# OTP & Mailer Imports
from app.db.redis_db import store_otp, verify_otp
from app.core.mailer import send_otp_email, generate_otp
from app.modules.users.user_model import User
from app.core.security import hash_password

# --- 1. Router-a initialize pannanum (IDHU DHAAN MISSING) ---
router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- 2. Login Logic ---
@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = authenticate_user(db, payload.email, payload.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": token, "token_type": "bearer"}

# --- 3. Forgot Password Logic ---
@router.post("/forgot-password")
async def forgot_password(
    payload: ForgotPasswordRequest,
    bg: BackgroundTasks,
    db: Session = Depends(get_db)
):
    email = payload.email

    user = db.query(User).filter(User.email == email).first()

    if user:
        otp = generate_otp()

        store_otp(email, otp)

        bg.add_task(send_otp_email, email, otp)

        return {"message": f"OTP has been sent to {email}"}

    return {"message": "If email exists, OTP has been sent."}

@router.post("/verify-otp")
def verify_otp_endpoint(payload: VerifyOTPRequest):
    if not verify_otp(payload.email, payload.otp, delete=False):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "OTP verified successfully"}

# --- 4. Reset Password Logic ---
@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    if not verify_otp(payload.email, payload.otp):
        raise HTTPException(status_code=400, detail="Invalid or Expired OTP")

    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = hash_password(payload.new_password)

    db.commit()

    return {"message": "Password updated successfully. You can login now."}