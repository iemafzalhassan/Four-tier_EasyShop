# --------***********----------
#     Stage 1: Dependencies
# --------***********----------

FROM node:20-alpine AS deps
LABEL maintainer="EasyShop"
LABEL description="Backend API for EasyShop e-commerce platform"
LABEL version="1.0"
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ curl

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Install production dependencies with clean cache
RUN npm ci --only=production && \
    npm cache clean --force

# --------***********----------
#     Stage 2: Builder
# --------***********----------

FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build environment
ENV NODE_ENV=production

# Create necessary directories
RUN mkdir -p logs uploads

# Build the application (if needed)
RUN npm run build || echo "No build script found"

# --------***********----------
#     Stage 3: Runner
# --------***********----------

FROM node:20-alpine AS runner
LABEL maintainer="EasyShop"
LABEL description="Production runtime for EasyShop backend"
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

ENV NODE_ENV=production

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp --ingroup nodejs

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy necessary files from builder
COPY --from=builder --chown=nodeapp:nodejs /app/src ./src
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./
COPY --from=deps --chown=nodeapp:nodejs /app/node_modules ./node_modules

# Create and set permissions for required directories
RUN mkdir -p logs uploads && \
    chown -R nodeapp:nodejs /app/logs && \
    chown -R nodeapp:nodejs /app/uploads

# Switch to non-root user
USER nodeapp

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/api/v1/health || exit 1

# Expose API port
EXPOSE 4000

# Set default environment variables
ENV PORT=4000
ENV MONGODB_URI=mongodb://mongodb:27017/easyshop

# Start the application
CMD ["node", "src/index.js"]
