import React, { useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight, ZoomIn, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useVisits } from '../../hooks/useVisits';
import { useCustomers } from '../../hooks/useCustomers';
import { formatDate } from '../../utils/formatters';

export const GalleryView: React.FC = () => {
  const { visits } = useVisits();
  const { customers } = useCustomers();

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Flatten all photos from visits into a rich gallery array
  const allGalleryItems = visits.flatMap((visit) => {
    const customer = customers.find((c) => c.id === visit.customerId);
    return visit.photos.map((photoUrl) => ({
      photoUrl,
      customerName: customer ? customer.name : 'Zákazníčka',
      date: visit.date,
      tags: visit.tags || [],
      note: visit.note,
    }));
  });

  const activePhoto = activePhotoIndex !== null ? allGalleryItems[activePhotoIndex] : null;

  return (
    <div className="space-y-6 py-2 pb-20 sm:pb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Fotogaléria Prác & Manikúry</h1>
        <p className="text-sm text-slate-400">
          Inšpirácie, vytvorené dizajny a výber fotografií hotových nechtov ({allGalleryItems.length}{' '}
          fotografií)
        </p>
      </div>

      {allGalleryItems.length === 0 ? (
        <Card className="text-center py-12 text-slate-400 space-y-3">
          <Image className="w-8 h-8 text-slate-600 mx-auto" />
          <p>Zatiaľ nemáte žiadne fotografie nechtov v galérii.</p>
          <p className="text-xs text-slate-500">
            Pridajte novú návštevu a odfotografujte hotovú manikúru!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {allGalleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-slate-800 bg-slate-900 shadow-md hover:border-rose-500/50 hover:scale-[1.02] transition-all duration-200"
            >
              <img
                src={item.photoUrl}
                alt={item.customerName}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <p className="text-xs font-bold">{item.customerName}</p>
                <p className="text-[10px] text-slate-300">{formatDate(item.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && activePhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {activePhotoIndex > 0 && (
            <button
              onClick={() => setActivePhotoIndex(activePhotoIndex - 1)}
              className="absolute left-4 text-slate-300 hover:text-white p-3 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {activePhotoIndex < allGalleryItems.length - 1 && (
            <button
              onClick={() => setActivePhotoIndex(activePhotoIndex + 1)}
              className="absolute right-4 text-slate-300 hover:text-white p-3 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-3xl max-h-[85vh] flex flex-col items-center space-y-4">
            <img
              src={activePhoto.photoUrl}
              alt={activePhoto.customerName}
              className="max-h-[70vh] rounded-2xl object-contain border border-slate-800 shadow-2xl"
            />

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">{activePhoto.customerName}</h3>
              <p className="text-xs text-rose-400">{formatDate(activePhoto.date)}</p>
              {activePhoto.note && (
                <p className="text-xs text-slate-300 max-w-md">{activePhoto.note}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
