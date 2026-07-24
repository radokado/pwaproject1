export interface AppFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'pwa' | 'performance' | 'offline' | 'cloudflare';
  status: 'active' | 'ready' | 'beta';
}

export interface OfflineTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: string;
  synced: boolean;
}

export interface SystemInfo {
  browser: string;
  online: boolean;
  serviceWorkerActive: boolean;
  storageUsageBytes: number;
  storageQuotaBytes: number;
}
