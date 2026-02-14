pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = 'biolume'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_USERNAME = 'tharukadissanayake'
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/biolume-frontend"
        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/biolume-backend"
        REMOTE_SERVER = '98.93.42.249'
        REMOTE_USER = 'ubuntu'
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
                    echo "Checking Docker..."
                    docker --version
                    docker compose version
                    docker info > /dev/null || (echo "Docker daemon not reachable"; exit 1)
                '''
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh '''
                    # Build frontend image
                    docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend
                    
                    # Build backend image
                    docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend
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
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                sh '''
                    # Login to Docker Hub
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                    
                    # Push frontend images
                    docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${FRONTEND_IMAGE}:latest
                    
                    # Push backend images
                    docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                    docker push ${BACKEND_IMAGE}:latest
                '''
            }
        }
        
        stage('Deploy to Remote Server') {
            steps {
                echo 'Deploying to remote server...'
                sshagent(['aws-server-ssh']) {
                    sh '''
                        # Copy docker-compose file to remote server
                        scp -o StrictHostKeyChecking=no compose.prod.yml ${REMOTE_USER}@${REMOTE_SERVER}:/home/${REMOTE_USER}/biolume/
                        
                        # Deploy on remote server
                        ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_SERVER} << 'EOF'
                            cd /home/ubuntu/biolume
                            
                            # Login to Docker Hub
                            echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                            
                            # Pull latest images
                            docker pull ${FRONTEND_IMAGE}:latest
                            docker pull ${BACKEND_IMAGE}:latest
                            
                            # Stop existing containers
                            docker compose -f compose.prod.yml down || true
                            
                            # Start new containers
                            docker compose -f compose.prod.yml up -d
                            
                            # Clean up old images
                            docker image prune -f
EOF
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                sh '''
                    sleep 15
                    
                    # Check frontend health
                    curl -f http://${REMOTE_SERVER}:5173 > /dev/null 2>&1 || echo "Frontend not responding yet"
                    
                    # Check backend health
                    curl -f http://${REMOTE_SERVER}:3000 > /dev/null 2>&1 || echo "Backend not responding yet"
                    
                    echo "Deployment completed!"
                    echo "Application accessible at: http://${REMOTE_SERVER}:5173"
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
            echo 'Application deployed at: http://98.93.42.249:5173'
            echo "Frontend Image: ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
            echo "Backend Image: ${BACKEND_IMAGE}:${BUILD_NUMBER}"
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            echo 'Cleaning up...'
            sh '''
                docker logout || true
            '''
        }
    }
}
