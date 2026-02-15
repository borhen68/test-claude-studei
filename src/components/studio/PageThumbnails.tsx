'use client';

import { motion, Reorder } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Page {
  id: string;
  pageNumber: number;
  template: string;
  photos: any[];
}

interface PageThumbnailsProps {
  pages: Page[];
  currentIndex: number;
  onPageSelect: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
}

export default function PageThumbnails({
  pages,
  currentIndex,
  onPageSelect,
  onReorder,
  onAddPage,
  onDeletePage,
}: PageThumbnailsProps) {
  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Pages</h3>
          <span className="text-xs text-slate-500">{pages.length} total</span>
        </div>
        <button
          onClick={onAddPage}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-xl transition-colors border border-violet-600/30"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Page</span>
        </button>
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {pages.map((page, index) => (
          <motion.div
            key={page.id}
            layoutId={page.id}
            className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
              index === currentIndex
                ? 'ring-2 ring-violet-500 shadow-lg shadow-violet-500/30'
                : 'hover:ring-2 hover:ring-slate-600'
            }`}
            onClick={() => onPageSelect(index)}
          >
            {/* Thumbnail */}
            <div className="aspect-[8.5/11] bg-slate-800 relative">
              {/* Page Number */}
              <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-300">
                {page.pageNumber + 1}
              </div>

              {/* Template Preview */}
              <div className="absolute inset-0 p-4 flex items-center justify-center">
                <div className="w-full h-full bg-slate-700/30 rounded-lg flex items-center justify-center">
                  {page.photos.length > 0 ? (
                    <div className={`grid gap-1 w-full h-full p-2 ${
                      page.template === 'hero' ? 'grid-cols-1' :
                      page.template.includes('duo') ? 'grid-cols-2' :
                      page.template.includes('trio') ? 'grid-cols-3' :
                      page.template.includes('quad') ? 'grid-cols-2 grid-rows-2' :
                      'grid-cols-1'
                    }`}>
                      {page.photos.slice(0, 4).map((photo, i) => (
                        <div key={i} className="bg-slate-600 rounded" />
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Empty</span>
                  )}
                </div>
              </div>

              {/* Drag Handle */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1 bg-slate-900/90 backdrop-blur-sm rounded-lg cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Delete Button */}
              {pages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePage(index);
                  }}
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-600 hover:bg-red-700 rounded-lg"
                  aria-label="Delete page"
                >
                  <Trash2 className="h-3.5 w-3.5 text-white" />
                </button>
              )}
            </div>

            {/* Current Indicator */}
            {index === currentIndex && (
              <motion.div
                layoutId="currentPage"
                className="absolute inset-0 border-2 border-violet-500 rounded-2xl pointer-events-none"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
