<?php
// PostgreSQL Database Setup API Endpoint
// Visit: https://your-render-url.onrender.com/api/setup-db

require_once __DIR__ . '/../config/cors.php';

$results = ['steps' => []];

try {
    // Get DATABASE_URL from environment
    $databaseUrl = getenv('DATABASE_URL');
    
    if (!$databaseUrl) {
        throw new Exception('DATABASE_URL not set. Add it in Render Environment variables.');
    }
    
    $results['steps'][] = '✓ DATABASE_URL found';
    
    // Parse PostgreSQL URL
    $dbParts = parse_url($databaseUrl);
    $host = $dbParts['host'];
    $port = $dbParts['port'] ?? 5432;
    $user = $dbParts['user'];
    $pass = $dbParts['pass'];
    $dbname = ltrim($dbParts['path'], '/');
    
    // Connect to PostgreSQL
    $results['steps'][] = 'Connecting to PostgreSQL...';
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $results['steps'][] = '✓ Connected';
    
    // Read schema - try multiple possible paths
    $possiblePaths = [
        __DIR__ . '/../../database/schema_postgres.sql',
        '/var/www/html/database/schema_postgres.sql',
        __DIR__ . '/../database/schema_postgres.sql'
    ];
    
    $schemaFile = null;
    foreach ($possiblePaths as $path) {
        if (file_exists($path)) {
            $schemaFile = $path;
            break;
        }
    }
    
    if (!$schemaFile) {
        throw new Exception("Schema file not found. Tried: " . implode(', ', $possiblePaths));
    }
    
    $sql = file_get_contents($schemaFile);
    $results['steps'][] = '✓ Schema loaded from: ' . $schemaFile;
    
    // Execute schema
    $results['steps'][] = 'Creating tables...';
    $pdo->exec($sql);
    $results['steps'][] = '✓ Tables created';
    
    // Verify
    $stmt = $pdo->query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $counts = [];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM \"$table\"");
        $counts[$table] = $stmt->fetchColumn();
    }
    
    $results['success'] = true;
    $results['message'] = 'Database setup complete!';
    $results['tables'] = $tables;
    $results['counts'] = $counts;
    
} catch (Exception $e) {
    $results['success'] = false;
    $results['error'] = $e->getMessage();
    http_response_code(500);
}

echo json_encode($results, JSON_PRETTY_PRINT);
