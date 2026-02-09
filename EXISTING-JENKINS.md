# Creating BioLume Pipeline in Existing Jenkins

## For Users Who Already Have Jenkins Installed

Since you already have Jenkins running at http://localhost:8080, follow these simple steps:

> **📍 AWS Deployment**: This application is deployed on AWS and accessible at:
>
> - **Frontend**: http://98.93.42.249:5173
> - **Backend**: http://98.93.42.249:3000
>
> See [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md) for AWS-specific configuration.

---

## Step 1: Access Jenkins

1. Open browser: **http://localhost:8080**
2. Log in with your existing credentials

---

## Step 2: Create New Pipeline Job

1. Click **"New Item"** (top left)
2. Enter item name: `BioLume-CICD`
3. Select **"Pipeline"** (scroll down if needed)
4. Click **"OK"**

---

## Step 3: Configure the Pipeline

You'll see the configuration page. Fill in these sections:

### General Section:

- **Description**: `BioLume Application CI/CD Pipeline`
- Leave other options as default

### Build Triggers Section (Optional):

If you want automatic builds:

- ☑️ Check **"Poll SCM"**
- Schedule: `H/5 * * * *` (checks every 5 minutes for changes)

### Pipeline Section:

This is the important part!

**Option A - Using SCM (if you have Git):**

- Definition: Select **"Pipeline script from SCM"**
- SCM: Select **"Git"**
- Repository URL:
  ```
  file:///mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy
  ```
- Credentials: (leave as "none" for local repo)
- Branch Specifier: `*/main` (or `*/master` if that's your branch)
- Script Path: `Jenkinsfile`

**Option B - Direct Script (Easier for local projects):**

- Definition: Select **"Pipeline script"**
- Script: Copy and paste the entire contents of the `Jenkinsfile` from your project
  (Open the Jenkinsfile in VS Code, copy all content, paste in Jenkins)

---

## Step 4: Configure Docker Permissions

Before running, ensure Jenkins can access Docker in WSL:

Open WSL terminal and run:

```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Fix docker socket permissions
sudo chmod 666 /var/run/docker.sock

# Restart Jenkins
sudo service jenkins restart
```

---

## Step 5: Save and Build

1. Scroll to bottom and click **"Save"**
2. You'll be taken to the project page
3. Click **"Build Now"** (left sidebar)
4. Watch the build progress:
   - A build number appears under "Build History"
   - Click the build number (e.g., #1)
   - Click **"Console Output"** to watch live progress

---

## Step 6: Monitor the Build

The build will go through these stages:

1. ✓ Checkout (5-10s)
2. ✓ Environment Check (3-5s)
3. ✓ Stop Existing Containers (5-10s)
4. ✓ Clean Old Images (10-20s)
5. ✓ Build Images (2-5 min first time, 30-60s after)
6. ✓ Run Tests (10-30s)
7. ✓ Deploy (20-40s)
8. ✓ Health Check (10-20s)

**Total time: 3-7 minutes for first build, 2-3 minutes for subsequent builds**

---

## Step 7: Verify Deployment

After the build succeeds, check:

### Browser:

- **Frontend (Public)**: http://98.93.42.249:5173
- **Backend API (Public)**: http://98.93.42.249:3000
- **Frontend (Local)**: http://localhost:5173
- **Backend API (Local)**: http://localhost:3000

### Terminal (WSL):

```bash
# Check containers are running
docker compose ps

# View logs
docker compose logs -f

# Should see 3 containers: frontend, backend, mongo
```

---

## Troubleshooting

### ❌ Build fails with "permission denied" Docker error

**Fix:**

```bash
# In WSL terminal
sudo chmod 666 /var/run/docker.sock
sudo usermod -aG docker jenkins
sudo service jenkins restart
```

Then retry the build in Jenkins.

### ❌ Build fails with "docker: command not found"

**Fix:**

```bash
# In WSL terminal
sudo service docker start
sudo service jenkins restart
```

### ❌ Port already in use (5173 or 3000)

**Fix:**

```bash
# In WSL terminal
docker compose down

# Or find and kill the process
sudo lsof -i :5173
sudo lsof -i :3000
# Then: sudo kill -9 <PID>
```

### ❌ Can't find Jenkinsfile

**Check the path in Jenkins matches exactly:**

```
file:///mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy
```

**Or use Option B** (direct script) instead - just copy-paste the Jenkinsfile content.

---

## Quick Commands Reference

```bash
# Check status
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"
bash check-status.sh

# Or using make
make status

# View containers
docker compose ps

# View logs
docker compose logs -f

# Stop application
docker compose down

# Start application manually
docker compose up -d
```

---

## Visual Guide

### Creating Pipeline Job:

```
Jenkins Dashboard
  └─> New Item
       └─> Enter name: BioLume-CICD
            └─> Select: Pipeline
                 └─> OK
                      └─> Configure Pipeline section
                           └─> Save
                                └─> Build Now
```

### After Build Succeeds:

```
Jenkins Dashboard
  └─> BioLume-CICD job
       └─> Build #1 (blue dot = success)
            └─> Console Output (to see logs)
```

---

## Expected Result

After successful build, you should see:

**In Jenkins Console Output:**

```
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
```

**In WSL Terminal:**

```bash
$ docker compose ps
NAME                       STATUS              PORTS
devops_biolume-backend-1   Up 2 minutes       0.0.0.0:3000->3000/tcp
devops_biolume-frontend-1  Up 2 minutes       0.0.0.0:5173->5173/tcp
devops_biolume-mongo-1     Up 2 minutes       0.0.0.0:27019->27017/tcp
```

**In Browser:**

- http://98.93.42.249:5173 → Your BioLume app loads ✓ (Public AWS)
- http://98.93.42.249:3000 → Backend API responds ✓ (Public AWS)
- http://localhost:5173 → Your BioLume app loads ✓ (Local)
- http://localhost:3000 → Backend API responds ✓ (Local)

---

## Next Steps

1. ✅ Pipeline job created
2. ✅ First build successful
3. ✅ Application deployed and running

**For future updates:**

- Just click "Build Now" in Jenkins whenever you want to redeploy
- Or set up SCM polling for automatic builds on code changes

**To stop the application:**

```bash
docker compose down
```

**To restart:**
Just trigger another Jenkins build!

---

## Need Help?

Run the status checker:

```bash
cd "/mnt/c/Users/Tharuka Dissanayake/Documents/GitHub/Devops_BioLume - Copy"
bash check-status.sh
```

This will show you the status of Docker, Jenkins, and your application containers.
