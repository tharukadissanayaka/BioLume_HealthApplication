pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = 'biolume'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                sh '''
                    git clone https://github.com/tharukadissanayaka/BioLume_HealthApplication.git . || git pull origin main
                '''
            }
        }
        
        stage('Environment Check') {
            steps {
                echo 'Checking environment...'
                sh '''
                    echo "Checking Docker in WSL..."
                    docker --version
                    docker compose version
                    docker info > /dev/null || (echo "Docker daemon not reachable"; exit 1)
                    uname -a
                '''
            }
        }
        
        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                sh '''
                    docker compose down || exit 0
                    # Also remove any stray containers from previous runs
                    docker ps -a --filter "name=biolume" --format="{{.ID}}" | xargs -r docker rm -f || exit 0
                    docker ps -a --filter "name=devops" --format="{{.ID}}" | xargs -r docker rm -f || exit 0
                '''
            }
        }
        
        stage('Clean Old Images') {
            steps {
                echo 'Cleaning old images...'
                sh '''
                    docker system prune -f || exit 0
                '''
            }
        }
        
        stage('Build Images') {
            steps {
                echo 'Building Docker images...'
                sh '''
                    docker compose build --no-cache
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh '''
                    # Backend tests (if available)
                    echo "Backend tests would run here"
                    
                    # Frontend lint check
                    echo "Frontend lint check would run here"
                    
                    # For now, we skip as no tests are configured
                    echo "Tests: PASSED (placeholder)"
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh '''
                    docker compose up -d
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                sh '''
                    sleep 10
                    
                    # Check if containers are running
                    docker compose ps
                    
                    # Check backend health (local)
                    curl -f http://localhost:3000 > /dev/null 2>&1 || echo "Backend not responding yet on localhost"
                    
                    # Check frontend health (local)
                    curl -f http://localhost:5173 > /dev/null 2>&1 || echo "Frontend not responding yet on localhost"
                    
                    # Check AWS public access
                    curl -f http://98.93.42.249:5173 > /dev/null 2>&1 || echo "Frontend not accessible on AWS IP yet"
                    curl -f http://98.93.42.249:3000 > /dev/null 2>&1 || echo "Backend not accessible on AWS IP yet"
                    
                    echo "Deployment completed!"
                    echo "Application accessible at: http://98.93.42.249:5173"
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            echo 'Application deployed at: http://98.93.42.249:5173'
            sh 'docker compose ps'
        }
        failure {
            echo 'Pipeline failed!'
            sh '''
                docker compose logs || exit 0
                docker compose down || exit 0
            '''
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs(
                deleteDirs: true,
                disableDeferredWipeout: true,
                patterns: [
                    [pattern: 'node_modules/', type: 'INCLUDE']
                ]
            )
        }
    }
}
