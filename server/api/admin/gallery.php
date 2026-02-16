<?php
// Admin Gallery Management API
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
    
    // GET - Fetch all gallery images (including inactive)
    if ($method === 'GET') {
        $query = "SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC";
        $stmt = $db->query($query);
        $images = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $images]);
    }
    
    // POST - Add new image
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $imageUrl = trim($data['image_url'] ?? '');
        $title = trim($data['title'] ?? '');
        $description = trim($data['description'] ?? '');
        $displayOrder = intval($data['display_order'] ?? 0);
        
        if (empty($imageUrl)) {
            http_response_code(400);
            echo json_encode(['error' => 'Image URL is required']);
            exit;
        }
        
        $stmt = $db->prepare("INSERT INTO gallery (image_url, title, description, display_order) VALUES (?, ?, ?, ?)");
        $stmt->execute([$imageUrl, $title, $description, $displayOrder]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Image added to gallery',
            'id' => $db->lastInsertId()
        ]);
    }
    
    // PUT - Update image
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Image ID required']);
            exit;
        }
        
        $updates = [];
        $params = [];
        
        if (isset($data['image_url'])) {
            $updates[] = "image_url = ?";
            $params[] = trim($data['image_url']);
        }
        if (isset($data['title'])) {
            $updates[] = "title = ?";
            $params[] = trim($data['title']);
        }
        if (isset($data['description'])) {
            $updates[] = "description = ?";
            $params[] = trim($data['description']);
        }
        if (isset($data['display_order'])) {
            $updates[] = "display_order = ?";
            $params[] = intval($data['display_order']);
        }
        if (isset($data['is_active'])) {
            $updates[] = "is_active = ?";
            $params[] = $data['is_active'] ? 'true' : 'false';
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            exit;
        }
        
        $params[] = $id;
        $sql = "UPDATE gallery SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode(['success' => true, 'message' => 'Image updated']);
    }
    
    // DELETE - Delete image
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Image ID required']);
            exit;
        }
        
        $stmt = $db->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Image deleted']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
