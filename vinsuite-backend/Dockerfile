# Dockerfile for Vinsuite Backend with k6 support

# Use official lightweight OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Install wget + tar and download k6
RUN apt-get update && \
    apt-get install -y wget tar && \
    wget https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz && \
    tar -xzf k6-v0.47.0-linux-amd64.tar.gz && \
    mv k6-v0.47.0-linux-amd64/k6 /usr/bin/k6 && \
    chmod +x /usr/bin/k6 && \
    rm -rf k6-v0.47.0-linux-amd64*

# Copy Maven wrapper and Maven related files first
COPY vinsuite-backend/mvnw .
COPY vinsuite-backend/mvnw.cmd .
COPY vinsuite-backend/.mvn .mvn

# Copy the full project files
COPY vinsuite-backend .

# Give execute permissions to mvnw
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean install -DskipTests

# Expose port used by Spring Boot
EXPOSE 8081

# Run the built JAR
CMD ["java", "-jar", "target/vinsuite-0.0.1-SNAPSHOT.jar"]
