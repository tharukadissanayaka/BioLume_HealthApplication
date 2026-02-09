#!/bin/bash

# Jenkins Setup Script for WSL (Without Docker Desktop)
# Run this script in WSL: bash setup-jenkins.sh

set -e

echo "========================================="
echo "BioLume Jenkins CI/CD Setup Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running in WSL
check_wsl() {
    print_info "Checking if running in WSL..."
    if grep -qi microsoft /proc/version; then
        print_success "Running in WSL"
    else
        print_error "This script is designed for WSL. Please run in WSL environment."
        exit 1
    fi
}

# Install Java
install_java() {
    print_info "Installing Java (OpenJDK 17)..."
    if command -v java &> /dev/null; then
        print_success "Java is already installed: $(java -version 2>&1 | head -n 1)"
    else
        sudo apt update
        sudo apt install -y openjdk-17-jdk
        print_success "Java installed successfully"
    fi
}

# Install Docker
install_docker() {
    print_info "Installing Docker..."
    if command -v docker &> /dev/null; then
        print_success "Docker is already installed: $(docker --version)"
    else
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl gnupg lsb-release
        
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        print_success "Docker installed successfully"
    fi
}

# Start Docker
start_docker() {
    print_info "Starting Docker service..."
    if sudo service docker status &> /dev/null; then
        print_success "Docker is already running"
    else
        sudo service docker start
        sleep 3
        print_success "Docker started successfully"
    fi
}

# Install Jenkins
install_jenkins() {
    print_info "Installing Jenkins..."
    if command -v jenkins &> /dev/null; then
        print_success "Jenkins is already installed"
    else
        curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
          /usr/share/keyrings/jenkins-keyring.asc > /dev/null
        
        echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
          https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
          /etc/apt/sources.list.d/jenkins.list > /dev/null
        
        sudo apt update
        sudo apt install -y jenkins
        
        print_success "Jenkins installed successfully"
    fi
}

# Configure permissions
configure_permissions() {
    print_info "Configuring user permissions..."
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    # Add jenkins user to docker group
    sudo usermod -aG docker jenkins || true
    
    # Fix docker socket permissions
    sudo chmod 666 /var/run/docker.sock || true
    
    print_success "Permissions configured"
}

# Start Jenkins
start_jenkins() {
    print_info "Starting Jenkins service..."
    sudo systemctl start jenkins
    sudo systemctl enable jenkins
    sleep 5
    print_success "Jenkins started successfully"
}

# Display information
display_info() {
    echo ""
    echo "========================================="
    echo "Setup Complete!"
    echo "========================================="
    echo ""
    print_success "Jenkins is running!"
    echo ""
    echo "Next steps:"
    echo "1. Access Jenkins at: http://localhost:8080"
    echo ""
    echo "2. Get initial admin password:"
    echo "   sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
    echo ""
    echo "3. Initial admin password:"
    if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
        sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    else
        echo "   (Password file not found yet, Jenkins may still be initializing)"
    fi
    echo ""
    echo "4. Install suggested plugins in Jenkins"
    echo "5. Create a new Pipeline job pointing to the Jenkinsfile"
    echo ""
    echo "Useful commands:"
    echo "  - Start Jenkins:  sudo service jenkins start"
    echo "  - Stop Jenkins:   sudo service jenkins stop"
    echo "  - Restart Jenkins: sudo service jenkins restart"
    echo "  - Start Docker:   sudo service docker start"
    echo "  - Check status:   sudo service jenkins status"
    echo ""
    echo "Read README-JENKINS.md for detailed instructions"
    echo ""
}

# Main execution
main() {
    check_wsl
    install_java
    install_docker
    start_docker
    install_jenkins
    configure_permissions
    start_jenkins
    display_info
}

# Run main function
main
