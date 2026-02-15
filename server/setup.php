<?php
// Simple database setup script for Render deployment
// Visit this URL once to create tables: https://your-render-url.onrender.com/setup.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Load environment variables
$host = getenv('DB_HOST') ?: 'localhost';
$port = getenv('DB_PORT') ?: '3306';
$dbname = getenv('DB_NAME') ?: 'railway';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';

$results = ['steps' => []];

try {
    // Step 1: Connect to MySQL
    $results['steps'][] = 'Connecting to MySQL...';
    $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 10
    ]);
    $results['steps'][] = '✓ Connected to MySQL';
    
    // Step 2: Create database if not exists
    $results['steps'][] = "Creating database '$dbname'...";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    $pdo->exec("USE `$dbname`");
    $results['steps'][] = "✓ Database '$dbname' ready";
    
    // Step 3: Read schema file
    $schemaFile = __DIR__ . '/../database/schema_railway.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: $schemaFile");
    }
    
    $sql = file_get_contents($schemaFile);
    $results['steps'][] = '✓ Schema file loaded';
    
    // Step 4: Execute schema
    $results['steps'][] = 'Creating tables...';
    
    // Split by semicolon and execute each statement
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && 
                   strpos($stmt, '--') !== 0 && 
                   strpos($stmt, '/*') !== 0 &&
                   strpos($stmt, 'USE ') !== 0;
        }
    );
    
    $executed = 0;
    $errors = [];
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                $executed++;
            } catch (PDOException $e) {
                // Ignore duplicate/exists errors
                if (strpos($e->getMessage(), 'already exists') === false &&
                    strpos($e->getMessage(), 'Duplicate') === false) {
                    $errors[] = $e->getMessage();
                }
            }
        }
    }
    
    $results['steps'][] = "✓ Executed $executed SQL statements";
    if (!empty($errors)) {
        $results['warnings'] = $errors;
    }
    
    // Step 5: Verify tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $results['steps'][] = '✓ Tables created: ' . implode(', ', $tables);
    
    // Step 6: Count records
    $counts = [];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM `$table`");
        $count = $stmt->fetchColumn();
        $counts[$table] = $count;
    }
    $results['steps'][] = '✓ Record counts: ' . json_encode($counts);
    
    $results['success'] = true;
    $results['message'] = 'Database setup complete!';
    $results['tables'] = $tables;
    $results['counts'] = $counts;
    
    http_response_code(200);
    
} catch (Exception $e) {
    $results['success'] = false;
    $results['error'] = $e->getMessage();
    $results['connection_info'] = [
        'host' => $host,
        'port' => $port,
        'database' => $dbname,
        'user' => $user
    ];
    http_response_code(500);
}

echo json_encode($results, JSON_PRETTY_PRINT);
