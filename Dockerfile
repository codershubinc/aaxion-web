# Stage 1: Build the Next.js application
FROM oven/bun:1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies using bun (much faster than npm)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js application
# This will output static files to the /out directory
RUN bun run build

# Stage 2: Serve the static files
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy the built static files from builder stage
COPY --from=builder /app/out ./out

# Expose port 3000
EXPOSE 3000

# Serve the static files from the out directory
CMD ["serve", "-s", "out", "-l", "3000"]
