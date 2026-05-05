# SMRU Campus Tour - Development Guide

Guide for developers working on the SMRU Campus Tour application.

## Development Environment Setup

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org/))
- npm or yarn package manager
- Git version control
- A modern code editor (VS Code recommended)

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo/campus-tour.git
   cd campus-tour
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
campus-tour/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── tour/page.tsx            # Tour page
│   ├── buildings/page.tsx       # Buildings page
│   ├── facilities/page.tsx      # Facilities page
│   ├── directions/page.tsx      # Directions page
│   └── about/page.tsx           # About page
├── components/
│   └── PWAInstallPrompt.tsx     # PWA installation component
├── lib/                          # Utility functions
│   ├── constants.ts             # App constants
│   ├── service-worker.ts        # SW utilities
│   └── storage.ts               # LocalStorage utilities
├── types/
│   └── index.ts                 # TypeScript definitions
├── public/
│   ├── sw.js                    # Service worker
│   ├── manifest.json            # PWA manifest
│   ├── offline.html             # Offline page
│   └── icons/                   # App icons
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## Development Workflow

### Creating a New Page

1. **Create Directory**
   ```bash
   mkdir -p app/new-page
   ```

2. **Create page.tsx**
   ```typescript
   'use client';
   
   import Link from 'next/link';
   
   export default function NewPage() {
     return (
       <main className="min-h-screen">
         {/* Page content */}
       </main>
     );
   }
   ```

3. **Update Navigation** (in other pages)
   ```typescript
   <Link href="/new-page">New Page</Link>
   ```

### Adding a New Component

1. **Create component file**
   ```bash
   touch components/MyComponent.tsx
   ```

2. **Write component**
   ```typescript
   'use client';
   
   export interface MyComponentProps {
     title: string;
     description: string;
   }
   
   export default function MyComponent({ title, description }: MyComponentProps) {
     return (
       <div className="p-4">
         <h2 className="font-bold">{title}</h2>
         <p>{description}</p>
       </div>
     );
   }
   ```

3. **Use in pages**
   ```typescript
   import MyComponent from '@/components/MyComponent';
   
   export default function Page() {
     return <MyComponent title="Example" description="Test" />;
   }
   ```

### Styling

We use Tailwind CSS for styling. Classes are responsive by default.

```typescript
// Mobile-first responsive design
<div className="
  w-full          // Mobile: full width
  md:w-1/2        // Tablet: 50% width
  lg:w-1/3        // Desktop: 33% width
  p-4 md:p-6      // Padding adjusts with breakpoints
  bg-white dark:bg-gray-900  // Light/dark mode
  rounded-lg      // Border radius
  shadow-md       // Shadow effect
  hover:shadow-lg // Interactive state
  transition-all  // Smooth animation
">
</div>
```

## Code Style Guidelines

### TypeScript
- Use interfaces for props: `interface ComponentProps { }`
- Use type safety everywhere
- Avoid `any` type unless necessary

### React Components
- Use functional components
- Use `'use client'` for client-side components
- Keep components small and focused
- Extract complex logic to utilities

### File Naming
- Components: PascalCase (MyComponent.tsx)
- Utilities: kebab-case (my-utility.ts)
- Pages: lowercase (page.tsx)

### Imports
- Use absolute imports with `@/` alias
- Group imports: React, external, internal
- Keep imports alphabetically sorted

## Testing

### Manual Testing

1. **Test on Mobile**
   ```bash
   # Get local IP
   ipconfig getifaddr en0  # macOS
   
   # Access from phone on same network
   http://YOUR_IP:3000
   ```

2. **Test Offline**
   - Open DevTools (F12)
   - Network tab → Offline
   - Verify app still works

3. **Test PWA**
   - Open DevTools
   - Application tab → Manifest
   - Check manifest loads correctly
   - Try installing app

### Browser DevTools

- **Network Tab**: Check request caching
- **Application Tab**: View Service Workers, Cache Storage
- **Console**: Check for errors
- **Lighthouse**: Run PWA audit

## Common Tasks

### Adding a New Route

1. Create directory: `mkdir app/new-route`
2. Create file: `app/new-route/page.tsx`
3. Add TypeScript types to `types/index.ts`
4. Import and use types in page
5. Update navigation links
6. Test the route

### Modifying Service Worker

Edit `/public/sw.js`:
- Cache strategy in fetch event
- Add new cache patterns
- Update cache version
- Test offline behavior

### Updating Styles

- Global styles: `app/globals.css`
- Component styles: Use Tailwind classes inline
- Theme colors: `app/globals.css` CSS variables
- Dark mode: Use `dark:` prefix in classes

### Adding Constants

1. Edit `lib/constants.ts`
2. Export new constants
3. Use with `import { CONSTANT_NAME } from '@/lib/constants'`

## Debugging

### Enable Debug Logging

Add to any file:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug message');
}
```

### Check Service Worker
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => console.log(reg));
});
```

### Clear Cache
```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

## Performance Tips

- Lazy load heavy components: `dynamic(() => import('...'))`
- Optimize images: Use Next.js Image component
- Minimize bundle: Check with `npm run build`
- Cache static content: Service Worker handles this
- Avoid large dependencies

## Git Workflow

### Commit Messages
```
feat: Add new tour page
fix: Resolve offline caching issue
docs: Update README
style: Format code
refactor: Improve component structure
chore: Update dependencies
```

### Branch Naming
```
feature/tour-page
fix/offline-bug
docs/readme-update
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request
5. Request review
6. Address feedback
7. Merge to main

## Environment Variables

### Available Variables (from .env.local.example)
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_URL`: Production URL
- `NEXT_PUBLIC_APP_DESCRIPTION`: App description

### Adding New Variables
1. Add to `.env.local.example`
2. Add to `.env.local` (local development)
3. Use with `process.env.VARIABLE_NAME` or `process.env.NEXT_PUBLIC_*`
4. Prefix with `NEXT_PUBLIC_` to expose to browser

## Troubleshooting

### Hot Reload Not Working
- Stop dev server
- Clear `.next` directory
- Run `npm run dev` again

### Module Not Found
- Check import path (use `@/` for root imports)
- Verify file exists
- Check for typos

### Build Errors
- Check console output
- Run `npm run type-check`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Service Worker Issues
- Check `/public/sw.js` exists
- Verify scope in registration
- Use `rm -rf .next` to clear cache

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## Performance Monitoring

### Built-in Metrics
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

### Check with Lighthouse
1. Open DevTools
2. Lighthouse tab
3. Run audit
4. Review recommendations

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] No console errors or warnings
- [ ] TypeScript types are correct
- [ ] Responsive design tested
- [ ] Accessibility considered (a11y)
- [ ] Performance is acceptable
- [ ] No hardcoded values
- [ ] Comments for complex logic
- [ ] Tests pass (if applicable)

---

**Last Updated**: May 2026
**For Questions**: Contact SMRU Dev Team
