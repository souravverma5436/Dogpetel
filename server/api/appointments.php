<?php
// Appointments API (Works without composer)

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

function generateBookingId() {
    return 'PETEL' . strtoupper(substr(uniqid(), -8));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    $required = ['customer_name', 'email', 'phone', 'pet_name', 'pet_type', 'service', 
                 'price_per_day', 'booking_date', 'time_slot', 'pickup_datetime', 'payment_method', 'terms_agreed'];
    
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Field $field is required"]);
            exit;
        }
    }
    
    if (!$data['terms_agreed']) {
        http_response_code(400);
        echo json_encode(['error' => 'You must agree to terms and conditions']);
        exit;
    }
    
    try {
        $db = getDB();
        $bookingId = generateBookingId();
        
        $paymentStatus = ($data['payment_method'] === 'online' && !empty($data['razorpay_payment_id'])) ? 'paid' : 'unpaid';
        
        // Insert appointment
        $stmt = $db->prepare("
            INSERT INTO appointments 
            (booking_id, customer_name, email, phone, pet_name, pet_type, breed, age, 
             service, price_per_day, booking_date, time_slot, pickup_datetime, notes, 
             payment_method, payment_status, razorpay_payment_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        ");
        
        $stmt->execute([
            $bookingId,
            $data['customer_name'],
            $data['email'],
            $data['phone'],
            $data['pet_name'],
            $data['pet_type'],
            $data['breed'] ?? null,
            $data['age'] ?? null,
            $data['service'],
            $data['price_per_day'],
            $data['booking_date'],
            $data['time_slot'],
            $data['pickup_datetime'],
            $data['notes'] ?? null,
            $data['payment_method'],
            $paymentStatus,
            $data['razorpay_payment_id'] ?? null
        ]);
        
        // Note: Email notifications disabled (requires composer install)
        // To enable: run "composer install" in server folder
        
        echo json_encode([
            'success' => true,
            'booking_id' => $bookingId,
            'message' => 'Appointment booked successfully! Booking ID: ' . $bookingId,
            'note' => 'Email notifications are disabled. Contact +91 82838 83463 for confirmation.'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to book appointment: ' . $e->getMessage()]);
    }
}
