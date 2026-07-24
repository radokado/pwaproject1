import React, { useState } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface PWAInstallBannerProps {
  onInstall: () => Promise<boolean>;
  canInstall: boolean;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  onInstall,
  canInstall,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900/90 to-purple-900/90 border-b border-indigo-500/30 px-4 py-3 text-white backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">
              Nainštalujte pwaproject1 na vaše zariadenie
            </p>
            <p className="text-xs text-slate-300">
              Získajte plnohodnotný offline prístup, rýchlejší štart a samostatné okno.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={onInstall}
            className="shadow-md shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" />
            Nainštalovať PWA
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Zatvoriť"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
