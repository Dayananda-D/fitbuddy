from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from src import auth_token, schemas, database, models
from src.hashing import Hash
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
import random
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv() 
sender_email = os.getenv("SMTP_EMAIL")
sender_password = os.getenv("SMTP_PASSWORD")
router = APIRouter(tags=['Authentication'])

@router.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(
        models.User.email == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Invalid Credentials")
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Incorrect password")

    access_token = auth_token.create_access_token(data={"email": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


def send_email(recipient_email: str, subject: str, body: str):
    # sender_email = "dhivahar.m.celestialsys@gmail.com"
    # sender_password = "bspp sfxf ikvi rjzc"
    
    # Create the email message
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg.set_content(body)
    
    # Connect to the SMTP server and send the email
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:  # Update with your email provider's SMTP server and port
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send email: {e}")


@router.post('/reset-password/request')
def request_reset_password(email: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Generate a 6-digit numeric token
    reset_token = f"{random.randint(100000, 999999)}"
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    # Send the token via email
    send_email(
        recipient_email=user.email,
        subject="Password Reset Request",
        # body=f"Your password reset code is: {reset_token}"
        body = f"""
        Hello,

        We received a request to reset your password. Use the code below to reset it:

        Your reset code: {reset_token}

        This code is valid for 15 minutes.

        If you didn't request this, please ignore this email.

        Thanks,
        Your App Team
        """
    )
    
    return {"message": "Password reset token has been sent to your email"}

@router.post('/reset-password/confirm')
def reset_password(token: str, new_password: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.reset_token == token).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid reset token")
    
    # Check if the token has expired
    if user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired")
    
    # Update password
    user.password = Hash.bcrypt(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password has been reset successfully"}
