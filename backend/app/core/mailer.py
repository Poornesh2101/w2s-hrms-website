import random
import string
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_otp_email(email: str, otp: str):
    message = MessageSchema(
        subject="HRMS Password Reset OTP",
        recipients=[email],
        body=f"Your OTP is: {otp}. Valid for 5 minutes.",
        subtype=MessageType.plain
    )
    fm = FastMail(conf)
    await fm.send_message(message)

def generate_otp():
    return ''.join(random.choices(string.digits, k=4))