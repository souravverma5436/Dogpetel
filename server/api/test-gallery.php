<?php
// Test Gallery API and Add Sample Images
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    // First, check if gallery table exists
    $checkTable = $db->query("SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'gallery'
    )");
    $tableExists = $checkTable->fetchColumn();
    
    if (!$tableExists) {
        echo json_encode([
            'success' => false,
            'error' => 'Gallery table does not exist',
            'action' => 'Run database setup first'
        ]);
        exit;
    }
    
    // Check current gallery count
    $countStmt = $db->query("SELECT COUNT(*) FROM gallery");
    $currentCount = $countStmt->fetchColumn();
    
    // If gallery is empty, add sample images
    if ($currentCount == 0) {
        $images = [
            [
                'url' => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
                'title' => 'Adorable Little Explorer',
                'description' => 'Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel with those sparkling eyes and soft golden fur.',
                'order' => 1
            ],
            [
                'url' => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
                'title' => 'Cozy Comfort Time',
                'description' => 'Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket at PETEL, where every pet feels at home.',
                'order' => 2
            ],
            [
                'url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
                'title' => 'Playtime Paradise',
                'description' => 'Happy tails and joyful moments! Our guests enjoying their favorite activities in our spacious play areas designed for maximum fun and safety.',
                'order' => 3
            ],
            [
                'url' => 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
                'title' => 'Luxury Pet Suites',
                'description' => 'Premium comfort for your beloved companions. Our luxury suites feature plush bedding, climate control, and all the amenities your pet deserves.',
                'order' => 4
            ],
            [
                'url' => 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
                'title' => 'Professional Care Team',
                'description' => 'Expert care with a personal touch. Our trained staff ensures every pet receives individual attention, love, and professional grooming services.',
                'order' => 5
            ],
            [
                'url' => 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80',
                'title' => 'Happy & Healthy',
                'description' => 'Bright smiles and wagging tails! We maintain the highest standards of cleanliness and health protocols to keep your furry friends happy and safe.',
                'order' => 6
            ]
        ];
        
        $stmt = $db->prepare("
            INSERT INTO gallery (image_url, title, description, display_order, is_active, created_at) 
            VALUES (:url, :title, :description, :order, true, NOW())
        ");
        
        $inserted = 0;
        foreach ($images as $img) {
            $stmt->execute([
                ':url' => $img['url'],
                ':title' => $img['title'],
                ':description' => $img['description'],
                ':order' => $img['order']
            ]);
            $inserted++;
        }
        
        echo json_encode([
            'success' => true,
            'message' => "Added {$inserted} images to gallery",
            'images_added' => $inserted,
            'previous_count' => $currentCount
        ]);
    } else {
        // Gallery has images, just return them
        $stmt = $db->query("SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC");
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Gallery already has images',
            'count' => count($images),
            'images' => $images
        ]);
    }
    
} catch (Exception $e) {
    error_log("Gallery test error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
