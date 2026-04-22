pipeline {
    agent any

    environment {
        AWS_REGION      = 'us-east-1'
        ECR_REGISTRY    = credentials('ecr-url')           // e.g. 123456789.dkr.ecr.us-east-1.amazonaws.com
        IMAGE_TAG       = "${env.GIT_COMMIT[0..7]}"        // short SHA — enables rollback
        BACKEND_IMAGE   = "${ECR_REGISTRY}/car-vault/backend"
        FRONTEND_IMAGE  = "${ECR_REGISTRY}/car-vault/frontend"
        BACKEND_API_URL = credentials('backend-api-url')   // http://EC2_IP:3001 or K8s ALB
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    sh 'npm test'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm test -- --watchAll=false --passWithNoTests'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend

                    docker build \\
                      --build-arg VITE_API_URL=${BACKEND_API_URL} \\
                      -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend
                """
            }
        }

        stage('Push to ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \\
                          docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}

                        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                        docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }

        // ── Phase 4 deploy target: EC2 via SSM ─────────────────────────────
        stage('Deploy to EC2') {
            when {
                allOf {
                    branch 'main'
                    not { expression { params.DEPLOY_TO_K8S == true } }
                }
            }
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                        aws ssm send-command \\
                          --document-name "AWS-RunShellScript" \\
                          --targets "Key=tag:Name,Values=car-vault-backend" \\
                          --parameters 'commands=[
                            "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}",
                            "docker pull ${BACKEND_IMAGE}:latest",
                            "docker stop car-vault-backend || true",
                            "docker rm car-vault-backend || true",
                            "docker run -d --name car-vault-backend --restart unless-stopped -p 3001:3001 -e PORT=3001 ${BACKEND_IMAGE}:latest"
                          ]' \\
                          --region ${AWS_REGION}
                    """
                }
            }
        }

        // ── Phase 5 deploy target: Kubernetes / EKS ────────────────────────
        stage('Deploy to EKS') {
            when {
                allOf {
                    branch 'main'
                    expression { params.DEPLOY_TO_K8S == true }
                }
            }
            steps {
                withAWS(credentials: 'aws-credentials', region: "${AWS_REGION}") {
                    sh """
                        aws eks update-kubeconfig --region ${AWS_REGION} --name car-vault-cluster

                        kubectl set image deployment/car-vault-backend \\
                          backend=${BACKEND_IMAGE}:${IMAGE_TAG} -n car-vault

                        kubectl set image deployment/car-vault-frontend \\
                          frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} -n car-vault

                        kubectl rollout status deployment/car-vault-backend -n car-vault
                        kubectl rollout status deployment/car-vault-frontend -n car-vault
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up dangling images to prevent disk fill
            sh 'docker system prune -f || true'
        }
        success {
            echo "Pipeline complete — CarVault deployed (tag: ${IMAGE_TAG})"
        }
        failure {
            echo "Pipeline failed. Check stage logs above."
        }
    }
}
