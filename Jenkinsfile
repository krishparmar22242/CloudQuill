pipeline {
    agent {
        // Run everything inside a Node.js container within Jenkins automatically
        docker { 
            image 'node:18-alpine' 
            args '-u root:root'
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                // In a real scenario, this connects to your Git repo.
                // For this local experiment, Jenkins will use the local workspace path if setup correctly,
                // or we use a basic checkout mechanism.
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo 'Installing Backend Dependencies...'
                    sh 'npm install'
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('backend') {
                    echo 'Running Backend Unit Tests...'
                    sh 'npm test'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo 'Installing Frontend Dependencies & Building...'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Dockerize & Deploy Preparation') {
            steps {
                echo 'Preparing for Ansible Deployment...'
                // The actual docker build and deploy will be handled by Ansible in Phase 4
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline Execution Completed.'
        }
        success {
            echo 'Build and Test succeeded! Ready for Deployment.'
        }
        failure {
            echo 'Build or Test failed. Deployment stopped.'
        }
    }
}
