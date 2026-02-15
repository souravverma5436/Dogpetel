#!/bin/bash
# Railway start script for PETEL

# Use PORT environment variable or default to 8080
PORT=${PORT:-8080}

echo "Starting PHP server on port $PORT..."
echo "Working directory: $(pwd)"
echo "Checking build..."
ls -la client/dist/ 2>/dev/null || echo "Warning: client/dist not found"

# Start PHP server with document root at project root, using router
php -S 0.0.0.0:$PORT server/index.php
