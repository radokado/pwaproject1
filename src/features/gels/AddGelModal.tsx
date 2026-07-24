import React, { useState } from 'react';
import { X, Sparkles, Camera } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useGels } from '../../hooks/useGels';
import { GelType } from '../../types';
import { imageCompressionService } from '../../services/imageCompressionService';

interface AddGelModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledGel?: Partial<GelType>;
}

export const AddGelModal: React.FC<AddGelModalProps> = ({ isOpen, onClose }) => {
  const { addGel } = useGels();
  const [manufacturer, setManufacturer] = useState('');
  const [name, setName] = useState('');
  const [shade, setShade] = useState('');
  const [codeNumber, setCodeNumber] = useState('');
  const [hexColor, setHexColor] = useState('#f472b6');
  const [gelType, setGelType] = useState<GelType>('base');
  const [volumeMl, setVolumeMl] = useState<number>(13);
  const [photoUrl, setPhotoUrl] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await imageCompressionService.compressImage(file, 800, 800, 0.8);
        setPhotoUrl(compressed);
      } catch (err) {
        console.error('Error compressing photo:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturer.trim() || !name.trim() || !shade.trim()) return;

    setIsSubmitting(true);
    try {
      await addGel({
        manufacturer: manufacturer.trim(),
        name: name.trim(),
        shade: shade.trim(),
        codeNumber: codeNumber.trim() || undefined,
        hexColor,
        gelType,
        volumeMl: Number(volumeMl) || undefined,
        photoUrl: photoUrl || undefined,
        note: note.trim() || undefined,
      });

      setManufacturer('');
      setName('');
      setShade('');
      setCodeNumber('');
      setPhotoUrl('');
      setNote('');
      onClose();
    } catch (err) {
      console.error('Failed adding gel:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" /> Nový Gél do Databázy
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Výrobca *
              </label>
              <input
                type="text"
                required
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="napr. Indigo, Semilac"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Názov *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="napr. Mineral Base"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Odtieň *
              </label>
              <input
                type="text"
                required
                value={shade}
                onChange={(e) => setShade(e.target.value)}
                placeholder="napr. Natural Blush"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Číslo / Kód
              </label>
              <input
                type="text"
                value={codeNumber}
                onChange={(e) => setCodeNumber(e.target.value)}
                placeholder="napr. MB-01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Typ Gélu
              </label>
              <select
                value={gelType}
                onChange={(e) => setGelType(e.target.value as GelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="base">Báza</option>
                <option value="builder">Stavebný gél</option>
                <option value="color">Farebný gél/lak</option>
                <option value="top">Top Coat</option>
                <option value="effect">Efektový gél</option>
                <option value="other">Iný</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Farba Vzorky
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                <input
                  type="color"
                  value={hexColor}
                  onChange={(e) => setHexColor(e.target.value)}
                  className="w-7 h-7 rounded bg-transparent border-0 cursor-pointer"
                />
                <span className="text-[10px] text-slate-300 font-mono">{hexColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Objem (ml)
              </label>
              <input
                type="number"
                value={volumeMl}
                onChange={(e) => setVolumeMl(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fotografia obalu (voliteľné)
            </label>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Bottle"
                  className="w-12 h-12 rounded-xl object-cover border border-rose-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                  <Camera className="w-5 h-5" />
                </div>
              )}
              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-medium transition-colors">
                Odfotiť / Vybrať
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Zrušiť
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
            >
              Uložiť Gél
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
