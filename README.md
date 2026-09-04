# VyaparMap — Location Intelligence for Founders

VyaparMap is a high-performance location intelligence platform built to analyze footfall quality, competition saturation, and commercial lease viability before capital is committed.

---

## 🏗️ Architecture

```
vyaparMap/
├── index.html                   # Root entrypoint
├── app.tsx                      # Root router & layout
├── main.tsx                     # Vite mount
├── style.css                    # Tailwind CSS system
├── components/                  # Reusable UI & Navigation (Header, Sidebar, Modals, Buttons)
├── database/                    # Centralized presentation/demo data & types
├── features/                    # User-facing modular features (each with frontend/ & future backend/)
│   ├── landing/
│   ├── ai-advisor/
│   ├── business-finder/
│   ├── map-explorer/
│   ├── franchises/
│   ├── properties/
│   ├── analytics/
│   └── owner-dashboard/         # Private Registered Business Owner portal
└── system/                      # General system modules
    ├── auth/                    # Dual mode: Guest Visitor vs Registered Owner
    └── settings/                # Profile, business telemetry, & API keys
```

---

## 👥 Dual User Experience Modes

1. **Guest / Visitor (Public Mode)**:
   - Access to Sovereign Landing Overview (`/`)
   - AI Location Advisor (`/ai-advisor`)
   - Smart Business Finder (`/find-business`)
   - Interactive GIS Map Explorer (`/map`)
   - Franchise Network Directory (`/franchises`)
   - Commercial Real Estate Listings (`/properties`)
   - Market Analytics & Revenue Calculator (`/analytics`)
   - *Protected:* Guests are gated from accessing the private Owner Dashboard.

2. **Registered Business Owner (Private Mode)**:
   - Unlocked access to private **Owner Dashboard** (`/owner/dashboard`).
   - Store hourly footfall telemetry (Weekday vs Weekend).
   - Local competitor radar (500m walking radius).
   - Rent-to-revenue stress-testing matrix.

---

## 🚀 Getting Started

```bash
# Navigate to project
cd D:\Coding\Codes\Projects\vyaparMap

# Install dependencies
npm install

# Start development server
npm run dev
```

