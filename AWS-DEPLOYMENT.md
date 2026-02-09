# AWS Deployment Configuration

## Your Application URLs

- **Frontend**: http://98.93.42.249:5173
- **Backend API**: http://98.93.42.249:3000
- **MongoDB**: Accessible internally on port 27019

## Jenkins Pipeline

Your Jenkinsfile has been configured to:

1. Deploy containers on your AWS EC2 instance
2. Health check both localhost and public AWS IP
3. Display the public URL after successful deployment

## After Each Build

When Jenkins completes successfully, access your application at:

```
http://98.93.42.249:5173
```

## Port Configuration

Make sure your AWS Security Group allows:

- Port **5173** (Frontend - React/Vite)
- Port **3000** (Backend - Node.js API)
- Port **8080** (Jenkins UI)
- Port **27019** (MongoDB - if external access needed)

## Checking Deployment

### From Jenkins Console:

The pipeline will automatically check:

- ✓ Local health: http://localhost:5173, http://localhost:3000
- ✓ Public health: http://98.93.42.249:5173, http://98.93.42.249:3000

### From WSL Terminal:

```bash
# Check containers
docker compose ps

# Check local access
curl http://localhost:5173
curl http://localhost:3000

# Check public access (from another machine or browser)
curl http://98.93.42.249:5173
curl http://98.93.42.249:3000
```

### From Browser:

Simply open: **http://98.93.42.249:5173**

## Troubleshooting

### Can't access from public IP:

1. **Check AWS Security Group:**
   - Go to EC2 → Security Groups
   - Ensure inbound rules allow:
     - Type: Custom TCP
     - Port: 5173, 3000
     - Source: 0.0.0.0/0 (or your IP)

2. **Check if containers are running:**

   ```bash
   docker compose ps
   ```

3. **Check Docker port binding:**

   ```bash
   docker compose ps
   # Should show: 0.0.0.0:5173->5173/tcp
   ```

4. **Check AWS instance firewall:**
   ```bash
   sudo ufw status
   # If active, allow ports:
   sudo ufw allow 5173
   sudo ufw allow 3000
   sudo ufw allow 8080
   ```

### Application works locally but not on public IP:

- Verify the container is bound to 0.0.0.0, not 127.0.0.1
- Check your compose.yml ports are: `"5173:5173"` not `"127.0.0.1:5173:5173"`

## Quick Commands

```bash
# Status check
docker compose ps

# View logs
docker compose logs -f

# Restart application
docker compose restart

# Stop application
docker compose down

# Start application
docker compose up -d

# Check what's listening on ports
sudo netstat -tlnp | grep 5173
sudo netstat -tlnp | grep 3000
```

## Jenkins Build

After creating your pipeline job in Jenkins:

1. Click **"Build Now"**
2. Watch the console output
3. On success, you'll see: `Application deployed at: http://98.93.42.249:5173`
4. Open that URL in your browser

## Integration with Frontend

If your frontend needs to call the backend API, make sure to configure the API URL in your frontend code:

```javascript
// In your frontend config or .env
const API_URL = "http://98.93.42.249:3000";
```

Or use relative paths if frontend and backend are on the same domain.

## Monitoring

- **Jenkins**: http://98.93.42.249:8080 (or localhost:8080 if SSH tunneled)
- **Application**: http://98.93.42.249:5173
- **API**: http://98.93.42.249:3000

## Notes

- The pipeline checks both local (localhost) and public (98.93.42.249) accessibility
- If public IP doesn't respond immediately, it may be security group configuration
- Docker containers bind to 0.0.0.0 by default, making them accessible on all interfaces
- Your AWS instance should have ports open in both AWS Security Group AND instance firewall (if any)
