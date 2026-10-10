# 🌿 coolroute — AI Thermal Logistics Control Center

> **Dynamic non-refrigerated produce rescue & perishability-aware routing for smallholder agriculture.**  
> *(GM University Hackathon AI26AG02 Prototype)*

---

## 📌 Problem Statement

Shortest route is not always the safest route. Traditional GPS navigation optimizes purely for distance or travel time, ignoring the thermal impact on perishable agricultural goods. 

In India and emerging markets, over **80% of smallholder produce transit operates without cold chain refrigeration**. Standard navigation systems inadvertently guide harvest trucks onto sun-baked national highways where ambient tarmac temperatures often exceed 38°C—accelerating cellular breakdown, moisture loss, and rot.

**coolroute** is an AI-powered bio-thermal routing platform that dynamically balances travel time, road distance, and radiant heat exposure to maximize harvest quality upon arrival at the APMC Mandi hub.

---

## 🏗️ Architecture

The platform features a **two-page modern architecture** with zero-downtime offline failover:

```
├── frontend/
│   ├── index.html            # Marketing Landing Page (Overview, Pipeline, Testimonials, FAQ)
│   ├── dashboard.html        # Live Command Center (Interactive GIS Map, Decay Optimizer)
│   ├── landing.css           # Softly Design System styles for Landing Page
│   ├── styles.css            # Daylight tactical theme for Command Center
│   ├── js/
│   │   ├── app.js            # Main dashboard controller & in-transit simulation
│   │   ├── routing.js        # OSRM client with intelligent rate limiting & waypoint synthesis
│   │   ├── thermalModel.js   # Q10 biophysical decay mathematics engine
│   │   ├── weather.js        # Open-Meteo batched microclimate fetcher
│   │   └── config.js         # Geographic coordinates, crop profiles, scoring weights
│   ├── fallback_routes.json  # Pre-cached regional OSRM routing alternatives
│   └── fallback_weather.json # Pre-cached Open-Meteo road temperature grid
├── backend/
│   ├── server.js             # Express API (Multi-route decay scoring & APMC mandi analytics)
│   ├── package.json          # Backend dependencies & scripts
│   ├── package-lock.json     # Backend locked dependency manifest
│   ├── fallback_routes.json  # Fallback routing data
│   └── fallback_weather.json # Fallback microclimate data
├── tests/                    # Automated validation suites
│   ├── test-backend.js       # Backend endpoints & SLA decay test suite (5 checks)
│   ├── test-frontend-integration.js # Frontend DOM, decay math & multi-route test suite (23 checks)
│   └── audit-two-page.js     # Two-page architecture & design system audit (26 checks)
├── docs/                     # Design documents, execution plan & pitch guide
│   ├── DESIGN.md             # Spatial perspective & design vision
│   ├── PLAN.md               # Project execution phases & roadmap
│   ├── demo-walkthrough.md   # Pitch guide & live presentation walkthrough script
│   └── design/               # Detailed UI component & UX specifications
├── package.json              # Root project orchestration scripts
└── .gitignore                # Git ignore rules
```

### 1. Landing Page (`/` or `index.html`)
- **Hero & Scenario Explorer**: Problem walkthrough showing how temperature spikes destroy produce value.
- **9-Step Pipeline Architecture**: End-to-end breakdown from sensor telemetry to APMC mandi auction.
- **Farmer Impact Testimonials**: Case studies showing real-world rupee savings.
- **Direct App Launch CTA**: One-click launch into the live command center.

### 2. Live Command Center (`/dashboard` or `dashboard.html`)
- **Leaflet GIS Map**: Daylight cartography with interactive checkpoint temperature markers (`CP1`, `CP2`, `CP3`).
- **Multi-Corridor Generation**: Evaluates up to 4 distinct road corridors simultaneously.
- **Microclimate Weather Grid**: Batched API calls to Open-Meteo capturing road temperatures.
- **APMC Mandi Benchmark Section**: Real-time commodity benchmark rates for Davanagere Mandi and dynamic cargo valuation.
- **Custom Lab Crop Tuner (`🧪`)**: Lab sandbox enabling researchers to tune baseline $T_{\text{ref}}$, decay sensitivity $k$, and market price for any crop.
- **Continuous In-Transit Telemetry HUD**: Floating live telemetry HUD tracking segment temperatures, progressive quality decay, and journey progress with instant dismiss capability.

---

## 🔬 Core Biophysical Decay Model

The core engine models produce respiration and senescence using the biological **$Q_{10}$ temperature coefficient** ($Q_{10} = 2.0$):

1. **Heat Factor:**
   $$\text{Heat Factor} = 2^{\frac{T - T_{\text{ref}}}{10}}$$

