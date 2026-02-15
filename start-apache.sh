#!/bin/bash
set -e

# Use PORT from environment or default to 10000
PORT=${PORT:-10000}

# Update Apache ports configuration
echo "Listen $PORT" > /etc/apache2/ports.conf

# Update VirtualHost to use the PORT
sed -i "s/\${PORT}/$PORT/g" /etc/apache2/sites-available/000-default.conf

# Start Apache in foreground
apache2-foreground
