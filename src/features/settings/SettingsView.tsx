import React, { useState } from 'react';
import { Download, Upload, Database, HardDrive, RefreshCw, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { exportImportService } from '../../services/exportImportService';
import { useCustomers } from '../../hooks/useCustomers';
import { useGels } from '../../hooks/useGels';
import { useVisits } from '../../hooks/useVisits';

export const SettingsView: React.FC = () => {
  const { customers } = useCustomers();
  const { gels } = useGels();
  const { visits } = useVisits();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportImportService.exportDatabase();
      setMessage({ type: 'success', text: 'Záloha databázy bola úspešne stiahnutá do JSON súboru.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Chyba pri exporte databázy.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('UPOZORNENIE: Import nahradí vašu aktuálnu databázu. Chcete pokračovať?')) {
      return;
    }

    setIsImporting(true);
    try {
      await exportImportService.importDatabase(file);
      setMessage({ type: 'success', text: 'Obnova zo zálohy prebehla úspešne! Obnovte stránku.' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Neplatný zálohový súbor JSON.' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 py-2 pb-20 sm:pb-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Nastavenia & Zálohovanie DB</h1>
        <p className="text-sm text-slate-400">
          Správa lokálnej IndexedDB databázy (Dexie), zálohy a optimalizácia
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Database Statistics */}
      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-rose-400" /> Štatistika IndexedDB Úložiska
        </h2>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-white">{customers.length}</p>
            <p className="text-xs text-slate-400">Zákazníčok</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-white">{gels.length}</p>
            <p className="text-xs text-slate-400">Gélov & Odtieňov</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <p className="text-2xl font-extrabold text-white">{visits.length}</p>
            <p className="text-xs text-slate-400">Návštev</p>
          </div>
        </div>
      </Card>

      {/* Backup & Restore */}
      <Card className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-indigo-400" /> Export & Import Zálohy
        </h2>
        <p className="text-xs text-slate-400">
          Vaše dáta sú bezpečne uložené výhradne vo vašom zariadení (Offline First). Môžete si stiahnuť
          kompletnú zálohu v JSON formáte a preniesť ju do iného telefónu alebo tabletu.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-indigo-600 hover:bg-indigo-500"
          >
            <Download className="w-4 h-4" /> Stiahnuť Zálohu (JSON)
          </Button>

          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors">
              <Upload className="w-4 h-4 text-pink-400" /> Obnoviť zo súboru JSON
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
          </label>
        </div>
      </Card>

      {/* PWA & System info */}
      <Card className="space-y-3 border-emerald-500/20 bg-emerald-950/10">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Shield className="w-5 h-5" /> PWA Status & Cloudflare Pages Ready
        </div>
        <p className="text-xs text-slate-300">
          Aplikácia spĺňa požiadavky na PWA, manifest.webmanifest, Service Worker caching a Lighthouse skóre.
        </p>
      </Card>
    </div>
  );
};
