<?php
// Simple MySQL connection test
header('Content-Type: application/json');

$host = getenv('DB_HOST') ?: 'switchback.proxy.rlwy.net';
$port = getenv('DB_PORT') ?: '32612';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$dbname = getenv('DB_NAME') ?: 'railway';

$results = [];

// Test 1: Can we resolve the hostname?
$results['hostname'] = $host;
$results['port'] = $port;
$results['dns_lookup'] = gethostbyname($host);

// Test 2: Try to connect without selecting database
try {
    $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5
    ]);
    $results['connection'] = 'SUCCESS';
    
    // Test 3: Check MySQL version
    $version = $pdo->query('SELECT VERSION()')->fetchColumn();
    $results['mysql_version'] = $version;
    
    // Test 4: List databases
    $stmt = $pdo->query('SHOW DATABASES');
    $databases = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $results['databases'] = $databases;
    
    // Test 5: Try to use the railway database
    $pdo->exec("USE `$dbname`");
    $results['database_selected'] = 'SUCCESS';
    
    // Test 6: List tables
    $stmt = $pdo->query('SHOW TABLES');
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $results['tables'] = $tables;
    $results['table_count'] = count($tables);
    
} catch (PDOException $e) {
    $results['connection'] = 'FAILED';
    $results['error'] = $e->getMessage();
    $results['error_code'] = $e->getCode();
}

echo json_encode($results, JSON_PRETTY_PRINT);
