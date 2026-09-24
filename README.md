# Nexus Energy Grid Monitoring & Telemetry Platform

An enterprise-grade, real-time energy telemetry, load-balancing, and regional power infrastructure management platform.

![Nexus Energy Grid Architecture](./diagram.png)

---

## 1. Executive Summary

The Nexus Energy Grid Platform provides real-time monitoring, predictive load forecasting, and decentralized generation telemetry across renewable and baseload energy assets. Modern electrical grids face intermittent generation dynamics driven by variable meteorological conditions. Nexus bridges raw atmospheric telemetry and utility transmission management, computing instantaneous power yields, load coverage, grid stability margins, and automated Battery Energy Storage System (BESS) dispatching.

---

## 2. Core Capabilities

### 2.1 State and Municipal Grid Load Balancing
* **Demand vs. Supply Computation**: Dynamically calculates baseline and diurnal peak electrical demand (accounting for commercial morning surges and evening cooling/heating loads) against total live generation.
* **Surplus and Deficit Detection**: Computes net transmission balance in real time, triggering automated battery storage charging or dispatch alerts during peak demand intervals.
* **Hierarchical State and City Navigation**: Enables multi-tiered regional navigation across state transmission networks (e.g., Tamil Nadu, Kerala, Karnataka, Maharashtra, Gujarat, Delhi NCR) with direct drill-down into municipal distribution zones.

### 2.2 Regional Power Infrastructure Mapping
* **Asset-Level Telemetry**: Maps real-world utility generation stations feeding specific metropolitan and industrial clusters.
* **Multi-Source Generation Matrix**:
  * **Nuclear Baseload**: Pressurized Heavy Water Reactors (PHWR) and Light Water Reactors (VVER) providing continuous, zero-carbon base load (e.g., MAPS Kalpakkam, Kudankulam, Tarapur, Kaiga, Narora, Kakrapar).
  * **Photovoltaic Arrays**: Single-axis and dual-axis tracking utility solar farms modulated by real-time irradiance, cloud attenuation, and surface temperatures (e.g., Bhadla, Pavagada, Kamuthi, Sakri, Charanka).
  * **Kinetic Wind Networks**: Asymptotic power curve calculations accounting for atmospheric density, barometric pressure, and cut-in velocity thresholds (e.g., Muppandal, Jaisalmer, Brahmanvel, Chitradurga).
  * **Hydroelectric and Ocean Systems**: High-head pumped-storage facilities and coastal tidal wave converters for instantaneous frequency support (e.g., Idukki, Koyna, Sharavathi, Tehri, Srisailam).

### 2.3 Battery Energy Storage Systems (BESS)
* **Autonomous Grid Buffering**: Simulates utility-scale lithium-iron-phosphate (LFP) battery storage banks, tracking State of Charge (SoC %), net power flow (kW), and rapid frequency stabilization.

### 2.4 Environmental Metrics & AI Diagnostics
* **Carbon Offset Calculations**: Continuously measures equivalent avoided greenhouse gas emissions (kg CO2e) and biological sequestration equivalents.
* **Predictive 12-Hour AI Forecasting**: Uses time-series regression models based on weather trend projections to forecast generation curves and transmission stress 12 hours in advance.

---

## 3. System Architecture

```
+-------------------------------------------------------------------------+
|                              Client Tier                                |
|  - React / Vite Single Page Application                                 |
|  - Framer Motion Hardware-Accelerated UI & Recharts Telemetry Suite     |
|  - Multi-tiered State & City Selector with GPS / IP Auto-Detection      |
+------------------------------------+------------------------------------+
                                     |  HTTP / REST
                                     v
+-------------------------------------------------------------------------+
|                              Backend Tier                               |
|  - Express.js Telemetry Engine & Energy Balancing Controllers           |
|  - Regional Power Infrastructure Database & Asset Resolvers             |
|  - Diurnal Load Demand & Peak Factor Calculation Algorithms             |
+------------------------------------+------------------------------------+
                                     |  API Integration
                                     v
+-------------------------------------------------------------------------+
|                             External Tier                               |
|  - Open-Meteo High-Resolution Numerical Weather Prediction API         |
|  - OpenStreetMap Nominatim & Global IP Geolocation Resolvers            |
+-------------------------------------------------------------------------+
```

---

## 4. Mathematical Modeling & Physics Simulation

### 4.1 Solar Photovoltaic Yield
$$\text{Solar Output (kW)} = \left( \frac{G \times \eta \times A}{1000} \right) \times \left(1 - \frac{\text{Cloud Cover}}{100}\right)$$
Where $G$ is global horizontal irradiance ($\text{W/m}^2$), $\eta$ is panel efficiency ($15\%$), and $A$ is array surface area.

### 4.2 Wind Turbine Kinetic Yield
$$\text{Wind Output (kW)} = \frac{1}{2} \times \rho \times A_{\text{swept}} \times v^3 \times C_p \times \frac{1}{1000}$$
Where $\rho = \frac{P}{R_{\text{spec}} \times T}$ (air density via ideal gas approximation), $v$ is wind velocity ($\text{m/s}$), and $C_p$ is the power coefficient.

### 4.3 Grid Load and Balance
$$\text{Demand (kW)} = \text{Base Demand} \times K_{\text{city}} \times K_{\text{diurnal}} \times K_{\text{temp}}$$
$$\text{Grid Balance (kW)} = \text{Total Generation (kW)} - \text{Demand (kW)}$$

---

## 5. API Reference

### 5.1 Energy Telemetry
* **Endpoint**: `GET /api/energy`
* **Query Parameters**:
  * `lat` (float, required): Latitude of target node
  * `lon` (float, required): Longitude of target node
  * `city` (string, optional): Target state or city identifier
* **Response**: Returns current generation by asset type, demand and supply balance, regional power plant specifications, battery storage state, and historical telemetry.

### 5.2 Predictive Generation Forecast
* **Endpoint**: `POST /api/forecast`
* **Payload**: `{ "irradiance": number, "windSpeed": number, "temperature": number }`
* **Response**: Returns 12-hour projected output timeline and generation slope trend.

### 5.3 Health Check
* **Endpoint**: `GET /api/health`
* **Response**: `{ "status": "ok", "timestamp": "ISO-8601" }`

---

## 6. Installation & Local Development

### 6.1 Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)
* Docker & Docker Compose (optional)

### 6.2 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Bharath80988/Nexus_energygrid.git
cd Nexus_energygrid
```

2. Install dependencies:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

3. Start development servers:
```bash
# Runs backend on port 5000 and frontend on port 5173
npm run dev
```

---

## 7. Containerized Deployment (Docker)

To build and run the entire unified stack within a single container:

```bash
docker compose up --build
```

The application will be accessible at `http://localhost:5000`.

---

## 8. Cloud Deployment

The repository includes production-ready deployment configurations for cloud container runtimes (such as Render, AWS ECS, or Google Cloud Run). For comprehensive deployment guidelines, refer to [DEPLOYMENT.md](./DEPLOYMENT.md).
