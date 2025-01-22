# EasyShop Frontend
[![GitHub Profile](https://img.shields.io/badge/GitHub-iemafzalhassan-blue?logo=github&style=flat)](https://github.com/iemafzalhassan)
![Docker Image](https://img.shields.io/github/forks/iemafzalhassan/Four-tier_EasyShop)
[![Stars](https://img.shields.io/github/stars/iemafzalhassan/Four-tier_EasyShop)](https://github.com/iemafzalhassan/Four-tier_EasyShop)
![GitHub last commit](https://img.shields.io/github/last-commit/iemafzalhassan/Four-tier_EasyShop?color=red)
<p align="center">
  <img src="frontend/public/assets/logo.svg" alt="EasyShop Logo" width="200"/>
</p>

A modern e-commerce platform built with Next.js 14, featuring server-side rendering, real-time updates, and a seamless shopping experience.

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Environment Setup](#environment-setup)
  - [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
  - [Building Images](#building-images)
  - [Setting up Network](#setting-up-network)
  - [Database Setup and Migration](#database-setup-and-migration)
  - [Running Containers](#running-containers)
- [Architecture](#architecture)
- [Database Management](#database-management)
  - [Backup Procedures](#backup-procedures)
  - [Restore Procedures](#restore-procedures)
  - [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Contributing](#contributing)
- [License](#license)

## Overview

EasyShop is a modern e-commerce platform built with Next.js 14 and Express.js, featuring:
- Server-side rendering for optimal performance
- Real-time cart updates with Redis
- MongoDB for scalable data storage
- Docker containerization for easy deployment
- Admin dashboard for product and user management

## Technologies Used

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Redis for caching
- JWT Authentication
- Multer for file uploads

## Prerequisites

- Node.js (v20 or later)
- npm (v10 or later)
- Docker and Docker Compose

## Getting Started

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/iemafzalhassan/easyshop.git
cd easyshop
```

2. Set up environment variables:

Create a `.env` file in the root directory:
```env
# Project Settings
COMPOSE_PROJECT_NAME=easyshop

# Frontend Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Backend Settings
PORT=4000
JWT_SECRET=eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTczNzAwMzQ1MCwiaWF0IjoxNzM3MDAzNDUwfQ.zQZPWfJHpoW4lwQZBtUIiPmqhYt_1L-Y5f7TwfP7mjE
FRONTEND_URL=http://localhost:3000

# MongoDB Settings
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=easyshop_admin_123
MONGO_INITDB_DATABASE=easyshop

# MongoDB Express (Development UI)
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=easyshop_express_123

# Redis Settings
REDIS_PASSWORD=easyshop_redis_123

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=easyshop
CLOUDINARY_API_KEY=Replace_with_your_API_key
CLOUDINARY_API_SECRET=Replace_with_your_API_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=iemafzalhassan
EMAIL_PASSWORD=jhgiun9798sdfsdjbnwbr37
EMAIL_FROM_NAME=iemafzalhassan
EMAIL_FROM_ADDRESS=iemafzalhassan@gmail.com
```

### Local Development

1. Install frontend dependencies:
```bash
cd frontend
npm install
npm run build
npm start
```

2. Install backend dependencies:
```bash
cd backend
npm install
npm start
```

The development servers will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Docker Deployment

### Building Images

1. Build frontend image:
```bash
cd frontend
docker build -t easyshop-frontend .
```

2. Build backend image:
```bash
cd backend
docker build -t easyshop-backend .
```

### Setting up Network

Create a Docker network for the application:
```bash
docker network create easyshop-network
```

### Database Setup and Migration

1. Start MongoDB:
```bash

# Start MongoDB

docker run -d \
  --name easyshop-mongodb \
  --network easyshop-network \
  -p 27017:27017 \
  -v $(pwd)/mongo-init:/docker-entrypoint-initdb.d \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=easyshop_admin_123 \
  -e MONGO_INITDB_DATABASE=easyshop \
  mongo:latest
```
2. Start Redis:
```bash

# Start Redis

docker run -d \
  --name easyshop-redis \
  --network easyshop-network \
  -p 6379:6379 \
  redis:latest redis-server --requirepass easyshop_redis_123
```

# Check database

```mongodb
use easyshop
show collections
db.products.find().limit(1)
```

### Running Application Containers

2. Start Backend:
```bash

docker run -d \
  --name easyshop-backend \
  --network easyshop-network \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e PORT=4000 \
  -e MONGODB_URI="mongodb://admin:easyshop_admin_123@easyshop-mongodb:27017/easyshop?authSource=admin" \
  -e JWT_SECRET=eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTczNzAwMzQ1MCwiaWF0IjoxNzM3MDAzNDUwfQ.zQZPWfJHpoW4lwQZBtUIiPmqhYt_1L-Y5f7TwfP7mjE \
  -e FRONTEND_URL=http://localhost:3000 \
  -e REDIS_URL="redis://:easyshop_redis_123@easyshop-redis:6379" \
  -e STRIPE_SECRET_KEY=your_stripe_secret_key \
  -e CLOUDINARY_CLOUD_NAME=your_cloud_name \
  -e CLOUDINARY_API_KEY=your_cloud_api_key \
  -e CLOUDINARY_API_SECRET=your_cloud_api_secret \
  easyshop-backend
```

3. Start Frontend:
```bash

docker run -d \
  --name easyshop-frontend \
  --network easyshop-network \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 \
  -e REDIS_URL="redis://:easyshop_redis_123@easyshop-redis:6379" \
  easyshop-frontend
```

4. Docker-compose deployment:
```bash

# Start services

docker-compose up -d

# Follow logs

docker-compose logs -f

# Check container status

docker-compose ps

# Check health endpoints
curl http://localhost:4000/api/v1/health
curl http://localhost:3000/api/health
```

4. Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Architecture

The application follows a multi-tier architecture:

<div align="center">

![alt text](frontend/public/image.png)

</div>

1. **Frontend (Presentation Layer)**
   - Next.js for server-side rendering and static generation
   - TypeScript for type safety
   - Tailwind CSS for styling
   - Shadcn UI for component library

2. **Backend (Application Layer)**
   - Express.js for REST API
   - JWT for authentication
   - Input validation middleware
   - Error handling middleware
   - RESTful endpoints for data operations

3. **Caching Layer**
   - Redis for high-performance caching
   - Session management
   - Real-time cart synchronization
   - Rate limiting and request throttling
   - Temporary data storage

4. **Database (Persistence Layer)**
   - MongoDB for permanent data storage
   - Mongoose for object modeling
   - Indexes for query optimization
   - Data replication and sharding support

## Database Management

### Backup Procedures

1. Automated Daily Backups:
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backup/directory"

# Create backup
docker exec easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongodump --out=/data/backup_${TIMESTAMP}

# Copy backup from container
docker cp easyshop-mongodb:/data/backup_${TIMESTAMP} ${BACKUP_DIR}

# Clean up old backups (keep last 7 days)
find ${BACKUP_DIR} -type d -mtime +7 -exec rm -rf {} +
EOF

# Make script executable
chmod +x backup.sh

# Add to crontab (runs daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup.sh") | crontab -
```

2. Manual Backup:
```bash
# Backup specific collections
docker exec easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongodump --db easyshop --collection products --out=/data/backup

# Backup with compression
docker exec easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongodump --archive=/data/backup.gz --gzip

# Backup to AWS S3 (requires aws cli)
docker exec easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongodump --archive | aws s3 cp - s3://your-bucket/backup_$(date +%Y%m%d).gz
```

### Restore Procedures

1. Full Database Restore:
```bash
# Stop running containers
docker-compose down

# Start only MongoDB
docker-compose up -d mongodb

# Restore from backup
docker exec easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongorestore /data/backup

# Restart all services
docker-compose up -d
```

2. Selective Restore:
```bash
# Restore specific collection
docker exec easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongorestore --db easyshop --collection products /data/backup/easyshop/products.bson

# Restore from compressed backup
docker exec easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongorestore --archive=/data/backup.gz --gzip

# Restore from AWS S3
aws s3 cp s3://your-bucket/backup_20250122.gz - | docker exec -i easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongorestore --archive --gzip
```

### Monitoring and Maintenance

1. Check Database Status:
```bash
# Connect to MongoDB shell
docker exec -it easyshop-mongodb -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin mongosh

# Check database stats
use easyshop
db.stats()

# Check collection stats
db.products.stats()
```

2. Index Maintenance:
```bash
# List indexes
db.products.getIndexes()

# Create indexes
db.products.createIndex({ "title": "text", "description": "text" })

# Remove unused indexes
db.products.dropIndex("index_name")
```

3. Data Cleanup:
```bash
# Remove old sessions
db.sessions.deleteMany({ "lastAccessed": { $lt: new Date(Date.now() - 30*24*60*60*1000) } })

# Remove soft-deleted items
db.products.deleteMany({ "deleted": true, "deletedAt": { $lt: new Date(Date.now() - 90*24*60*60*1000) } })
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-name`
7. Submit a pull request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Crafted with <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png" alt="Beating Heart" width="20" height="20" style="vertical-align: middle;"/> for the developer community</sub>
  <br/>
  <sup><a href="https://github.com/iemafzalhassan" style="text-decoration: none; color: #666;">Md. Afzal Hassan Ehsani</a></sup>
</div>
