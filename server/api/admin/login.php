<?php
// Admin Login API with JWT
// CORS is handled by .htaccess in this directory

header('Content-Type: application/json');

// Simple JWT implementation
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function createJWT($password) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'admin' => true,
        'exp' => time() + (7 * 24 * 60 * 60) // 7 days
    ]);
    
    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $password, true);
    $base64UrlSignature = base64url_encode($signature);
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
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

// Get admin password from environment
$adminPassword = getenv('ADMIN_PASSWORD') ?: ($_ENV['ADMIN_PASSWORD'] ?? 'komal123');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $password = $data['password'] ?? '';
    
    if ($password === $adminPassword) {
        $token = createJWT($adminPassword);
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid password']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verify token from Authorization header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        if (verifyJWT($token, $adminPassword)) {
            echo json_encode(['success' => true, 'logged_in' => true]);
        } else {
            echo json_encode(['success' => false, 'logged_in' => false]);
        }
    } else {
        echo json_encode(['success' => false, 'logged_in' => false]);
    }
}
