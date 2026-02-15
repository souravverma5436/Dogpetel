<?php
// PostgreSQL Database Setup for Render
// Visit: https://your-render-url.onrender.com/setup-postgres.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$results = ['steps' => []];

try {
    // Get DATABASE_URL from environment (Render format)
    $databaseUrl = getenv('DATABASE_URL');
    
    if (!$databaseUrl) {
        throw new Exception('DATABASE_URL environment variable not set');
    }
    
    $results['steps'][] = '✓ DATABASE_URL found';
    
    // Parse DATABASE_URL
    // Format: postgresql://user:password@host:port/database
    $dbParts = parse_url($databaseUrl);
    
    $host = $dbParts['host'];
    $port = $dbParts['port'] ?? 5432;
    $user = $dbParts['user'];
    $pass = $dbParts['pass'];
    $dbname = ltrim($dbParts['path'], '/');
    
    $results['connection_info'] = [
        'host' => $host,
        'port' => $port,
        'database' => $dbname,
        'user' => $user
    ];
    
    // Step 1: Connect to PostgreSQL
    $results['steps'][] = 'Connecting to PostgreSQL...';
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 10
    ]);
    $results['steps'][] = '✓ Connected to PostgreSQL';
    
    // Step 2: Read PostgreSQL schema file
    $schemaFile = __DIR__ . '/../database/schema_postgres.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("PostgreSQL schema file not found: $schemaFile");
    }
    
    $sql = file_get_contents($schemaFile);
    $results['steps'][] = '✓ Schema file loaded';
    
    // Step 3: Execute schema
    $results['steps'][] = 'Creating tables and inserting data...';
    
    // Execute the entire SQL file
    try {
        $pdo->exec($sql);
        $results['steps'][] = '✓ Schema executed successfully';
    } catch (PDOException $e) {
        // If full execution fails, try statement by statement
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            function($stmt) {
                $stmt = trim($stmt);
                return !empty($stmt) && 
                       strpos($stmt, '--') !== 0;
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
                    // Ignore "already exists" errors
                    if (strpos($e->getMessage(), 'already exists') === false &&
                        strpos($e->getMessage(), 'duplicate') === false) {
                        $errors[] = substr($e->getMessage(), 0, 200);
                    }
                }
            }
        }
        
        $results['steps'][] = "✓ Executed $executed SQL statements";
        if (!empty($errors)) {
            $results['warnings'] = array_slice($errors, 0, 5);
        }
    }
    
    // Step 4: Verify tables
    $stmt = $pdo->query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $results['steps'][] = '✓ Tables created: ' . implode(', ', $tables);
    
    // Step 5: Count records
    $counts = [];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM \"$table\"");
            $count = $stmt->fetchColumn();
            $counts[$table] = $count;
        } catch (PDOException $e) {
            $counts[$table] = 'error';
        }
    }
    $results['steps'][] = '✓ Record counts retrieved';
    
    $results['success'] = true;
    $results['message'] = 'Database setup complete!';
    $results['tables'] = $tables;
    $results['counts'] = $counts;
    
    http_response_code(200);
    
} catch (Exception $e) {
    $results['success'] = false;
    $results['error'] = $e->getMessage();
    $results['trace'] = $e->getTraceAsString();
    http_response_code(500);
}

echo json_encode($results, JSON_PRETTY_PRINT);
