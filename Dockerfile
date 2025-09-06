# --- Base Image ---
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy all source files
COPY . .

# Build the Next.js app
RUN yarn build

# Expose port 5000
EXPOSE 3000

# Start the application
CMD ["yarn", "start", "-p", "3000"]
