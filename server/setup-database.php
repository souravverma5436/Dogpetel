<?php
// Auto-setup database on first run
// This script will be called automatically by the application

require_once __DIR__ . '/config/database.php';

function setupDatabase() {
    try {
        $db = getDB();
        
        // Check if tables already exist
        $stmt = $db->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (count($tables) >= 5) {
            return ['success' => true, 'message' => 'Database already set up', 'tables' => count($tables)];
        }
        
        // Read and execute schema
        $schemaFile = __DIR__ . '/../database/schema_railway.sql';
        
        if (!file_exists($schemaFile)) {
            return ['success' => false, 'error' => 'Schema file not found'];
        }
        
        $sql = file_get_contents($schemaFile);
        
        // Split by semicolon and execute each statement
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            function($stmt) {
                return !empty($stmt) && 
                       strpos($stmt, '--') !== 0 && 
                       strpos($stmt, '/*') !== 0;
            }
        );
        
        $executed = 0;
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                try {
                    $db->exec($statement);
                    $executed++;
                } catch (PDOException $e) {
                    // Ignore duplicate entry errors
                    if (strpos($e->getMessage(), 'Duplicate entry') === false &&
                        strpos($e->getMessage(), 'already exists') === false) {
                        error_log("Schema setup warning: " . $e->getMessage());
                    }
                }
            }
        }
        
        // Verify tables
        $stmt = $db->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        return [
            'success' => true, 
            'message' => 'Database setup complete',
            'statements' => $executed,
            'tables' => count($tables)
        ];
        
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

// If called directly, run setup and output result
if (php_sapi_name() === 'cli' || basename($_SERVER['PHP_SELF']) === 'setup-database.php') {
    header('Content-Type: application/json');
    echo json_encode(setupDatabase(), JSON_PRETTY_PRINT);
}
