# Quick Reference Guide - BioLume CI/CD

## Essential Jenkins Setup

### 1. Add Docker Hub Credentials

- Jenkins → Manage Jenkins → Credentials → Add
- **ID**: `dockerhub-credentials`
- **Username**: `tharukadissanayaka`
- **Password**: [Your Docker Hub token]

### 2. Setup SSH Access to Remote Server

```bash
# On Jenkins server (as jenkins user)
ssh-keygen -t rsa -b 4096
cat ~/.ssh/id_rsa.pub
# Copy this public key to remote server's authorized_keys
```

On remote server:

```bash
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Create Jenkins Pipeline Job

- New Item → Pipeline
- Git: https://github.com/tharukadissanayake/BioLume_HealthApplication.git
- Branch: main
- Script Path: Jenkinsfile
- Poll SCM: `H/5 * * * *`

## Quick Commands

### On Jenkins Server

```bash
# Test Docker
docker --version
docker ps

# Test SSH to remote
ssh ubuntu@98.93.42.249

# Manual image build and push
docker build -t tharukadissanayaka/biolume-frontend:latest ./frontend
docker build -t tharukadissanayaka/biolume-backend:latest ./backend
docker login
docker push tharukadissanayaka/biolume-frontend:latest
docker push tharukadissanayaka/biolume-backend:latest
```

### On Remote Server (98.93.42.249)

```bash
# Check running containers
docker ps
docker compose -f /home/ubuntu/biolume/compose.prod.yml ps

# View logs
docker compose -f /home/ubuntu/biolume/compose.prod.yml logs -f

# Restart application
cd /home/ubuntu/biolume
docker compose -f compose.prod.yml restart

# Pull and redeploy
docker compose -f compose.prod.yml down
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d

# Check disk space
df -h
docker system df

# Clean up
docker system prune -a -f
```

## Testing the Pipeline

### 1. Initial Setup Test

```bash
# Clone repo
git clone https://github.com/tharukadissanayake/BioLume_HealthApplication.git
cd BioLume_HealthApplication

# Test local build
docker build -t test-frontend ./frontend
docker build -t test-backend ./backend
```

### 2. Trigger Pipeline

- Push code to GitHub
- Or click "Build Now" in Jenkins
- Monitor console output

### 3. Verify Deployment

```bash
# Check application
curl http://98.93.42.249:5173
curl http://98.93.42.249:3000

# Check Docker Hub
# Visit: https://hub.docker.com/u/tharukadissanayaka
```

## Common Issues & Fixes

### Issue: "Permission denied" on Docker

```bash
sudo usermod -aG docker $USER
# Logout and login again
```

### Issue: "Cannot connect to Docker daemon"

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Issue: SSH connection refused

```bash
# Check SSH service
sudo systemctl status ssh

# Check firewall
sudo ufw status
sudo ufw allow 22
```

### Issue: Port already in use

```bash
# Find process using port
sudo netstat -tlnp | grep 5173
# Kill process
sudo kill -9 <PID>
```

### Issue: Out of disk space

```bash
# Clean Docker
docker system prune -a -f --volumes
# Check space
df -h
```

## URLs

- **Application**: http://98.93.42.249:5173/
- **Backend API**: http://98.93.42.249:3000/
- **Docker Hub Frontend**: https://hub.docker.com/r/tharukadissanayaka/biolume-frontend
- **Docker Hub Backend**: https://hub.docker.com/r/tharukadissanayaka/biolume-backend

## Files to Copy to Remote Server

```bash
# From your local machine
scp compose.prod.yml ubuntu@98.93.42.249:/home/ubuntu/biolume/
scp deploy.sh ubuntu@98.93.42.249:/home/ubuntu/biolume/
```

## Environment Variables

Add to Jenkins if needed:

- `DOCKER_HUB_USERNAME`: tharukadissanayaka
- `REMOTE_SERVER`: 98.93.42.249
- `REMOTE_USER`: ubuntu

## Pipeline Flow

```
Code Push → GitHub
    ↓
GitHub → Jenkins (webhook/poll)
    ↓
Jenkins Pipeline:
    1. Checkout code
    2. Build Docker images
    3. Run tests
    4. Push to Docker Hub
    5. SSH to remote server
    6. Pull images
    7. Deploy with docker-compose
    8. Health check
    ↓
Application Live at http://98.93.42.249:5173/
```

## Monitoring

```bash
# On remote server - watch logs
docker compose -f /home/ubuntu/biolume/compose.prod.yml logs -f

# Monitor resources
docker stats

# Check container health
docker inspect <container_id> | grep -A 10 Health
```
