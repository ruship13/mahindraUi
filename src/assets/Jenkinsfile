pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ruship13/mahindraUi.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Angular') {
            steps {
                sh 'npm run build -- --configuration production'
            }
        }

        stage('Verify Build') {
            steps {
                sh 'find dist -type f | head -20'
            }
        }

        stage('Deploy to Windows Server') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'windows-server',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'dist/**/*',
                                    removePrefix: 'dist',
                                    remoteDirectory: 'angular-deploy'
                                )
                            ]
                        )
                    ]
                )
            }
        }
    }

    post {
        success {
            echo 'Angular Build and Deployment Successful!'
        }

        failure {
            echo 'Build or Deployment Failed!'
        }
    }
}