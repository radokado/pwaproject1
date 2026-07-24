import { useState, useEffect, useCallback } from 'react';
import { BeforeInstallPromptEvent, PWAState } from '../types/pwa';
import { useOnlineStatus } from './useOnlineStatus';

export function usePWA() {
  const isOnline = useOnlineStatus();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOffline: !isOnline,
    hasUpdate: false,
    swRegistration: null,
  });

  const [storageEstimate, setStorageEstimate] = useState<{ usage: number; quota: number }>({
    usage: 0,
    quota: 0,
  });

  // Check display-mode standalone
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setPwaState((prev) => ({
      ...prev,
      isInstalled: isStandalone,
      isOffline: !isOnline,
    }));
  }, [isOnline]);

  // Capture install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setPwaState((prev) => ({ ...prev, isInstallable: true }));
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setPwaState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Check Storage quota
  useEffect(() => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        setStorageEstimate({
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
        });
      });
    }
  }, []);

  // Trigger Install
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setPwaState((prev) => ({ ...prev, isInstalled: true, isInstallable: false }));
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error triggering PWA prompt', err);
      return false;
    }
  }, [deferredPrompt]);

  return {
    ...pwaState,
    installApp,
    storageEstimate,
    canInstall: !!deferredPrompt && !pwaState.isInstalled,
  };
}
