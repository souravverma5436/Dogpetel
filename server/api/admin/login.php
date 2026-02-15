<?php
// Admin Login API

require_once __DIR__ . '/../../config/cors.php';

// Start session
session_start();

// Load environment variables
$envFile = __DIR__ . '/../../.env';
$env = [];

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $env[trim($key)] = trim($value);
    }
}

// Set default admin password if not in env
$adminPassword = $env['ADMIN_PASSWORD'] ?? 'komal123';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $password = $data['password'] ?? '';
    
    if ($password === $adminPassword) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_login_time'] = time();
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid password']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if already logged in
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in']) {
        echo json_encode(['success' => true, 'logged_in' => true]);
    } else {
        echo json_encode(['success' => false, 'logged_in' => false]);
    }
}
