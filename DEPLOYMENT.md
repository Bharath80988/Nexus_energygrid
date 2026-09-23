# 🚀 Docker & Render Deployment Guide for Nexus Energy Platform

This guide explains how to build, run locally with Docker, and deploy the Nexus Energy Platform as a unified single container image on [Render](https://render.com).

---

## 📦 Architecture Overview

The single Docker image uses a multi-stage build:
1. **Frontend Stage**: Compiles the React + Vite frontend into static production assets (`dist/`).
2. **Production Stage**: Runs Node.js Express backend serving both:
   - REST API endpoints (`/api/...`)
   - High-performance static React Single-Page Application (with SPA routing fallback)
   - Health check endpoint (`/api/health`) for Render zero-downtime health probing.

---

## 💻 Local Quickstart with Docker

### Option 1: Using Docker Compose (Recommended)
```bash
# Build and run the container
docker compose up --build

# Open your browser at:
# http://localhost:5000
```

### Option 2: Using Plain Docker CLI
```bash
# 1. Build the image
docker build -t nexus-energygrid .

# 2. Run the container
docker run -d -p 5000:5000 --name nexus-energygrid nexus-energygrid

# 3. Check logs
docker logs -f nexus-energygrid
```

---

## 🌐 Deploying on Render

### Method 1: Direct GitHub Repository Connection (Standard)

1. Push your latest code (including `Dockerfile`, `.dockerignore`, and modified files) to your GitHub repository: `Bharath80988/Nexus_energygrid`.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and connect `Bharath80988/Nexus_energygrid`.
4. Configure the following settings:
   - **Name**: `nexus-energygrid` (or any name you prefer)
   - **Region**: Choose the closest region to you (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main` (or your active branch)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
   - **Instance Type**: `Free`
5. (Optional) In **Advanced Settings**:
   - **Health Check Path**: `/api/health`
6. Click **Create Web Service**.
7. Render will automatically build the multi-stage Dockerfile and host the application at `https://your-service-name.onrender.com`.

---

### Method 2: Render Blueprint (Infrastructure as Code)

Because this repository includes `render.yaml`:
1. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance**.
3. Connect your `Bharath80988/Nexus_energygrid` repository.
4. Render will read `render.yaml` and configure everything automatically.
5. Click **Apply**.

---

## 🛠️ Environment Variables

The container runs out-of-the-box with default settings. You can optionally set:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port on which the Express server listens (Render sets this automatically). |
| `NODE_ENV` | `production` | Node environment (`production` or `development`). |
| `VITE_BACKEND_URL` | `/api` | Base API URL for frontend queries. |

---

## 🩺 Health Check & Diagnostics

- **Health Endpoint**: `GET /api/health` -> Returns `{ "status": "ok", "timestamp": "..." }`
- **Weather / Grid Data**: `GET /api/energy?lat=19.0760&lon=72.8777`
