# Dockerfile for Vinsuite Backend

# Use official OpenJDK image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Package the application
RUN ./mvnw clean install

# Expose port (same as your Spring Boot app)
EXPOSE 8081

# Run the application
CMD ["./mvnw", "spring-boot:run"]
