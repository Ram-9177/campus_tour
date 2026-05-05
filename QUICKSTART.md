# SMRU Campus Tour - Quick Start Guide

Get started with SMRU Campus Tour in 5 minutes!

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## Installation (5 minutes)

### 1. Clone and Setup
```bash
# Navigate to project (if not already there)
cd campus-tour

# Install dependencies
npm install
```

### 2. Start Development Server
```bash
# Start dev server
npm run dev
```

Open your browser to **[http://localhost:3000](http://localhost:3000)**

That's it! 🎉

## What You Get

✅ **Homepage** - Interactive welcome page with tour options  
✅ **Interactive Tour** - 6-stop guided campus tour with progress tracking  
✅ **Buildings Directory** - 6 campus buildings with details  
✅ **Facilities Guide** - 10+ campus facilities and amenities  
✅ **Campus Directions** - Navigation between locations  
✅ **About Page** - App information and features  
✅ **Offline Support** - Works without internet  
✅ **Mobile-First Design** - Perfect on phones and tablets  

## Project Structure

```
📁 app/              → Pages and routes
📁 components/       → Reusable UI components
📁 lib/              → Utility functions
📁 types/            → TypeScript types
📁 public/           → Static files, PWA config
📄 next.config.js    → Next.js configuration
📄 tailwind.config.ts → Styling configuration
```

## Available Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## Customize Your App

### Change App Name
Edit `app/layout.tsx`:
```typescript
const APP_NAME = 'Your App Name';
const APP_URL = 'https://your-domain.com';
```

### Update Colors
Edit `app/globals.css`:
```css
:root {
  --primary: #667eea;        /* Primary color */
  --primary-dark: #764ba2;   /* Dark variant */
  --secondary: #f3f4f6;      /* Secondary color */
}
```

### Add Icons
1. Create PNG icons (192x192, 512x512)
2. Place in `public/icons/`
3. Update `public/manifest.json` with paths

### Add New Pages
1. Create directory: `mkdir app/my-page`
2. Create file: `touch app/my-page/page.tsx`
3. Add content from existing page (copy structure)
4. Link from other pages

## Testing

### Test Offline
1. Open DevTools (F12)
2. Network tab → Offline
3. App continues to work!

### Test Mobile
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Open from phone on same network
http://YOUR_IP:3000
```

### Test PWA Installation
1. On mobile, open the app
2. Look for "Install" button or menu option
3. Tap to install as home screen app

## Build for Production

```bash
# Build optimized version
npm run build

# Test production build
npm start
```

## Deploy (Choose One)

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Push to GitHub
2. Connect at [netlify.com](https://netlify.com)
3. Auto-deploys on git push

### Your Own Server
```bash
npm run build
npm start  # Runs on port 3000
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clear build cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Service Worker Issues
- Clear browser cache (Cmd/Ctrl + Shift + Delete)
- Hard reload (Cmd/Ctrl + Shift + R)
- Check DevTools Application tab

## Next Steps

1. ✅ **Customize** - Update app name, colors, and icons
2. ✅ **Modify Content** - Update building and facility information
3. ✅ **Test Thoroughly** - Test on mobile and offline
4. ✅ **Deploy** - Deploy to production
5. ✅ **Share QR Code** - Use `tour.smru.edu.in` or your domain

## Documentation

- **[README.md](./README.md)** - Full documentation
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Developer guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical details

## File Locations Cheat Sheet

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage |
| `app/layout.tsx` | Root layout & PWA config |
| `app/globals.css` | Global styles |
| `components/PWAInstallPrompt.tsx` | Install prompt UI |
| `public/manifest.json` | PWA metadata |
| `public/sw.js` | Service worker (offline) |
| `lib/constants.ts` | App constants |
| `next.config.js` | Build configuration |

## Key Features

🚀 **Fast** - Optimized performance  
📱 **Mobile-First** - Perfect on phones  
📡 **Offline** - Works without internet  
🎨 **Beautiful** - Modern design with dark mode  
♿ **Accessible** - For everyone  
🔒 **Secure** - Privacy-first approach  
⚡ **Installable** - Add to home screen  

## Get Help

1. Check [Next.js Docs](https://nextjs.org/docs)
2. Read [DEVELOPMENT.md](./DEVELOPMENT.md)
3. Review code comments
4. Check [browser console](devtools) for errors

## What's Next?

After setup:
1. Explore the code
2. Modify content
3. Test on mobile
4. Deploy to production
5. Share with users

---

**Version**: 1.0.0  
**Ready to Use**: Yes ✓  
**Time to Deploy**: ~15 minutes  

**Happy coding! 🚀**
