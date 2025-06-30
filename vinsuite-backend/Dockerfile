# Dockerfile for VinSuite Backend with JVM memory caps and k6 load testing

FROM openjdk:17-jdk-slim

WORKDIR /app

# Install wget, tar, and download k6 binary
RUN apt-get update && \
    apt-get install -y wget tar && \
    wget https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz && \
    tar -xzf k6-v0.47.0-linux-amd64.tar.gz && \
    mv k6-v0.47.0-linux-amd64/k6 /usr/bin/k6 && \
    chmod +x /usr/bin/k6 && \
    rm -rf k6-v0.47.0-linux-amd64*

# Copy Maven wrapper and Maven project files
COPY vinsuite-backend/mvnw ./
COPY vinsuite-backend/mvnw.cmd ./
COPY vinsuite-backend/.mvn .mvn
COPY vinsuite-backend .

# Grant execute permissions to mvnw
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean install -DskipTests

# Set JVM memory limits to avoid Render OOM kills
ENV JAVA_OPTS="-Xms256m -Xmx768m"

# Expose port used by Spring Boot
EXPOSE 8081

# Run the app with memory limits
CMD ["sh", "-c", "java $JAVA_OPTS -jar target/vinsuite-0.0.1-SNAPSHOT.jar"]
