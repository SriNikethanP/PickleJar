#!/bin/bash

# PickleJar Backend Deployment Script

set -e

echo "🚀 Starting PickleJar Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it and try again."
    exit 1
fi

# Stop existing containers if running
print_status "Stopping existing containers..."
docker-compose down --remove-orphans

# Remove old images (optional)
if [ "$1" = "--clean" ]; then
    print_status "Cleaning old images..."
    docker-compose down --rmi all --volumes --remove-orphans
fi

# Build and start services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
print_status "Checking service status..."
docker-compose ps

# Check application health
print_status "Checking application health..."
if curl -f http://localhost:8080/api/v1/actuator/health > /dev/null 2>&1; then
    print_status "✅ Application is healthy and running!"
    print_status "🌐 Backend API: http://localhost:8080/api/v1"
    print_status "📊 Health Check: http://localhost:8080/api/v1/actuator/health"
    print_status "🗄️  MySQL Database: localhost:3306"
    print_status "🔴 Redis Cache: localhost:6379"
else
    print_error "❌ Application health check failed!"
    print_status "Checking logs..."
    docker-compose logs backend
    exit 1
fi

print_status "🎉 Deployment completed successfully!" 