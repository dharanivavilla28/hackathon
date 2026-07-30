import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "static" / "uploads"
GENERATED_DIR = BASE_DIR / "static" / "generated"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
GENERATED_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

raw_port = os.getenv("PORT", "8000").strip()
PORT = int(raw_port) if raw_port.isdigit() else 8000

raw_host = os.getenv("HOST", "0.0.0.0").strip()
HOST = raw_host if raw_host else "0.0.0.0"
