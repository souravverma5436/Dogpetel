# Dockerfile for PETEL PHP Backend on Render
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql pgsql mysqli mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache modules
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY server/composer.json server/composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-scripts || true

# Copy server files
COPY server/ ./

# Copy database schema files
COPY database/ /var/www/html/database/

# Create health endpoint
RUN echo '<?php header("Content-Type: application/json"); echo json_encode(["status" => "healthy", "timestamp" => time()]);' > /var/www/html/health.php

# Create test endpoint to verify file structure
RUN echo '<?php phpinfo();' > /var/www/html/info.php

# List files for debugging
RUN ls -la /var/www/html/ > /var/www/html/files.txt

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configure Apache
RUN echo 'ServerName localhost' >> /etc/apache2/apache2.conf

# Copy Apache configuration and startup script
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY start-apache.sh /usr/local/bin/start-apache.sh
RUN chmod +x /usr/local/bin/start-apache.sh

# Expose port
EXPOSE 10000

# Start Apache
CMD ["/usr/local/bin/start-apache.sh"]
