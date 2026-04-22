# 실행 환경 설정
FROM eclipse-temurin:17-jdk-alpine

# 실행할 디렉토리
WORKDIR /backend

# jar파일 컨테이너로 복사
COPY build/libs/watchover-0.0.1-SNAPSHOT.jar app.jar

# 실행할 포트 번호
EXPOSE 8080

# 애플리케이션 실행 명령어
ENTRYPOINT ["java", "-jar", "app.jar"]