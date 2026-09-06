# VyaparMap Deployment & Architecture Separation Guide

This document defines the architectural separation between the **Cloud-Hosted Web Application** (deployable to Vercel / Netlify / Cloudflare Pages) and the **Offline Python ML Toolkit** (designed for local laptop training & offline batch intelligence).

---

## 1. Cloud Web Application (Vercel / Netlify)
The web application is built with **React 18 + Vite + TypeScript + Tailwind CSS** and is 100% serverless / edge-compatible:

- **Deployment Target**: Vercel / Netlify
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Cloud Execution**:
  - Client-side deterministic econometric engine (MoSJE loan rules, agglomeration algorithms, demographic weighting).
  - External API integration with live Google Maps, OpenStreetMap Overpass API, and multi-provider AI (Groq Llama 3.3 70B, Perplexity Sonar, Google Gemini).
  - In-browser SQLite / IndexedDB Local Storage SQL Vault (`vyapar_harvested_places`, `vyapar_loan_applications`).

---

## 2. Offline Python ML Toolkit (`features/AI/`)
The `features/AI/` directory is **excluded from cloud deployment** via `.gitignore` and `.vercelignore`:

- **Why it stays local**:
  - Requires Python 3.10+, NumPy, Pandas, Scikit-Learn, and Joblib.
  - Vercel static frontends cannot execute long-running Python training scripts without custom serverless runtime bloat.
  - Allows the jury / presentation evaluators to inspect real offline model training scripts directly on your local laptop:
    - `run_1click_training.bat`: 1-click batch trainer.
    - `generate_training_dataset.py`: Synthesizes 5,000+ localized Indian commercial corridor samples.
    - `train_advisor_model.py`: Trains Random Forest & Gradient Boosting feasibility regressors.
    - `train_finder_recommender.py`: Trains Cosine Similarity Nearest Neighbors trade recommenders.
    - `harvest_osm_maps.py`: Queries live Overpass API and saves POIs directly into local SQLite (`vyapar_harvested.db`).
    - `predict_score_cli.py`: Fast CLI predictor tool.

---

## 3. How to Deploy to Vercel

1. Push your repository to GitHub / GitLab:
   ```bash
   git add .
   git commit -m "feat: VyaparMap 2.0 with universal search, map harvester, and 2-tier loans"
   git push origin main
   ```
   *(Note: `features/AI/` and `*.db` are automatically excluded by `.gitignore`)*

2. Import project into Vercel:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. Configure Environment Variables (Optional in Vercel Project Settings):
   - `VITE_GOOGLE_MAPS_API_KEY`: (Optional - fallback to OpenStreetMap is built-in)
   - `VITE_GROQ_API_KEY` or `VITE_GEMINI_API_KEY`: (Optional - client form also accepts direct input)
