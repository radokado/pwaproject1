import React, { useState } from 'react';
import { Sparkles, Plus, Search, Camera, Trash2, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useGels } from '../../hooks/useGels';
import { AddGelModal } from './AddGelModal';
import { AIGelRecognizerModal } from '../ai/AIGelRecognizerModal';

export const GelsListView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const { gels, deleteGel } = useGels(search, typeFilter);

  const gelTypeLabels: Record<string, string> = {
    base: 'Báza',
    builder: 'Stavebný gél',
    color: 'Farebný gél',
    top: 'Top Coat',
    effect: 'Efektový gél',
    other: 'Iný',
  };

  return (
    <div className="space-y-6 py-2 pb-20 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Databáza Gélov a Odtieňov</h1>
          <p className="text-sm text-slate-400">
            Evidencia báz, stavebných gélov, farebných lakov a top coatov ({gels.length} v databáze)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsAiModalOpen(true)}>
            <Camera className="w-4 h-4 text-pink-400" /> AI Odfotiť fľaštičku
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-500 shadow-rose-600/25"
          >
            <Plus className="w-4 h-4" /> Pridať Gél
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Vyhľadať podľa značky (Indigo, Semilac...), odtieňa alebo čísla..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/50"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-rose-500 cursor-pointer"
        >
          <option value="all">Všetky typy gélov</option>
          <option value="base">Bázy</option>
          <option value="builder">Stavebné gély</option>
          <option value="color">Farebné gély/laky</option>
          <option value="top">Top Coaty</option>
          <option value="effect">Efektové gély</option>
        </select>
      </div>

      {/* Gel Cards Grid */}
      {gels.length === 0 ? (
        <Card className="text-center py-12 text-slate-400 space-y-3">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <p>Nenašli sa žiadne gély podľa zadaných kritérií.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gels.map((gel) => (
            <Card key={gel.id} className="space-y-3 relative group hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-slate-700 shrink-0 shadow-sm"
                    style={{ backgroundColor: gel.hexColor || '#f472b6' }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{gel.manufacturer}</h3>
                    <p className="text-xs font-semibold text-rose-300">{gel.name}</p>
                  </div>
                </div>

                <Badge variant="neutral" size="sm">
                  {gelTypeLabels[gel.gelType] || gel.gelType}
                </Badge>
              </div>

              <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Odtieň:</span>
                  <span className="font-semibold text-white">{gel.shade}</span>
                </div>
                {gel.codeNumber && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Kód / Číslo:</span>
                    <span className="font-mono text-rose-400 font-bold">{gel.codeNumber}</span>
                  </div>
                )}
                {gel.volumeMl && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Objem:</span>
                    <span className="text-slate-300">{gel.volumeMl} ml</span>
                  </div>
                )}
              </div>

              {gel.note && <p className="text-xs text-slate-400">{gel.note}</p>}

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    if (confirm(`Vymazať gél ${gel.manufacturer} - ${gel.shade}?`)) {
                      deleteGel(gel.id!);
                    }
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                  title="Vymazať"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddGelModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <AIGelRecognizerModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
};
