#!/bin/bash

# Deployment script for app.uptrender.in
# This script builds and deploys the algo project without affecting the live trade.investminuae.com project

set -e  # Exit on any error

PROJECT_DIR="/var/www/algo"
LOG_FILE="/var/log/uptrender-deploy.log"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting deployment for app.uptrender.in"

# Change to project directory
cd "$PROJECT_DIR"

log "Current directory: $(pwd)"

# Check if git repo and pull latest changes (optional)
if [ -d ".git" ]; then
    log "Pulling latest changes from git..."
    git pull origin main || log "Git pull failed or not needed"
fi

# Install/update dependencies for frontend
log "Installing frontend dependencies..."
npm install --legacy-peer-deps

# Install/update dependencies for backend
log "Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps
cd ..

# Build the frontend for production
log "Building frontend for production..."
npm run build

# Check if PM2 log directory exists
sudo mkdir -p /var/log/pm2
sudo chown root:root /var/log/pm2

# Stop existing processes if they exist
log "Stopping existing processes..."
pm2 delete uptrender-frontend 2>/dev/null || log "Frontend process not running"
pm2 delete uptrender-backend 2>/dev/null || log "Backend process not running"

# Create database if it doesn't exist (optional)
log "Setting up database..."
# Check if database exists (this will be handled by the application)
log "Database setup will be handled by the application on first run"

# Start the applications using PM2
log "Starting applications with PM2..."
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Show status
log "Deployment completed. Current PM2 status:"
pm2 status

log "Applications should be running on:"
log "Frontend: http://localhost:4000 (proxied via nginx to https://app.uptrender.in)"
log "Backend: http://localhost:4001"

log "Checking if applications are responding..."
sleep 5

# Check if frontend is responding
if curl -f http://localhost:4000 >/dev/null 2>&1; then
    log "✅ Frontend is responding on port 4000"
else
    log "❌ Frontend is not responding on port 4000"
    pm2 logs uptrender-frontend --lines 10
fi

# Check if backend is responding
if curl -f http://localhost:4001/health >/dev/null 2>&1; then
    log "✅ Backend is responding on port 4001"
else
    log "❌ Backend is not responding on port 4001"
    pm2 logs uptrender-backend --lines 10
fi

log "Deployment script completed!"
log "Check logs with: pm2 logs"
log "View status with: pm2 status"
log "Website should be available at: https://app.uptrender.in"