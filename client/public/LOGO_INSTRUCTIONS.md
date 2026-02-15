# PETEL Logo Setup Instructions

## Your Logo Has Been Integrated!

The website is now configured to display your PETEL logo in:
1. **Header** - Top navigation bar (all pages)
2. **Hero Section** - Home page main banner

---

## How to Add Your Logo

### Step 1: Save Your Logo
Save your PETEL logo image as:
```
client/public/logo.png
```

**Supported formats:**
- PNG (recommended - supports transparency)
- JPG/JPEG
- SVG (vector format)

### Step 2: File Naming
The code is already configured to look for `/logo.png`

If you want to use a different format:
- For JPG: Save as `logo.jpg` and update references
- For SVG: Save as `logo.svg` and update references

### Step 3: Update References (if not using PNG)

If using a different format, update these files:

**client/src/components/Header.jsx:**
```jsx
<img src="/logo.jpg" alt="PETEL Logo" className="logo-img" />
```

**client/src/pages/Home.jsx:**
```jsx
<img src="/logo.jpg" alt="PETEL - A Pet Hotel" className="hero-logo" />
```

---

## Logo Specifications

### Recommended Dimensions

**For Header:**
- Height: 60-80px
- Width: Auto (maintains aspect ratio)
- Format: PNG with transparent background

**For Hero Section:**
- Max Width: 400px
- Height: Auto
- Format: PNG with transparent background

### File Size
- Keep under 200KB for fast loading
- Optimize using tools like TinyPNG or ImageOptim

---

## Current Logo Styling

### Header Logo
- Height: 60px (50px on mobile)
- Positioned left side of header
- Next to "PETEL - A Pet Hotel" text
- Visible on all pages

### Hero Logo
- Max width: 400px (300px on tablet, 250px on mobile)
- Centered in hero section
- Animated with floating effect
- Responsive sizing

---

## Testing Your Logo

After adding your logo file:

1. Start the development server:
   ```bash
   cd client
   npm run dev
   ```

2. Open browser: http://localhost:5173

3. Check logo appears in:
   - Header (top left)
   - Home page hero section

4. Test on different screen sizes:
   - Desktop (1920px+)
   - Tablet (768px)
   - Mobile (375px)

---

## Troubleshooting

### Logo Not Showing
1. Check file name is exactly `logo.png`
2. Check file is in `client/public/` folder
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart dev server

### Logo Too Large/Small
Edit CSS in `client/src/components/Header.css`:
```css
.logo-img {
  height: 60px; /* Adjust this value */
  width: auto;
  object-fit: contain;
}
```

Edit CSS in `client/src/pages/Home.css`:
```css
.hero-logo {
  max-width: 400px; /* Adjust this value */
  width: 100%;
  height: auto;
  object-fit: contain;
}
```

### Logo Quality Issues
- Use PNG format with transparent background
- Ensure logo is high resolution (at least 2x display size)
- Use vector format (SVG) for best quality

---

## Alternative: Using Different Logo for Header vs Hero

If you want different logos in different places:

1. Save two versions:
   - `logo-header.png` (smaller, horizontal)
   - `logo-hero.png` (larger, square)

2. Update references:
   - Header: `<img src="/logo-header.png" ... />`
   - Hero: `<img src="/logo-hero.png" ... />`

---

## Production Deployment

When deploying to production:
1. Ensure logo file is included in build
2. Optimize logo file size
3. Test on production URL
4. Check HTTPS serving correctly

---

## Need Help?

Contact: Komal - +91 82838 83463

---

**Note:** The logo integration is complete. Simply add your `logo.png` file to `client/public/` and it will appear automatically!
