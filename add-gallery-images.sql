-- Add gallery images with descriptions
-- Note: You need to upload these images to Imgur or Cloudinary first and replace the URLs below

-- Image 1: White dog with blue blanket
INSERT INTO gallery (image_url, title, description, is_active, created_at) 
VALUES (
  'YOUR_IMAGE_URL_1_HERE',
  'Cozy Comfort Time',
  'Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket at PETEL.',
  true,
  NOW()
);

-- Image 2: Fluffy brown puppy
INSERT INTO gallery (image_url, title, description, is_active, created_at) 
VALUES (
  'YOUR_IMAGE_URL_2_HERE',
  'Adorable Little Explorer',
  'Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel.',
  true,
  NOW()
);
