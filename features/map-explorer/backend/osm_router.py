"""
FastAPI Router for OpenStreetMap Map Explorer Endpoints
Exposes endpoints to geocode locations and query live POIs and market telemetry.
"""

from typing import Optional
try:
    from fastapi import APIRouter, HTTPException, Query
except ImportError:
    # Allow import even if fastapi is not yet installed in this environment
    APIRouter = object

from .osm_service import osm_service

if isinstance(APIRouter, type) and APIRouter is not object:
    router = APIRouter(prefix="/api/map", tags=["OpenStreetMap Explorer"])

    @router.get("/geocode")
    async def geocode(q: str = Query(..., description="Location address or query string")):
        """Geocode a place name into latitude, longitude, and bounding box."""
        res = osm_service.geocode(q)
        if not res:
            raise HTTPException(status_code=404, detail="Location not found")
        return res

    @router.get("/telemetry")
    async def get_telemetry(
        lat: float = Query(..., description="Latitude"),
        lon: float = Query(..., description="Longitude"),
        shop_type: str = Query("cafe", description="Type of business/shop"),
        radius_m: int = Query(1000, ge=100, le=5000, description="Search radius in meters"),
    ):
        """Fetch live competitor density, transit hubs, and commercial anchors around coordinates."""
        telemetry = osm_service.get_market_telemetry(lat, lon, shop_type=shop_type, radius_m=radius_m)
        return telemetry
else:
    router = None

