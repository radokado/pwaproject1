import React, { useState } from 'react';
import { X, Sparkles, Camera, CheckCircle2, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useGels } from '../../hooks/useGels';
import { aiVisionService } from '../../services/aiVisionService';
import { AIGelRecognitionResult } from '../../types';

interface AIGelRecognizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGel?: (gelId: number) => void;
}

export const AIGelRecognizerModal: React.FC<AIGelRecognizerModalProps> = ({
  isOpen,
  onClose,
  onSelectGel,
}) => {
  const { gels, addGel } = useGels();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AIGelRecognitionResult[]>([]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64 = evt.target?.result as string;
      setPhoto(base64);
      setIsAnalyzing(true);
      try {
        const recognized = await aiVisionService.recognizeGelBottles(base64, gels);
        setResults(recognized);
      } catch (err) {
        console.error('AI Recognition error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSuggestedGel = async (res: AIGelRecognitionResult) => {
    if (!res.suggestedGel) return;
    const newId = await addGel(res.suggestedGel);
    if (onSelectGel) onSelectGel(newId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" /> AI Rozpoznanie Gélov
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!photo ? (
          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-4 bg-slate-950/60">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-white">Odfoťte fľaštičky použitých gélov</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                AI automaticky deteguje značku, odtieň a číslo fľaštičky a porovná ich s vašou databázou.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-rose-600/25 transition-all">
              <Camera className="w-4 h-4" /> Odfotiť / Vybrať fotku
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-48 bg-slate-950">
              <img src={photo} alt="AI Gel Bottle" className="w-full h-full object-contain" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-rose-400">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <p className="text-xs font-semibold text-slate-200">AI analyzuje fľaštičky a odtiene...</p>
                </div>
              )}
            </div>

            {results.map((res, idx) => (
              <div key={idx} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold text-white">
                        {res.manufacturer} - {res.name} ({res.shade})
                      </p>
                      <p className="text-[11px] text-slate-400">Kód: {res.codeNumber}</p>
                    </div>
                  </div>
                  <Badge variant="success">{Math.round((res.confidenceScore || 0) * 100)}% Zhoda</Badge>
                </div>

                {res.matchedGelId ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                    <span>Gél už existuje vo vašej databáze!</span>
                    {onSelectGel && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          onSelectGel(res.matchedGelId!);
                          onClose();
                        }}
                      >
                        Vybrať gél
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" /> Nový gél nenájdený v DB
                    </span>
                    <Button size="sm" variant="secondary" onClick={() => handleSaveSuggestedGel(res)}>
                      <Plus className="w-3.5 h-3.5" /> Uložiť do DB
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setPhoto(null)}>
                Skúsiť inú fotku
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Zatvoriť
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
