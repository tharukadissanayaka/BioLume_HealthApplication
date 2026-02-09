# Jenkins CI/CD Quick Start Guide

## Option 1: Automated Setup

Run in WSL terminal:

```bash
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"
chmod +x setup-jenkins.sh
./setup-jenkins.sh
```

Enter your sudo password when prompted.

## Option 2: Quick Manual Setup

Run in WSL terminal:

```bash
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"
chmod +x quick-setup.sh
./quick-setup.sh
```

## Option 3: Step-by-Step Manual Commands

### 1. Start Docker

```bash
sudo service docker start
docker --version
```

### 2. Install Jenkins (if not already installed)

```bash
# Add Jenkins repository key
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# Add Jenkins repository
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Update and install
sudo apt update
sudo apt install -y jenkins
```

### 3. Configure Permissions

```bash
# Add current user to docker group
sudo usermod -aG docker $USER

# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Fix docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

### 4. Start Jenkins

```bash
sudo service jenkins start
sudo service jenkins status
```

### 5. Get Initial Admin Password

```bash
# Wait 30 seconds for Jenkins to initialize, then:
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## Accessing Jenkins

1. Open browser: **http://localhost:8080**
2. Enter the initial admin password from above
3. Click "Install suggested plugins"
4. Create your admin user
5. Click "Save and Continue"

## Creating the Pipeline Job

### Step 1: Create New Job

1. Click **"New Item"** in Jenkins
2. Enter name: `BioLume-CICD`
3. Select **"Pipeline"**
4. Click **"OK"**

### Step 2: Configure Pipeline

**General Tab:**

- Description: `BioLume Application CI/CD Pipeline`

**Build Triggers:**

- Check ☑ **"Poll SCM"**
- Schedule: `H/5 * * * *` (checks every 5 minutes)

**Pipeline Section:**

- Definition: Select **"Pipeline script from SCM"**
- SCM: Select **"Git"**
- Repository URL: Enter your repository URL OR use local path:
  ```
  file:///mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy
  ```
- Branch Specifier: `*/main` (or `*/master`)
- Script Path: `Jenkinsfile`

**OR Use Direct Script:**

- Definition: Select **"Pipeline script"**
- Copy-paste the content from `Jenkinsfile` directly into the script box

### Step 3: Save and Build

1. Click **"Save"**
2. Click **"Build Now"**
3. Watch the build progress in **"Console Output"**

## Verifying the Deployment

After successful build:

### Check Containers

```bash
docker compose ps
```

### Access Applications

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **MongoDB**: localhost:27019

### View Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs frontend
docker compose logs backend
```

## Common Issues and Solutions

### Issue: "Permission denied" for Docker

```bash
sudo chmod 666 /var/run/docker.sock
sudo usermod -aG docker jenkins
sudo service jenkins restart
```

### Issue: Port already in use

```bash
# Stop existing containers
docker compose down

# Or kill specific port
sudo lsof -i :5173  # Find process ID
sudo kill -9 <PID>  # Kill process
```

### Issue: Jenkins service won't start

```bash
# Check status
sudo service jenkins status

# Restart
sudo service jenkins restart

# Check logs
sudo journalctl -u jenkins -n 50
```

### Issue: Can't access http://localhost:8080

```bash
# Check if Jenkins is running
sudo service jenkins status

# Check if port 8080 is in use
sudo lsof -i :8080

# Restart Jenkins
sudo service jenkins restart
```

## Useful Commands

### Jenkins Management

```bash
# Start Jenkins
sudo service jenkins start

# Stop Jenkins
sudo service jenkins stop

# Restart Jenkins
sudo service jenkins restart

# Check Jenkins status
sudo service jenkins status

# View Jenkins logs
sudo journalctl -u jenkins -f
```

### Docker Management

```bash
# Start Docker
sudo service docker start

# Check Docker status
sudo service docker status

# View running containers
docker compose ps

# Start application
docker compose up -d

# Stop application
docker compose down

# View logs
docker compose logs -f
```

### Application Management

```bash
# Navigate to project
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"

# Build images
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Restart services
docker compose restart
```

## What the Pipeline Does

1. **Checkout**: Gets code from repository
2. **Environment Check**: Verifies Docker and WSL setup
3. **Stop Existing Containers**: Stops any running containers
4. **Clean Old Images**: Removes unused Docker images
5. **Build Images**: Builds frontend, backend, and database images
6. **Run Tests**: Placeholder for future tests
7. **Deploy**: Starts all services using docker-compose
8. **Health Check**: Verifies all services are running

## Next Steps

1. ✓ Jenkins installed and running
2. ✓ Pipeline created and configured
3. ✓ Application deployed
4. Configure webhooks for automatic builds (if using Git)
5. Add real tests to backend and frontend
6. Set up environment variables for different environments
7. Configure notifications (email/Slack)
8. Add monitoring and logging

## Getting Help

- Check Jenkins logs: `sudo journalctl -u jenkins -n 100`
- Check Docker logs: `docker compose logs`
- View pipeline console output in Jenkins UI
- Review README-JENKINS.md for detailed documentation

## Quick Test

After setup, test your pipeline:

```bash
# In WSL terminal
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"

# Make a small change to trigger rebuild
echo "# Test change" >> README.md

# If using Git
git add .
git commit -m "Test CI/CD"

# Jenkins will automatically detect and build (if SCM polling is configured)
# Or manually click "Build Now" in Jenkins UI
```

Then check:

- Jenkins build succeeds ✓
- http://localhost:5173 shows frontend ✓
- http://localhost:3000 shows backend ✓
- `docker compose ps` shows all containers running ✓
