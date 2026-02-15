<?php
// Debug endpoint to check environment variables
// DELETE THIS FILE after confirming setup works!

header('Content-Type: application/json');

// Check if .env file exists
$envFileExists = file_exists(__DIR__ . '/../.env');

$env_vars = [
    'DB_HOST' => getenv('DB_HOST') ?: 'NOT SET',
    'DB_PORT' => getenv('DB_PORT') ?: 'NOT SET',
    'DB_NAME' => getenv('DB_NAME') ?: 'NOT SET',
    'DB_USER' => getenv('DB_USER') ?: 'NOT SET',
    'DB_PASS' => getenv('DB_PASS') ? '***SET***' : 'NOT SET',
    'ADMIN_PASSWORD' => getenv('ADMIN_PASSWORD') ? '***SET***' : 'NOT SET',
];

// Also check $_ENV
$env_vars_alt = [
    'DB_HOST' => $_ENV['DB_HOST'] ?? 'NOT SET',
    'DB_PORT' => $_ENV['DB_PORT'] ?? 'NOT SET',
    'DB_NAME' => $_ENV['DB_NAME'] ?? 'NOT SET',
    'DB_USER' => $_ENV['DB_USER'] ?? 'NOT SET',
    'DB_PASS' => isset($_ENV['DB_PASS']) ? '***SET***' : 'NOT SET',
    'ADMIN_PASSWORD' => isset($_ENV['ADMIN_PASSWORD']) ? '***SET***' : 'NOT SET',
];

// Get all env vars to see what Railway provides
$all_env = getenv();
$railway_vars = [];
foreach ($all_env as $key => $value) {
    if (stripos($key, 'RAILWAY') !== false || stripos($key, 'MYSQL') !== false || stripos($key, 'DATABASE') !== false) {
        if (stripos($key, 'PASS') !== false || stripos($key, 'SECRET') !== false || stripos($key, 'TOKEN') !== false) {
            $railway_vars[$key] = '***HIDDEN***';
        } else {
            $railway_vars[$key] = $value;
        }
    }
}

echo json_encode([
    'message' => 'Environment Variables Check',
    'env_file_exists' => $envFileExists,
    'env_file_path' => __DIR__ . '/../.env',
    'getenv_values' => $env_vars,
    'ENV_array_values' => $env_vars_alt,
    'railway_provided_vars' => $railway_vars,
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
], JSON_PRETTY_PRINT);
