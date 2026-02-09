# 🚀 Jenkins CI/CD Setup Complete!

## ✅ Files Created

I've created the following files for your Jenkins CI/CD pipeline:

1. **Jenkinsfile** - Main CI/CD pipeline definition
2. **setup-jenkins.sh** - Automated installation script
3. **quick-setup.sh** - Quick manual setup commands
4. **check-status.sh** - Status checking utility
5. **QUICKSTART.md** - Quick start guide
6. **README-JENKINS.md** - Detailed documentation
7. **ARCHITECTURE.md** - System architecture diagrams
8. **Makefile** - Command shortcuts
9. **.dockerignore** - Docker build optimization

## 🎯 Next Steps - Choose One Method:

### Method 1: Automated Setup (Recommended)

Open WSL terminal and run:

```bash
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"
bash setup-jenkins.sh
```

Enter your WSL password when prompted.

### Method 2: Quick Manual Setup

```bash
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"
bash quick-setup.sh
```

### Method 3: Step by Step

```bash
# 1. Start Docker
sudo service docker start

# 2. Check if Jenkins is installed
jenkins --version

# 3. If not installed, install Jenkins:
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install -y jenkins

# 4. Configure permissions
sudo usermod -aG docker $USER
sudo usermod -aG docker jenkins
sudo chmod 666 /var/run/docker.sock

# 5. Start Jenkins
sudo service jenkins start

# 6. Get initial password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## 📋 After Installation

### 1. Access Jenkins

- Open browser: **http://localhost:8080**
- Copy the initial admin password from terminal
- Paste it in Jenkins
- Click **"Install suggested plugins"**
- Create admin user
- Click **"Save and Continue"**

### 2. Create Pipeline Job

1. Click **"New Item"**
2. Name: `BioLume-CICD`
3. Type: **"Pipeline"**
4. Click **"OK"**

### 3. Configure Pipeline

**Pipeline Section:**

- Definition: **"Pipeline script from SCM"**
- SCM: **"Git"**
- Repository URL:
  ```
  file:///mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy
  ```
- Branch: `*/main` (or `*/master`)
- Script Path: `Jenkinsfile`

Click **"Save"**

### 4. Run First Build

- Click **"Build Now"**
- Watch **"Console Output"**
- Wait 3-5 minutes for first build

### 5. Access Your Application

After successful build:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 🛠 Useful Commands

### Using Makefile (Easy):

```bash
make status          # Check everything
make start           # Start application
make stop            # Stop application
make logs            # View logs
make jenkins-start   # Start Jenkins
make jenkins-password # Show password
make help            # Show all commands
```

### Manual Commands:

```bash
# Check status
bash check-status.sh

# Docker commands
docker compose up -d      # Start app
docker compose down       # Stop app
docker compose ps         # Show containers
docker compose logs -f    # View logs

# Jenkins commands
sudo service jenkins start    # Start Jenkins
sudo service jenkins status   # Check status
sudo service jenkins restart  # Restart Jenkins
```

## 📊 Pipeline Stages

Your pipeline will:

1. ✓ Checkout code
2. ✓ Check environment
3. ✓ Stop old containers
4. ✓ Clean old images
5. ✓ Build new images (Frontend, Backend, MongoDB)
6. ✓ Run tests
7. ✓ Deploy containers
8. ✓ Health check

**Total time**: ~3-5 minutes

## 🔍 Monitoring

- **Jenkins**: http://localhost:8080
- **Build History**: Click on job → Build History
- **Console Output**: Click build number → Console Output
- **Application Logs**: `docker compose logs -f`

## 📖 Documentation

- **QUICKSTART.md** - Fast setup guide
- **README-JENKINS.md** - Detailed instructions
- **ARCHITECTURE.md** - System diagrams
- **Jenkinsfile** - Pipeline code (with comments)

## ⚡ Quick Test

After setup, test your pipeline:

```bash
# Check everything is running
bash check-status.sh

# Or using make
make status

# View running containers
docker compose ps

# Test frontend
curl http://localhost:5173

# Test backend
curl http://localhost:3000
```

## 🆘 Troubleshooting

### Jenkins won't start:

```bash
sudo service jenkins status
sudo service jenkins restart
sudo journalctl -u jenkins -n 50
```

### Docker permission denied:

```bash
sudo chmod 666 /var/run/docker.sock
sudo usermod -aG docker jenkins
sudo service jenkins restart
```

### Port already in use:

```bash
docker compose down
sudo lsof -i :5173    # Find process
sudo lsof -i :3000    # Find process
sudo kill -9 <PID>    # Kill process
```

### Can't access application:

```bash
docker compose ps           # Check containers
docker compose logs -f      # Check logs
sudo service docker start   # Start Docker
```

## 🎉 What You Get

✅ **Automated CI/CD Pipeline** - Push code → Auto deploy
✅ **Jenkins Integration** - Build history & logs
✅ **Docker Containerization** - Consistent environments
✅ **WSL Native** - No Docker Desktop needed
✅ **Easy Management** - Simple make commands
✅ **Health Checks** - Automatic verification
✅ **Complete Documentation** - Everything explained

## 🔄 Workflow

```
Code Change → Git Commit → Jenkins Detects → Build → Test → Deploy → Running App
```

## 📞 Need Help?

1. Check status: `bash check-status.sh`
2. Read QUICKSTART.md for common issues
3. View logs: `docker compose logs -f`
4. Jenkins logs: `sudo journalctl -u jenkins -f`

---

## 🚀 Quick Start Summary

```bash
# In WSL terminal:
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"

# Run setup:
bash setup-jenkins.sh

# After setup opens browser to:
http://localhost:8080

# Create Pipeline job → Build Now → Done!
```

Your application will be automatically deployed via Jenkins CI/CD! 🎊
