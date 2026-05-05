# SMRU Campus Tour - PWA

A mobile-first Progressive Web Application (PWA) for exploring SMRU Campus. Built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Features

- **📱 Mobile-First Design**: Optimized for smartphones and tablets
- **📡 Offline Support**: Full functionality without internet connection
- **🚀 Installable**: Add to home screen for app-like experience
- **🌙 Dark Mode**: Comfortable viewing in all lighting conditions
- **♿ Accessible**: Built with accessibility best practices
- **⚡ Fast**: Optimized performance with service workers
- **🔄 Real-time Updates**: Automatic cache updates

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **PWA**: Service Workers with Workbox
- **Deployment**: Ready for Vercel, Netlify, or self-hosted

## 📁 Project Structure

```
campus-tour/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with PWA meta
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Global styles
│   ├── tour/
│   │   └── page.tsx         # Interactive tour with progress tracking
│   ├── buildings/
│   │   └── page.tsx         # Campus buildings directory
│   ├── facilities/
│   │   └── page.tsx         # Facilities information
│   ├── directions/
│   │   └── page.tsx         # Navigation and directions
│   └── about/
│       └── page.tsx         # About SMRU and app information
├── components/
│   └── PWAInstallPrompt.tsx # PWA installation UI
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service worker
│   ├── offline.html        # Offline fallback page
│   └── icons/              # App icons (192x192, 512x512)
├── next.config.js          # Next.js configuration with PWA headers
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Navigate to the project**
   ```bash
   cd campus-tour
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📝 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit
```

## 🏗️ Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Test the production build locally**
   ```bash
   npm start
   ```

3. **Deploy** (see deployment section below)

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository directly at [vercel.com](https://vercel.com).

### Netlify

1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`

### Self-Hosted

```bash
# Build
npm run build

# Copy to server and run
npm start
```

Server requirements:
- Node.js 18+
- Port 3000 (or configure via PORT env variable)

## 📦 PWA Configuration

### Manifest
- Located at `/public/manifest.json`
- Defines app metadata, icons, and shortcuts
- Customize app name, colors, and icons

### Service Worker
- Located at `/public/sw.js`
- Implements offline-first strategy
- Cache-first for images, network-first for pages
- Auto-updates every 60 seconds

### Installation
- Users can install from browser menu or PWA prompt
- App appears on home screen with icon
- Works in standalone mode

## 🔧 Customization

### Update App Name & Domain
Edit in multiple files:
- `app/layout.tsx` - APP_NAME constant
- `public/manifest.json` - name and short_name
- `next.config.js` - domain configuration

### Add/Remove Pages
1. Create new directory under `app/`
2. Add `page.tsx` file
3. Update navigation links

### Update Colors
1. Edit CSS variables in `app/globals.css`
2. Modify Tailwind colors in `tailwind.config.ts`
3. Update theme color in `manifest.json`

### Add Icons
1. Create icon images (192x192, 512x512 PNG)
2. Place in `public/icons/`
3. Update paths in `manifest.json`

## 🔐 Security

- Service Worker scope restricted to `/`
- Security headers configured in `next.config.js`
- Content Security Policy ready for implementation
- No sensitive data stored in localStorage

### Headers Configured
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📊 Performance Optimization

- **Service Workers**: Intelligent caching strategy
- **Code Splitting**: Automatic by Next.js
- **Image Optimization**: WebP format support
- **Dynamic Imports**: Lazy loading ready
- **Minification**: Automatic in production

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+
- Mobile browsers (iOS Safari 14.5+, Chrome Mobile 90+)

## 📱 Testing on Mobile

### iOS
1. Open in Safari
2. Share → Add to Home Screen
3. App appears on home screen

### Android
1. Open in Chrome
2. Menu → Install app
3. Or: Add to home screen if available

### Local Testing
```bash
# Get local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Access from mobile on same network
http://YOUR_IP:3000
```

## 🐛 Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure app is served over HTTPS (or localhost)
- Clear browser cache and reload

### Offline Not Working
- Service worker must be registered first
- Check `/public/sw.js` is accessible
- Verify MIME type is application/javascript

### Installation Prompt Not Showing
- Site must be installable (has manifest, icons, https)
- User must not have dismissed prompt recently
- Try accessing from incognito mode

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developers.google.com/web/tools/workbox)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🔮 Future Enhancements

- [ ] VMS Integration (visitor management)
- [ ] Real-time campus map with interactive markers
- [ ] QR code scanners for building information
- [ ] Audio tour guide
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Virtual reality campus tour

## 📄 License

All rights reserved © 2026 SMRU.

## 👥 Contributing

For development and feature requests, please contact the SMRU development team.

## 📞 Support

For technical support or issues:
- Email: [info@smru.edu.in](mailto:info@smru.edu.in)
- Website: [www.smru.edu.in](https://www.smru.edu.in)

---

**Version**: 1.0.0
**Last Updated**: May 2026
**Status**: Ready for Production
