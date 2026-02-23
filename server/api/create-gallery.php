<?php
// Create Gallery Table and Add Images
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    // Step 1: Create the gallery table
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255),
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $db->exec($createTableSQL);
    
    // Step 2: Create indexes
    $db->exec("CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active)");
    $db->exec("CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order)");
    
    // Step 3: Check if table has data
    $countStmt = $db->query("SELECT COUNT(*) FROM gallery");
    $existingCount = $countStmt->fetchColumn();
    
    if ($existingCount > 0) {
        // Clear existing data
        $db->exec("TRUNCATE TABLE gallery RESTART IDENTITY");
    }
    
    // Step 4: Add 6 beautiful images
    $images = [
        [
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
            'Adorable Little Explorer',
            'Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel.',
            1
        ],
        [
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
            'Cozy Comfort Time',
            'Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket.',
            2
        ],
        [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
            'Playtime Paradise',
            'Happy tails and joyful moments! Our guests enjoying their favorite activities in our spacious play areas.',
            3
        ],
        [
            'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
            'Luxury Pet Suites',
            'Premium comfort for your beloved companions with plush bedding and climate control.',
            4
        ],
        [
            'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
            'Professional Care Team',
            'Expert care with a personal touch. Our trained staff ensures every pet receives individual attention.',
            5
        ],
        [
            'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80',
            'Happy & Healthy',
            'Bright smiles and wagging tails! We maintain the highest standards of cleanliness and health.',
            6
        ]
    ];
    
    $stmt = $db->prepare("
        INSERT INTO gallery (image_url, title, description, display_order, is_active, created_at) 
        VALUES (?, ?, ?, ?, true, NOW())
    ");
    
    $count = 0;
    foreach ($images as $img) {
        $stmt->execute($img);
        $count++;
    }
    
    // Step 5: Verify insertion
    $checkStmt = $db->query("SELECT COUNT(*) FROM gallery WHERE is_active = true");
    $totalActive = $checkStmt->fetchColumn();
    
    // Get all images to show in response
    $allImages = $db->query("SELECT id, title, image_url FROM gallery ORDER BY display_order")->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => "Gallery table created and {$count} images added successfully!",
        'steps_completed' => [
            'table_created' => true,
            'indexes_created' => true,
            'old_data_cleared' => $existingCount > 0,
            'images_inserted' => $count
        ],
        'images_added' => $count,
        'total_active' => $totalActive,
        'images' => $allImages,
        'note' => 'Gallery is now ready! Visit https://dogpetel.vercel.app/gallery to see the images.'
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'error_code' => $e->getCode(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString())
    ], JSON_PRETTY_PRINT);
}
