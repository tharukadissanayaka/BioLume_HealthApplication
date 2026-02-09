#!/bin/bash

# Status Check Script for BioLume Jenkins CI/CD

echo "========================================="
echo "BioLume CI/CD Status Check"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Docker
echo "1. Docker Status:"
if command -v docker &> /dev/null; then
    echo -e "   ${GREEN}✓${NC} Docker installed: $(docker --version)"
    if sudo service docker status &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} Docker service is running"
    else
        echo -e "   ${RED}✗${NC} Docker service is not running"
        echo "   Run: sudo service docker start"
    fi
else
    echo -e "   ${RED}✗${NC} Docker is not installed"
fi
echo ""

# Check Docker Compose
echo "2. Docker Compose Status:"
if command -v docker &> /dev/null; then
    if docker compose version &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} Docker Compose installed: $(docker compose version)"
    else
        echo -e "   ${RED}✗${NC} Docker Compose is not available"
    fi
else
    echo -e "   ${RED}✗${NC} Docker Compose is not available"
fi
echo ""

# Check Jenkins
echo "3. Jenkins Status:"
if command -v jenkins &> /dev/null; then
    echo -e "   ${GREEN}✓${NC} Jenkins installed"
    if sudo service jenkins status &> /dev/null; then
        echo -e "   ${GREEN}✓${NC} Jenkins service is running"
        echo "   URL: http://localhost:8080"
    else
        echo -e "   ${RED}✗${NC} Jenkins service is not running"
        echo "   Run: sudo service jenkins start"
    fi
else
    echo -e "   ${RED}✗${NC} Jenkins is not installed"
fi
echo ""

# Check Java
echo "4. Java Status:"
if command -v java &> /dev/null; then
    echo -e "   ${GREEN}✓${NC} Java installed: $(java -version 2>&1 | head -n 1)"
else
    echo -e "   ${RED}✗${NC} Java is not installed"
fi
echo ""

# Check Application Containers
echo "5. Application Containers:"
if docker compose ps 2>/dev/null | grep -q "Up"; then
    echo -e "   ${GREEN}✓${NC} Application containers are running:"
    docker compose ps
else
    echo -e "   ${YELLOW}!${NC} No running containers found"
    echo "   Run: docker compose up -d"
fi
echo ""

# Check Application URLs
echo "6. Application Accessibility:"

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200\|404\|301\|302"; then
    echo -e "   ${GREEN}✓${NC} Frontend is accessible at http://localhost:5173"
else
    echo -e "   ${YELLOW}!${NC} Frontend not accessible at http://localhost:5173"
fi

# Check backend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404\|301\|302"; then
    echo -e "   ${GREEN}✓${NC} Backend is accessible at http://localhost:3000"
else
    echo -e "   ${YELLOW}!${NC} Backend not accessible at http://localhost:3000"
fi
echo ""

# Check Jenkins password file
echo "7. Jenkins Initial Password:"
if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
    echo -e "   ${GREEN}✓${NC} Password file exists"
    echo "   Password: $(sudo cat /var/lib/jenkins/secrets/initialAdminPassword 2>/dev/null)"
else
    echo -e "   ${YELLOW}!${NC} Password file not found (Jenkins may need to initialize or already configured)"
fi
echo ""

# Docker permissions
echo "8. Docker Permissions:"
if groups | grep -q docker; then
    echo -e "   ${GREEN}✓${NC} Current user is in docker group"
else
    echo -e "   ${YELLOW}!${NC} Current user is not in docker group"
    echo "   Run: sudo usermod -aG docker $USER"
fi

if id jenkins 2>/dev/null | grep -q docker; then
    echo -e "   ${GREEN}✓${NC} Jenkins user is in docker group"
else
    echo -e "   ${YELLOW}!${NC} Jenkins user is not in docker group"
    echo "   Run: sudo usermod -aG docker jenkins"
fi
echo ""

echo "========================================="
echo "Status Check Complete"
echo "========================================="
echo ""
echo "Quick Commands:"
echo "  - Start all services:  docker compose up -d"
echo "  - Stop all services:   docker compose down"
echo "  - View logs:           docker compose logs -f"
echo "  - Start Jenkins:       sudo service jenkins start"
echo "  - Start Docker:        sudo service docker start"
echo "  - Check this status:   ./check-status.sh"
echo ""
