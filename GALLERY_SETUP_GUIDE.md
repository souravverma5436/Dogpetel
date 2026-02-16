# Gallery Feature Setup Guide

## What's Been Added

✅ **Gallery Page** - New public gallery page at `/gallery`
✅ **Admin Gallery Management** - Full control to add/delete/hide images
✅ **Instagram Integration** - Instagram link added to footer and gallery page
✅ **Database Table** - New `gallery` table in PostgreSQL

## Setup Steps

### 1. Update Database (IMPORTANT - Do this first!)

Visit this URL to add the gallery table to your database:
```
https://dogpetel.onrender.com/api/add-gallery-table.php
```

You should see:
```json
{
  "success": true,
  "message": "Gallery table created successfully!"
}
```

### 2. Wait for Deployments

- **Vercel** (Frontend): Will auto-deploy in 1-2 minutes
- **Render** (Backend): Will auto-deploy in 3-5 minutes

Check deployment status:
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com

### 3. Access Gallery Features

**Public Gallery Page:**
- URL: https://dogpetel.vercel.app/gallery
- Shows all active images
- Instagram link prominently displayed

**Admin Gallery Management:**
1. Login to admin: https://dogpetel.vercel.app/admin
2. Password: `komal123`
3. Click "Gallery" tab
4. Add/manage images

## How to Add Images

### Option 1: Using Imgur (Easiest - Free)

1. Go to https://imgur.com/upload
2. Upload your image (no account needed)
3. Right-click the uploaded image → "Copy image address"
4. Paste URL in admin panel

### Option 2: Using Cloudinary (Professional)

1. Sign up at https://cloudinary.com (free tier available)
2. Upload images to your media library
3. Copy the image URL
4. Paste in admin panel

### Option 3: Using GitHub (For this project)

1. Create a folder: `client/public/gallery/`
2. Add images there
3. Use URL: `/gallery/image-name.jpg`
4. Commit and push to GitHub

## Admin Gallery Features

### Add Image
- **Image URL**: Required - paste the hosted image URL
- **Title**: Optional - shown on hover
- **Description**: Optional - shown in lightbox

### Manage Images
- **Show/Hide**: Toggle image visibility without deleting
- **Delete**: Permanently remove image
- **Order**: Images display in order added (newest first)

## Instagram Integration

Instagram link added to:
- Footer (all pages)
- Gallery page header
- Config file: `client/src/config.js`

Instagram URL: https://www.instagram.com/petel_a_doghotel

## Testing

1. **Check Gallery Page**: https://dogpetel.vercel.app/gallery
2. **Check Instagram Link**: Click Instagram button in footer
3. **Test Admin**: Add a test image using Imgur
4. **Test Visibility**: Hide/show images from admin

## Troubleshooting

### Gallery table not found
- Run: https://dogpetel.onrender.com/api/add-gallery-table.php

### Images not showing
- Check if images are marked as "active" in admin
- Verify image URLs are accessible (open in browser)

### Can't add images
- Make sure you're logged in as admin
- Check that image URL is valid and accessible

## Image Recommendations

- **Format**: JPG or PNG
- **Size**: Max 2MB for fast loading
- **Dimensions**: 1200x1200px or similar (square works best)
- **Content**: Happy pets, facilities, staff with pets

## Next Steps

1. Run the database migration URL
2. Wait for deployments to complete
3. Login to admin and add your first image
4. Share your gallery page with customers!

---

**Need Help?**
- Check Render logs: https://dashboard.render.com
- Check Vercel logs: https://vercel.com/dashboard
- Test API: https://dogpetel.onrender.com/api/gallery.php
