-- PETEL Database Schema for Railway
-- MySQL Database for Pet Hotel Management System

USE railway;

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pet_name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50) NOT NULL,
    breed VARCHAR(255) DEFAULT NULL,
    age VARCHAR(50) DEFAULT NULL,
    service VARCHAR(100) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    notes TEXT DEFAULT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
    razorpay_payment_id VARCHAR(255) DEFAULT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    late_days INT DEFAULT 0,
    late_charges DECIMAL(10,2) DEFAULT 0.00,
    actual_pickup_datetime DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_booking_id (booking_id),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_booking_date (booking_date),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pricing Table
CREATE TABLE IF NOT EXISTS pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_type (service_type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Pricing
INSERT INTO pricing (service_name, service_type, price, description) VALUES
-- Boarding Packages
('Basic Boarding', 'boarding', 499.00, 'Comfortable stay with basic amenities, regular feeding, and daily walks'),
('Standard Boarding', 'boarding', 799.00, 'Enhanced care with playtime, treats, and photo updates'),
('Premium Boarding', 'boarding', 1199.00, 'Luxury suite with personalized attention and premium food'),
('VIP Boarding', 'boarding', 1599.00, 'Exclusive suite with 24/7 camera access and spa treatment'),

-- Weekly Boarding Packages (Discounted)
('Basic Boarding - Weekly', 'boarding', 3199.00, '7 days basic boarding package (Save ₹294)'),
('Standard Boarding - Weekly', 'boarding', 5199.00, '7 days standard boarding package (Save ₹394)'),
('Premium Boarding - Weekly', 'boarding', 7999.00, '7 days premium boarding package (Save ₹394)'),

-- Monthly Boarding Packages (Best Value)
('Basic Boarding - Monthly', 'boarding', 12999.00, '30 days basic boarding package (Save ₹2,971)'),
('Standard Boarding - Monthly', 'boarding', 21999.00, '30 days standard boarding package (Save ₹1,971)'),

-- Daycare Packages
('Full Day Daycare', 'daycare', 399.00, 'Full day care and supervision (8 hours)'),
('Half Day Daycare', 'daycare', 249.00, 'Half day care (up to 4 hours)'),
('Daycare - 5 Days Package', 'daycare', 1799.00, '5 days daycare package (Save ₹196)'),
('Daycare - 10 Days Package', 'daycare', 3499.00, '10 days daycare package (Save ₹491)'),

-- Grooming Packages
('Basic Grooming', 'grooming', 399.00, 'Bath, brush, nail trim, and ear cleaning'),
('Standard Grooming', 'grooming', 599.00, 'Basic grooming plus teeth brushing and paw care'),
('Premium Grooming', 'grooming', 799.00, 'Full grooming with styling and conditioning treatment'),
('Deluxe Grooming', 'grooming', 999.00, 'Premium grooming plus spa treatment and aromatherapy'),
('Grooming - Monthly Package', 'grooming', 1499.00, 'Monthly grooming package (2 sessions, Save ₹299)'),

-- Transportation Services
('Pick-up Service', 'pickup', 199.00, 'One-way pick-up service within 10km'),
('Drop Service', 'pickup', 199.00, 'One-way drop service within 10km'),
('Pick-up & Drop', 'pickup', 349.00, 'Round trip service within 10km (Save ₹49)'),
('Pick-up & Drop - Extended', 'pickup', 499.00, 'Round trip service 10-20km'),

-- Special Services
('Pet Training - Basic', 'training', 2999.00, '5 sessions basic obedience training'),
('Pet Training - Advanced', 'training', 4999.00, '10 sessions advanced training'),
('Veterinary Checkup', 'veterinary', 599.00, 'Basic health checkup and consultation'),
('Emergency Care', 'veterinary', 1499.00, '24/7 emergency veterinary care'),

-- Combo Packages
('Boarding + Grooming Combo', 'combo', 1499.00, '3 days boarding + basic grooming (Save ₹296)'),
('Weekly Care Package', 'combo', 5999.00, '7 days boarding + grooming + pickup/drop (Save ₹746)'),
('Premium Monthly Package', 'combo', 24999.00, '30 days premium boarding + 2 grooming + transport (Save ₹3,996)');

-- Insert Default Settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('late_pickup_enabled', 'true', 'Enable late pickup charges'),
('late_pickup_rule', 'same_as_package', 'Late pickup charge rule: same_as_package or custom'),
('late_pickup_custom_charge', '500', 'Custom late pickup charge per day (if rule is custom)');

-- Sample Testimonials (Optional - can be managed via admin later)
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    pet_name VARCHAR(255) DEFAULT NULL,
    rating INT DEFAULT 5,
    review TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Testimonials
INSERT INTO testimonials (customer_name, pet_name, rating, review) VALUES
('Priya Sharma', 'Bruno', 5, 'PETEL took amazing care of Bruno during our vacation. He came back happy and healthy. Highly recommend!'),
('Rahul Verma', 'Bella', 5, 'Professional service and genuine care for pets. Komal is wonderful and keeps you updated 24/7.'),
('Anjali Patel', 'Max', 5, 'Best pet boarding experience! Clean facility, loving staff, and reasonable prices. Max loves staying here!');
