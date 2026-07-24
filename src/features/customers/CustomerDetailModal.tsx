import React from 'react';
import { X, User, Phone, Instagram, Calendar, Sparkles, Clock, Trash2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Customer } from '../../types';
import { useVisits } from '../../hooks/useVisits';
import { useGels } from '../../hooks/useGels';
import { formatDate } from '../../utils/formatters';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onAddVisitForCustomer: (customerId: number) => void;
  onDeleteCustomer: (customerId: number) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onAddVisitForCustomer,
  onDeleteCustomer,
}) => {
  if (!isOpen || !customer) return null;

  const { visits } = useVisits(customer.id);
  const { gels } = useGels();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            {customer.photoUrl ? (
              <img
                src={customer.photoUrl}
                alt={customer.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400 font-extrabold text-2xl">
                {customer.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-extrabold text-white">{customer.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-1 text-indigo-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" /> {customer.phone}
                </a>
                {customer.instagram && (
                  <a
                    href={`https://instagram.com/${customer.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-pink-400 hover:underline"
                  >
                    <Instagram className="w-3.5 h-3.5" /> {customer.instagram}
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Note */}
        {customer.note && (
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
              Poznámka / Preferencie
            </p>
            <p className="text-sm text-slate-200">{customer.note}</p>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" /> História Návštev ({visits.length})
          </h3>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              onAddVisitForCustomer(customer.id!);
            }}
            className="bg-rose-600 hover:bg-rose-500"
          >
            <Plus className="w-4 h-4" /> Pridať Návštevu
          </Button>
        </div>

        {/* Visit List */}
        <div className="space-y-4">
          {visits.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              Zatiaľ žiadne evidované návštevy pre túto zákazníčku.
            </div>
          ) : (
            visits.map((visit) => {
              const usedGels = gels.filter((g) => visit.gelIds.includes(g.id!));
              return (
                <div
                  key={visit.id}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">
                      {formatDate(visit.date)}
                    </span>
                    {visit.priceEur && <Badge variant="success">{visit.priceEur} €</Badge>}
                  </div>

                  {visit.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {visit.photos.map((p, idx) => (
                        <img
                          key={idx}
                          src={p}
                          alt="Nail"
                          className="w-20 h-20 rounded-xl object-cover border border-slate-800"
                        />
                      ))}
                    </div>
                  )}

                  {usedGels.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400">Gély:</span>
                      {usedGels.map((g) => (
                        <span
                          key={g.id}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800"
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

                  {visit.note && <p className="text-xs text-slate-300">{visit.note}</p>}
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Naozaj chcete vymazať túto zákazníčku a jej návštevy?')) {
                onDeleteCustomer(customer.id!);
                onClose();
              }
            }}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" /> Vymazať Zákazníčku
          </Button>

          <Button variant="outline" size="sm" onClick={onClose}>
            Zatvoriť
          </Button>
        </div>
      </div>
    </div>
  );
};
