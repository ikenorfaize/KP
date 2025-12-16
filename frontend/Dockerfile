# Frontend Dockerfile - Multi-stage build
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_FILE_SERVER_URL

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FILE_SERVER_URL=$VITE_FILE_SERVER_URL

# Build the application
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
