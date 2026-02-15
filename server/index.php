<?php
// Router for PHP built-in server
// Document root is project root, router is in server/index.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = urldecode($uri);

// API routes - serve from server/api directory
if (strpos($uri, '/api/') === 0) {
    $apiPath = str_replace('/api/', '/server/api/', $uri);
    $apiFile = __DIR__ . '/..' . $apiPath;
    
    // Add .php extension if not present
    if (!file_exists($apiFile) && !preg_match('/\.php$/', $apiFile)) {
        $apiFile .= '.php';
    }
    
    if (file_exists($apiFile) && is_file($apiFile)) {
        require $apiFile;
        return true;
    }
    
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API endpoint not found: ' . $uri]);
    return true;
}

// Static files from dist (CSS, JS, images, fonts, etc.)
if (preg_match('/\.(?:png|jpg|jpeg|gif|ico|css|js|svg|woff|woff2|ttf|eot|map)$/i', $uri)) {
    // Serve from client/dist
    $distFile = __DIR__ . '/../client/dist' . $uri;
    
    if (file_exists($distFile) && is_file($distFile)) {
        // Determine content type
        $ext = pathinfo($distFile, PATHINFO_EXTENSION);
        $contentTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'json' => 'application/json',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject',
            'map' => 'application/json'
        ];
        
        if (isset($contentTypes[$ext])) {
            header('Content-Type: ' . $contentTypes[$ext]);
        }
        
        readfile($distFile);
        return true;
    }
    
    // Try public directory
    $publicFile = __DIR__ . '/../client/public' . $uri;
    if (file_exists($publicFile) && is_file($publicFile)) {
        return false; // Let PHP serve it
    }
    
    // File not found
    http_response_code(404);
    error_log("Static file not found: $uri (looked in: $distFile)");
    echo "File not found: $uri";
    return true;
}

// All other routes - serve React app (SPA)
$indexFile = __DIR__ . '/../client/dist/index.html';

if (file_exists($indexFile)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($indexFile);
    return true;
}

// Fallback if build doesn't exist
http_response_code(500);
header('Content-Type: text/html; charset=UTF-8');
echo "<!DOCTYPE html><html><head><title>Build Error</title></head><body>";
echo "<h1>Frontend Build Not Found</h1>";
echo "<p>The React frontend has not been built yet.</p>";
echo "<p>Expected location: " . htmlspecialchars($indexFile) . "</p>";
echo "<p>Please ensure 'npm run build' completed successfully.</p>";
echo "</body></html>";
return true;
