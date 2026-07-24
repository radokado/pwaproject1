export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
  swRegistration: ServiceWorkerRegistration | null;
}

export interface ServiceWorkerMessage {
  type: string;
  payload?: Record<string, unknown>;
}
