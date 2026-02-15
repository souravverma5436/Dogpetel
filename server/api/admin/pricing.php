<?php
// Admin Pricing Management API

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

session_start();

if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    if ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $price = $data['price'] ?? 0;
        
        if (empty($id) || $price <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            exit;
        }
        
        $stmt = $db->prepare("UPDATE pricing SET price = ? WHERE id = ?");
        $stmt->execute([$price, $id]);
        
        echo json_encode(['success' => true, 'message' => 'Price updated']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
