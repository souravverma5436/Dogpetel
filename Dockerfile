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

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configure Apache to use PORT environment variable
RUN echo 'ServerName localhost' >> /etc/apache2/apache2.conf

# Create Apache configuration that listens on $PORT
COPY <<EOF /etc/apache2/sites-available/000-default.conf
<VirtualHost *:\${PORT}>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # API routing
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        
        # Route API requests to api directory
        RewriteCond %{REQUEST_URI} ^/api/
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^api/(.*)$ /api/\$1.php [L,QSA]
    </IfModule>
    
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Create startup script that sets PORT
COPY <<'EOF' /usr/local/bin/start-apache.sh
#!/bin/bash
set -e

# Use PORT from environment or default to 10000
export PORT=\${PORT:-10000}

# Update Apache ports configuration
echo "Listen \${PORT}" > /etc/apache2/ports.conf

# Start Apache in foreground
apache2-foreground
EOF

RUN chmod +x /usr/local/bin/start-apache.sh

# Expose port (Render will set this via $PORT)
EXPOSE 10000

# Start Apache
CMD ["/usr/local/bin/start-apache.sh"]
