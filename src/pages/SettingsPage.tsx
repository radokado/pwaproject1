import React, { useState, useEffect } from 'react';
import { Settings, Moon, HardDrive, RefreshCw, Trash2, Shield, Info, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { storageService, UserSettings } from '../services/storageService';
import { formatBytes } from '../utils/formatters';

interface SettingsPageProps {
  storageEstimate: { usage: number; quota: number };
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ storageEstimate }) => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    offlineNotifications: true,
    autoSync: true,
  });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setSettings(storageService.getSettings());
  }, []);

  const handleToggleNotification = () => {
    const updated: UserSettings = {
      ...settings,
      offlineNotifications: !settings.offlineNotifications,
    };
    setSettings(updated);
    storageService.saveSettings(updated);
    showSavedNotification();
  };

  const handleToggleAutoSync = () => {
    const updated: UserSettings = {
      ...settings,
      autoSync: !settings.autoSync,
    };
    setSettings(updated);
    storageService.saveSettings(updated);
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleClearAllData = () => {
    if (confirm('Naozaj chcete vymazať všetky uložené úlohy a nastavenia z prehliadača?')) {
      localStorage.clear();
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Nastavenia Aplikácie</h1>
          <p className="text-slate-400 mt-1">
            Spravujte predvoľby, PWA vyrovnávaciu pamäť a lokálne úložisko.
          </p>
        </div>
        {savedMessage && (
          <Badge variant="success" className="animate-fade-in flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Uložené
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Storage Management */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Úložisko Device & PWA Cache</h3>
              <p className="text-xs text-slate-400">Využitá pamäť v tomto zariadení</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Obsadené úložisko:</span>
              <span className="font-semibold text-indigo-400">
                {formatBytes(storageEstimate.usage)} / {formatBytes(storageEstimate.quota || 10737418240)}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    ((storageEstimate.usage || 1) / (storageEstimate.quota || 10737418240)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Predvoľby & Notifikácie</h3>
              <p className="text-xs text-slate-400">Prispôsobenie správania PWA</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-200">Offline Oznámenia</p>
                <p className="text-xs text-slate-400">Zobraziť odznak pri stratení internetového spojenia</p>
              </div>
              <button
                onClick={handleToggleNotification}
                className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                  settings.offlineNotifications ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.offlineNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-200">Automatická Synchronizácia</p>
                <p className="text-xs text-slate-400">Synchronizovať dáta pri opätovnom pripojení</p>
              </div>
              <button
                onClick={handleToggleAutoSync}
                className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                  settings.autoSync ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-rose-500/20 bg-rose-950/10 space-y-4">
          <div className="flex items-center gap-3 text-rose-400">
            <Trash2 className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Vymazanie Dát</h3>
          </div>
          <p className="text-xs text-slate-300">
            Vymaže všetky lokálne dáta, zruší kešovanie Service Workera a resetuje aplikáciu do pôvodného stavu.
          </p>
          <Button variant="danger" size="sm" onClick={handleClearAllData}>
            Vymazať Všetky Dáta PWA
          </Button>
        </Card>
      </div>
    </div>
  );
};
