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
                sh 'npm install --legacy-peer-deps'
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

        stage('Deploy to Tomcat') {
            steps {
                sh '''
                    cd dist
                    zip -r ../mahindra-battery.war .
                '''

                withCredentials([usernamePassword(
                    credentialsId: 'TomcatCreds',
                    usernameVariable: 'TOMCAT_USER',
                    passwordVariable: 'TOMCAT_PASS'
                )]) {
                    sh '''
                        curl -v \
                        -u $TOMCAT_USER:$TOMCAT_PASS \
                        -T mahindra-battery.war \
                        "http://192.168.11.76:8088/manager/text/deploy?path=/mahindra-battery&update=true"
                    '''
                }
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