2. **Cumulative Thermal Load:**
   $$\text{Thermal Load} = \sum_{i=1}^{N} \left( \Delta t_i \times \text{Heat Factor}_i \right)$$

3. **Arrival Quality Decay ($Q$):**
   $$Q_{\text{arrival}} = 100 \times e^{-k \times \text{Thermal Load}}$$

4. **Multi-Objective Composite Score:**
   $$\text{Score} = (0.20 \times t_{\text{hours}}) + (0.05 \times d_{\text{km}}) + (0.75 \times (100 - Q_{\text{arrival}})) + (\text{deadlineBreached} ? 500 : 0)$$

### Produce Baseline Parameters

| Produce Variety | Baseline $T_{\text{ref}}$ (°C) | Decay Constant ($k$) | Davanagere APMC Rate |
| :--- | :---: | :---: | :---: |
| **Tomato** | 13.0°C | 0.012 | ₹36.50 / kg |
| **Leafy Greens** | 10.0°C | 0.022 | ₹42.00 / kg |
| **Mango** | 13.0°C | 0.009 | ₹88.00 / kg |
| **Potato / Onion** | 15.0°C | 0.003 | ₹22.00 / kg |
| **Custom Lab Crop** | *Configurable* | *Configurable* | *Configurable* |

---

## 💰 APMC Mandi Economic Value Model

The optimizer calculates the direct monetary savings preserved by choosing the AI-recommended thermal route over the hottest suboptimal route:

$$\text{Value Preserved (₹)} = \text{Cargo Weight (kg)} \times \text{Rate (₹/kg)} \times \frac{Q_{\text{Recommended}} - Q_{\text{Worst}}}{100}$$

For a standard 1,000 kg shipment of tomatoes, preserving just 1.0% additional cellular quality saves approximately **₹365 – ₹372** per transit run.

---

## 🛡️ Offline Resilience & Failover

To guarantee zero downtime in rural regions with intermittent internet connectivity:
- **Server Offline Fallback:** If the backend (Port 5000) is unreachable, the in-browser client seamlessly switches to client-side heuristics.
- **OSRM Fallback:** If the public OSRM server times out or rate-limits, the engine automatically serves `fallback_routes.json`.
- **Weather Grid Fallback:** If Open-Meteo is unavailable, segment temperatures fall back to pre-cached local thermal grids (`fallback_weather.json`).
- Zero API calls occur on UI slider adjustments, ensuring instantaneous responsiveness.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm`

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Gagan-G-044/temperature-based-optimal-path-finder-.git
cd temperature-based-optimal-path-finder-
npm install
```

### Running the Application

1. **Start the Backend API Server:**
   ```bash
   npm start
   ```
   *Backend runs on `http://localhost:5000` (can also run from `backend/` via `cd backend && npm start`).*

2. **Start the Frontend Web Server:**
   In a separate terminal:
   ```bash
   npm run serve:frontend
   ```
   *Frontend serves on `http://localhost:3000`.*

3. **Open in Browser:**
   - **Landing Page:** `http://localhost:3000/`
   - **Live Command Center:** `http://localhost:3000/dashboard.html`

4. **Live Pitch & Presentation Guide:**
   - Step-by-step 2-minute demo flow and 5-minute pitch outline are documented in [`docs/demo-walkthrough.md`](docs/demo-walkthrough.md).

---

## 🧪 Automated Test Suites

The codebase includes automated test suites covering backend endpoints, frontend integration, and the biophysical decay model:

> **Note on Running Tests:** Because the test suites validate live local HTTP endpoints, ensure the relevant servers are running before executing tests:
> - **Backend tests** (`npm run test:backend`) require the backend server running on `http://localhost:5000`.
> - **Frontend integration and audit tests** (`npm run test:frontend`, `npm run test:audit`, or `npm test`) require both the backend (`http://localhost:5000`) and the frontend server (`http://localhost:3000`).

```bash
# Run all test suites (tests/test-backend.js, tests/test-frontend-integration.js, tests/audit-two-page.js)
npm test

# Run backend unit & optimization tests (5 checks)
npm run test:backend

# Run frontend integration & decay tests (23 checks)
npm run test:frontend

# Run two-page architecture & design system audit (26 checks)
npm run test:audit
```

---

## 📜 Attributions & Third-Party APIs

- **Routing Engine:** [OSRM (Open Source Routing Machine)](http://project-osrm.org/)
- **Meteorological Data:** [Open-Meteo Microclimate API](https://open-meteo.com/)
- **Cartography & Tiles:** &copy; [OpenStreetMap](https://www.openstreetmap.org/) contributors via [Leaflet.js](https://leafletjs.com/)
- **Typography:** Google Fonts (*Outfit*, *Reenie Beanie*)

---

## 📄 License
MIT License. Built for hackathon demonstration and open research.
