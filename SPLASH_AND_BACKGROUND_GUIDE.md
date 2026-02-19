# Splash Screen & HD Background Guide

## Splash Screen ✅ IMPLEMENTED

### Features
- Shows on first load and page refresh
- Duration: 2 seconds (0.5s for reduced-motion users)
- Displays your logo, "PETEL" text, and tagline
- Animated paw prints loader
- Smooth fade-in and fade-out
- Only shows once per session (uses sessionStorage)
- Respects prefers-reduced-motion setting

### Files Created
- `client/src/components/SplashScreen.jsx`
- `client/src/components/SplashScreen.css`
- Updated `client/src/App.jsx`

### How It Works
1. On first page load, splash screen appears
2. After 2 seconds, fades out smoothly
3. Main app loads
4. Navigation between pages doesn't show splash again
5. Refreshing the page shows splash again

## HD Dog Background - INSTRUCTIONS

### Option A: Hero Section Only (Recommended)

Add background to Home hero section only:

1. **Find a royalty-free HD dog image:**
   - Unsplash: https://unsplash.com/s/photos/happy-dog
   - Pexels: https://pexels.com/search/dog/
   - Pixabay: https://pixabay.com/images/search/dog/
   
   Search for: "happy dog", "golden retriever home", "dog portrait", "friendly dog"

2. **Download and optimize:**
   - Download in WebP format (or convert using https://squoosh.app)
   - Recommended size: 1920x1080px
   - File size: < 200KB after optimization

3. **Add to project:**
   ```bash
   # Place image in:
   client/public/hero-dog.webp
   ```

4. **Update Home.css:**
   ```css
   .hero {
     background: linear-gradient(
       135deg, 
       rgba(255, 248, 243, 0.95) 0%, 
       rgba(255, 245, 235, 0.9) 100%
     ),
     url('/hero-dog.webp');
     background-size: cover;
     background-position: center;
     background-attachment: fixed;
   }
   ```

### Option B: Global Background (All Pages)

Add to `client/src/index.css`:

```css
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(
      135deg, 
      rgba(255, 248, 243, 0.97) 0%, 
      rgba(255, 245, 235, 0.95) 100%
    ),
    url('/hero-dog.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  pointer-events: none;
  z-index: -1;
}
```

### Recommended Free Images

**Unsplash (Free for commercial use):**
1. Golden Retriever: https://unsplash.com/photos/golden-retriever-puppy
2. Happy Dog: https://unsplash.com/photos/short-coated-brown-dog
3. Dog Portrait: https://unsplash.com/photos/adult-yellow-labrador-retriever

**Pexels (Free for commercial use):**
1. Friendly Dog: https://www.pexels.com/photo/golden-retriever-dog-2253275/
2. Dog at Home: https://www.pexels.com/photo/dog-lying-on-floor-1458916/

### Image Requirements
- ✅ Royalty-free / Commercial use allowed
- ✅ High quality (1920x1080 or higher)
- ✅ WebP format for best performance
- ✅ File size < 200KB
- ✅ Shows friendly, happy dog
- ✅ Good for pet hotel brand
- ✅ Not too busy (text should be readable over it)

### Performance Tips
1. Use WebP format
2. Lazy load with `loading="lazy"`
3. Add blur placeholder while loading
4. Use responsive images for mobile
5. Compress images before upload

### Mobile Optimization
```css
@media (max-width: 768px) {
  .hero {
    background-attachment: scroll; /* Better performance on mobile */
    background-size: cover;
  }
}
```

## Testing Checklist
- [x] Splash screen appears on first load
- [x] Splash screen appears on refresh
- [x] Splash doesn't show during navigation
- [x] Animations are smooth
- [x] Reduced motion is respected
- [ ] Background image loads quickly
- [ ] Text is readable over background
- [ ] Mobile performance is good
- [ ] All pages look consistent

## Next Steps
1. ✅ Splash screen is ready and deployed
2. ⏳ Choose and download HD dog image
3. ⏳ Optimize image to WebP < 200KB
4. ⏳ Add to `client/public/hero-dog.webp`
5. ⏳ Update CSS with background
6. ⏳ Test on mobile and desktop
7. ⏳ Push changes to GitHub

## Files to Update for Background
- `client/public/hero-dog.webp` (new file - add your image)
- `client/src/pages/Home.css` (Option A)
- OR `client/src/index.css` (Option B)
