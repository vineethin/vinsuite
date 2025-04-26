# Dockerfile for Vinsuite Backend

# Use official lightweight OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and Maven related files first
COPY vinsuite-backend/mvnw .
COPY vinsuite-backend/mvnw.cmd .
COPY vinsuite-backend/.mvn .mvn

# Copy the full project files
COPY vinsuite-backend .

# Give execute permissions to mvnw
RUN chmod +x mvnw

# Build the application (creates JAR file in /target/)
RUN ./mvnw clean install -DskipTests

# Expose port used by Spring Boot
EXPOSE 8081

# Run the built JAR directly (CORRECTED HERE)
CMD ["java", "-jar", "target/vinsuite-0.0.1-SNAPSHOT.jar"]