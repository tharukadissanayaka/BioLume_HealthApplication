#!/bin/bash

# Quick Manual Setup Commands for Jenkins on WSL

echo "=== Step 1: Start Docker ==="
sudo service docker start

echo ""
echo "=== Step 2: Verify Docker is running ==="
docker --version
docker compose version

echo ""
echo "=== Step 3: Check if Jenkins is installed ==="
if ! command -v jenkins &> /dev/null; then
    echo "Installing Jenkins..."
    
    # Add Jenkins repository
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
      /usr/share/keyrings/jenkins-keyring.asc > /dev/null
    
    echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
      https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
      /etc/apt/sources.list.d/jenkins.list > /dev/null
    
    sudo apt update
    sudo apt install -y jenkins
fi

echo ""
echo "=== Step 4: Add users to docker group ==="
sudo usermod -aG docker $USER
sudo usermod -aG docker jenkins

echo ""
echo "=== Step 5: Fix Docker socket permissions ==="
sudo chmod 666 /var/run/docker.sock

echo ""
echo "=== Step 6: Start Jenkins ==="
sudo service jenkins start

echo ""
echo "=== Step 7: Wait for Jenkins to initialize ==="
sleep 10

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Jenkins URL: http://localhost:8080"
echo ""
echo "Get initial admin password with:"
echo "sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
echo ""
echo "If password file doesn't exist, wait a minute and try again."
echo ""

# Try to display password
if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
    echo "Your initial admin password is:"
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    echo ""
fi

echo "Next: Open http://localhost:8080 in your browser"
