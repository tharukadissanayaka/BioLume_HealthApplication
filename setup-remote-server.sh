#!/bin/bash

# Quick Setup Script for Remote Server
# Run this on the remote server (98.93.42.249) to prepare for Jenkins deployments

set -e

echo "========================================="
echo "BioLume - Remote Server Setup"
echo "========================================="

# Update system
echo "Updating system packages..."
sudo apt-get update

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker installed successfully!"
else
    echo "Docker already installed: $(docker --version)"
fi

# Install Docker Compose if not present
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully!"
else
    echo "Docker Compose already installed: $(docker compose version)"
fi

# Create application directory
echo "Creating application directory..."
mkdir -p /home/ubuntu/biolume
cd /home/ubuntu/biolume

echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Ensure SSH key is configured for Jenkins access"
echo "2. Copy compose.prod.yml to this directory"
echo "3. Configure Jenkins pipeline"
echo "4. Run your first deployment!"
echo ""
echo "Directory created: /home/ubuntu/biolume"
echo ""
