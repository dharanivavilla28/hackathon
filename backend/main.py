import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import BASE_DIR, HOST, PORT
from routes.design import router as design_router

app = FastAPI(
    title="HomeLove AI Home & Exterior Design API",
    description="Spatial Understanding + 3-Option Image Generation + Conversational Refinement + Veo 3.1 Video Walkthrough",
    version="1.0.0"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded & generated static files
static_dir = BASE_DIR / "static"
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Include design API router
app.include_router(design_router)

@app.get("/")
async def root():
    return {
        "app": "HomeLove AI",
        "status": "online",
        "features": [
            "Spatial Understanding (Gemini 2.5 Flash)",
            "3-Option Redesign Generation (Gemini 2.5 Flash Image / Imagen 3)",
            "Chat-to-Edit Conversational Refinement",
            "Cinematic Video Walkthrough (Veo 3.1)"
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
