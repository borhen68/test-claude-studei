'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, MoreVertical, Copy, Trash2, Image as ImageIcon } from 'lucide-react';

interface Page {
  id: string;
  pageNumber: number;
  photoIds: string[];
  template: string;
}

interface PageSidebarProps {
  pages: Page[];
  currentPage: number;
  onReorder: (pages: Page[]) => void;
  onAdd: () => void;
  onDelete: (pageId: string) => void;
  onDuplicate: (pageId: string) => void;
  onNavigate: (index: number) => void;
}

export default function PageSidebar({
  pages,
  currentPage,
  onReorder,
  onAdd,
  onDelete,
  onDuplicate,
  onNavigate,
}: PageSidebarProps) {
  const [contextMenu, setContextMenu] = useState<{ pageId: string; x: number; y: number } | null>(null);

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white text-sm font-semibold mb-2">Pages</h3>
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2 text-sm transition-colors shadow-lg shadow-purple-500/30"
        >
          <Plus className="h-4 w-4" />
          Add Page
        </motion.button>
      </div>

      {/* Page List */}
      <Reorder.Group
        axis="y"
        values={pages}
        onReorder={onReorder}
        className="space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent"
      >
        {pages.map((page, index) => (
          <Reorder.Item key={page.id} value={page}>
            <motion.div
              onClick={() => onNavigate(index)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ pageId: page.id, x: e.clientX, y: e.clientY });
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                currentPage === index
                  ? 'border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                <ImageIcon className="h-6 w-6 text-white/30" />
                
                {/* Photo count badge */}
                {page.photoIds.length > 0 && (
                  <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {page.photoIds.length}
                  </div>
                )}
                
                {/* Current page indicator */}
                {currentPage === index && (
                  <div className="absolute inset-0 bg-purple-500/20" />
                )}
              </div>

              {/* Page number */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs font-mono">
                {index + 1}
              </div>

              {/* Context menu button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenu({ pageId: page.id, x: e.clientX, y: e.clientY });
                }}
                className="absolute top-1 left-1 p-1 bg-black/50 hover:bg-black/70 rounded transition-colors"
              >
                <MoreVertical className="h-3 w-3 text-white" />
              </button>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 bg-gray-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden"
              style={{ left: contextMenu.x, top: contextMenu.y }}
            >
              <button
                onClick={() => {
                  onDuplicate(contextMenu.pageId);
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center gap-2 text-sm transition-colors"
              >
                <Copy className="h-4 w-4" />
                Duplicate Page
              </button>
              <button
                onClick={() => {
                  onDelete(contextMenu.pageId);
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 flex items-center gap-2 text-sm transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Page
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page count */}
      <div className="mt-3 pt-3 border-t border-white/10 text-center text-white/50 text-xs">
        {pages.length} {pages.length === 1 ? 'page' : 'pages'}
      </div>
    </div>
  );
}
