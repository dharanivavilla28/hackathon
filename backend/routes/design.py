from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Body
from typing import Optional
import json
import logging
from services.spatial import extract_spatial_manifest
from services.image_gen import generate_3_redesigns, STYLE_PRESETS
from services.chat_edit import apply_chat_refinement
from services.video_gen import generate_veo_video_walkthrough

router = APIRouter(prefix="/api", tags=["HomeLove Design API"])
logger = logging.getLogger("design_router")

@router.get("/style-presets")
async def get_style_presets():
    """
    Returns list of curated design style presets (Japandi, Modern Luxury, Scandinavian, etc.)
    """
    return {
        "status": "success",
        "presets": [
            {
                "key": key,
                "title": val["title"],
                "description": val["description"],
                "palette": val["palette"],
                "elements": val["elements"]
            } for key, val in STYLE_PRESETS.items()
        ]
    }

@router.post("/analyze-space")
async def analyze_space(file: UploadFile = File(...)):
    """
    Step 2: Analyzes uploaded photo to extract Spatial Geometric Manifest (walls, windows, doors, boundaries).
    """
    try:
        contents = await file.read()
        manifest = extract_spatial_manifest(contents, file.filename)
        return {
            "status": "success",
            "filename": file.filename,
            "manifest": manifest
        }
    except Exception as e:
        logger.error(f"Error analyzing space: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-redesigns")
async def generate_redesigns(
    file: UploadFile = File(...),
    prompt: str = Form("Redesign this space to be warm, functional, and modern."),
    style_key: str = Form("japandi"),
    manifest_json: Optional[str] = Form(None)
):
    """
    Step 4: Generates 3 distinct redesign variations maintaining spatial structure.
    """
    try:
        contents = await file.read()
        
        spatial_manifest = {}
        if manifest_json:
            try:
                spatial_manifest = json.loads(manifest_json)
            except Exception:
                pass
        
        if not spatial_manifest:
            spatial_manifest = extract_spatial_manifest(contents, file.filename)
            
        variations = generate_3_redesigns(
            image_bytes=contents,
            user_prompt=prompt,
            style_key=style_key,
            spatial_manifest=spatial_manifest
        )
        
        return {
            "status": "success",
            "prompt": prompt,
            "style_key": style_key,
            "spatial_manifest": spatial_manifest,
            "variations": variations
        }
    except Exception as e:
        logger.error(f"Error generating redesigns: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat-edit")
async def chat_edit(payload: dict = Body(...)):
    """
    Step 5: Conversational Refinement ('Chat-to-Edit') on a selected redesign candidate.
    """
    try:
        current_image_url = payload.get("image_url", "")
        refinement_prompt = payload.get("refinement_prompt", "")
        spatial_manifest = payload.get("spatial_manifest", {})
        
        if not current_image_url or not refinement_prompt:
            raise HTTPException(status_code=400, detail="Missing image_url or refinement_prompt")
            
        result = apply_chat_refinement(
            current_image_path=current_image_url,
            refinement_instruction=refinement_prompt,
            spatial_manifest=spatial_manifest
        )
        return result
    except Exception as e:
        logger.error(f"Error in chat edit: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-walkthrough")
async def generate_walkthrough(payload: dict = Body(...)):
    """
    Step 6: Optional Cinematic Video Walkthrough with Veo 3.1.
    """
    try:
        image_url = payload.get("image_url", "")
        custom_prompt = payload.get("camera_prompt", None)
        
        if not image_url:
            raise HTTPException(status_code=400, detail="Missing image_url parameter")
            
        result = generate_veo_video_walkthrough(
            redesign_image_url=image_url,
            custom_camera_prompt=custom_prompt
        )
        return result
    except Exception as e:
        logger.error(f"Error generating video walkthrough: {e}")
        raise HTTPException(status_code=500, detail=str(e))
