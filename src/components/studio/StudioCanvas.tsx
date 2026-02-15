'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { ZoomIn, ZoomOut, Grid3x3, Maximize2 } from 'lucide-react';
import PhotoSlot from './PhotoSlot';

interface Photo {
  id: string;
  processedUrl: string;
  thumbnailUrl: string;
  orientation: 'portrait' | 'landscape' | 'square';
}

interface PhotoLayout {
  photoId: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface PageData {
  id: string;
  pageNumber: number;
  template: string;
  layoutData: {
    layouts: PhotoLayout[];
  };
  textContent?: string;
}

interface StudioCanvasProps {
  page: PageData;
  photos: Map<string, Photo>;
  onPhotoMove: (fromSlot: string, toSlot: string) => void;
  onPhotoEdit: (photoId: string) => void;
  onPhotoSelect: (photoId: string | null) => void;
  selectedPhoto: string | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

export default function StudioCanvas({
  page,
  photos,
  onPhotoMove,
  onPhotoEdit,
  onPhotoSelect,
  selectedPhoto,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
}: StudioCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const layouts = page.layoutData?.layouts || [];

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      onPhotoMove(active.id, over.id);
    }
    
    setActiveId(null);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[1400px]">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-light">
            Page {page.pageNumber}
          </span>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-white/50 text-xs">
            {page.template} layout
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            <motion.button
              onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
              disabled={zoom <= 0.5}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ZoomOut className="h-4 w-4" />
            </motion.button>
            <span className="text-white text-sm min-w-[60px] text-center font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <motion.button
              onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
              disabled={zoom >= 2}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ZoomIn className="h-4 w-4" />
            </motion.button>
            <div className="h-6 w-px bg-white/20 mx-1" />
            <motion.button
              onClick={() => onZoomChange(1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-2 py-1 text-white hover:bg-white/10 rounded-lg text-xs transition-all"
            >
              Fit
            </motion.button>
          </div>

          {/* Grid Toggle */}
          <motion.button
            onClick={onToggleGrid}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-all border ${
              showGrid
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
            title="Toggle Grid"
          >
            <Grid3x3 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <motion.div
          className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden relative"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
          }}
          animate={{ scale: zoom }}
          transition={{ duration: 0.2 }}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
          )}

          {/* Photo Slots */}
          <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <AnimatePresence>
              {layouts.map((layout, index) => {
                const photo = photos.get(layout.photoId);
                if (!photo) return null;

                return (
                  <PhotoSlot
                    key={layout.photoId}
                    photo={photo}
                    layout={layout}
                    index={index}
                    isSelected={selectedPhoto === layout.photoId}
                    onSelect={() => onPhotoSelect(layout.photoId)}
                    onEdit={() => onPhotoEdit(layout.photoId)}
                  />
                );
              })}
            </AnimatePresence>

            {/* Page Caption */}
            {page.textContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-6 right-6 text-center"
              >
                <p className="text-gray-700 text-lg italic font-light">
                  {page.textContent}
                </p>
              </motion.div>
            )}

            {/* Page Number */}
            <div className="absolute bottom-4 right-6 text-gray-400 text-sm font-light">
              {page.pageNumber}
            </div>
          </div>
        </motion.div>

        <DragOverlay>
          {activeId && (
            <div className="w-32 h-32 bg-purple-500/20 border-2 border-purple-500 rounded-lg" />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
