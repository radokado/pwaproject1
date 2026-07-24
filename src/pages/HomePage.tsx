import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Smartphone,
  Zap,
  WifiOff,
  Globe,
  ArrowRight,
  Sparkles,
  Download,
  Layers,
  Cpu,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ServiceWorkerStatus } from '../components/pwa/ServiceWorkerStatus';

interface HomePageProps {
  canInstall: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
  storageEstimate: { usage: number; quota: number };
}

export const HomePage: React.FC<HomePageProps> = ({
  canInstall,
  isInstalled,
  onInstall,
  storageEstimate,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/20 p-8 sm:p-12 text-center sm:text-left">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Progressive Web App • Cloudflare Pages Optimized</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Aplikácia <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">pwaproject1</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Ultra-rýchla, responzívna a bezpečná PWA aplikácia pripravená na offline prevádzku, inštaláciu do smartfónu či počítača a okamžité nasadenie na Cloudflare Pages.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            {canInstall ? (
              <Button size="lg" variant="primary" onClick={onInstall}>
                <Download className="w-5 h-5" />
                Nainštalovať Aplikáciu
              </Button>
            ) : isInstalled ? (
              <Badge variant="success" size="md" className="py-2 px-4 text-sm">
                Aplikácia je nainštalovaná v zariadení
              </Badge>
            ) : null}

            <NavLink to="/features">
              <Button size="lg" variant="secondary">
                <Layers className="w-5 h-5 text-indigo-400" />
                Preskúmať Funkcie
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Service Worker Status Diagnostics */}
      <section>
        <ServiceWorkerStatus storageEstimate={storageEstimate} />
      </section>

      {/* Key Feature Highlights */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">PWA Architektúra & Výhody</h2>
            <p className="text-sm text-slate-400">Prehľad hlavných vlastností a technológií</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="space-y-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Lighthouse Score &gt; 95</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Navrhnuté s maximálnym dôrazom na rýchlosť, pristúpenie, SEO a PWA štandardy s minimálnym reakčným časom.
            </p>
          </Card>

          <Card hoverable className="space-y-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl w-fit">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Offline-First Kešovanie</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pracuje spoľahlivo aj bez pripojenia na internet. Všetky statické súbory a úlohy sú uložené priamo vo vašom zariadení.
            </p>
          </Card>

          <Card hoverable className="space-y-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl w-fit">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cloudflare Pages Edge</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Kompatibilné s globálnou CDN sieťou Cloudflare Pages. Automatický fallback smerovania vďaka konfiguračnému súboru _redirects.
            </p>
          </Card>
        </div>
      </section>

      {/* Quick Interactive Demo CTA */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> Vyskúšajte si v praxi
          </div>
          <h3 className="text-xl font-bold text-white">Test offline ukladania úloh a synchronizácie</h3>
          <p className="text-sm text-slate-400 max-w-xl">
            Pridajte úlohy, vypnite Wi-Fi/Mobilné dáta a overte si, že aplikácia pwaproject1 funguje bez jediného výpadku.
          </p>
        </div>

        <NavLink to="/offline-demo" className="shrink-0">
          <Button size="lg" variant="primary">
            <span>Otvoriť Offline Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </NavLink>
      </section>
    </div>
  );
};
