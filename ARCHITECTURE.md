# SMRU Campus Tour - Technical Architecture

Technical documentation for the SMRU Campus Tour PWA architecture and design decisions.

## Architecture Overview

The SMRU Campus Tour is built as a **Progressive Web Application (PWA)** using a modern web stack optimized for mobile-first deployment.

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Components (UI Layer)                  │   │
│  │  - Pages (Home, Tour, Buildings, etc.)              │   │
│  │  - Components (PWAInstallPrompt, etc.)              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Application Logic (App Layer)               │   │
│  │  - State Management (React Hooks)                   │   │
│  │  - Local Storage Utilities                          │   │
│  │  - Constants & Types                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Service Worker (Offline Layer)              │   │
│  │  - Cache Management                                 │   │
│  │  - Offline Support                                  │   │
│  │  - Background Sync                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Web APIs (Browser Layer)                    │   │
│  │  - Geolocation API                                  │   │
│  │  - LocalStorage API                                │   │
│  │  - Service Worker API                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Framework
- **Next.js 15**: React meta-framework with App Router
  - Server-side rendering capabilities
  - Automatic code splitting
  - Built-in performance optimization
  - Image optimization

### Language
- **TypeScript**: Type-safe JavaScript
  - Better IDE support
  - Compile-time error detection
  - Self-documenting code

### Styling
- **Tailwind CSS**: Utility-first CSS framework
  - Responsive design utilities
  - Dark mode support
  - Customizable theme
  - Small bundle size

### State Management
- **React Hooks**: Built-in state management
  - useState for local component state
  - useEffect for side effects
  - Custom hooks for reusable logic

### PWA Technologies
- **Web Manifest**: App metadata and icons
- **Service Workers**: Offline support and caching
- **HTTPS**: Secure communication

## Directory Structure

### `app/` - Next.js App Router
```
app/
├── layout.tsx          # Root layout with PWA configuration
├── page.tsx            # Homepage (/)
├── globals.css         # Global styles
├── tour/
│   └── page.tsx        # Interactive tour (/tour)
├── buildings/
│   └── page.tsx        # Buildings directory (/buildings)
├── facilities/
│   └── page.tsx        # Facilities info (/facilities)
├── directions/
│   └── page.tsx        # Navigation (/directions)
└── about/
    └── page.tsx        # About page (/about)
```

### `components/` - Reusable Components
```
components/
└── PWAInstallPrompt.tsx    # PWA installation UI
```

### `lib/` - Utility Functions
```
lib/
├── constants.ts        # Application constants
├── service-worker.ts   # Service Worker utilities
└── storage.ts          # LocalStorage helpers
```

### `types/` - TypeScript Definitions
```
types/
└── index.ts            # Global type definitions
```

### `public/` - Static Assets
```
public/
├── sw.js               # Service Worker script
├── manifest.json       # PWA manifest
├── offline.html        # Offline fallback
├── favicon.ico         # App icon
└── icons/              # App icons for PWA
    ├── icon-192x192.png
    ├── icon-512x512.png
    ├── icon-maskable-192x192.png
    └── icon-maskable-512x512.png
```

## Data Flow

### Page Load Sequence
```
1. User navigates to tour.smru.edu.in
2. Next.js serves HTML with PWA metadata
3. Browser downloads and parses manifest.json
4. Service Worker registers and caches assets
5. React components hydrate and become interactive
6. LocalStorage loads saved user data (tour progress)
7. Page is fully functional
```

### Offline Functionality
```
1. Service Worker intercepts fetch requests
2. Network request attempted first
3. If network fails, check cache
4. If cache found, serve cached response
5. If nothing cached, serve offline.html
6. When online again, update cache silently
```

### User Interaction
```
User Action → React Component → State Update → 
LocalStorage Save → DOM Re-render → Cache Update
```

## Key Components

### PWAInstallPrompt Component
```typescript
// Handles PWA installation
// - Listens for beforeinstallprompt event
// - Shows install UI
// - Registers service worker
// - Triggers browser install dialog
```

### Service Worker (`/public/sw.js`)
```javascript
// Caching strategies:
// 1. Images: Cache-first (static content)
// 2. HTML/API: Network-first (fresh content)
// 3. CSS/JS: Cache-first (bundled with app)

// Offline support:
// - Serves cached pages when offline
// - Fallback to offline.html for errors
// - Periodically checks for updates
```

### Layout (`app/layout.tsx`)
```typescript
// Root layout includes:
// - PWA metadata (manifest, theme colors)
// - Security headers configuration
// - Font optimization
// - Global styles
// - PWA install prompt
```

## Routing

Next.js App Router provides file-based routing:

| File | Route |
|------|-------|
| `app/page.tsx` | `/` |
| `app/tour/page.tsx` | `/tour` |
| `app/buildings/page.tsx` | `/buildings` |
| `app/facilities/page.tsx` | `/facilities` |
| `app/directions/page.tsx` | `/directions` |
| `app/about/page.tsx` | `/about` |

## State Management

### Local Component State
```typescript
const [completedSteps, setCompletedSteps] = useState<number[]>([]);
```

