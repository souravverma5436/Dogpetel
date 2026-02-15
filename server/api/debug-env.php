<?php
// Debug endpoint to check environment variables
// DELETE THIS FILE after confirming setup works!

header('Content-Type: application/json');

// Check if .env file exists
$envFileExists = file_exists(__DIR__ . '/../.env');

$env_vars = [
    'DB_HOST' => getenv('DB_HOST') ?: 'NOT SET',
    'DB_NAME' => getenv('DB_NAME') ?: 'NOT SET',
    'DB_USER' => getenv('DB_USER') ?: 'NOT SET',
    'DB_PASS' => getenv('DB_PASS') ? '***SET***' : 'NOT SET',
    'ADMIN_PASSWORD' => getenv('ADMIN_PASSWORD') ? '***SET***' : 'NOT SET',
];

// Also check $_ENV
$env_vars_alt = [
    'DB_HOST' => $_ENV['DB_HOST'] ?? 'NOT SET',
    'DB_NAME' => $_ENV['DB_NAME'] ?? 'NOT SET',
    'DB_USER' => $_ENV['DB_USER'] ?? 'NOT SET',
    'DB_PASS' => isset($_ENV['DB_PASS']) ? '***SET***' : 'NOT SET',
    'ADMIN_PASSWORD' => isset($_ENV['ADMIN_PASSWORD']) ? '***SET***' : 'NOT SET',
];

echo json_encode([
    'message' => 'Environment Variables Check',
    'env_file_exists' => $envFileExists,
    'env_file_path' => __DIR__ . '/../.env',
    'getenv_values' => $env_vars,
    'ENV_array_values' => $env_vars_alt,
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
], JSON_PRETTY_PRINT);
