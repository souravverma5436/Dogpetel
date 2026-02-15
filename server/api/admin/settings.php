<?php
// Admin Settings Management API

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
    
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM settings");
        $settings = $stmt->fetchAll();
        
        $settingsObj = [];
        foreach ($settings as $setting) {
            $settingsObj[$setting['setting_key']] = $setting['setting_value'];
        }
        
        echo json_encode(['success' => true, 'data' => $settingsObj]);
    }
    
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        foreach ($data as $key => $value) {
            $stmt = $db->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = ?");
            $stmt->execute([$value, $key]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Settings updated']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
