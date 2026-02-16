<?php
// Admin Appointments Management API
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
    
    // GET - Fetch all appointments
    if ($method === 'GET') {
        $search = $_GET['search'] ?? '';
        $status = $_GET['status'] ?? '';
        
        $query = "SELECT * FROM appointments WHERE 1=1";
        $params = [];
        
        if (!empty($search)) {
            $query .= " AND (customer_name LIKE ? OR email LIKE ? OR phone LIKE ? OR booking_id LIKE ?)";
            $searchTerm = "%$search%";
            $params = array_fill(0, 4, $searchTerm);
        }
        
        if (!empty($status)) {
            $query .= " AND status = ?";
            $params[] = $status;
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $appointments = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $appointments]);
    }
    
    // PUT - Update appointment
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Appointment ID required']);
            exit;
        }
        
        // Fetch current appointment
        $stmt = $db->prepare("SELECT * FROM appointments WHERE id = ?");
        $stmt->execute([$id]);
        $appointment = $stmt->fetch();
        
        if (!$appointment) {
            http_response_code(404);
            echo json_encode(['error' => 'Appointment not found']);
            exit;
        }
        
        // Calculate late charges if actual pickup is set
        $lateCharges = 0;
        $lateDays = 0;
        
        if (!empty($data['actual_pickup_datetime'])) {
            $scheduledPickup = new DateTime($appointment['pickup_datetime']);
            $actualPickup = new DateTime($data['actual_pickup_datetime']);
            
            if ($actualPickup > $scheduledPickup) {
                $interval = $scheduledPickup->diff($actualPickup);
                $lateDays = (int)ceil($interval->days + ($interval->h / 24));
                $lateCharges = $lateDays * $appointment['price_per_day'];
            }
        }
        
        // Update appointment
        $updateFields = [];
        $updateParams = [];
        
        if (isset($data['status'])) {
            $updateFields[] = "status = ?";
            $updateParams[] = $data['status'];
        }
        
        if (isset($data['payment_status'])) {
            $updateFields[] = "payment_status = ?";
            $updateParams[] = $data['payment_status'];
        }
        
        if (isset($data['actual_pickup_datetime'])) {
            $updateFields[] = "actual_pickup_datetime = ?";
            $updateParams[] = $data['actual_pickup_datetime'];
            $updateFields[] = "late_days = ?";
            $updateParams[] = $lateDays;
            $updateFields[] = "late_charges = ?";
            $updateParams[] = $lateCharges;
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            exit;
        }
        
        $updateParams[] = $id;
        $updateQuery = "UPDATE appointments SET " . implode(", ", $updateFields) . " WHERE id = ?";
        
        $stmt = $db->prepare($updateQuery);
        $stmt->execute($updateParams);
        
        echo json_encode([
            'success' => true,
            'message' => 'Appointment updated',
            'late_days' => $lateDays,
            'late_charges' => $lateCharges
        ]);
    }
    
    // DELETE - Delete appointment
    elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(['error' => 'Appointment ID required']);
            exit;
        }
        
        $stmt = $db->prepare("DELETE FROM appointments WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Appointment deleted']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
