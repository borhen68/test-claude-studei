'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ShoppingCart,
  Download,
  Loader2,
  Grid3x3,
  Edit3,
  Save,
  X,
  GripVertical,
  Trash2,
  ChevronDown,
} from 'lucide-react';

interface Photo {
  id: string;
  processedUrl: string;
  thumbnailUrl: string;
  originalUrl: string;
  orientation: 'portrait' | 'landscape' | 'square';
}

interface Page {
  id: string;
  pageNumber: number;
  template: string;
  photoIds: string[];
  layoutData: any;
  textContent?: string;
}

interface Book {
  id: string;
  title: string;
  status: string;
  pageCount: number;
  photos: Photo[];
  pages: Page[];
  theme?: string;
}

export default function BookViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books?id=${resolvedParams.id}`);
        const data = await res.json();

        if (data.success) {
          setBook(data.book);
        } else {
          alert('Book not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [resolvedParams.id, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 't') setShowThumbnails((s) => !s);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentPage, book]);

  const nextPage = () => {
    if (book && currentPage < book.pages.length - 1) {
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleCheckout = () => {
    router.push(`/checkout?bookId=${resolvedParams.id}`);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // Trigger PDF generation
      const res = await fetch(`/api/books/${resolvedParams.id}/export`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success && data.pdfUrl) {
        // Download the PDF
        window.open(data.pdfUrl, '_blank');
      } else {
        alert('Failed to export PDF. Please try again.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const saveEdits = async () => {
    if (!book) return;
    
    try {
      const res = await fetch(`/api/books/${book.id}/pages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: book.pages }),
      });
      
      if (res.ok) {
        setEditMode(false);
        alert('Changes saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-light">Loading your beautiful book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Book not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = book.pages[currentPage];
  const photoMap = new Map(book.photos.map((p) => [p.id, p]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/30 backdrop-blur-xl border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {book.title}
            </h1>
            <p className="text-sm text-purple-300 font-light">
              Page {currentPage + 1} of {book.pages.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Edit Mode Toggle */}
            {editMode ? (
              <>
                <button
                  onClick={saveEdits}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all flex items-center gap-2 shadow-lg shadow-green-500/30"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2 border border-white/10"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl px-3 py-2 border border-white/10">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                disabled={zoom <= 0.5}
                className="p-1.5 text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-white text-sm min-w-[50px] text-center font-mono">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                disabled={zoom >= 2}
                className="p-1.5 text-white hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnails Toggle */}
            <button
              onClick={() => setShowThumbnails((s) => !s)}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-all border border-white/10"
              title="Toggle thumbnails (T)"
            >
              <Grid3x3 className="h-5 w-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-all border border-white/10"
              title="Fullscreen (F)"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export PDF
            </button>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30 font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              Order Print
            </button>
          </div>
        </div>
      </motion.div>

      {/* Book Viewer */}
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-8 relative">
        {/* Navigation Arrows */}
        <motion.button
          onClick={prevPage}
          disabled={currentPage === 0}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-8 z-20 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all disabled:hover:scale-100"
        >
          <ChevronLeft className="h-8 w-8 text-purple-900" />
        </motion.button>

        {/* Page Container with Flip Animation */}
        <div className="relative perspective-[2000px]">
          <AnimatePresence mode="wait" custom={currentPage}>
            <motion.div
              key={currentPage}
              custom={currentPage}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="bg-white shadow-2xl rounded-lg overflow-hidden"
              style={{
                width: `${Math.min(1000, window.innerWidth - 200)}px`,
                height: `${Math.min(750, window.innerHeight - 300)}px`,
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
              }}
            >
              {currentPageData && (
                <PageRenderer
                  page={currentPageData}
                  photos={photoMap}
                  editMode={editMode}
                  onUpdate={(updatedPage) => {
                    const newPages = [...book.pages];
                    const index = newPages.findIndex(
                      (p) => p.id === updatedPage.id
                    );
                    if (index !== -1) {
                      newPages[index] = updatedPage;
                      setBook({ ...book, pages: newPages });
                    }
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Page Number Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-6 py-2 rounded-full text-white text-sm font-light"
          >
            {currentPage + 1} / {book.pages.length}
          </motion.div>
        </div>

        <motion.button
          onClick={nextPage}
          disabled={currentPage === book.pages.length - 1}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-8 z-20 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all disabled:hover:scale-100"
        >
          <ChevronRight className="h-8 w-8 text-purple-900" />
        </motion.button>
      </div>

      {/* Thumbnail Navigation */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 z-10"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowThumbnails(false)}
                  className="p-1 hover:bg-white/10 rounded transition-all"
                >
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>
                <span className="text-white text-sm font-light">
                  Page Navigation
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                {book.pages.map((page, index) => (
                  <motion.button
                    key={page.id}
                    onClick={() => setCurrentPage(index)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden border-2 transition-all shadow-lg ${
                      currentPage === index
                        ? 'border-purple-500 ring-4 ring-purple-500/50 shadow-purple-500/50'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                      <span className="text-gray-600 text-xs font-mono">
                        {index + 1}
                      </span>
                      {currentPage === index && (
                        <div className="absolute inset-0 bg-purple-500/20" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Overlay */}
      <div className="fixed bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs space-y-1 border border-white/10">
        <div className="font-semibold mb-2 text-purple-300">Keyboard Shortcuts</div>
        <div>← → : Navigate pages</div>
        <div>F : Toggle fullscreen</div>
        <div>T : Toggle thumbnails</div>
        <div>ESC : Exit fullscreen</div>
      </div>
    </div>
  );
}

// Page Renderer Component
function PageRenderer({
  page,
  photos,
  editMode,
  onUpdate,
}: {
  page: Page;
  photos: Map<string, Photo>;
  editMode: boolean;
  onUpdate: (page: Page) => void;
}) {
  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(page.textContent || '');
  const layouts = page.layoutData?.layouts || [];

  const handleRemovePhoto = (photoId: string) => {
    const newLayouts = layouts.filter((l: any) => l.photoId !== photoId);
    onUpdate({
      ...page,
      layoutData: { ...page.layoutData, layouts: newLayouts },
    });
  };

  const handleSaveCaption = () => {
    onUpdate({ ...page, textContent: caption });
    setEditingCaption(false);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Photo Layouts */}
      <AnimatePresence>
        {layouts.map((layout: any, index: number) => {
          const photo = photos.get(layout.photoId);
          if (!photo) return null;

          const { x, y, width, height } = layout.position;

          return (
            <motion.div
              key={layout.photoId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className={`absolute overflow-hidden shadow-lg ${
                editMode ? 'cursor-move' : ''
              }`}
              style={{
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                width: `${width * 100}%`,
                height: `${height * 100}%`,
              }}
            >
              <motion.img
                src={photo.processedUrl || photo.originalUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                whileHover={editMode ? { scale: 1.02 } : {}}
              />

              {/* Edit Mode Controls */}
              {editMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <button
                    className="p-2 bg-white rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    onClick={() => handleRemovePhoto(layout.photoId)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                    <GripVertical className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Caption/Text Content */}
      {(page.textContent || editMode) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 right-8"
        >
          {editMode && editingCaption ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
                placeholder="Add a caption..."
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveCaption}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingCaption(false);
                    setCaption(page.textContent || '');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => editMode && setEditingCaption(true)}
              className={`text-center ${
                editMode ? 'cursor-pointer hover:bg-white/10 rounded-lg p-2' : ''
              }`}
            >
              <p className="text-gray-700 text-lg italic font-light drop-shadow-lg">
                {caption || (editMode && 'Click to add caption')}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Page Number Watermark */}
      <div className="absolute bottom-4 right-8 text-gray-400 text-sm font-light">
        {page.pageNumber}
      </div>
    </div>
  );
}
