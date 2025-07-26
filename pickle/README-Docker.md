# PickleJar Backend - Docker Deployment Guide

This guide explains how to deploy the PickleJar backend using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- At least 4GB of available RAM
- Ports 8080, 3306, and 6379 available

## Quick Start

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd pickle
   ```

2. **Run the deployment script:**
   ```bash
   ./scripts/deploy.sh
   ```

   Or manually:
   ```bash
   docker-compose up --build -d
   ```

3. **Check the application status:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

## Services

The Docker Compose setup includes:

- **Backend**: Spring Boot application (Port 8080)
- **MySQL**: Database (Port 3306)
- **Redis**: Caching (Port 6379)

## Environment Variables

Key environment variables can be customized in `docker-compose.yml`:

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/pickle
  SPRING_DATASOURCE_USERNAME: pickle_user
  SPRING_DATASOURCE_PASSWORD: pickle_pass
  SPRING_JPA_HIBERNATE_DDL_AUTO: update
```

## Database

- **Database**: `pickle`
- **Username**: `pickle_user`
- **Password**: `pickle_pass`
- **Root Password**: `test`

## API Endpoints

Once deployed, the API will be available at:

- **Base URL**: `http://localhost:8080/api/v1`
- **Health Check**: `http://localhost:8080/api/v1/actuator/health`
- **Products**: `http://localhost:8080/api/v1/products`
- **Categories**: `http://localhost:8080/api/v1/categories`
- **Auth**: `http://localhost:8080/api/v1/auth`

## Default Admin User

- **Email**: `admin@picklejar.com`
- **Password**: `admin123`

## Useful Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build -d

# Clean everything (including volumes)
docker-compose down --volumes --remove-orphans

# Access MySQL
docker exec -it pickle-mysql mysql -u pickle_user -p pickle

# Access Redis
docker exec -it pickle-redis redis-cli
```

## Troubleshooting

### Application won't start
1. Check if MySQL is healthy: `docker-compose ps`
2. View backend logs: `docker-compose logs backend`
3. Ensure ports are not in use: `netstat -an | grep 8080`

### Database connection issues
1. Wait for MySQL to be ready (health check)
2. Verify database credentials in `docker-compose.yml`
3. Check MySQL logs: `docker-compose logs mysql`

### Memory issues
1. Increase Docker memory allocation in Docker Desktop
2. Reduce JVM heap size in `Dockerfile` (JAVA_OPTS)

## Production Deployment

For production, consider:

1. **Security**: Change default passwords
2. **SSL**: Add reverse proxy with SSL termination
3. **Monitoring**: Add Prometheus/Grafana
4. **Backup**: Configure database backups
5. **Scaling**: Use Docker Swarm or Kubernetes

## File Structure

```
pickle/
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Service orchestration
├── .dockerignore             # Docker build exclusions
├── docker/
│   └── mysql/
│       └── init.sql          # Database initialization
├── scripts/
│   └── deploy.sh             # Deployment script
└── src/main/resources/
    └── application-docker.properties  # Docker config
``` 