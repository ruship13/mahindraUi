pipeline {
    agent any

    tools {
        // Must match the name configured in Jenkins Tools
        nodejs 'node20' 
    }

    environment {
    DIST_DIR = 'dist/ats_mahindra_battery_cc_ui'
    // Example for Windows XAMPP. Update this to your path from Step 1!
    DEPLOY_DIR = 'C:/xampp/htdocs' 
}

    stages {
        stage('Checkout Code') {
            steps {
                // Pulls code from the repository configured in the Jenkins job
                checkout scm 
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing node modules...'
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build Application') {
            steps {
                echo 'Building Angular application for Production...'
                // Generates the static production files inside the 'dist/' folder
                sh 'npm run build -- --configuration production' 
            }
        }

        stage('Deploy to Web Server') {
            steps {
                echo 'Deploying static files to the web server...'
                // Cleans old deployment and copies new build artifacts
                sh "sudo rm -rf ${DEPLOY_DIR}/*"
                sh "sudo cp -r ${DIST_DIR}/* ${DEPLOY_DIR}/"
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Please check the logs.'
        }
    }
}
