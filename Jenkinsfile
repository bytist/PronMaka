#!/usr/bin/env groovy

def podLabel = UUID.randomUUID().toString()
def timeStamp = Calendar.getInstance().getTime().format('YYMMdd-HHmmss',TimeZone.getTimeZone('CST6CDT'))
def tagVersion = "${timeStamp}-spa-${env.BRANCH_NAME}-${BUILD_NUMBER}"
def dockerTag = "${timeStamp}-spa-${BUILD_NUMBER}"
def ccv2Repo = 'git@bitbucket.org:sap-ecommerce/maka-sap-ccv2-source.git'
def buildFolder = 'js-storefront'
def burstableNodePoolTaintKey = 'burstnode'
def burstableNodePoolSelector = 'agentpool=usernp02'
def pullrequest = params.pullrequest ?: false
def acr = "keffkeff.azurecr.io"
def sapCommerceSmokeURL = "https:\\/\\/backoffice-smoke.y.keffkeff.com\\/"

podTemplate(
  imagePullSecrets: ['regcred'],
  label: podLabel,
  nodeSelector: "${burstableNodePoolSelector}",
  yaml: """
      spec:
        tolerations:
        - key: "${burstableNodePoolTaintKey}"
          operator: "Exists"
          effect: "NoSchedule"
  """,
  envVars: [
    secretEnvVar(
        key: 'ACR_USER',
        secretName: 'acr-credentials',
        secretKey: 'username'
    ),
    secretEnvVar(
        key: 'ACR_PASSWORD',
        secretName: 'acr-credentials',
        secretKey: 'password'
    )
  ],
  containers: [
    containerTemplate(
        name: 'jnlp',
        image: 'keffkeff.azurecr.io/jenkins-slave/build-tools:0.0.1',
        alwaysPullImage: true,
        ttyEnabled: true,
        privileged: false,
        workingDir: '/home/jenkins',
        args: '${computer.jnlpmac} ${computer.name}'
    )
  ],
  volumes: [
    hostPathVolume(mountPath: '/usr/bin/docker', hostPath: '/usr/bin/docker'),
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
  ]
)

{
    node(podLabel) {
        try {
            stage('Checkout') {
              echo sh(script: 'env|sort', returnStdout: true)
              def scmVars = checkout scm
              if (isDeployableBranch() && !pullrequest)
              {
                sh """
                      git config --global user.email 'jenkins@y.keffkeff.com'
                      git config --global user.name 'Jenkins'
                      git tag -a ${tagVersion} -m ${tagVersion}
                   """
              }
            }

            stage('App build') {
              sh '''
                    yarn install
                    yarn run build:ssr
                    yarn run copyserver
                 '''
            }

            stage('App test') {
              sh 'yarn test:coverage'
            }

            stage('SonarQube') {
              if (isDeployableBranch())
              {
                def scannerHome = tool 'SonarScanner 4.0'
                withSonarQubeEnv('sonarSF') {
                  sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=spartacus -Dsonar.sourceEncoding=UTF-8 -Dsonar.sources=. -Dsonar.scm.provider=git"
                }
              }
              else
              {
                echo 'Pull request: skip SonarQube'
              }
            }

            stage('CCV2 Source') {
              if (isDeployableBranch() && !pullrequest)
              {
                sshagent(credentials: ['bitbucket']) {
                  sh 'git push --tags'
                }
                sh """
                    mkdir -p ${buildFolder}/maka-storefront
                    cp -R dist ${buildFolder}/maka-storefront
                   """
              }
              else
              {
                echo "skip creating CCV2 source"
              }
            }

            stage('CCV2 branch') {
              if (isDeployableBranch() && !pullrequest && currentBuild.currentResult == 'SUCCESS')
              {
                sh 'mkdir maka-ccv2-source'
                dir('maka-ccv2-source') {
                  sshagent(credentials: ['bitbucket']) {
                    sh """
                         git clone ${ccv2Repo} .
                         git checkout ccv2-${env.BRANCH_NAME} 2>/dev/null || git checkout -b ccv2-${env.BRANCH_NAME}
                         rm -rf ${buildFolder} || true
                         cp -R ../${buildFolder} .
                         git add -A ${buildFolder}
                         # Disable exit on non 0
                         set +e
                         git commit -m 'Automated push from spartacus CI'
                         if [ \$? -eq 0 ]; then
                              # Enable exit on non 0
                              set -e
                              git push origin ccv2-${env.BRANCH_NAME}
                              git tag -a ${tagVersion} -m ${tagVersion}
                              git push --tags
                         fi
                     """
                  }
                }
              }
              else
              {
                echo "skip preparing CCV2 branch"
              }
            }

            stage('Docker image') {
                if (isDeployableBranch() && !pullrequest && currentBuild.currentResult == 'SUCCESS') {
                    sh """
                        sed -i -e \'s/content=\"OCC_BACKEND_BASE_URL_VALUE\"/content=\"${sapCommerceSmokeURL}\"/g\' ./dist/maka-storefront/index.html
                        docker build -f resources/docker/nginx/Dockerfile . -t ${acr}/spartacus/storefront-web:${dockerTag}
                        docker build -f resources/docker/nodejs/Dockerfile . -t ${acr}/spartacus/storefront-js:${dockerTag}
                        docker login -u $ACR_USER -p $ACR_PASSWORD ${acr}
                        docker push ${acr}/spartacus/storefront-web:${dockerTag}
                        docker push ${acr}/spartacus/storefront-js:${dockerTag}
                    """
                } else {
                    echo 'skip Docker image'
                }
            }

            stage('Continuous Deployment'){
                if (isDeployableBranch() && !pullrequest && currentBuild.currentResult == 'SUCCESS') {
                    build job: "smoke-deploy-all-storefront", wait: false, parameters: [
                        string(name: 'tag', value: dockerTag)
                    ]
                } else {
                    echo 'Skip continuous deployment'
                }
            }
        }
        catch (any) {
            currentBuild.result = 'FAILURE'

            if (pullrequest) {
                def subject = "FE you broke the build!"
                def message = "PR '${env.pullRequestTitle} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
                slackSend (color: '#FF8C00', message: "${subject}: ${message}")
            }
            else {
                def subject = 'Frontend: You broke the build!'
                def message = "Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
                slackSend (color: '#FF0000', message: "${subject}: ${message}")
            }

            throw any //rethrow exception to prevent the build from proceeding
        }
        finally {
            // assume build is successful if currentBuild.result is empty
            if (currentBuild.result == null) {
                currentBuild.result = 'SUCCESS'
            }
        }
    }
}

@NonCPS
def isDeployableBranch()
{
  env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'develop' || env.BRANCH_NAME =~ /release.*/ || env.BRANCH_NAME =~ /hotfix.*/
}
