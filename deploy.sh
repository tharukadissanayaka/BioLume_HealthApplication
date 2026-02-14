#!/bin/bash

# BioLume Health Application - Deployment Script for Remote Server
# This script pulls the latest images from Docker Hub and deploys the application

set -e

DOCKER_HUB_USERNAME="tharukadissanayaka"
FRONTEND_IMAGE="${DOCKER_HUB_USERNAME}/biolume-frontend:latest"
BACKEND_IMAGE="${DOCKER_HUB_USERNAME}/biolume-backend:latest"

echo "========================================="
echo "BioLume Health Application Deployment"
echo "========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed!"
    exit 1
fi

# Check if docker compose is available
if ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not available!"
    exit 1
fi

echo "Pulling latest images from Docker Hub..."
docker pull $FRONTEND_IMAGE
docker pull $BACKEND_IMAGE
docker pull mongo:latest

echo "Stopping existing containers..."
docker compose -f compose.prod.yml down || true

echo "Starting containers..."
docker compose -f compose.prod.yml up -d

echo "Waiting for services to start..."
sleep 10

echo "Checking container status..."
docker compose -f compose.prod.yml ps

echo "========================================="
echo "Deployment completed!"
echo "Application available at: http://$(curl -s ifconfig.me):5173"
echo "========================================="

# Clean up old images
echo "Cleaning up old images..."
docker image prune -f

echo "Done!"
