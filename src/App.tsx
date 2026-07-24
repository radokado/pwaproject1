/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { OfflinePage } from './pages/OfflinePage';
import { SettingsPage } from './pages/SettingsPage';
import { usePWA } from './hooks/usePWA';

export default function App() {
  const { canInstall, isInstalled, installApp, storageEstimate } = usePWA();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <PWAInstallBanner canInstall={canInstall} onInstall={installApp} />
        <Header canInstall={canInstall} onInstall={installApp} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  canInstall={canInstall}
                  isInstalled={isInstalled}
                  onInstall={installApp}
                  storageEstimate={storageEstimate}
                />
              }
            />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/offline-demo" element={<OfflinePage />} />
            <Route path="/settings" element={<SettingsPage storageEstimate={storageEstimate} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

