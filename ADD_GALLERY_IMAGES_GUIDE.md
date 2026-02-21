# How to Add Your Dog Images to Gallery

## Step 1: Upload Images to Image Hosting

You need to upload your images to a free image hosting service first. Here are two recommended options:

### Option A: Imgur (Recommended - Easy & Free)
1. Go to https://imgur.com/upload
2. Click "New post" or drag and drop your images
3. Upload both dog images
4. After upload, right-click each image and select "Copy image address"
5. Save these URLs

### Option B: Cloudinary (Professional)
1. Sign up at https://cloudinary.com (free tier available)
2. Upload your images
3. Copy the image URLs from the dashboard

## Step 2: Add Images via Admin Panel

1. Go to https://dogpetel.vercel.app/admin
2. Login with password: `komal123`
3. Click on the "Gallery" tab
4. For each image, fill in the form:

### Image 1 (White Dog with Blue Blanket):
- **Image URL**: [Paste the Imgur/Cloudinary URL here]
- **Title**: Cozy Comfort Time
- **Description**: Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket at PETEL.

### Image 2 (Fluffy Brown Puppy):
- **Image URL**: [Paste the Imgur/Cloudinary URL here]
- **Title**: Adorable Little Explorer
- **Description**: Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel.

5. Click "Add Image" for each one

## Alternative: Direct Database Insert

If you prefer to add them directly to the database, use the Render PostgreSQL dashboard:

1. Go to https://dashboard.render.com
2. Select your PostgreSQL database
3. Go to the "Shell" or "Query" tab
4. Run these SQL commands (replace the URLs first):

```sql
-- Image 1
INSERT INTO gallery (image_url, title, description, is_active, created_at) 
VALUES (
  'YOUR_IMGUR_URL_FOR_IMAGE_1',
  'Cozy Comfort Time',
  'Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket at PETEL.',
  true,
  NOW()
);

-- Image 2
INSERT INTO gallery (image_url, title, description, is_active, created_at) 
VALUES (
  'YOUR_IMGUR_URL_FOR_IMAGE_2',
  'Adorable Little Explorer',
  'Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel.',
  true,
  NOW()
);
```

## Quick Imgur Upload Steps:

1. Open https://imgur.com/upload in your browser
2. Drag both images to the upload area
3. Wait for upload to complete
4. For each image:
   - Right-click on the image
   - Select "Copy image address" (or "Copy image location")
   - The URL will look like: `https://i.imgur.com/XXXXX.jpg`
5. Use these URLs in the admin panel

## Beautiful Descriptions Provided:

### Image 1 Description:
"Wrapped in warmth and love! Our furry friend enjoying a peaceful moment in their favorite cozy blanket at PETEL."

### Image 2 Description:
"Meet our precious little guest! This fluffy bundle of joy loves exploring every corner of our pet hotel."

## Tips:
- Make sure the image URLs end with `.jpg`, `.png`, or `.jpeg`
- Test the URL by pasting it in a browser - it should show just the image
- Images will appear on the Gallery page immediately after adding
- You can hide/show or delete images anytime from the admin panel

---

**Need Help?**
If you have any issues uploading or adding images, let me know!
