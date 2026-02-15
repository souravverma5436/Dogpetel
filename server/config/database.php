<?php
// Database Configuration and Connection

// Load environment variables manually (without composer)
// Priority: System env vars (Railway) > .env file > defaults
$envFile = __DIR__ . '/../.env';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($key, $value) = explode('=', $line, 2);
        // Only set if not already set by system
        if (!getenv(trim($key))) {
            $_ENV[trim($key)] = trim($value);
        }
    }
}

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        // Priority: getenv (Railway) > $_ENV (.env file) > defaults
        $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
        $port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '3306');
        $dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'petel_db');
        $username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'root');
        $password = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
        
        try {
            // Build DSN with port support
            $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
            
            // First connect without database to ensure it exists
            $this->connection = new PDO(
                $dsn,
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
            
            // Create database if it doesn't exist
            $this->connection->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
            $this->connection->exec("USE `$dbname`");
            
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode([
                'error' => 'Database connection failed. Please check your database configuration.',
                'details' => $e->getMessage(),
                'host' => $host,
                'port' => $port,
                'database' => $dbname
            ]));
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}

function getDB() {
    return Database::getInstance()->getConnection();
}
