<?php
// Fix All Missing Tables - Run once to create all required tables
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/database.php';

$results = [];

try {
    $db = getDB();

    // 1. Create pricing table
    $db->exec("CREATE TABLE IF NOT EXISTS pricing (
        id SERIAL PRIMARY KEY,
        package_name VARCHAR(255) NOT NULL,
        pet_type VARCHAR(50) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        features TEXT,
        is_popular BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    $results[] = 'pricing table: OK';

    // 2. Create testimonials table
    $db->exec("CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        pet_name VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review TEXT NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    $results[] = 'testimonials table: OK';

    // 3. Create gallery table
    $db->exec("CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255),
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    $results[] = 'gallery table: OK';

    // 4. Create contacts table
    $db->exec("CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    $results[] = 'contacts table: OK';

    // 5. Create appointments table
    $db->exec("CREATE TABLE IF NOT EXISTS appointments (
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
        status VARCHAR(20) DEFAULT 'pending',
        actual_pickup_datetime TIMESTAMP,
        late_days INTEGER DEFAULT 0,
        late_charges DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    $results[] = 'appointments table: OK';

    // 6. Create settings table
    $db->exec("CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    $results[] = 'settings table: OK';

    // Check if pricing has data
    $count = $db->query("SELECT COUNT(*) FROM pricing")->fetchColumn();
    if ($count == 0) {
        $db->exec("INSERT INTO pricing (package_name, pet_type, duration, price, features, is_popular, display_order) VALUES
        ('Basic Care', 'dog', 'Per Day', 500.00, 'Daily walks, Basic grooming, Regular feeding, Clean accommodation', false, 1),
        ('Standard Care', 'dog', 'Per Day', 800.00, 'Multiple walks, Basic grooming, Premium food, Spacious room, Play time', true, 2),
        ('Premium Care', 'dog', 'Per Day', 1200.00, 'Unlimited walks, Full grooming, Gourmet meals, Luxury suite, Personal attention', false, 3),
        ('Weekly Basic', 'dog', 'Per Week', 3000.00, 'All Basic Care features, 7 days accommodation, Weekly health check', false, 4),
        ('Weekly Standard', 'dog', 'Per Week', 5000.00, 'All Standard Care features, 7 days accommodation, Vet consultation', true, 5),
        ('Weekly Premium', 'dog', 'Per Week', 7500.00, 'All Premium Care features, 7 days accommodation, Daily vet check', false, 6),
        ('Monthly Basic', 'dog', 'Per Month', 12000.00, 'All Basic Care features, 30 days accommodation, Bi-weekly health check', false, 7),
        ('Monthly Standard', 'dog', 'Per Month', 18000.00, 'All Standard Care features, 30 days accommodation, Weekly vet visits', true, 8),
        ('Monthly Premium', 'dog', 'Per Month', 28000.00, 'All Premium Care features, 30 days accommodation, Daily health monitoring', false, 9),
        ('Daycare', 'dog', 'Per Day', 400.00, 'Drop-off and pick-up, Supervised play, Feeding, Basic care', false, 10),
        ('Basic Care', 'cat', 'Per Day', 400.00, 'Daily care, Litter maintenance, Regular feeding, Clean space', false, 11),
        ('Standard Care', 'cat', 'Per Day', 650.00, 'Enhanced care, Premium litter, Quality food, Comfortable room', true, 12),
        ('Premium Care', 'cat', 'Per Day', 950.00, 'Luxury care, Premium litter, Gourmet meals, Private suite', false, 13),
        ('Weekly Basic', 'cat', 'Per Week', 2500.00, 'All Basic Care features, 7 days accommodation', false, 14),
        ('Weekly Standard', 'cat', 'Per Week', 4000.00, 'All Standard Care features, 7 days accommodation', true, 15),
        ('Weekly Premium', 'cat', 'Per Week', 6000.00, 'All Premium Care features, 7 days accommodation', false, 16),
        ('Basic Care', 'bird', 'Per Day', 300.00, 'Daily care, Cage cleaning, Regular feeding, Fresh water', false, 17),
        ('Standard Care', 'bird', 'Per Day', 500.00, 'Enhanced care, Premium food, Spacious cage, Social time', true, 18),
        ('Premium Care', 'bird', 'Per Day', 750.00, 'Luxury care, Gourmet diet, Large aviary, Personal attention', false, 19)");
        $results[] = 'pricing data: 19 packages inserted';
    } else {
        $results[] = "pricing data: already has $count records";
    }

    // Check if testimonials has data
    $count = $db->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
    if ($count == 0) {
        $db->exec("INSERT INTO testimonials (customer_name, pet_name, rating, review, is_featured) VALUES
        ('Priya Sharma', 'Bruno', 5, 'Excellent service! My dog was so happy and well taken care of. The staff is very professional and caring. Highly recommended!', true),
        ('Rahul Verma', 'Whiskers', 5, 'Best pet hotel in the city! My cat received amazing care and I got daily photo updates. Will definitely come back!', true),
        ('Anjali Patel', 'Milo', 5, 'Outstanding facility and caring staff. My pet was treated like family. Thank you PETEL for the wonderful service!', true)");
        $results[] = 'testimonials data: 3 records inserted';
    } else {
        $results[] = "testimonials data: already has $count records";
    }

    // Final check - count all tables
    $tables = ['pricing', 'testimonials', 'gallery', 'contacts', 'appointments', 'settings'];
    $counts = [];
    foreach ($tables as $table) {
        $counts[$table] = $db->query("SELECT COUNT(*) FROM $table")->fetchColumn();
    }

    echo json_encode([
        'success' => true,
        'message' => 'All tables created and data seeded successfully!',
        'steps' => $results,
        'table_counts' => $counts
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'completed_steps' => $results
    ], JSON_PRETTY_PRINT);
}
