'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewModalProps {
  isOpen: boolean;
  book: any;
  onClose: () => void;
}

export function PreviewModal({ isOpen, book, onClose }: PreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const pages = book?.pages || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Preview Book</h2>
                <p className="text-slate-400">
                  Page {currentPage + 1} of {pages.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                  aria-label="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Page Preview */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ aspectRatio: '8.5 / 11' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full p-12"
                >
                  {pages[currentPage] ? (
                    <div className="w-full h-full bg-neutral-50 rounded-lg flex items-center justify-center">
                      <p className="text-neutral-400">Page {currentPage + 1} content</p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-neutral-400">Empty page</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>

              <div className="flex gap-2">
                {pages.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentPage
                        ? 'bg-violet-500 w-8'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="secondary"
                onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                disabled={currentPage === pages.length - 1}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
