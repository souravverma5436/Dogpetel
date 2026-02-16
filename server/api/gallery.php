<?php
// Gallery API - Public endpoint
// CORS is handled by .htaccess in this directory
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $db = getDB();
        
        // Fetch active gallery images ordered by display_order
        $query = "SELECT id, image_url, title, description, display_order, created_at 
                  FROM gallery 
                  WHERE is_active = true 
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
