-- Add More Pricing Packages to PETEL Database
-- Run this if you already have the database set up and want to add more packages

USE petel_db;

-- Clear existing pricing (optional - comment out if you want to keep existing)
-- DELETE FROM pricing;

-- Insert Comprehensive Pricing Packages
INSERT INTO pricing (service_name, service_type, price, description, is_active) VALUES

-- Additional Boarding Packages
('VIP Boarding', 'boarding', 1599.00, 'Exclusive suite with 24/7 camera access and spa treatment', 1),
('Basic Boarding - Weekly', 'boarding', 3199.00, '7 days basic boarding package (Save ₹294)', 1),
('Standard Boarding - Weekly', 'boarding', 5199.00, '7 days standard boarding package (Save ₹394)', 1),
('Premium Boarding - Weekly', 'boarding', 7999.00, '7 days premium boarding package (Save ₹394)', 1),
('Basic Boarding - Monthly', 'boarding', 12999.00, '30 days basic boarding package (Save ₹2,971)', 1),
('Standard Boarding - Monthly', 'boarding', 21999.00, '30 days standard boarding package (Save ₹1,971)', 1),

-- Additional Daycare Packages
('Daycare - 5 Days Package', 'daycare', 1799.00, '5 days daycare package (Save ₹196)', 1),
('Daycare - 10 Days Package', 'daycare', 3499.00, '10 days daycare package (Save ₹491)', 1),

-- Additional Grooming Packages
('Standard Grooming', 'grooming', 599.00, 'Basic grooming plus teeth brushing and paw care', 1),
('Deluxe Grooming', 'grooming', 999.00, 'Premium grooming plus spa treatment and aromatherapy', 1),
('Grooming - Monthly Package', 'grooming', 1499.00, 'Monthly grooming package (2 sessions, Save ₹299)', 1),

-- Additional Transportation Services
('Pick-up & Drop - Extended', 'pickup', 499.00, 'Round trip service 10-20km', 1),

-- Training Services (NEW)
('Pet Training - Basic', 'training', 2999.00, '5 sessions basic obedience training', 1),
('Pet Training - Advanced', 'training', 4999.00, '10 sessions advanced training', 1),

-- Veterinary Services (NEW)
('Veterinary Checkup', 'veterinary', 599.00, 'Basic health checkup and consultation', 1),
('Emergency Care', 'veterinary', 1499.00, '24/7 emergency veterinary care', 1),

-- Combo Packages (NEW)
('Boarding + Grooming Combo', 'combo', 1499.00, '3 days boarding + basic grooming (Save ₹296)', 1),
('Weekly Care Package', 'combo', 5999.00, '7 days boarding + grooming + pickup/drop (Save ₹746)', 1),
('Premium Monthly Package', 'combo', 24999.00, '30 days premium boarding + 2 grooming + transport (Save ₹3,996)', 1);

-- Verify insertion
SELECT COUNT(*) as total_packages FROM pricing WHERE is_active = 1;
SELECT service_type, COUNT(*) as count FROM pricing WHERE is_active = 1 GROUP BY service_type;
