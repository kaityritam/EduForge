from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

print(f"🔑 SECRET_KEY loaded: {SECRET_KEY}")

# Swagger Authorize button
security = HTTPBearer(auto_error=False)


def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False


def get_password_hash(password):
    try:
        return pwd_context.hash(password)
    except ValueError as e:
        if "password cannot be longer than 72 bytes" in str(e):
            return pwd_context.hash(password[:72])
        raise e


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


def get_current_user_id(request: Request) -> int:
    """
    Accepts BOTH:
      Authorization: Bearer <token>
      Authorization: <token>
    """
    auth_header = request.headers.get("Authorization")
    print(f"🔍 Auth header: {auth_header[:50] if auth_header else 'NONE'}...")

    if not auth_header:
        raise HTTPException(status_code=401, detail="No authorization header")

    # Strip Bearer if present
    token = auth_header.replace("Bearer ", "").replace("bearer ", "").strip()
    print(f"🔍 Token: {token[:40]}...")

    payload = decode_token(token)
    print(f"🔍 Payload: {payload}")

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")

    print(f"✅ Authenticated user_id: {user_id}")
    return user_id