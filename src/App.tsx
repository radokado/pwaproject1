import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { HomePage } from './pages/HomePage';
import { CustomersPage } from './pages/CustomersPage';
import { GelsPage } from './pages/GelsPage';
import { GalleryPage } from './pages/GalleryPage';
import { SettingsPage } from './pages/SettingsPage';
import { usePWA } from './hooks/usePWA';

export default function App() {
  const { canInstall, installApp } = usePWA();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
        <PWAInstallBanner canInstall={canInstall} onInstall={installApp} />
        <Header canInstall={canInstall} onInstall={installApp} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/gels" element={<GelsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNavigation />
      </div>
    </BrowserRouter>
  );
}
