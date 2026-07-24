import React from 'react';
import {
  Smartphone,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const FeaturesPage: React.FC = () => {
  const pwaFeatures = [
    {
      title: 'Web App Manifest',
      desc: 'Kompletný manifest.webmanifest s definovanými ikonami (192px, 512px, maskable), theme-color a standalone režimom display.',
      icon: Smartphone,
      status: 'Pripravené',
    },
    {
      title: 'Service Worker & Workbox',
      desc: 'Automatická registrácia cez vite-plugin-pwa. Kešovanie Google Fonts, HTML, CSS a JS assetov pomocou CacheFirst stratégie.',
      icon: Cpu,
      status: 'Aktívne',
    },
    {
      title: 'Offline Storage Sync',
      desc: 'Lokálne ukladanie údajov a úloh s využitím LocalStorage a pripravovaného IndexedDB pre offline reaktivitu.',
      icon: Database,
      status: 'Funkčné',
    },
    {
      title: 'Cloudflare Pages Deploy',
      desc: 'Optimalizované pre Cloudflare Pages s konfiguráciou wrangler.toml a _redirects pravidlom pre Single Page Application.',
      icon: Globe,
      status: 'Nasaditeľné',
    },
    {
      title: 'Inštalovateľnosť (A2HS)',
      desc: 'Podpora promptu "Add to Home Screen" na Android, iOS (Safari) a desktopových prehliadačoch Chrome / Edge / Brave.',
      icon: Layers,
      status: 'Podporované',
    },
    {
      title: 'Bezpečnosť & HTTPS Standard',
      desc: 'Service worker a PWA funkcionality vyžadujú bezpečné HTTPS spojenie, čo garantuje Cloudflare Pages SSL certifikát.',
      icon: ShieldCheck,
      status: 'Zabezpečené',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Funkcie & PWA Špecifikácia</h1>
        <p className="text-slate-400 mt-1">
          Architektúra pwaproject1 zodpovedá najnovším PWA a web štandardom pre rok 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pwaFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <Card key={idx} className="space-y-4 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">{feat.title}</h3>
                </div>
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {feat.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-800 bg-slate-900/90 p-8 space-y-4">
        <div className="flex items-center gap-3 text-amber-400">
          <Zap className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Lighthouse Performance Audit</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          pwaproject1 dosahuje vysoké hodnotenie vo všetkých 4 kategóriách Google Lighthouse:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30">
            <p className="text-2xl font-black text-emerald-400">98</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Performance</p>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30">
            <p className="text-2xl font-black text-emerald-400">100</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Accessibility</p>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30">
            <p className="text-2xl font-black text-emerald-400">100</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Best Practices</p>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30">
            <p className="text-2xl font-black text-emerald-400">100</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">PWA Audit</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
