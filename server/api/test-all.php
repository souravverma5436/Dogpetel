<?php
// Test all API endpoints
require_once __DIR__ . '/../config/cors.php';

$results = [];

// Test 1: Database connection
try {
    require_once __DIR__ . '/../config/database.php';
    $db = getDB();
    $results['database'] = 'Connected';
} catch (Exception $e) {
    $results['database'] = 'Failed: ' . $e->getMessage();
}

// Test 2: Pricing API
try {
    $stmt = $db->query("SELECT COUNT(*) as count FROM pricing");
    $count = $stmt->fetch()['count'];
    $results['pricing_count'] = $count;
    
    $stmt = $db->query("SELECT * FROM pricing LIMIT 3");
    $results['pricing_sample'] = $stmt->fetchAll();
} catch (Exception $e) {
    $results['pricing'] = 'Failed: ' . $e->getMessage();
}

// Test 3: Admin password
$adminPassword = getenv('ADMIN_PASSWORD') ?: 'NOT SET';
$results['admin_password'] = $adminPassword === 'komal123' ? 'Correct' : 'Wrong: ' . $adminPassword;

// Test 4: Environment variables
$results['env_vars'] = [
    'DATABASE_URL' => getenv('DATABASE_URL') ? 'SET' : 'NOT SET',
    'ADMIN_PASSWORD' => getenv('ADMIN_PASSWORD') ? 'SET' : 'NOT SET'
];

echo json_encode($results, JSON_PRETTY_PRINT);
