import React from 'react';
import { Smartphone, Shield, Zap, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-200 text-sm">pwaproject1 PWA</p>
            <p className="text-slate-500">Optimalizované pre Cloudflare Pages & Service Worker</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
            <Zap className="w-4 h-4 text-amber-400" /> Lighthouse &gt; 95 Score
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
            <Shield className="w-4 h-4 text-emerald-400" /> Offline First Cache
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
            <Globe className="w-4 h-4 text-cyan-400" /> Cloudflare Pages Ready
          </span>
        </div>

        <p className="text-slate-500 text-center md:text-right flex items-center justify-center gap-1">
          Vytvorené s <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500/20" /> v React 19 & Vite
        </p>
      </div>
    </footer>
  );
};
