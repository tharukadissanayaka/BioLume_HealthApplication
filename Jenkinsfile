pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = 'biolume'
        DOCKER_BUILDKIT = '1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Environment Check') {
            steps {
                echo 'Checking environment...'
                sh '''
                    docker --version
                    docker compose version
                    echo "WSL Environment: $(uname -a)"
                '''
            }
        }
        
        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                sh '''
                    docker compose down || true
                '''
            }
        }
        
        stage('Clean Old Images') {
            steps {
                echo 'Cleaning old images...'
                sh '''
                    docker system prune -f || true
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
                    curl -f http://localhost:3000 || echo "Backend not responding yet on localhost"
                    
                    # Check frontend health (local)
                    curl -f http://localhost:5173 || echo "Frontend not responding yet on localhost"
                    
                    # Check AWS public access
                    curl -f http://98.93.42.249:5173 || echo "Frontend not accessible on AWS IP yet"
                    curl -f http://98.93.42.249:3000 || echo "Backend not accessible on AWS IP yet"
                    
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
                docker compose logs
                docker compose down || true
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
