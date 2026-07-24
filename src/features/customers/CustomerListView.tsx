import React, { useState } from 'react';
import { Users, Plus, Search, Phone, Instagram, Calendar, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useCustomers } from '../../hooks/useCustomers';
import { Customer } from '../../types';
import { AddCustomerModal } from './AddCustomerModal';
import { CustomerDetailModal } from './CustomerDetailModal';
import { AddVisitModal } from '../visits/AddVisitModal';
import { formatDate } from '../../utils/formatters';

export const CustomerListView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [visitModalCustomerId, setVisitModalCustomerId] = useState<number | null>(null);

  const { customers, deleteCustomer } = useCustomers(search);

  return (
    <div className="space-y-6 py-2 pb-20 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Databáza Zákazníčok</h1>
          <p className="text-sm text-slate-400">
            Správa kontaktov, preferencií a histórie návštev ({customers.length} zákazníčok)
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-500 shadow-rose-600/25"
        >
          <Plus className="w-4 h-4" /> Nová Zákazníčka
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Vyhľadať podľa mena, telefónu alebo Instagramu..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/50"
        />
      </div>

      {/* Customer Cards Grid */}
      {customers.length === 0 ? (
        <Card className="text-center py-12 text-slate-400 space-y-3">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <p>Nenašli sa žiadne zákazníčky.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              hoverable
              onClick={() => setSelectedCustomer(customer)}
              className="space-y-3 relative group"
            >
              <div className="flex items-center gap-3">
                {customer.photoUrl ? (
                  <img
                    src={customer.photoUrl}
                    alt={customer.name}
                    className="w-12 h-12 rounded-xl object-cover border border-rose-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400 font-bold text-lg shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-100 text-base truncate group-hover:text-rose-300 transition-colors">
                    {customer.name}
                  </h3>
                  <a
                    href={`tel:${customer.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> {customer.phone}
                  </a>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-rose-400 transition-colors shrink-0" />
              </div>

              {customer.instagram && (
                <p className="text-xs text-pink-400 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5" /> {customer.instagram}
                </p>
              )}

              {customer.note && (
                <p className="text-xs text-slate-400 line-clamp-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                  {customer.note}
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Posledná návšteva:
                </span>
                <span className="font-semibold text-slate-300">
                  {customer.lastVisitAt ? formatDate(customer.lastVisitAt) : 'Zatiaľ nebola'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onAddVisitForCustomer={(customerId) => {
          setSelectedCustomer(null);
          setVisitModalCustomerId(customerId);
        }}
        onDeleteCustomer={(id) => deleteCustomer(id)}
      />

      <AddVisitModal
        isOpen={!!visitModalCustomerId}
        preselectedCustomerId={visitModalCustomerId || undefined}
        onClose={() => setVisitModalCustomerId(null)}
      />
    </div>
  );
};
