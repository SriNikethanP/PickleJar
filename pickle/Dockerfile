# Multi-stage build for optimized Docker image
# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first for better layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application with optimizations
RUN ./mvnw clean package -DskipTests \
    -Dmaven.compiler.source=21 \
    -Dmaven.compiler.target=21 \
    -Dmaven.compiler.release=21

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Install necessary packages
RUN apk add --no-cache curl tzdata

# Set timezone
ENV TZ=UTC

# Create app user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory for file uploads
RUN mkdir -p uploads

# Set ownership for appuser
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xmx1024m -Xms512m -XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/app/dumps"

# Database connection retry settings (can be overridden by deployment environment)
ENV SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT=30000
ENV SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE=10
ENV SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE=5
ENV SPRING_DATASOURCE_HIKARI_IDLE_TIMEOUT=300000
ENV SPRING_DATASOURCE_HIKARI_MAX_LIFETIME=1200000

# JPA/Hibernate settings (can be overridden by deployment environment)
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_JPA_SHOW_SQL=false
ENV SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
ENV SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=true

# Note: Database connection details (URL, username, password) should be set in deployment environment
# SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1

# Add labels for better container management
LABEL maintainer="PickleJar Team"
LABEL version="1.0"
LABEL description="PickleJar Spring Boot Application"

# Run the application directly
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 