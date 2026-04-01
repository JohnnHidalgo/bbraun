# Dockerfile for Backend
FROM node:18-alpine

# Install OpenSSL 1.1 compatibility for Prisma
RUN apk add --no-cache openssl1.1-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client with correct binary targets
RUN npx prisma generate --binary-targets=linux-musl-openssl-1.1.x

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]