<?php
// Admin Login API

// Handle CORS and OPTIONS first
require_once __DIR__ . '/../../config/cors.php';

// Only start session if not OPTIONS request
if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    session_start();
}

// Get admin password from environment
$adminPassword = getenv('ADMIN_PASSWORD') ?: ($_ENV['ADMIN_PASSWORD'] ?? 'komal123');

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
