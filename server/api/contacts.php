<?php
// Contact Form API (Works without composer)
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display in response
ini_set('log_errors', 1);

// Handle CORS manually for contacts endpoint
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (strpos($origin, '.vercel.app') !== false || strpos($origin, '.onrender.com') !== false || strpos($origin, 'localhost') !== false) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Log received data for debugging
    error_log("Contact form data received: " . print_r($data, true));
    
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $message = trim($data['message'] ?? '');
    
    // Validation
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }
    
    try {
        $db = getDB();
        
        // Insert contact
        $stmt = $db->prepare("INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([$name, $email, $phone, $message]);
        
        if ($result) {
            error_log("Contact saved successfully. ID: " . $db->lastInsertId());
            echo json_encode([
                'success' => true, 
                'message' => 'Thank you for contacting us! We will get back to you soon at ' . $phone
            ]);
        } else {
            throw new Exception("Failed to insert contact");
        }
        
    } catch (Exception $e) {
        error_log("Contact form error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send message. Please try again or call +91 82838 83463']);
    }
}
