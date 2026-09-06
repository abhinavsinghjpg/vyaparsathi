# VyaparMap — Geospatial Location Intelligence

> **Live Application**: [https://vyapar-map.vercel.app](https://vyapar-map.vercel.app)

VyaparMap is a high-performance geospatial location intelligence and MSME viability platform built for Indian micro-entrepreneurs, artisans, and commercial founders. It analyzes footfall dynamics, competition density, rent stress, and capital requirements to compute real-time feasibility and unit economics before financial commitments are made.

---

## 👥 Team Project & Contributors

This platform was developed as a collaborative team project:

| Member | Project Role | GitHub | LinkedIn |
|---|---|---|---|
| **Abhinav Kumar** | Project Ideation & Concept | [@abhinavsinghjpg](https://github.com/abhinavsinghjpg) | |
| **Abhinav Choudhary** | Lead Developer (Full-Stack & Architecture) | [@Atrixfinal](https://github.com/Atrixfinal) | [abhinav-atrix](https://www.linkedin.com/in/abhinav-atrix/) |
| **Nikita Poonia** | Project Research & Domain Analysis | | |
| **Harsh Dhonkaria** | Quality Assurance & Testing | | |
| **Kusum Kanwar** | | | |
| **Chitransha Saini** | | | |

---

## 🚀 Key Features

- **AI Feasibility & Unit Economics Advisor**:
  Continuous 5-pillar mathematical scoring engine evaluating capital adequacy, competitor saturation, rent burden, footfall density, and net margins (with strict ceilings against operating deficits).
- **Universal Location & Corridor Search**:
  Fast search across Indian cities, tehsils, rural craft corridors, and neighborhoods using Google Geocoding with OpenStreetMap Nominatim failover.
- **Comprehensive Business Catalog (43+ Models)**:
  Includes both rural micro-enterprises (pottery, handloom, leathercraft, mobile repair) and modern urban ventures (specialty cafe, IT hardware outlet, esports lounge, cloud kitchen, shopping mall).
- **Interactive Map Explorer & Live POI Harvester**:
  Queries real-world establishments via OpenStreetMap Overpass API and saves POIs directly into a browser-native SQL Vault.
- **Official Government MSME & Economic Intelligence**:
  District-level MSME densities, 5-year Udyam formalization trajectories, sector compositions, and MoSPI consumer expenditure benchmarks.
- **3-Tier Loan Assistance Engine**:
  Auto-routes project outlays between Micro-Finance (≤ ₹1.4L), Concessional Term Loans (₹1.4L to ₹50L), and Commercial Bank Syndicates (up to ₹2.00 Cr).

---

## 🏗️ Architecture & Project Structure

```
vyaparMap/
├── index.html                   # Web application entry point
├── app.tsx                      # Root application routing & layout
├── main.tsx                     # Vite React DOM mount
├── style.css                    # Global Tailwind CSS styles
├── components/                  # Reusable UI components (Header, Sidebar, Modals)
├── database/                    # SQL schema definitions & seed scripts
├── features/                    # Modular feature directories
│   ├── ai-advisor/              # AI Feasibility scoring engine & consultation UI
│   ├── business-finder/         # 43-model business catalog & recommendation engine
│   ├── map-explorer/            # GIS mapping, POI harvesting & location search
│   ├── loans/                   # 3-tier loan calculator & scheme integration
│   ├── analytics/               # Market analytics & official MSME intelligence
│   ├── franchises/              # Franchise directory & investment models
│   ├── properties/              # Commercial real estate & lease listings
│   └── owner-dashboard/         # Business telemetry & stress-testing tools
├── system/                      # Core system modules (SQL Vault, Auth, Utilities)
└── types/                       # Shared TypeScript interfaces & schemas
```

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Geospatial & Maps**: OpenStreetMap (Leaflet / Overpass API), Google Maps Platform
- **Data & Storage**: Browser-native SQL Vault (IndexedDB / SQLite compatibility)
- **Deployment**: Vercel

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18.0 or later recommended)
- npm or yarn

### Installation & Local Setup

```bash
# Clone the repository
git clone https://github.com/Atrixfinal/vyaparMap.git

# Navigate into the project directory
cd vyaparMap

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Production Build

```bash
# Compile TypeScript and generate production bundle
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
