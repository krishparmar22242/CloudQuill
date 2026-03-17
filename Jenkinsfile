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
        
        stage('Deploy with Ansible') {
            steps {
                echo 'Deploying application using Ansible...'
                // Run the playbook through the existing ansible-controller container
                sh 'docker exec ansible-server ansible-playbook /app/ansible/deploy.yml'
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
