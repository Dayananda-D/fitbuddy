import base64
import hmac
import hashlib
import json
from typing import Any

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"

def base64_url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")

def base64_url_decode(data: str) -> bytes:
    padding = "=" * (4 - len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)

def create_access_token(data: dict) -> str:
    header = {"alg": ALGORITHM, "typ": "JWT"}
    header_encoded = base64_url_encode(json.dumps(header).encode("utf-8"))
    payload_encoded = base64_url_encode(json.dumps(data).encode("utf-8"))

    signature = hmac.new(
        SECRET_KEY.encode("utf-8"),
        f"{header_encoded}.{payload_encoded}".encode("utf-8"),
        hashlib.sha256,
    ).digest()
    signature_encoded = base64_url_encode(signature)

    return f"{header_encoded}.{payload_encoded}.{signature_encoded}"

def verify_token(token: str, credentials_exception: Any) -> dict:
    try:
        header_encoded, payload_encoded, signature_encoded = token.split(".")
        signature = base64_url_decode(signature_encoded)

        expected_signature = hmac.new(
            SECRET_KEY.encode("utf-8"),
            f"{header_encoded}.{payload_encoded}".encode("utf-8"),
            hashlib.sha256,
        ).digest()

        if not hmac.compare_digest(signature, expected_signature):
            raise credentials_exception

        payload = json.loads(base64_url_decode(payload_encoded).decode("utf-8"))

        return payload
    except Exception:
        raise credentials_exception