### Persistent State (LocalStorage)
```typescript
// Save to storage
localStorage.setItem('completedTourSteps', JSON.stringify(completed));

// Load from storage
const saved = localStorage.getItem('completedTourSteps');
```

### Application Constants
```typescript
// Centralized constants in lib/constants.ts
export const ROUTES = { HOME: '/', TOUR: '/tour', ... };
export const TOUR_STEPS = [ ... ];
```

## Styling Strategy

### Global Styles (`app/globals.css`)
```css
/* CSS variables for theming */
--background
--foreground
--primary
--secondary
--border

/* Dark mode support */
@media (prefers-color-scheme: dark) { ... }

/* Component utilities */
.btn-primary, .card, .container-safe
```

### Component Styles (Tailwind Classes)
```typescript
<div className="
  p-4
  bg-white dark:bg-gray-900
  rounded-lg
  shadow-md
  hover:shadow-lg
  transition-all
  responsive-classes
">
```

### Responsive Design
```
Mobile-first approach:
- Default styles: Mobile (320px+)
- md: (768px+)  - Tablet
- lg: (1024px+) - Desktop
- xl: (1280px+) - Large screens
```

## Performance Optimizations

### Code Splitting
- Next.js automatically splits code by route
- Components loaded only when needed

### Image Optimization
- WebP format support
- Lazy loading
- Responsive sizes

### Caching Strategy
```
Static Assets:
  - Service Worker: Cache-first
  - Browser: Long-term caching

Dynamic Content:
  - Service Worker: Network-first
  - Browser: Must-revalidate

API Responses:
  - Not applicable (no backend currently)
```

### Bundle Size
- Tailwind CSS purges unused styles
- Next.js minification
- Code splitting by routes

## Security Measures

### Headers Configuration
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Service Worker Security
- Scope restricted to app root (`/`)
- HTTPS required (or localhost for dev)
- No sensitive data in cache

### Data Privacy
- No tracking without consent
- LocalStorage only (on-device storage)
- No server communication (currently)

## Browser APIs Used

### Geolocation API
```typescript
// For campus navigation
navigator.geolocation.getCurrentPosition(
  (position) => { /* handle location */ },
  (error) => { /* handle error */ }
);
```

### LocalStorage API
```typescript
// For saving tour progress
localStorage.setItem(key, JSON.stringify(data));
const data = JSON.parse(localStorage.getItem(key));
```

### Service Worker API
```typescript
// For offline support
navigator.serviceWorker.register('/sw.js');
```

### Web App Manifest
```json
// For PWA installation
{
  "name": "SMRU Campus Tour",
  "start_url": "/",
  "display": "standalone",
  "icons": [...]
}
```

## Future Architecture Considerations

### VMS Integration
```
When integrating with Visitor Management System:

Current: Standalone app
Future: 
  - Add backend API
  - Authentication (if needed)
  - Visitor form submission
  - Real-time data sync
  - Analytics
```

### Scalability
```
Current: Client-side only (no backend needed)
Future possibilities:
  - Node.js backend
  - Database (PostgreSQL/MongoDB)
  - API endpoints (/api/*)
  - Authentication system
  - Admin dashboard
```

### Real-time Features
```
When needed:
  - WebSocket integration
  - Server-Sent Events (SSE)
  - Push notifications
  - Real-time campus updates
```

## Deployment Architecture

### Development
```
Local Machine
  └── Next.js Dev Server (npm run dev)
      └── Hot Module Replacement
      └── Source Maps
      └── Debug Mode
```

### Production
```
CDN
  ├── Static assets (images, fonts)
  ├── JS/CSS bundles
  └── Service Worker script

Next.js Server
  ├── API routes (if added)
  ├── SSR/SSG pages
  └── Middleware

Database (if added)
  └── User data, analytics
```

## Configuration Files

### `next.config.js`
- PWA headers configuration
- Image optimization settings
- Security headers
- Redirects and rewrites

### `tailwind.config.ts`
- Theme customization
- Color palette
- Spacing scale
- Responsive breakpoints

### `tsconfig.json`
- TypeScript compiler options
- Path aliases (`@/*`)
- Strict mode enabled

### `package.json`
- Dependencies and versions
- Scripts (dev, build, start)
- Node.js engine requirement

## Testing Strategy

### Manual Testing
- Browser DevTools
- Mobile device testing
- PWA audit (Lighthouse)
- Offline functionality

### Automated Testing (Future)
- Unit tests (Jest)
- Component tests (React Testing Library)
- E2E tests (Playwright)
- Accessibility tests (axe)

## Monitoring & Analytics

### Currently Logged
- Service Worker registration
- Offline events
- Page navigation

### Future Additions
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics

## Best Practices

1. **Mobile-First Development**: Design for mobile, enhance for desktop
2. **Progressive Enhancement**: Core features work without JS
3. **Accessibility**: WCAG 2.1 AA compliant
4. **Performance**: Optimize for slow networks
5. **Type Safety**: Use TypeScript throughout
6. **DRY Principle**: Reuse components and utilities
7. **Error Handling**: Graceful degradation
8. **Documentation**: Self-documenting code with comments

---

**Version**: 1.0.0
**Last Updated**: May 2026
**Architecture Status**: Stable and Production-Ready
