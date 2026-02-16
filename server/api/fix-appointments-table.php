<?php
// One-time script to fix appointments table schema
// Visit: https://dogpetel.onrender.com/api/fix-appointments-table.php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    // Drop old appointments table and recreate with correct schema
    $sql = "
    DROP TABLE IF EXISTS appointments CASCADE;
    
    CREATE TABLE appointments (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        pet_name VARCHAR(255) NOT NULL,
        pet_type VARCHAR(50) NOT NULL,
        breed VARCHAR(255),
        age VARCHAR(50),
        service VARCHAR(100) NOT NULL,
        price_per_day DECIMAL(10,2) NOT NULL,
        booking_date DATE NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        pickup_datetime TIMESTAMP NOT NULL,
        notes TEXT,
        payment_method VARCHAR(20) DEFAULT 'cash',
        payment_status VARCHAR(20) DEFAULT 'unpaid',
        razorpay_payment_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        actual_pickup_datetime TIMESTAMP,
        late_days INTEGER DEFAULT 0,
        late_charges DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX idx_appointments_booking ON appointments(booking_id);
    CREATE INDEX idx_appointments_email ON appointments(email);
    CREATE INDEX idx_appointments_status ON appointments(status);
    CREATE INDEX idx_appointments_dates ON appointments(booking_date, pickup_datetime);
    ";
    
    $db->exec($sql);
    
    echo json_encode([
        'success' => true,
        'message' => 'Appointments table fixed successfully!',
        'note' => 'Old appointments were deleted. You can now book appointments.'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
