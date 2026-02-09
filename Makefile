.PHONY: help setup status start stop restart logs build clean jenkins-start jenkins-stop jenkins-restart docker-start

# Default target
help:
	@echo "BioLume CI/CD Management Commands"
	@echo "=================================="
	@echo ""
	@echo "Setup Commands:"
	@echo "  make setup          - Initial setup (install Jenkins, Docker, etc.)"
	@echo "  make quick-setup    - Quick setup with minimal prompts"
	@echo ""
	@echo "Application Commands:"
	@echo "  make start          - Start all application containers"
	@echo "  make stop           - Stop all application containers"
	@echo "  make restart        - Restart all application containers"
	@echo "  make logs           - View application logs"
	@echo "  make build          - Build Docker images"
	@echo "  make clean          - Stop containers and remove volumes"
	@echo ""
	@echo "Jenkins Commands:"
	@echo "  make jenkins-start  - Start Jenkins service"
	@echo "  make jenkins-stop   - Stop Jenkins service"
	@echo "  make jenkins-restart- Restart Jenkins service"
	@echo "  make jenkins-password - Show Jenkins initial password"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-start   - Start Docker service"
	@echo ""
	@echo "Status Commands:"
	@echo "  make status         - Check status of all services"
	@echo "  make ps             - Show running containers"
	@echo ""

# Setup commands
setup:
	@chmod +x setup-jenkins.sh
	@./setup-jenkins.sh

quick-setup:
	@chmod +x quick-setup.sh
	@./quick-setup.sh

# Application management
start:
	@echo "Starting application containers..."
	@docker compose up -d
	@echo "Waiting for services to start..."
	@sleep 5
	@docker compose ps
	@echo ""
	@echo "Application started!"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:3000"

stop:
	@echo "Stopping application containers..."
	@docker compose down
	@echo "Containers stopped."

restart:
	@echo "Restarting application containers..."
	@docker compose restart
	@echo "Containers restarted."

logs:
	@docker compose logs -f

build:
	@echo "Building Docker images..."
	@docker compose build --no-cache
	@echo "Build complete."

clean:
	@echo "Stopping containers and removing volumes..."
	@docker compose down -v
	@echo "Cleaning Docker system..."
	@docker system prune -f
	@echo "Cleanup complete."

# Jenkins management
jenkins-start:
	@echo "Starting Jenkins..."
	@sudo service jenkins start
	@echo "Jenkins started. Access at: http://localhost:8080"

jenkins-stop:
	@echo "Stopping Jenkins..."
	@sudo service jenkins stop
	@echo "Jenkins stopped."

jenkins-restart:
	@echo "Restarting Jenkins..."
	@sudo service jenkins restart
	@echo "Jenkins restarted. Access at: http://localhost:8080"

jenkins-password:
	@echo "Jenkins Initial Admin Password:"
	@sudo cat /var/lib/jenkins/secrets/initialAdminPassword || echo "Password file not found. Jenkins may not be initialized yet."

# Docker management
docker-start:
	@echo "Starting Docker service..."
	@sudo service docker start
	@echo "Docker started."

# Status commands
status:
	@chmod +x check-status.sh
	@./check-status.sh

ps:
	@docker compose ps

# Development helpers
dev-frontend:
	@cd frontend && npm run dev

dev-backend:
	@cd backend && npm start

install-deps:
	@echo "Installing backend dependencies..."
	@cd backend && npm install
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "Dependencies installed."
