'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Edit3, Trash2, Crop, Image as ImageIcon
} from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
}

interface Page {
  id: string;
  pageNumber: number;
  template: string;
  photos: Photo[];
  caption?: string;
}

interface BookCanvasProps {
  page: Page;
  selectedPhotoId: string | null;
  onPhotoSelect: (id: string | null) => void;
  onPhotoUpdate: (photoId: string, updates: Partial<Photo>) => void;
  onTemplateChange: (template: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function BookCanvas({
  page,
  selectedPhotoId,
  onPhotoSelect,
  onPhotoUpdate,
  onTemplateChange,
  onNavigate,
}: BookCanvasProps) {
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);

  const getTemplateLayout = (template: string) => {
    const layouts: Record<string, string> = {
      hero: 'grid-cols-1 grid-rows-1',
      duo_horizontal: 'grid-cols-2 grid-rows-1',
      duo_vertical: 'grid-cols-1 grid-rows-2',
      trio: 'grid-cols-3 grid-rows-1',
      trio_asymmetric: 'grid-cols-3 grid-rows-2',
      quad: 'grid-cols-2 grid-rows-2',
      quad_grid: 'grid-cols-2 grid-rows-2',
      gallery_6: 'grid-cols-3 grid-rows-2',
    };
    return layouts[template] || 'grid-cols-2 grid-rows-2';
  };

  const slots = page.template === 'hero' ? 1 :
    page.template.includes('duo') ? 2 :
    page.template.includes('trio') ? 3 :
    page.template.includes('quad') ? 4 :
    page.template === 'gallery_6' ? 6 : 4;

  return (
    <div className="flex-1 flex flex-col bg-slate-800/30 backdrop-blur-sm">
      {/* Canvas Controls */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-slate-300 font-medium">
            Page {page.pageNumber + 1}
          </span>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Template: <span className="text-violet-400 font-semibold">{page.template.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <motion.div
          key={page.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-2xl shadow-2xl"
          style={{
            aspectRatio: '8.5 / 11',
            maxHeight: '80vh',
            width: 'auto',
          }}
        >
          {/* Page Spread */}
          <div className={`absolute inset-0 p-8 grid gap-4 ${getTemplateLayout(page.template)}`}>
            {Array.from({ length: slots }).map((_, index) => {
              const photo = page.photos[index];
              const isSelected = photo?.id === selectedPhotoId;
              const isHovered = photo?.id === hoveredPhotoId;

              return (
                <motion.div
                  key={index}
                  className={`relative rounded-xl overflow-hidden bg-neutral-100 ${
                    isSelected ? 'ring-4 ring-violet-500 ring-offset-4' : ''
                  }`}
                  onClick={() => photo && onPhotoSelect(photo.id)}
                  onMouseEnter={() => photo && setHoveredPhotoId(photo.id)}
                  onMouseLeave={() => setHoveredPhotoId(null)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {photo ? (
                    <>
                      {/* Photo */}
                      <img
                        src={photo.url || photo.thumbnailUrl}
                        alt={photo.caption || `Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Hover Overlay */}
                      <AnimatePresence>
                        {(isHovered || isSelected) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center p-4"
                          >
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Open crop modal
                                }}
                                className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-xl text-slate-900 transition-colors"
                                aria-label="Crop photo"
                              >
                                <Crop className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Open caption editor
                                }}
                                className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-xl text-slate-900 transition-colors"
                                aria-label="Edit caption"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPhotoUpdate(photo.id, { url: '' });
                                }}
                                className="p-2 bg-red-600/90 backdrop-blur-sm hover:bg-red-600 rounded-xl text-white transition-colors"
                                aria-label="Remove photo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Caption */}
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="text-white text-sm">{photo.caption}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty Slot */
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
                      <ImageIcon className="h-12 w-12 mb-2" />
                      <p className="text-sm font-medium">Add Photo</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Page Shadow/Curl Effect */}
          <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none" />
        </motion.div>
      </div>

      {/* Bottom Info */}
      <div className="p-4 border-t border-slate-700 text-center">
        <p className="text-xs text-slate-500">
          Click a photo to edit • Change layout in the right toolbar
        </p>
      </div>
    </div>
  );
}
