'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PROMPT_STATE_KEY = 'smru_pwa_install_prompt_state_v1';

type PromptState = 'dismissed' | 'accepted' | null;

function readPromptState(): PromptState {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(PROMPT_STATE_KEY);
  return value === 'dismissed' || value === 'accepted' ? value : null;
}

function writePromptState(state: Exclude<PromptState, null>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROMPT_STATE_KEY, state);
}

function isRunningAsInstalledApp(): boolean {
  if (typeof window === 'undefined') return false;
  const standaloneIOS = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const standaloneDisplay = window.matchMedia('(display-mode: standalone)').matches;
  return standaloneIOS || standaloneDisplay;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Dev safeguard: remove old SW/caches to avoid stale HTML hydration mismatch
    if (process.env.NODE_ENV !== 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
    }

    let updateIntervalId: number | null = null;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (readPromptState() || isRunningAsInstalledApp()) {
        setShowPrompt(false);
        return;
      }
      const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;
      setDeferredPrompt(beforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      writePromptState('accepted');
      setDeferredPrompt(null);
      setShowPrompt(false);
    };

    // Register service worker in production only.
    // In dev, stale SW caches can cause hydration mismatches.
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Check for updates periodically
          updateIntervalId = window.setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch(() => {
          // Ignore registration errors in UI layer.
        });
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (updateIntervalId !== null) {
        window.clearInterval(updateIntervalId);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        writePromptState('accepted');
      } else {
        writePromptState('dismissed');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch {
      writePromptState('dismissed');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    writePromptState('dismissed');
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 animate-in slide-in-from-bottom-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0">📱</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              Install App
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Add SMRU Campus Tour to your home screen for quick access
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleInstall}
            className="flex-1 btn-primary text-sm py-2"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 btn-secondary text-sm py-2"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
