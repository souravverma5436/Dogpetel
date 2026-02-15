# Use PHP with Apache base image
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Set working directory
WORKDIR /app

# Copy package files
COPY client/package*.json ./client/

# Install frontend dependencies
WORKDIR /app/client
RUN npm install

# Copy all files
WORKDIR /app
COPY . .

# Build frontend
WORKDIR /app/client
RUN npm run build

# Set working directory back to root
WORKDIR /app

# Expose port
EXPOSE 8080

# Start PHP server
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t server"]
