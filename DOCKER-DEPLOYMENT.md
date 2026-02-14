# BioLume Health Application - Docker & Jenkins CI/CD Setup

This document explains the automated CI/CD pipeline setup for building, pushing, and deploying the BioLume Health Application.

## Overview

The Jenkins pipeline automatically:

1. Builds Docker images for frontend and backend
2. Pushes images to Docker Hub
3. Deploys the application to the remote server at http://98.93.42.249:5173/

## Prerequisites

### On Jenkins Server

1. **Jenkins** with the following plugins:
   - Docker Pipeline
   - Git
   - SSH Agent
   - Credentials Binding

2. **Docker** installed and running

3. **SSH Access** to the remote server (98.93.42.249)

### On Remote Server (98.93.42.249)

1. **Docker** and **Docker Compose** installed
2. **SSH access** configured for Jenkins
3. **Directory**: `/home/ubuntu/biolume/` (will be created automatically)

## Setup Instructions

### 1. Configure Docker Hub Credentials in Jenkins

1. Go to Jenkins → Manage Jenkins → Credentials
2. Add new credentials:
   - **Kind**: Username with password
   - **ID**: `dockerhub-credentials`
   - **Username**: `tharukadissanayaka`
   - **Password**: Your Docker Hub password/token
   - **Description**: Docker Hub Credentials

### 2. Configure SSH Access to Remote Server

#### Option A: Using SSH Agent Plugin

1. Add SSH credentials in Jenkins:
   - **Kind**: SSH Username with private key
   - **ID**: `aws-server-ssh`
   - **Username**: `ubuntu`
   - **Private Key**: Paste your private key

2. Update Jenkinsfile to use SSH agent:
   ```groovy
   sshagent(['aws-server-ssh']) {
       // SSH commands
   }
   ```

#### Option B: Using SSH Key in Jenkins Home

1. Copy your SSH private key to Jenkins server:

   ```bash
   # On Jenkins server
   mkdir -p /var/lib/jenkins/.ssh
   cp your_key.pem /var/lib/jenkins/.ssh/
   chmod 600 /var/lib/jenkins/.ssh/your_key.pem
   chown jenkins:jenkins /var/lib/jenkins/.ssh/your_key.pem
   ```

2. Update SSH commands in Jenkinsfile:
   ```bash
   ssh -i ~/.ssh/your_key.pem -o StrictHostKeyChecking=no ubuntu@98.93.42.249
   ```

### 3. Prepare Remote Server

Connect to your remote server and prepare it:

```bash
# SSH to remote server
ssh ubuntu@98.93.42.249

# Install Docker (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose (if not already installed)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /home/ubuntu/biolume
cd /home/ubuntu/biolume

# Copy the compose.prod.yml file (will be done automatically by Jenkins)
# But you can also copy it manually:
# scp compose.prod.yml ubuntu@98.93.42.249:/home/ubuntu/biolume/
```

### 4. Create Jenkins Pipeline Job

1. Create a new Pipeline job in Jenkins
2. Source Code Management: Git
   - **Repository URL**: https://github.com/tharukadissanayake/BioLume_HealthApplication.git
   - **Branch**: main

3. Build Triggers:
   - ☑ Poll SCM: `H/5 * * * *` (checks every 5 minutes)
   - Or configure GitHub webhook for instant triggers

4. Pipeline:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Script Path**: Jenkinsfile

### 5. Setup GitHub Webhook (Optional but Recommended)

For automatic builds on code push:

1. Go to your GitHub repository → Settings → Webhooks
2. Add webhook:
   - **Payload URL**: `http://your-jenkins-url/github-webhook/`
   - **Content type**: application/json
   - **Events**: Just the push event
   - ☑ Active

## Docker Images

The pipeline creates and pushes these images to Docker Hub:

- **Frontend**: `tharukadissanayaka/biolume-frontend:latest`
- **Backend**: `tharukadissanayaka/biolume-backend:latest`

Each build also tags images with the build number:

- `tharukadissanayaka/biolume-frontend:${BUILD_NUMBER}`
- `tharukadissanayaka/biolume-backend:${BUILD_NUMBER}`

## Manual Deployment

If you need to deploy manually on the remote server:

1. Copy the deployment script to the server:

   ```bash
   scp deploy.sh ubuntu@98.93.42.249:/home/ubuntu/biolume/
   scp compose.prod.yml ubuntu@98.93.42.249:/home/ubuntu/biolume/
   ```

2. SSH to the server and run:
   ```bash
   ssh ubuntu@98.93.42.249
   cd /home/ubuntu/biolume
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Pipeline Stages

1. **Checkout**: Pulls the latest code from GitHub
2. **Environment Check**: Verifies Docker is available
3. **Build Docker Images**: Builds frontend and backend images
4. **Run Tests**: Executes test suite (placeholder for now)
5. **Push to Docker Hub**: Pushes images to Docker Hub
6. **Deploy to Remote Server**: Deploys containers on the remote server
7. **Health Check**: Verifies the application is running

## Accessing the Application

After successful deployment:

- **Frontend**: http://98.93.42.249:5173/
- **Backend API**: http://98.93.42.249:3000/

## Troubleshooting

### Jenkins can't connect to remote server

Check SSH connectivity:

```bash
# On Jenkins server
ssh -v ubuntu@98.93.42.249
```

### Docker Hub push fails

Verify credentials:

1. Check if `dockerhub-credentials` exists in Jenkins
2. Ensure the username and password are correct
3. Check Docker Hub access token permissions

### Containers not starting on remote server

SSH to the server and check:

```bash
ssh ubuntu@98.93.42.249
cd /home/ubuntu/biolume
docker compose -f compose.prod.yml ps
docker compose -f compose.prod.yml logs
```

### Port conflicts

Ensure ports 5173, 3000, and 27019 are not in use:

```bash
sudo netstat -tlnp | grep -E '5173|3000|27019'
```

### Check running containers

```bash
docker ps
docker compose -f compose.prod.yml ps
```

### View logs

```bash
# All services
docker compose -f compose.prod.yml logs

# Specific service
docker compose -f compose.prod.yml logs frontend
docker compose -f compose.prod.yml logs backend
docker compose -f compose.prod.yml logs mongo
```

### Restart services

```bash
docker compose -f compose.prod.yml restart
```

### Complete redeployment

```bash
docker compose -f compose.prod.yml down
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d
```

## Security Considerations

1. **Never commit credentials** to the repository
2. Use Jenkins credentials management for sensitive data
3. Secure your SSH keys (chmod 600)
4. Consider using Docker secrets for production
5. Implement proper firewall rules on the remote server
6. Use HTTPS in production (add nginx reverse proxy)

## Future Enhancements

- [ ] Add real test suites
- [ ] Implement blue-green deployment
- [ ] Add monitoring and alerting
- [ ] Set up HTTPS with Let's Encrypt
- [ ] Add environment-specific configurations
- [ ] Implement health check endpoints
- [ ] Add database backup strategy

## Files Structure

```
.
├── Jenkinsfile              # Jenkins pipeline configuration
├── compose.yml              # Local development compose file
├── compose.prod.yml         # Production compose file (uses Docker Hub images)
├── deploy.sh                # Manual deployment script
├── DOCKER-DEPLOYMENT.md     # This file
├── frontend/
│   └── Dockerfile          # Frontend Docker configuration
└── backend/
    └── Dockerfile          # Backend Docker configuration
```

## Support

For issues or questions:

1. Check Jenkins console output
2. Review Docker logs on the remote server
3. Verify all prerequisites are met
4. Check network connectivity between Jenkins and remote server
