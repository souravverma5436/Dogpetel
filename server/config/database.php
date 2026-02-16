<?php
// Database Configuration and Connection
// Updated for PostgreSQL on Render

// Load environment variables manually (without composer)
// Priority: System env vars (Render) > .env file > defaults
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
        // Check for DATABASE_URL (PostgreSQL on Render)
        $databaseUrl = getenv('DATABASE_URL') ?: ($_ENV['DATABASE_URL'] ?? '');
        
        if ($databaseUrl) {
            // Parse DATABASE_URL: postgresql://user:pass@host:port/dbname
            $parts = parse_url($databaseUrl);
            $host = $parts['host'] ?? 'localhost';
            $port = $parts['port'] ?? '5432';
            $username = $parts['user'] ?? 'postgres';
            $password = $parts['pass'] ?? '';
            $dbname = ltrim($parts['path'] ?? '/petel_db', '/');
            $driver = 'pgsql';
        } else {
            // Fallback to individual environment variables
            $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
            $port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');
            $dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'petel_db');
            $username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'postgres');
            $password = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
            $driver = getenv('DB_DRIVER') ?: ($_ENV['DB_DRIVER'] ?? 'pgsql');
        }
        
        try {
            // Build DSN for PostgreSQL
            $dsn = "$driver:host=$host;port=$port;dbname=$dbname";
            
            $this->connection = new PDO(
                $dsn,
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_TIMEOUT => 10
                ]
            );
            
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
