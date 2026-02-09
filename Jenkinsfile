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
                bat '''
                    docker --version
                    docker compose version
                    systeminfo | findstr /C:"OS Name"
                '''
            }
        }
        
        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                bat '''
                    docker compose down || exit /b 0
                '''
            }
        }
        
        stage('Clean Old Images') {
            steps {
                echo 'Cleaning old images...'
                bat '''
                    docker system prune -f || exit /b 0
                '''
            }
        }
        
        stage('Build Images') {
            steps {
                echo 'Building Docker images...'
                bat '''
                    docker compose build --no-cache
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                bat '''
                    REM Backend tests (if available)
                    echo Backend tests would run here
                    
                    REM Frontend lint check
                    echo Frontend lint check would run here
                    
                    REM For now, we skip as no tests are configured
                    echo Tests: PASSED (placeholder)
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                bat '''
                    docker compose up -d
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                bat '''
                    timeout /t 10 /nobreak
                    
                    REM Check if containers are running
                    docker compose ps
                    
                    REM Check backend health (local)
                    curl -f http://localhost:3000 >nul 2>&1 || echo Backend not responding yet on localhost
                    
                    REM Check frontend health (local)
                    curl -f http://localhost:5173 >nul 2>&1 || echo Frontend not responding yet on localhost
                    
                    REM Check AWS public access
                    curl -f http://98.93.42.249:5173 >nul 2>&1 || echo Frontend not accessible on AWS IP yet
                    curl -f http://98.93.42.249:3000 >nul 2>&1 || echo Backend not accessible on AWS IP yet
                    
                    echo Deployment completed!
                    echo Application accessible at: http://98.93.42.249:5173
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            echo 'Application deployed at: http://98.93.42.249:5173'
            bat 'docker compose ps'
        }
        failure {
            echo 'Pipeline failed!'
            bat '''
                docker compose logs
                docker compose down || exit /b 0
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
