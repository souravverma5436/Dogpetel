#!/bin/bash
# Railway start script for PETEL

# Use PORT environment variable or default to 8080
PORT=${PORT:-8080}

echo "Starting PHP server on port $PORT..."
php -S 0.0.0.0:$PORT -t server
