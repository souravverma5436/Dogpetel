<?php
// CORS Configuration

// Allowed origins (add your Railway domain here after deployment)
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    // Add your Railway domain here after deployment:
    // 'https://your-railway-domain.up.railway.app'
];

// Get the origin from the request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if origin is allowed
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (strpos($origin, '.railway.app') !== false || strpos($origin, '.up.railway.app') !== false) {
    // Automatically allow Railway domains
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Default to localhost for development
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
