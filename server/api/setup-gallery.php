<?php
// Simple Gallery Setup - Run this once to add images
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    // Delete any existing images first
    $db->exec("DELETE FROM gallery");
    
    // Add 6 beautiful images
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
    
    // Verify insertion
    $checkStmt = $db->query("SELECT COUNT(*) FROM gallery WHERE is_active = true");
    $totalActive = $checkStmt->fetchColumn();
    
    echo json_encode([
        'success' => true,
        'message' => "Successfully added {$count} images to gallery!",
        'images_added' => $count,
        'total_active' => $totalActive,
        'note' => 'Gallery is now ready. Visit /gallery to see the images.'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
