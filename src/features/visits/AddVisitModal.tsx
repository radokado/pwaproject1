import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, Camera, Sparkles, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCustomers } from '../../hooks/useCustomers';
import { useGels } from '../../hooks/useGels';
import { useVisits } from '../../hooks/useVisits';
import { imageCompressionService } from '../../services/imageCompressionService';

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCustomerId?: number;
}

export const AddVisitModal: React.FC<AddVisitModalProps> = ({
  isOpen,
  onClose,
  preselectedCustomerId,
}) => {
  const { customers } = useCustomers();
  const { gels } = useGels();
  const { addVisit } = useVisits();

  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(
    preselectedCustomerId || (customers[0]?.id as number) || 0
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedGelIds, setSelectedGelIds] = useState<number[]>([]);
  const [note, setNote] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(75);
  const [priceEur, setPriceEur] = useState<number>(35);
  const [gelSearch, setGelSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const compressedList = await Promise.all(
        files.map((file: File) => imageCompressionService.compressImage(file, 1200, 1200, 0.8))
      );
      setPhotos((prev) => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Failed compressing photos:', err);
    }
  };

  const toggleGelSelection = (gelId: number) => {
    setSelectedGelIds((prev) =>
      prev.includes(gelId) ? prev.filter((id) => id !== gelId) : [...prev, gelId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) return;

    setIsSubmitting(true);
    try {
      await addVisit({
        customerId: Number(selectedCustomerId),
        date,
        photos,
        gelIds: selectedGelIds,
        note: note.trim() || undefined,
        durationMinutes: Number(durationMinutes) || undefined,
        priceEur: Number(priceEur) || undefined,
        tags: ['Gél manikúra'],
      });

      setPhotos([]);
      setSelectedGelIds([]);
      setNote('');
      onClose();
    } catch (err) {
      console.error('Failed to add visit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGels = gels.filter((g) => {
    if (!gelSearch.trim()) return true;
    const q = gelSearch.toLowerCase();
    return (
      g.manufacturer.toLowerCase().includes(q) ||
      g.name.toLowerCase().includes(q) ||
      g.shade.toLowerCase().includes(q) ||
      (g.codeNumber && g.codeNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" /> Nová Návšteva & Manikúra
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Zákazníčka *
            </label>
            <select
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="">-- Vyberte zákazníčku --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Date, Duration, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dátum *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Trvanie (min)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cena (€)
              </label>
              <input
                type="number"
                value={priceEur}
                onChange={(e) => setPriceEur(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Gel Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Použité Gély ({selectedGelIds.length} vybrané)
            </label>
            <input
              type="text"
              placeholder="Vyhľadať gél podľa výrobcu alebo odtieňa..."
              value={gelSearch}
              onChange={(e) => setGelSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 mb-2 focus:outline-none focus:border-rose-500"
            />
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              {filteredGels.map((g) => {
                const isSelected = selectedGelIds.includes(g.id!);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGelSelection(g.id!)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"
                        style={{ backgroundColor: g.hexColor || '#f472b6' }}
                      />
                      <span className="font-semibold">{g.manufacturer}</span>
                      <span className="text-slate-400">{g.name} - {g.shade}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-rose-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photos Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fotografie hotových nechtov
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {photos.map((p, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={p}
                    alt={`Nail ${idx}`}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-14 h-14 rounded-xl bg-slate-950 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-rose-500 cursor-pointer transition-colors">
                <Camera className="w-5 h-5 text-slate-500" />
                <span className="text-[9px] mt-0.5">Pridať</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotosUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Poznámka k návšteve
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Poznámky k manikúre, dizajnu..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Zrušiť
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedCustomerId}
              className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
            >
              Uložiť Návštevu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
