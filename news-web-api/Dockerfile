# Stage 1: Build ứng dụng
FROM maven:3.9.1-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Stage 2: Tạo image nhẹ để chạy app
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy file jar từ stage build
COPY --from=build /app/target/*.jar app.jar

# Biến môi trường mặc định có thể override từ docker-compose
ENV SERVER_PORT=8080
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_NAME=blogdatabase
ENV DB_USER=root
ENV DB_PASSWORD=123456

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
