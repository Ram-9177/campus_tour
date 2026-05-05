import type { Metadata, Viewport } from 'next';
import './globals.css';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import smruLogo from '../SMRU Logo.png';

const APP_NAME = 'SMRU Campus Tour';
const APP_DESCRIPTION =
  'Explore SMRU Campus with an interactive mobile tour guide. Discover buildings, facilities, and amenities with offline access.';
const APP_URL = 'https://tour.smru.edu.in';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['campus', 'tour', 'SMRU', 'mobile', 'PWA'],
  authors: [{ name: 'SMRU' }],
  creator: 'SMRU',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1d4ed8' },
    { media: '(prefers-color-scheme: dark)', color: '#1d4ed8' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta
          name="theme-color"
          content="#1d4ed8"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1d4ed8"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href={smruLogo.src} />
        <link rel="apple-touch-icon" href={smruLogo.src} />
        <link rel="canonical" href={APP_URL} />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans bg-white text-slate-900">
        <PWAInstallPrompt />
        {children}
      </body>
    </html>
  );
}
