<?php
// Router for PHP built-in server
// This handles routing for both API and frontend

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// API routes - serve from api directory
if (strpos($uri, '/api/') === 0) {
    $apiFile = __DIR__ . $uri . '.php';
    
    // Remove /api/ prefix and add .php if not present
    if (!file_exists($apiFile)) {
        $apiFile = __DIR__ . $uri;
    }
    
    if (file_exists($apiFile) && is_file($apiFile)) {
        require $apiFile;
        return true;
    }
    
    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found']);
    return true;
}

// Static files (CSS, JS, images, etc.)
if (preg_match('/\.(?:png|jpg|jpeg|gif|ico|css|js|svg|woff|woff2|ttf|eot)$/', $uri)) {
    // Try to serve from built frontend
    $frontendFile = __DIR__ . '/../client/dist' . $uri;
    if (file_exists($frontendFile)) {
        return false; // Let PHP serve the static file
    }
    
    // Try to serve from public
    $publicFile = __DIR__ . '/../client/public' . $uri;
    if (file_exists($publicFile)) {
        return false;
    }
    
    http_response_code(404);
    return true;
}

// All other routes - serve React app (SPA)
$indexFile = __DIR__ . '/../client/dist/index.html';
if (file_exists($indexFile)) {
    readfile($indexFile);
    return true;
}

// Fallback if build doesn't exist
http_response_code(404);
echo "Frontend not built. Please run: cd client && npm run build";
return true;
