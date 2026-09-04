# AI Advisor — Backend Intelligence Engine (Python / OpenStreetMap)

## Overview
Calculates grounded business feasibility, footfall metrics, and competitor saturation by retrieving live real-world geospatial telemetry from **OpenStreetMap** (via `features/map-explorer/backend/osm_service.py`).

---

## Files
- `ai_osm_advisor.py`: AI Advisor analytical calculation engine. Retrieves live OSM nodes and computes:
  - Overall Viability Rating (1.0 - 5.0)
  - Pedestrian Footfall Level (Very High / High / Medium / Low)
  - Competitor Saturation & Density per km²
  - Real Named Competitors extracted from OpenStreetMap
  - Transit Hub & Commercial Anchor presence
  - Data-grounded Pros and Cons
  - CLI usage:
    ```bash
    python ai_osm_advisor.py "Connaught Place, New Delhi" "Fast Food / Casual Dining" 500 2500000
    ```
- `advisor_router.py`: FastAPI router exposing `POST /api/advisor/analyze-live`.

---

## Running the Engine
```bash
# Direct Python execution
python features/ai-advisor/backend/ai_osm_advisor.py "Koramangala, Bengaluru" "Cafe / Coffee Shop" 600 1800000
```

