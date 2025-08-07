pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '7'))
  }
  environment {
    // IMAGE_NAME = "ndolv2-local"
    // CONTAINER_NAME = "ndol-api"
    // PORT = "5222"
    ENV_PATH = ".env"
    // ENV_SECRET_ID = "ENV_PROD_API_NDOLv2_FILE"
  }

  stages {
    stage('Cấu hình theo nhánh ') {
      steps {
        script {
          def branch = env.BRANCH_NAME ?: 'longt'
          echo "⏳ BRANCH = ${branch}"

          if (branch == 'longt') {
            env.IMAGE_NAME = 'daigiatoc-api-staging'
            env.CONTAINER_NAME = 'daigiatoc-api-staging'
            env.PORT = '5224'
            env.ENV_SECRET_ID = 'ENV_STAGING_DAIGIATOC'
          } else {
            env.IMAGE_NAME = 'daigiatoc-api-prod'
            env.CONTAINER_NAME = 'daigiatoc-api-prod'
            env.PORT = '5225'
            env.ENV_SECRET_ID = 'ENV_PROD_DAIGIATOC'
          }

          env.IMAGE_TAG = "${env.IMAGE_NAME}:${env.BUILD_NUMBER}"

          echo "📦 branch = ${branch}"
          echo "📦 IMAGE_NAME = ${env.IMAGE_NAME}"
          echo "📦 CONTAINER_NAME = ${env.CONTAINER_NAME}"
          echo "📦 PORT = ${env.PORT}"
          echo "📦 ENV_SECRET_ID = ${env.ENV_SECRET_ID}"
          echo "📦 IMAGE_TAG = ${env.IMAGE_TAG}"
        }
      }
    }

    stage('Checkout source') {
      steps {
        checkout scm
        echo "✅ Đã checkout mã nguồn từ Git"
      }
    }

    stage('Tạo .env từ Jenkins Secret') {
      steps {
        withCredentials([file(credentialsId: env.ENV_SECRET_ID, variable: 'ENV_FILE')]) {
          sh '''
            cp "$ENV_FILE" .env
            chmod 644 .env
            echo "✅ Đã copy .env từ Jenkins Secret File"
          '''
        }
      }
    }

    stage('Lấy git commit hash') {
      steps {
        script {
          def commit = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          env.GIT_COMMIT_HASH = commit
          env.IMAGE_TAG = "${env.IMAGE_NAME}:${commit}"
          echo "📌 Commit hash: ${commit}"
        }
      }
    }

    stage('Build Docker Image Local') {
      steps {
        retry(2) {
          echo "⚙️ Đang build Docker image local... no cache"
          sh """
            docker build --no-cache -t ${env.IMAGE_TAG} .
          """
        }
      }
    }

    stage('Stop & Remove Old Container') {
      steps {
        script {
          echo "🛑 Kiểm tra và xoá container cũ nếu có: ${env.CONTAINER_NAME}"
          sh """
            if docker ps -a --format '{{.Names}}' | grep -q '^${env.CONTAINER_NAME}\$'; then
              echo "🔻 Container cũ đang tồn tại. Đang xoá..."
              docker rm -f ${env.CONTAINER_NAME}
              echo "✅ Đã xoá container cũ: ${env.CONTAINER_NAME}"
            else
              echo "ℹ️ Không có container cũ nào cần xoá."
            fi
          """
        }
      }
    }

    stage('Cleanup Old Images for Current Branch') {
      steps {
        script {
          def branch = env.BRANCH_NAME ?: "main"
          def prefix = (branch == "main") ? "daigiatoc-api-prod" : "daigiatoc-api-staging"

          echo "🧹 Dọn dẹp Docker images với prefix '${prefix}' – giữ lại 2 bản mới nhất"

          sh """
            echo "🔍 Đang xử lý ${prefix}..."

            IMAGE_IDS=\$(docker images --format "{{.Repository}} {{.Tag}} {{.ID}} {{.CreatedAt}}" | grep "^${prefix} " | sort -rk4 | awk '{ print \$3 }')

            COUNT=0
            for ID in \$IMAGE_IDS; do
              COUNT=\$((COUNT+1))
              if [ \$COUNT -le 2 ]; then
                echo "✅ Giữ lại: \$ID"
              else
                echo "🗑️  Xoá: \$ID"
                docker rmi -f \$ID || true
              fi
            done
          """
        }
      }
    }

    stage('Run New Container') {
      steps {
        script {
          retry(2) {
            echo "🐳 Đang chạy container mới từ local image..."
            sh """
              docker run -d \
                --name ${env.CONTAINER_NAME} \
                --env-file ${env.ENV_PATH} \
                -p ${env.PORT}:${env.PORT} \
                -v /daigiatoc-api-${env.PORT}/uploads:/app/uploads \
                -v /daigiatoc-api-${env.PORT}/token:/app/token \
                -v /daigiatoc-api-${env.PORT}/image-uploads:/app/src/uploads \
                ${env.IMAGE_TAG}
            """
            echo "✅ Container đã chạy: ${env.CONTAINER_NAME} từ image: ${env.IMAGE_TAG}"
          }
        }
      }
    }
  } // <- Đóng stages ở đây

  post {
    always {
      sh '''
        echo "🧹 Dọn dẹp Docker images – giữ lại 2 bản mới nhất cho từng tag prefix"

        IMAGE_PREFIXES="daigiatoc-api-prod daigiatoc-api-staging"

        for PREFIX in $IMAGE_PREFIXES; do
          echo "🔍 Xử lý $PREFIX..."
          IMAGE_IDS=$(docker images --format "{{.Repository}} {{.Tag}} {{.ID}} {{.CreatedAt}}" | grep "^$PREFIX " | sort -rk4 | awk '{ print $3 }')

          COUNT=0
          for ID in $IMAGE_IDS; do
            COUNT=$((COUNT+1))
            if [ $COUNT -le 2 ]; then
              echo "✅ Giữ lại: $ID"
            else
              echo "🗑️  Xóa: $ID"
              docker rmi -f $ID || true
            fi
          done
        done
      '''
      echo "📦 Pipeline kết thúc"
    }
    failure {
      echo "🚨 Có lỗi xảy ra, kiểm tra log Jenkins"
    }
  }
} // ✅ Đóng pipeline
