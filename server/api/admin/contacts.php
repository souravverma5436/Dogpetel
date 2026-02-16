<?php
// Admin Contacts Management API
// CORS is handled by .htaccess in this directory

require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json');

// Simple JWT verification
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function verifyJWT($jwt, $password) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return false;
    
    list($header, $payload, $signature) = $parts;
    $validSignature = base64url_encode(hash_hmac('sha256', $header . "." . $payload, $password, true));
    
    if ($signature !== $validSignature) return false;
    
    $payloadData = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
    if ($payloadData['exp'] < time()) return false;
    
    return true;
}

// Check authentication
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
$adminPassword = getenv('ADMIN_PASSWORD') ?: ($_ENV['ADMIN_PASSWORD'] ?? 'komal123');

$authenticated = false;
if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $token = $matches[1];
    $authenticated = verifyJWT($token, $adminPassword);
}

if (!$authenticated) {
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
