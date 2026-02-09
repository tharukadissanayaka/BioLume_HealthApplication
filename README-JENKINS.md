# Jenkins CI/CD Setup Guide for BioLume

## Prerequisites

### 1. Install Jenkins on WSL

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Java (required for Jenkins)
sudo apt install openjdk-17-jdk -y

# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install jenkins -y

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 2. Install Docker on WSL (Without Docker Desktop)

```bash
# Install Docker
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo service docker start

# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo usermod -aG docker $USER

# Verify Docker installation
docker --version
docker compose version
```

### 3. Configure Docker to Start Automatically in WSL

Create a startup script:

```bash
# Edit /etc/wsl.conf
sudo nano /etc/wsl.conf
```

Add:

```ini
[boot]
systemd=true
```

Restart WSL and start Docker:

```bash
sudo service docker start
```

### 4. Access Jenkins

1. Open browser and go to: `http://localhost:8080`
2. Enter the initial admin password from step 1
3. Install suggested plugins
4. Create an admin user

## Jenkins Configuration

### 1. Install Required Plugins

Go to **Manage Jenkins** → **Manage Plugins** → **Available**

Install:

- Docker Pipeline
- Git plugin
- Pipeline plugin
- Workspace Cleanup Plugin

### 2. Configure Jenkins User Permissions

```bash
# In WSL terminal
sudo usermod -aG docker jenkins
sudo service jenkins restart
sudo service docker restart
```

### 3. Create Jenkins Pipeline Job

1. Click **New Item**
2. Enter name: `BioLume-CICD`
3. Select **Pipeline**
4. Click **OK**

#### Configure the Pipeline:

**General:**

- Description: "BioLume Application CI/CD Pipeline"
- ✓ GitHub project: (your repo URL if available)

**Build Triggers:**

- ✓ Poll SCM: `H/5 * * * *` (checks every 5 minutes)
- Or use ✓ GitHub hook trigger for GITScm polling

**Pipeline:**

- Definition: **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: Your repository URL or local path
  - For local: `file:///path/to/your/repo`
- Branch: `*/main` or `*/master`
- Script Path: `Jenkinsfile`

### 4. For Local Development (Without Git)

If not using Git, select **Pipeline script** and paste the Jenkinsfile content directly.

## Running the Pipeline

### Manual Trigger:

1. Go to your pipeline job
2. Click **Build Now**
3. Monitor the build in **Console Output**

### Automatic Trigger:

- Pipeline will trigger automatically based on configured triggers
- For Git: commits will trigger builds
- For SCM polling: Jenkins checks for changes every 5 minutes

## Accessing the Application

After successful deployment:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27019

## Monitoring

### View Running Containers:

```bash
docker compose ps
```

### View Logs:

```bash
# All services
docker compose logs

# Specific service
docker compose logs frontend
docker compose logs backend
docker compose logs mongo
```

### Stop Application:

```bash
docker compose down
```

### Restart Application:

```bash
docker compose restart
```

## Troubleshooting

### Docker Permission Denied:

```bash
sudo chmod 666 /var/run/docker.sock
sudo usermod -aG docker jenkins
sudo service jenkins restart
```

### Jenkins Can't Access Docker:

```bash
# Check Docker is running
sudo service docker status

# Restart Docker
sudo service docker restart

# Restart Jenkins
sudo service jenkins restart
```

### Port Already in Use:

```bash
# Find and kill process using port
sudo lsof -i :5173
sudo lsof -i :3000
sudo kill -9 <PID>
```

### WSL Docker Not Starting:

```bash
# Check WSL version
wsl --version

# Update WSL (in Windows PowerShell)
wsl --update

# Restart WSL
wsl --shutdown
# Then restart your WSL terminal
```

## Build History

Jenkins will maintain:

- Build history with logs
- Deployment status
- Success/failure metrics
- Console output for debugging

## Next Steps

1. **Add Tests**: Update package.json with proper test scripts
2. **Environment Variables**: Create .env files for different environments
3. **Notifications**: Configure email/Slack notifications
4. **Backup**: Set up MongoDB data backup strategy
5. **Security**: Configure authentication and authorization
6. **Monitoring**: Add application monitoring tools

## Additional Notes

- Pipeline uses `cleanWs()` to clean workspace after each build
- Old Docker images are pruned to save space
- Health checks verify containers are running properly
- All commands run in WSL environment, not Docker Desktop
