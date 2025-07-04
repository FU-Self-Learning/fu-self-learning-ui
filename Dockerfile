# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy entire project
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Verify that SVG files are copied (for debugging)
RUN ls -la public/svgs/ || echo "SVG directory not found"
RUN ls -la public/SvgsComponents/ || echo "SvgsComponents directory not found"

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
