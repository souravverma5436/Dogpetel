<?php
// Health check endpoint for Render
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$health = [
    'status' => 'healthy',
    'timestamp' => time(),
    'service' => 'PETEL Pet Hotel API',
    'php_version' => phpversion()
];

// Check database connection if configured
if (getenv('DB_HOST')) {
    try {
        $host = getenv('DB_HOST');
        $dbname = getenv('DB_NAME') ?: 'railway';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';
        
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
        $health['database'] = 'connected';
    } catch (PDOException $e) {
        $health['database'] = 'disconnected';
        $health['db_error'] = $e->getMessage();
    }
} else {
    $health['database'] = 'not_configured';
}

http_response_code(200);
echo json_encode($health, JSON_PRETTY_PRINT);
