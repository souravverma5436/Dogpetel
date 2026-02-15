<?php
// Debug endpoint to check MySQL connection variables
header('Content-Type: application/json');

// Get all environment variables that contain 'MYSQL' or 'DATABASE'
$all_env = getenv();
$mysql_vars = [];

foreach ($all_env as $key => $value) {
    if (stripos($key, 'MYSQL') !== false || 
        stripos($key, 'DATABASE') !== false ||
        stripos($key, 'DB') !== false) {
        // Hide passwords
        if (stripos($key, 'PASS') !== false || stripos($key, 'PASSWORD') !== false) {
            $mysql_vars[$key] = '***HIDDEN***';
        } else {
            $mysql_vars[$key] = $value;
        }
    }
}

echo json_encode([
    'message' => 'MySQL Related Environment Variables',
    'variables' => $mysql_vars,
    'note' => 'Look for MYSQL_URL, MYSQL_PRIVATE_URL, or DATABASE_URL'
], JSON_PRETTY_PRINT);
