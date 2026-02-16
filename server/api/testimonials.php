<?php
// Testimonials API
// CORS is handled by .htaccess

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $db = getDB();
        $stmt = $db->query("SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 10");
        $testimonials = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $testimonials]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch testimonials', 'details' => $e->getMessage()]);
    }
}
