"""
FastAPI Router for AI Advisor using OpenStreetMap Live Telemetry
"""

from typing import Optional
try:
    from fastapi import APIRouter, HTTPException
    from pydantic import BaseModel, Field
except ImportError:
    APIRouter = object
    BaseModel = object
    Field = lambda *args, **kwargs: None

from .ai_osm_advisor import calculate_osm_feasibility

if isinstance(APIRouter, type) and APIRouter is not object:
    router = APIRouter(prefix="/api/advisor", tags=["AI Advisor"])

    class AdvisorAnalysisRequest(BaseModel):
        location: str = Field(..., example="Koramangala, Bengaluru")
        shop_type: str = Field("Cafe / Coffee Shop", example="Cafe / Coffee Shop")
        shop_size: int = Field(600, ge=50, le=10000, example=600)
        budget: float = Field(2000000.0, ge=10000.0, example=2000000.0)
        radius_m: int = Field(1000, ge=100, le=5000, example=1000)

    @router.post("/analyze-live")
    async def analyze_live(payload: AdvisorAnalysisRequest):
        """
        Run feasibility analysis dynamically pulling live OpenStreetMap
        nodes, competitors, transit hubs, and commercial anchors.
        """
        try:
            result = calculate_osm_feasibility(
                location_query=payload.location,
                shop_type=payload.shop_type,
                shop_size=payload.shop_size,
                budget=payload.budget,
                radius_m=payload.radius_m,
            )
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
else:
    router = None

