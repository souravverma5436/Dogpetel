<?php
// Pricing API

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $db = getDB();
        $stmt = $db->query("SELECT * FROM pricing ORDER BY display_order, pet_type, price");
        $pricing = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $pricing]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch pricing', 'details' => $e->getMessage()]);
    }
}
