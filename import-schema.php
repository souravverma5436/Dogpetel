<?php
// Import schema to Railway MySQL database

echo "PETEL - Import Database to Railway\n";
echo "====================================\n\n";

// Railway MySQL credentials
$host = 'nozomi.proxy.rlwy.net';
$port = 19782;
$database = 'railway';
$username = 'root';
$password = 'bJAYXAWosDimtjepRwNXOGsaIXSCtKRmzZm';

echo "Connecting to Railway MySQL...\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "✓ Connected successfully!\n\n";
    
    // Read schema file
    $schemaFile = __DIR__ . '/database/schema_railway.sql';
    
    if (!file_exists($schemaFile)) {
        die("ERROR: Schema file not found at: $schemaFile\n");
    }
    
    echo "Reading schema file...\n";
    $sql = file_get_contents($schemaFile);
    
    echo "Importing schema (this may take 30-60 seconds)...\n";
    
    // Split by semicolon and execute each statement
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && 
                   strpos($stmt, '--') !== 0 && 
                   strpos($stmt, '/*') !== 0;
        }
    );
    
    $count = 0;
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                $count++;
                if ($count % 10 == 0) {
                    echo ".";
                }
            } catch (PDOException $e) {
                // Ignore duplicate entry errors for INSERT statements
                if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                    echo "\nWarning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    
    echo "\n\n✓ Schema imported successfully!\n";
    echo "✓ Executed $count SQL statements\n\n";
    
    // Verify tables
    echo "Verifying tables...\n";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    echo "✓ Found " . count($tables) . " tables:\n";
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        echo "  - $table ($count rows)\n";
    }
    
    echo "\n====================================\n";
    echo "SUCCESS! Database is ready!\n";
    echo "Go to Railway and refresh the Data tab\n";
    echo "====================================\n";
    
} catch (PDOException $e) {
    echo "\n====================================\n";
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "\nPossible issues:\n";
    echo "- Network connection problem\n";
    echo "- Wrong credentials\n";
    echo "- Railway MySQL not accessible\n";
    echo "====================================\n";
    exit(1);
}
