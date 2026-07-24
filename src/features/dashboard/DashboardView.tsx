import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Calendar,
  Plus,
  Search,
  Camera,
  ChevronRight,
  Clock,
  Euro,
  Tag,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useCustomers } from '../../hooks/useCustomers';
import { useGels } from '../../hooks/useGels';
import { useVisits } from '../../hooks/useVisits';
import { AddCustomerModal } from '../customers/AddCustomerModal';
import { AddVisitModal } from '../visits/AddVisitModal';
import { AIGelRecognizerModal } from '../ai/AIGelRecognizerModal';
import { formatDate } from '../../utils/formatters';
import { NavLink } from 'react-router-dom';

export const DashboardView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const { customers } = useCustomers(searchQuery);
  const { gels } = useGels(searchQuery);
  const { visits } = useVisits();

  const filteredVisits = visits.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const customer = customers.find((c) => c.id === v.customerId);
    return (
      (customer && customer.name.toLowerCase().includes(q)) ||
      (v.note && v.note.toLowerCase().includes(q)) ||
      (v.tags && v.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-8 py-2 pb-20 sm:pb-8">
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Vyhľadať zákazníčku, gél, farbu, poznámku..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/50 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setIsVisitModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25"
          >
            <Plus className="w-4 h-4" /> Nová Návšteva
          </Button>

          <Button variant="secondary" onClick={() => setIsCustomerModalOpen(true)}>
            <Users className="w-4 h-4 text-rose-400" /> Nová Zákazníčka
          </Button>

          <Button variant="outline" onClick={() => setIsAiModalOpen(true)}>
            <Camera className="w-4 h-4 text-pink-400" /> AI Fotka
          </Button>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NavLink to="/customers">
          <Card hoverable className="space-y-2 border-rose-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Zákazníčky
              </span>
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{customers.length}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Zobraziť všetky zákazníčky <ChevronRight className="w-3 h-3 text-rose-400" />
            </p>
          </Card>
        </NavLink>

        <Card className="space-y-2 border-pink-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Návštevy Celkom
            </span>
            <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{visits.length}</p>
          <p className="text-xs text-slate-400">Evidované v lokálnej IndexedDB</p>
        </Card>

        <NavLink to="/gels">
          <Card hoverable className="space-y-2 border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Databáza Gélov
              </span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{gels.length}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Spravovať odtiene & značky <ChevronRight className="w-3 h-3 text-amber-400" />
            </p>
          </Card>
        </NavLink>
      </div>

      {/* Recent Visits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Posledné Návštevy Manikúry</h2>
            <p className="text-xs text-slate-400">História prác, použitých gélov a fotografií</p>
          </div>
        </div>

        {filteredVisits.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 space-y-3">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
            <p>Zatiaľ žiadne evdované návštevy. Kliknite na "Nová Návšteva" vyššie.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVisits.slice(0, 6).map((visit) => {
              const customer = customers.find((c) => c.id === visit.customerId);
              const usedGels = gels.filter((g) => visit.gelIds.includes(g.id!));

              return (
                <Card key={visit.id} className="space-y-3 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">
                        {customer ? customer.name : 'Zákazníčka'}
                      </h3>
                      <p className="text-xs text-slate-400">{formatDate(visit.date)}</p>
                    </div>
                    {visit.priceEur && (
                      <Badge variant="success" size="md">
                        {visit.priceEur} €
                      </Badge>
                    )}
                  </div>

                  {visit.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {visit.photos.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Nail preview"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  {usedGels.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400">Gély:</span>
                      {usedGels.map((g) => (
                        <span
                          key={g.id}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: g.hexColor || '#f472b6' }}
                          />
                          {g.manufacturer} {g.shade}
                        </span>
                      ))}
                    </div>
                  )}

                  {visit.note && (
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      {visit.note}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
      <AddVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />
      <AIGelRecognizerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
