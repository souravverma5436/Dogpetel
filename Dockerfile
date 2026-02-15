# Dockerfile for PETEL PHP Backend on Render
FROM php:8.2-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mysqli mbstring exif pcntl bcmath gd \
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

# Create Apache VirtualHost configuration
RUN echo '<VirtualHost *:${PORT}>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html\n\
    \n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Use PORT from environment or default to 10000\n\
PORT=${PORT:-10000}\n\
\n\
# Update Apache ports configuration\n\
echo "Listen $PORT" > /etc/apache2/ports.conf\n\
\n\
# Update VirtualHost to use the PORT\n\
sed -i "s/\${PORT}/$PORT/g" /etc/apache2/sites-available/000-default.conf\n\
\n\
# Start Apache in foreground\n\
apache2-foreground' > /usr/local/bin/start-apache.sh

RUN chmod +x /usr/local/bin/start-apache.sh

# Expose port
EXPOSE 10000

# Start Apache
CMD ["/usr/local/bin/start-apache.sh"]
