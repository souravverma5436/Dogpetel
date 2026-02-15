<?php
// Admin Contacts Management API

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

session_start();

// Check admin authentication
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    // GET - Fetch all contacts
    if ($method === 'GET') {
        $query = "SELECT * FROM contacts ORDER BY created_at DESC";
        $stmt = $db->query($query);
        $contacts = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $contacts]);
    }
    
    // DELETE - Delete contact
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Contact ID required']);
            exit;
        }
        
        $stmt = $db->prepare("DELETE FROM contacts WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Contact deleted']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
