#!/bin/bash

# PickleJar Docker Deployment Script
# Usage: ./scripts/deploy.sh [start|stop|restart|build|logs|clean|backup]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="pickle"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        exit 1
    fi
}

check_ports() {
    local ports=("8080" "8081" "3306" "6379")
    
    for port in "${ports[@]}"; do
        if netstat -tuln | grep ":$port " > /dev/null; then
            print_warning "Port $port is already in use"
        fi
    done
}

start_services() {
    print_status "Starting PickleJar services..."
    docker-compose -f $COMPOSE_FILE up -d
    print_success "Services started successfully"
    
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if curl -f http://localhost:8080/api/v1/actuator/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed, check logs"
    fi
}

stop_services() {
    print_status "Stopping PickleJar services..."
    docker-compose -f $COMPOSE_FILE down
    print_success "Services stopped successfully"
}

restart_services() {
    print_status "Restarting PickleJar services..."
    docker-compose -f $COMPOSE_FILE restart
    print_success "Services restarted successfully"
}

build_services() {
    print_status "Building PickleJar services..."
    docker-compose -f $COMPOSE_FILE build --no-cache
    print_success "Services built successfully"
}

show_logs() {
    print_status "Showing logs for all services..."
    docker-compose -f $COMPOSE_FILE logs -f
}

show_backend_logs() {
    print_status "Showing backend logs..."
    docker-compose -f $COMPOSE_FILE logs -f backend
}

clean_environment() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning environment..."
        docker-compose -f $COMPOSE_FILE down -v --rmi all
        docker system prune -f
        print_success "Environment cleaned successfully"
    else
        print_status "Cleanup cancelled"
    fi
}

backup_database() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="backup_${timestamp}.sql"
    
    print_status "Creating database backup: $backup_file"
    
    if docker-compose -f $COMPOSE_FILE exec -T mysql mysqldump -u root -ptest pickle > "$backup_file"; then
        print_success "Database backup created: $backup_file"
    else
        print_error "Database backup failed"
        exit 1
    fi
}

restore_database() {
    if [ -z "$1" ]; then
        print_error "Please provide backup file path"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will overwrite the current database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Restoring database from: $backup_file"
        
        if docker-compose -f $COMPOSE_FILE exec -T mysql mysql -u root -ptest pickle < "$backup_file"; then
            print_success "Database restored successfully"
        else
            print_error "Database restore failed"
            exit 1
        fi
    else
        print_status "Database restore cancelled"
    fi
}

show_status() {
    print_status "Service Status:"
    docker-compose -f $COMPOSE_FILE ps
    
    echo ""
    print_status "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
    
    echo ""
    print_status "Health Checks:"
    if curl -f http://localhost:8080/api/v1/actuator/health > /dev/null 2>&1; then
        print_success "Backend: UP"
    else
        print_error "Backend: DOWN"
    fi
}

show_help() {
    echo "PickleJar Docker Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  build       Build all services (no cache)"
    echo "  logs        Show logs for all services"
    echo "  backend     Show backend logs only"
    echo "  status      Show service status and resource usage"
    echo "  clean       Remove all containers, volumes, and images"
    echo "  backup      Create database backup"
    echo "  restore     Restore database from backup file"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 backup"
    echo "  $0 restore backup_20231201_143022.sql"
    echo "  $0 logs"
}

# Main script
main() {
    # Check prerequisites
    check_docker
    
    case "${1:-help}" in
        start)
            check_ports
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        build)
            build_services
            ;;
        logs)
            show_logs
            ;;
        backend)
            show_backend_logs
            ;;
        status)
            show_status
            ;;
        clean)
            clean_environment
            ;;
        backup)
            backup_database
            ;;
        restore)
            restore_database "$2"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 