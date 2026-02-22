<?php
// Script to add dog images to gallery
// Run this once: https://dogpetel.onrender.com/api/add-dog-images.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    // Image 1: Fluffy brown puppy
    $image1 = [
        'image_url' => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
        'title' => 'Adorable Little Explorer',
        'description' => 'Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel with those sparkling eyes and soft golden fur.',
        'display_order' => 1
    ];
    
    // Image 2: White dog with blue blanket
    $image2 = [
        'image_url' => 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
        'title' => 'Cozy Comfort Time',
        'description' => 'Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket at PETEL, where every pet feels at home.',
        'display_order' => 2
    ];
    
    // Additional themed images
    $image3 = [
        'image_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
        'title' => 'Playtime Paradise',
        'description' => 'Happy tails and joyful moments! Our guests enjoying their favorite activities in our spacious play areas designed for maximum fun and safety.',
        'display_order' => 3
    ];
    
    $image4 = [
        'image_url' => 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
        'title' => 'Luxury Pet Suites',
        'description' => 'Premium comfort for your beloved companions. Our luxury suites feature plush bedding, climate control, and all the amenities your pet deserves.',
        'display_order' => 4
    ];
    
    $image5 = [
        'image_url' => 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
        'title' => 'Professional Care Team',
        'description' => 'Expert care with a personal touch. Our trained staff ensures every pet receives individual attention, love, and professional grooming services.',
        'display_order' => 5
    ];
    
    $image6 = [
        'image_url' => 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80',
        'title' => 'Happy & Healthy',
        'description' => 'Bright smiles and wagging tails! We maintain the highest standards of cleanliness and health protocols to keep your furry friends happy and safe.',
        'display_order' => 6
    ];
    
    $images = [$image1, $image2, $image3, $image4, $image5, $image6];
    
    $inserted = 0;
    
    foreach ($images as $image) {
        $stmt = $db->prepare("
            INSERT INTO gallery (image_url, title, description, display_order, is_active, created_at) 
            VALUES (:image_url, :title, :description, :display_order, true, NOW())
        ");
        
        $stmt->execute([
            ':image_url' => $image['image_url'],
            ':title' => $image['title'],
            ':description' => $image['description'],
            ':display_order' => $image['display_order']
        ]);
        
        $inserted++;
    }
    
    echo json_encode([
        'success' => true,
        'message' => "Successfully added {$inserted} images to gallery!",
        'images_added' => $inserted
    ]);
    
} catch (Exception $e) {
    error_log("Error adding images: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to add images: ' . $e->getMessage()
    ]);
}
