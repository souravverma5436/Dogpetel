<?php
// Gallery API - Public endpoint
require_once __DIR__ . '/../config/cors.php';
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Fetch active gallery images ordered by display_order
        $db = getDB();
        $driver = Database::getInstance()->getDriver();
        $activeVal = ($driver === 'sqlite') ? '1' : 'true';
        $query = "SELECT id, image_url, title, description, display_order, created_at 
                  FROM gallery 
                  WHERE is_active = $activeVal
                  ORDER BY display_order ASC, created_at DESC";
        
        $stmt = $db->query($query);
        $images = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $images,
            'count' => count($images)
        ]);
        
    } catch (Exception $e) {
        error_log("Gallery fetch error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch gallery images']);
    }
}
