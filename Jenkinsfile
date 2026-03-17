pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                git branch: 'main', url: 'https://github.com/krishparmar22242/CloudQuill.git'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo 'Installing Backend Dependencies...'
                    // We use sh for Linux/Docker agents.
                    // Jenkins will use its installed Node plugin or tools for npm commands.
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
