pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {
        stage('Checkout Code') {
            steps {
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
                echo 'Packaging and deploying to Tomcat...'

                sh '''
                    cd dist/ats_mahindra_battery_cc_ui
                    jar -cvf ../../mahindra-battery.war .
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
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Please check the logs.'
        }
    }
}