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
    private $driver;
    
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

        $availableDrivers = PDO::getAvailableDrivers();
        if (!in_array($driver, $availableDrivers, true)) {
            $this->connectSqliteFallback("PDO driver '$driver' is not installed.");
            return;
        }
        
        try {
            $dsn = "$driver:host=$host;port=$port;dbname=$dbname";
            if ($driver === 'mysql') {
                $dsn .= ';charset=utf8mb4';
            }
            
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
            $this->driver = $driver;
            
        } catch (PDOException $e) {
            if (PHP_SAPI === 'cli-server' && in_array('sqlite', $availableDrivers, true)) {
                $this->connectSqliteFallback($e->getMessage());
                return;
            }

            throw new RuntimeException('Database connection failed: ' . $e->getMessage());
        }
    }

    private function connectSqliteFallback($reason) {
        $dataDir = __DIR__ . '/../data';
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0775, true);
        }

        $this->connection = new PDO(
            'sqlite:' . $dataDir . '/petel.sqlite',
            null,
            null,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        $this->driver = 'sqlite';
        $this->initializeSqliteSchema();
        error_log('Using SQLite fallback database: ' . $reason);
    }

    private function initializeSqliteSchema() {
        $this->connection->exec("
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_id TEXT UNIQUE NOT NULL,
                customer_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                pet_name TEXT NOT NULL,
                pet_type TEXT NOT NULL,
                breed TEXT,
                age TEXT,
                service TEXT NOT NULL,
                price_per_day REAL NOT NULL,
                booking_date TEXT NOT NULL,
                time_slot TEXT NOT NULL,
                pickup_datetime TEXT NOT NULL,
                notes TEXT,
                payment_method TEXT DEFAULT 'cash',
                payment_status TEXT DEFAULT 'unpaid',
                razorpay_payment_id TEXT,
                status TEXT DEFAULT 'pending',
                actual_pickup_datetime TEXT,
                late_days INTEGER DEFAULT 0,
                late_charges REAL DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS pricing (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                package_name TEXT NOT NULL,
                pet_type TEXT NOT NULL,
                duration TEXT NOT NULL,
                price REAL NOT NULL,
                features TEXT,
                is_popular INTEGER DEFAULT 0,
                display_order INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                pet_name TEXT,
                rating INTEGER DEFAULT 5,
                review TEXT NOT NULL,
                is_featured INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS gallery (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_url TEXT NOT NULL,
                title TEXT,
                description TEXT,
                display_order INTEGER DEFAULT 0,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT UNIQUE NOT NULL,
                setting_value TEXT,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        ");

        $count = (int) $this->connection->query("SELECT COUNT(*) AS count FROM pricing")->fetch()['count'];
        if ($count > 0) {
            return;
        }

        // Seed pricing - DOG ONLY
        $stmt = $this->connection->prepare("
            INSERT INTO pricing (package_name, pet_type, duration, price, features, is_popular, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        $items = [
            ['Basic Care', 'dog', 'Per Day', 500, 'Daily walks,Basic grooming,Regular feeding,Clean accommodation', 0, 1],
            ['Standard Care', 'dog', 'Per Day', 800, 'Multiple walks,Basic grooming,Premium food,Spacious room,Play time', 1, 2],
            ['Premium Care', 'dog', 'Per Day', 1200, 'Unlimited walks,Full grooming,Gourmet meals,Luxury suite,Personal attention', 0, 3],
            ['Weekly Basic', 'dog', 'Per Week', 3000, 'All Basic Care features,7 days accommodation,Weekly health check', 0, 4],
            ['Weekly Standard', 'dog', 'Per Week', 5000, 'All Standard Care features,7 days accommodation,Vet consultation', 1, 5],
            ['Weekly Premium', 'dog', 'Per Week', 7500, 'All Premium Care features,7 days accommodation,Daily vet check', 0, 6],
            ['Monthly Basic', 'dog', 'Per Month', 12000, 'All Basic Care features,30 days accommodation,Bi-weekly health check', 0, 7],
            ['Monthly Standard', 'dog', 'Per Month', 18000, 'All Standard Care features,30 days accommodation,Weekly vet visits', 1, 8],
            ['Monthly Premium', 'dog', 'Per Month', 28000, 'All Premium Care features,30 days accommodation,Daily health monitoring', 0, 9],
            ['Daycare', 'dog', 'Per Day', 400, 'Drop-off and pick-up,Supervised play,Feeding,Basic care', 0, 10],
        ];

        foreach ($items as $item) {
            $stmt->execute($item);
        }

        // Seed testimonials
        $tStmt = $this->connection->prepare("INSERT INTO testimonials (customer_name, pet_name, rating, review, is_featured) VALUES (?, ?, ?, ?, ?)");
        $tStmt->execute(['Priya Sharma', 'Bruno', 5, 'Excellent service! My dog was so happy and well taken care of. Highly recommended!', 1]);
        $tStmt->execute(['Rahul Verma', 'Max', 5, 'Best pet hotel! My dog received amazing care and I got daily photo updates.', 1]);
        $tStmt->execute(['Anjali Patel', 'Milo', 5, 'Outstanding facility and caring staff. My pet was treated like family!', 1]);

        // Seed gallery
        $gStmt = $this->connection->prepare("INSERT INTO gallery (image_url, title, description, display_order, is_active) VALUES (?, ?, ?, ?, 1)");
        $gStmt->execute(['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80', 'Adorable Little Explorer', 'Meet our precious little guest!', 1]);
        $gStmt->execute(['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80', 'Cozy Comfort Time', 'Wrapped in warmth and love!', 2]);
        $gStmt->execute(['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80', 'Playtime Paradise', 'Happy tails and joyful moments!', 3]);
        $gStmt->execute(['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80', 'Luxury Pet Suites', 'Premium comfort for your companions.', 4]);
        $gStmt->execute(['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80', 'Professional Care Team', 'Expert care with a personal touch.', 5]);
        $gStmt->execute(['https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80', 'Happy & Healthy', 'Bright smiles and wagging tails!', 6]);
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

    public function getDriver() {
        return $this->driver;
    }
}

function getDB() {
    return Database::getInstance()->getConnection();
}
