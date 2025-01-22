# --------***********----------
#     Stage 1: Dependencies
# --------***********----------

# Use Node.js LTS version for better stability
FROM node:20-alpine AS deps
LABEL maintainer="EasyShop"
LABEL description="Frontend application for EasyShop e-commerce platform"
LABEL version="1.0"
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

# Install dependencies required for build
RUN apk add --no-cache python3 make g++ vips-dev fftw-dev build-base \
    autoconf automake libtool nasm

# Copy package files
COPY package*.json ./

# Install dependencies with clean cache and image optimization packages
RUN npm ci --legacy-peer-deps && \
    npm install --save-dev imagemin-gifsicle imagemin-mozjpeg imagemin-optipng imagemin-svgo && \
    npm cache clean --force

# --------***********----------
#     Stage 2: Builder
# --------***********----------

FROM node:20-alpine AS builder
WORKDIR /app

# Install runtime dependencies for image processing
RUN apk add --no-cache vips-dev fftw-dev

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DISABLE_ESLINT_PLUGIN=true

# Build the application with better error handling
RUN npm run build || (echo "Build failed! Check the logs below:" && cat .next/error.log && exit 1)

# --------***********----------
#     Stage 3: Runner
# --------***********----------

FROM node:20-alpine AS runner
LABEL maintainer="EasyShop"
LABEL description="Production runtime for EasyShop frontend"
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

# Install runtime dependencies
RUN apk add --no-cache vips-dev fftw-dev

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]