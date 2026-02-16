<?php
// One-time script to add gallery table to existing database
// Visit: https://dogpetel.onrender.com/api/add-gallery-table.php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    // Create gallery table
    $sql = "
    CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255),
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
    CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order);
    ";
    
    $db->exec($sql);
    
    echo json_encode([
        'success' => true,
        'message' => 'Gallery table created successfully!',
        'note' => 'You can now add images from the admin panel'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
