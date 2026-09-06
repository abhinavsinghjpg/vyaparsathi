# Map Explorer — Backend Service (Python / OpenStreetMap)

## Overview
This backend service provides 100% free, keyless integration with **OpenStreetMap (OSM)**:
1. **OSM Nominatim API**: Real-time forward and reverse geocoding for any Indian or international location.
2. **OSM Overpass API**: Extracts real POIs (Points of Interest), commercial stores, direct competitors, transit stops (bus/metro), and commercial anchor entities.
3. **Market Density Engine**: Computes competitor saturation, transit accessibility, and footfall proxy scores.

---

## Files
- `osm_service.py`: Core OpenStreetMap client and geospatial calculation engine.
  - Can be executed directly from terminal:
    ```bash
    python osm_service.py "Indiranagar, Bangalore" "cafe"
    ```
- `osm_router.py`: FastAPI endpoints for geocoding and live POI telemetry.

---

## Running the Service
```bash
# Standalone CLI test
python features/map-explorer/backend/osm_service.py "Connaught Place, New Delhi" "restaurant"

# With FastAPI (when installed)
uvicorn features.map-explorer.backend.osm_router:router --reload --port 8000
```

