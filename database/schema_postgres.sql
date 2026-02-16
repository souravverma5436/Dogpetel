-- PETEL Database Schema for PostgreSQL (Render)
-- PostgreSQL Database for Pet Hotel Management System

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
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
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    special_requirements TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_booking ON appointments(booking_id);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_dates ON appointments(check_in, check_out);

-- Pricing Table
CREATE TABLE IF NOT EXISTS pricing (
    id SERIAL PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pricing_pet_type ON pricing(pet_type);
CREATE INDEX IF NOT EXISTS idx_pricing_popular ON pricing(is_popular);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    pet_name VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Gallery Table
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

-- Insert Pricing Packages
INSERT INTO pricing (package_name, pet_type, duration, price, features, is_popular, display_order) VALUES
-- Dog Packages
('Basic Care', 'dog', 'Per Day', 500.00, 'Daily walks, Basic grooming, Regular feeding, Clean accommodation', false, 1),
('Standard Care', 'dog', 'Per Day', 800.00, 'Multiple walks, Basic grooming, Premium food, Spacious room, Play time', true, 2),
('Premium Care', 'dog', 'Per Day', 1200.00, 'Unlimited walks, Full grooming, Gourmet meals, Luxury suite, Personal attention, Training sessions', false, 3),
('Weekly Basic', 'dog', 'Per Week', 3000.00, 'All Basic Care features, 7 days accommodation, Weekly health check', false, 4),
('Weekly Standard', 'dog', 'Per Week', 5000.00, 'All Standard Care features, 7 days accommodation, Vet consultation, Photo updates', true, 5),
('Weekly Premium', 'dog', 'Per Week', 7500.00, 'All Premium Care features, 7 days accommodation, Daily vet check, Video calls, Spa treatment', false, 6),
('Monthly Basic', 'dog', 'Per Month', 12000.00, 'All Basic Care features, 30 days accommodation, Bi-weekly health check, Vaccination reminder', false, 7),
('Monthly Standard', 'dog', 'Per Month', 18000.00, 'All Standard Care features, 30 days accommodation, Weekly vet visits, Training program, Photo album', true, 8),
('Monthly Premium', 'dog', 'Per Month', 28000.00, 'All Premium Care features, 30 days accommodation, Daily health monitoring, Personal trainer, Spa package, Video diary', false, 9),
('Daycare', 'dog', 'Per Day', 400.00, 'Drop-off and pick-up, Supervised play, Feeding, Basic care', false, 10),
('Grooming Only', 'dog', 'Per Session', 600.00, 'Bath, Haircut, Nail trimming, Ear cleaning', false, 11),

-- Cat Packages
('Basic Care', 'cat', 'Per Day', 400.00, 'Daily care, Litter maintenance, Regular feeding, Clean space', false, 12),
('Standard Care', 'cat', 'Per Day', 650.00, 'Enhanced care, Premium litter, Quality food, Comfortable room, Play time', true, 13),
('Premium Care', 'cat', 'Per Day', 950.00, 'Luxury care, Premium litter, Gourmet meals, Private suite, Personal attention, Enrichment activities', false, 14),
('Weekly Basic', 'cat', 'Per Week', 2500.00, 'All Basic Care features, 7 days accommodation, Weekly health check', false, 15),
('Weekly Standard', 'cat', 'Per Week', 4000.00, 'All Standard Care features, 7 days accommodation, Vet consultation, Photo updates', true, 16),
('Weekly Premium', 'cat', 'Per Week', 6000.00, 'All Premium Care features, 7 days accommodation, Daily vet check, Video calls, Spa treatment', false, 17),
('Monthly Basic', 'cat', 'Per Month', 10000.00, 'All Basic Care features, 30 days accommodation, Bi-weekly health check, Vaccination reminder', false, 18),
('Monthly Standard', 'cat', 'Per Month', 15000.00, 'All Standard Care features, 30 days accommodation, Weekly vet visits, Enrichment program, Photo album', true, 19),
('Monthly Premium', 'cat', 'Per Month', 23000.00, 'All Premium Care features, 30 days accommodation, Daily health monitoring, Personal caretaker, Spa package, Video diary', false, 20),
('Daycare', 'cat', 'Per Day', 350.00, 'Drop-off and pick-up, Supervised time, Feeding, Basic care', false, 21),
('Grooming Only', 'cat', 'Per Session', 500.00, 'Bath, Brushing, Nail trimming, Ear cleaning', false, 22),

-- Bird Packages
('Basic Care', 'bird', 'Per Day', 300.00, 'Daily care, Cage cleaning, Regular feeding, Fresh water', false, 23),
('Standard Care', 'bird', 'Per Day', 500.00, 'Enhanced care, Premium food, Spacious cage, Social time', true, 24),
('Premium Care', 'bird', 'Per Day', 750.00, 'Luxury care, Gourmet diet, Large aviary, Personal attention, Enrichment', false, 25),
('Weekly Basic', 'bird', 'Per Week', 1800.00, 'All Basic Care features, 7 days accommodation, Weekly health check', false, 26),
('Weekly Standard', 'bird', 'Per Week', 3000.00, 'All Standard Care features, 7 days accommodation, Vet consultation, Photo updates', true, 27),
('Weekly Premium', 'bird', 'Per Week', 4500.00, 'All Premium Care features, 7 days accommodation, Daily vet check, Video calls', false, 28),
('Monthly Basic', 'bird', 'Per Month', 7000.00, 'All Basic Care features, 30 days accommodation, Bi-weekly health check', false, 29),
('Monthly Standard', 'bird', 'Per Month', 11000.00, 'All Standard Care features, 30 days accommodation, Weekly vet visits, Photo album', true, 30),
('Monthly Premium', 'bird', 'Per Month', 17000.00, 'All Premium Care features, 30 days accommodation, Daily health monitoring, Video diary', false, 31),
('Daycare', 'bird', 'Per Day', 250.00, 'Drop-off and pick-up, Supervised time, Feeding, Basic care', false, 32),
('Grooming Only', 'bird', 'Per Session', 400.00, 'Nail trimming, Beak care, Feather check', false, 33);

-- Insert Sample Testimonials
INSERT INTO testimonials (customer_name, pet_name, rating, review, is_featured) VALUES
('Priya Sharma', 'Bruno', 5, 'Excellent service! My dog was so happy and well taken care of. The staff is very professional and caring. Highly recommended!', true),
('Rahul Verma', 'Whiskers', 5, 'Best pet hotel in the city! My cat received amazing care and I got daily photo updates. Will definitely come back!', true),
('Anjali Patel', 'Milo', 5, 'Outstanding facility and caring staff. My pet was treated like family. Thank you PETEL for the wonderful service!', true);

-- Insert Default Settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'PETEL - A Pet Hotel'),
('contact_email', 'komal@petel.com'),
('contact_phone', '+918283883463'),
('business_hours', 'Mon-Sun: 24/7 Available'),
('address', 'Your Address Here');
