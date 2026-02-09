# BioLume CI/CD Architecture

## Pipeline Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          JENKINS CI/CD PIPELINE                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Developer   │
│  Push Code   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        1. CHECKOUT STAGE                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • Clone repository from Git/Local                                │  │
│  │  • Checkout specific branch (main/master)                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    2. ENVIRONMENT CHECK STAGE                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • Verify Docker installation                                     │  │
│  │  • Verify Docker Compose installation                             │  │
│  │  • Check WSL environment                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  3. STOP EXISTING CONTAINERS STAGE                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • Stop old running containers                                    │  │
│  │  • Prepare for fresh deployment                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    4. CLEAN OLD IMAGES STAGE                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • Remove unused Docker images                                    │  │
│  │  • Free up disk space                                             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      5. BUILD IMAGES STAGE                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │  │
│  │  │   Frontend   │  │   Backend    │  │   MongoDB    │          │  │
│  │  │   (React)    │  │  (Node.js)   │  │   Database   │          │  │
│  │  │              │  │              │  │              │          │  │
│  │  │ Port: 5173   │  │ Port: 3000   │  │ Port: 27019  │          │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │  │
│  │                                                                    │  │
│  │  • Build Docker images for all services                           │  │
│  │  • Use cached layers when possible                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       6. RUN TESTS STAGE                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • Run backend unit tests                                         │  │
│  │  • Run frontend linting                                           │  │
│  │  • Run integration tests (when available)                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        7. DEPLOY STAGE                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • Start all containers using docker-compose                      │  │
│  │  • Deploy in correct order (mongo → backend → frontend)           │  │
│  │  • Configure networking and volumes                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      8. HEALTH CHECK STAGE                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • Wait for services to start                                     │  │
│  │  • Check container status                                         │  │
│  │  • Verify frontend accessibility (http://localhost:5173)          │  │
│  │  • Verify backend accessibility (http://localhost:3000)           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────┴──────────┐
                    │                    │
            ┌───────▼────────┐  ┌────────▼────────┐
            │    SUCCESS     │  │     FAILURE     │
            │                │  │                 │
            │ • Show status  │  │ • Show logs     │
            │ • List         │  │ • Stop          │
            │   containers   │  │   containers    │
            └────────────────┘  └─────────────────┘
                    │
                    ▼
            ┌────────────────┐
            │  Application   │
            │    Running     │
            │                │
            │  Frontend:     │
            │  :5173         │
            │                │
            │  Backend:      │
            │  :3000         │
            │                │
            │  MongoDB:      │
            │  :27019        │
            └────────────────┘
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           WSL (Ubuntu)                               │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     JENKINS SERVER                           │   │
│  │                   (Port: 8080)                               │   │
│  │                                                              │   │
│  │  • Monitors Git repository                                   │   │
│  │  • Triggers pipeline on changes                              │   │
│  │  • Executes Jenkinsfile stages                               │   │
│  │  • Manages Docker operations                                 │   │
│  └────────────────┬────────────────────────────────────────────┘   │
│                   │                                                  │
│                   │ Controls                                         │
│                   ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    DOCKER ENGINE                             │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │   │
│  │  │  Container   │  │  Container   │  │  Container   │     │   │
│  │  │              │  │              │  │              │     │   │
│  │  │  Frontend    │  │  Backend     │  │  MongoDB     │     │   │
│  │  │  (Nginx)     │  │  (Express)   │  │              │     │   │
│  │  │              │  │              │  │              │     │   │
│  │  │  React       │  │  Node.js     │  │  Database    │     │   │
│  │  │  Vite        │  │  API         │  │  Data        │     │   │
│  │  │              │  │              │  │              │     │   │
│  │  │  Port: 5173  │◄─┤  Port: 3000  │◄─┤  Port:27019  │     │   │
│  │  └──────────────┘  └──────────────┘  └──────┬───────┘     │   │
│  │                                              │              │   │
│  │                                              ▼              │   │
│  │                                      ┌──────────────┐       │   │
│  │                                      │    Volume    │       │   │
│  │                                      │  mongo_data  │       │   │
│  │                                      └──────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
                            │ Network Bridge
                            │
                ┌───────────▼────────────┐
                │   Windows Host         │
                │   Browser Access:      │
                │                        │
                │  localhost:8080  ───►  │ Jenkins UI
                │  localhost:5173  ───►  │ BioLume App
                │  localhost:3000  ───►  │ API
                └────────────────────────┘
```

## Deployment Workflow

### Developer Workflow:

```
1. Developer commits code changes
   ↓
2. Push to Git repository (or save locally)
   ↓
3. Jenkins detects changes (via polling or webhook)
   ↓
4. Jenkins triggers pipeline automatically
   ↓
5. Pipeline executes all stages
   ↓
6. Application deployed and accessible
```

### Pipeline Stages Detail:

**Stage 1: Checkout**

- Duration: ~5-10 seconds
- Pulls latest code from repository

**Stage 2: Environment Check**

- Duration: ~3-5 seconds
- Verifies all dependencies are available

**Stage 3: Stop Existing Containers**

- Duration: ~5-10 seconds
- Gracefully stops running containers

**Stage 4: Clean Old Images**

- Duration: ~10-20 seconds
- Removes unused Docker images

**Stage 5: Build Images**

- Duration: ~2-5 minutes (first time), ~30-60 seconds (cached)
- Builds all three Docker images

**Stage 6: Run Tests**

- Duration: ~10-30 seconds
- Runs all configured tests

**Stage 7: Deploy**

- Duration: ~20-40 seconds
- Starts all containers in correct order

**Stage 8: Health Check**

- Duration: ~10-20 seconds
- Verifies all services are responding

**Total Pipeline Time: ~4-7 minutes (first run), ~2-3 minutes (subsequent runs)**

## Technology Stack

```
┌─────────────────────┐
│    CI/CD Layer      │
│                     │
│  • Jenkins          │
│  • Jenkinsfile      │
│  • Shell Scripts    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Container Layer    │
│                     │
│  • Docker           │
│  • Docker Compose   │
│  • WSL              │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Application Layer  │
│                     │
│  • React + Vite     │
│  • Node.js          │
│  • Express          │
│  • MongoDB          │
│  • Nginx            │
└─────────────────────┘
```

## Benefits of This Setup

✓ **Automated Deployment**: Push code → Automatic build and deploy
✓ **Consistency**: Same process every time
✓ **Fast Feedback**: Know immediately if something breaks
✓ **Easy Rollback**: Previous builds are preserved
✓ **WSL Native**: No Docker Desktop needed
✓ **Reproducible**: Same environment for all developers
✓ **Scalable**: Easy to add more stages/tests

## Monitoring & Logs

Access logs through:

- Jenkins UI: http://localhost:8080/job/BioLume-CICD/
- Docker logs: `docker compose logs -f`
- Individual service: `docker compose logs -f [service-name]`
- Jenkins system logs: `sudo journalctl -u jenkins -f`
