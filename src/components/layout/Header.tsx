import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Users, Image, Settings, Download } from 'lucide-react';
import { OfflineBadge } from '../common/OfflineBadge';
import { Button } from '../ui/Button';

interface HeaderProps {
  canInstall: boolean;
  onInstall: () => Promise<boolean>;
}

export const Header: React.FC<HeaderProps> = ({ canInstall, onInstall }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-rose-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-400 group-hover:text-pink-300 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-rose-100 to-pink-300 bg-clip-text text-transparent">
                NailStudio PWA
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Offline PWA
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" /> Prehľad
            </NavLink>

            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              <Users className="w-4 h-4" /> Zákazníčky
            </NavLink>

            <NavLink
              to="/gels"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              <Sparkles className="w-4 h-4" /> Gély
            </NavLink>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              <Image className="w-4 h-4" /> Galéria
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              <Settings className="w-4 h-4" /> Nastavenia
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <OfflineBadge />

            {canInstall && (
              <Button
                variant="primary"
                size="sm"
                onClick={onInstall}
                className="bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
              >
                <Download className="w-4 h-4" />
                Inštalovať
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
