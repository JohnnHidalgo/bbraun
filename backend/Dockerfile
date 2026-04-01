# Dockerfile for Backend
FROM node:18-bullseye-slim

# Install OpenSSL 1.1 for Prisma compatibility
RUN apt-get update && apt-get install -y libssl1.1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]