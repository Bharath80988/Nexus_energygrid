# -------------------------------------------------------------
# Stage 1: Build Frontend (Vite + React)
# -------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source and build static assets
COPY frontend/ ./
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Production Server (Express Backend + Static Frontend)
# -------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install backend production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend application source
COPY backend/ ./backend/

# Copy compiled frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set working directory to backend
WORKDIR /app/backend

# Expose default application port (Render overrides PORT at runtime)
EXPOSE 5000

# Start production server
CMD ["node", "index.js"]
