<?php
// Debug endpoint to check environment variables
// DELETE THIS FILE after confirming setup works!

header('Content-Type: application/json');

$env_vars = [
    'DB_HOST' => getenv('DB_HOST') ?: 'NOT SET',
    'DB_NAME' => getenv('DB_NAME') ?: 'NOT SET',
    'DB_USER' => getenv('DB_USER') ?: 'NOT SET',
    'DB_PASS' => getenv('DB_PASS') ? '***SET***' : 'NOT SET',
    'ADMIN_PASSWORD' => getenv('ADMIN_PASSWORD') ? '***SET***' : 'NOT SET',
];

echo json_encode([
    'message' => 'Environment Variables Check',
    'variables' => $env_vars,
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
], JSON_PRETTY_PRINT);
