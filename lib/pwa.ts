/**
 * PWA utilities
 */

export async function registerPWA(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('PWA registered:', registration);
  } catch (error) {
    console.error('PWA registration failed:', error);
  }
}

export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if app is running as installed PWA
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && navigator.standalone === true)
  );
}

export async function checkForUpdates(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.update();
    }
    return true;
  } catch (error) {
    console.error('Update check failed:', error);
    return false;
  }
}

export function onOnline(callback: () => void): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('online', callback);
}

export function onOffline(callback: () => void): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('offline', callback);
}
