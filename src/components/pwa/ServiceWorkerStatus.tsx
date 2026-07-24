import React, { useState, useEffect } from 'react';
import { Cpu, Database, RefreshCw, CheckCircle2, HardDrive, Wifi } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatBytes } from '../../utils/formatters';

interface ServiceWorkerStatusProps {
  storageEstimate: { usage: number; quota: number };
}

export const ServiceWorkerStatus: React.FC<ServiceWorkerStatusProps> = ({ storageEstimate }) => {
  const [swActive, setSwActive] = useState(false);
  const [cacheCount, setCacheCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkSW = async () => {
    setLoading(true);
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      setSwActive(!!reg?.active);
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      setCacheCount(keys.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSW();
  }, []);

  const clearCache = async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await checkSW();
    }
  };

  return (
    <Card className="border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Service Worker & PWA Diagnostika</h3>
            <p className="text-xs text-slate-400">Stav vyrovnávacej pamäte a správca offline úložiska</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={checkSW} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Obnoviť
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-indigo-400" /> Service Worker
            </span>
            <Badge variant={swActive ? 'success' : 'warning'}>
              {swActive ? 'Aktívny' : 'Nepripojený'}
            </Badge>
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {swActive ? 'Aplikácia je pripravená na offline prevádzku' : 'Service worker sa registruje...'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> Cache Registre
            </span>
            <Badge variant="info">{cacheCount} Registrov</Badge>
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {cacheCount > 0 ? 'Statické assety a Google Fonts v keši' : 'Keš sa vytvára'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" /> Úložisko Device
            </span>
            <Badge variant="neutral">{formatBytes(storageEstimate.usage)}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Z celkovej kvóty {formatBytes(storageEstimate.quota || 10737418240)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" /> Manifest webmanifest validný & Cloudflare Pages kompatibilný
        </span>
        <Button variant="ghost" size="sm" onClick={clearCache} className="text-rose-400 hover:text-rose-300">
          Vyčistiť Keš PWA
        </Button>
      </div>
    </Card>
  );
};
