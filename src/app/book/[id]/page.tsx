'use client';

import { useState, useEffect, use, useCallback } from 'react';
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
  Wand2,
} from 'lucide-react';

// Studio Components
import StudioLayout from '@/components/studio/StudioLayout';
import StudioHeader from '@/components/studio/StudioHeader';
import PageSidebar from '@/components/studio/PageSidebar';
import StudioCanvas from '@/components/studio/StudioCanvas';
import EditorToolbar from '@/components/studio/EditorToolbar';
import UnusedPhotos from '@/components/studio/UnusedPhotos';

// Hooks
import { useHistory } from '@/hooks/useHistory';
import { useAutoSave } from '@/hooks/useAutoSave';

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

  // Studio-specific state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'themes' | 'layouts' | 'captions' | 'photo' | 'settings' | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showUnusedPhotos, setShowUnusedPhotos] = useState(false);

  // History management
  const {
    state: historyState,
    set: setHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<Book | null>(null);

  // Auto-save
  const { isSaving, lastSaved } = useAutoSave(
    book,
    book !== historyState,
    async (data) => {
      if (!data) return;
      await saveToServer(data);
    },
    2000
  );

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books?id=${resolvedParams.id}`);
        const data = await res.json();

        if (data.success) {
          setBook(data.book);
          setHistoryState(data.book);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editMode) {
        if (e.key === 'ArrowLeft') prevPage();
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
        if (e.key === 'f') toggleFullscreen();
        if (e.key === 't') setShowThumbnails((s) => !s);
      } else {
        // Studio mode shortcuts
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
          e.preventDefault();
          redo();
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          handleManualSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, isFullscreen, currentPage, book, canUndo, canRedo]);

  const saveToServer = async (bookData: Book) => {
    try {
      const res = await fetch(`/api/books/${bookData.id}/pages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: bookData.pages, title: bookData.title }),
      });
      
      if (!res.ok) throw new Error('Save failed');
    } catch (error) {
      console.error('Failed to save:', error);
      throw error;
    }
  };

  const handleManualSave = async () => {
    if (!book) return;
    try {
      await saveToServer(book);
      alert('Changes saved successfully!');
    } catch (error) {
      alert('Failed to save changes');
    }
  };

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
      const res = await fetch(`/api/books/${resolvedParams.id}/export`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success && data.pdfUrl) {
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

  // Studio handlers
  const handleTitleChange = (newTitle: string) => {
    if (!book) return;
    const updatedBook = { ...book, title: newTitle };
    setBook(updatedBook);
    setHistoryState(updatedBook);
  };

  const handlePageReorder = (newPages: Page[]) => {
    if (!book) return;
    const updatedBook = { ...book, pages: newPages };
    setBook(updatedBook);
    setHistoryState(updatedBook);
  };

  const handleAddPage = () => {
    if (!book) return;
    const newPage: Page = {
      id: `page-${Date.now()}`,
      pageNumber: book.pages.length + 1,
      template: 'duo',
      photoIds: [],
      layoutData: { layouts: [] },
    };
    const updatedBook = { ...book, pages: [...book.pages, newPage] };
    setBook(updatedBook);
    setHistoryState(updatedBook);
  };

  const handleDeletePage = (pageId: string) => {
    if (!book) return;
    const updatedPages = book.pages.filter((p) => p.id !== pageId);
    const updatedBook = { ...book, pages: updatedPages };
    setBook(updatedBook);
    setHistoryState(updatedBook);
  };

  const handleDuplicatePage = (pageId: string) => {
    if (!book) return;
    const page = book.pages.find((p) => p.id === pageId);
    if (!page) return;
    
    const newPage = {
      ...page,
      id: `page-${Date.now()}`,
      pageNumber: page.pageNumber + 1,
    };
    
    const updatedPages = [...book.pages];
    const index = updatedPages.findIndex((p) => p.id === pageId);
    updatedPages.splice(index + 1, 0, newPage);
    
    const updatedBook = { ...book, pages: updatedPages };
    setBook(updatedBook);
    setHistoryState(updatedBook);
  };

  const handlePhotoMove = (fromSlot: string, toSlot: string) => {
    console.log('Move photo from', fromSlot, 'to', toSlot);
    // Implement photo swapping logic
  };

  const handlePhotoEdit = (photoId: string) => {
    setSelectedPhoto(photoId);
    setActiveTab('photo');
  };

  const handleThemeChange = (theme: string) => {
    if (!book) return;
    const updatedBook = { ...book, theme };
    setBook(updatedBook);
    setHistoryState(updatedBook);
  };

  const handleLayoutChange = (layout: string) => {
    if (!book) return;
    const updatedPages = [...book.pages];
    const page = updatedPages[currentPage];
    if (page) {
      page.template = layout;
      const updatedBook = { ...book, pages: updatedPages };
      setBook(updatedBook);
      setHistoryState(updatedBook);
    }
  };

  const handleCaptionUpdate = (caption: string) => {
    if (!book) return;
    const updatedPages = [...book.pages];
    const page = updatedPages[currentPage];
    if (page) {
      page.textContent = caption;
      const updatedBook = { ...book, pages: updatedPages };
      setBook(updatedBook);
      setHistoryState(updatedBook);
    }
  };

  const getUnusedPhotos = (): Photo[] => {
    if (!book) return [];
    const usedPhotoIds = new Set(book.pages.flatMap((p) => p.photoIds));
    return book.photos.filter((p) => !usedPhotoIds.has(p.id));
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
  const unusedPhotos = getUnusedPhotos();

  // Studio Mode
  if (editMode) {
    return (
      <StudioLayout
        header={
          <StudioHeader
            bookTitle={book.title}
            onTitleChange={handleTitleChange}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            lastSaved={lastSaved || undefined}
            isSaving={isSaving}
            onPreview={() => setEditMode(false)}
            onExit={() => router.push('/dashboard/books')}
            onSave={handleManualSave}
          />
        }
        sidebar={
          <PageSidebar
            pages={book.pages}
            currentPage={currentPage}
            onReorder={handlePageReorder}
            onAdd={handleAddPage}
            onDelete={handleDeletePage}
            onDuplicate={handleDuplicatePage}
            onNavigate={setCurrentPage}
          />
        }
        canvas={
          currentPageData && (
            <StudioCanvas
              page={currentPageData}
              photos={photoMap}
              onPhotoMove={handlePhotoMove}
              onPhotoEdit={handlePhotoEdit}
              onPhotoSelect={setSelectedPhoto}
              selectedPhoto={selectedPhoto}
              zoom={zoom}
              onZoomChange={setZoom}
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid(!showGrid)}
            />
          )
        }
        toolbar={
          <EditorToolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onThemeChange={handleThemeChange}
            onLayoutChange={handleLayoutChange}
            onCaptionUpdate={handleCaptionUpdate}
            selectedPhoto={selectedPhoto}
            currentTheme={book.theme}
            currentLayout={currentPageData?.template}
            currentCaption={currentPageData?.textContent}
          />
        }
        unusedPhotos={
          <UnusedPhotos
            photos={unusedPhotos}
            isOpen={showUnusedPhotos}
            onToggle={() => setShowUnusedPhotos(!showUnusedPhotos)}
            onAddToPage={(photoId) => console.log('Add photo', photoId)}
          />
        }
        showUnusedPhotos={unusedPhotos.length > 0}
      />
    );
  }

  // Viewer Mode (Original)
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
            <motion.button
              onClick={() => setEditMode(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <Wand2 className="h-4 w-4" />
              Open Studio
            </motion.button>

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
        <motion.button
          onClick={prevPage}
          disabled={currentPage === 0}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-8 z-20 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all disabled:hover:scale-100"
        >
          <ChevronLeft className="h-8 w-8 text-purple-900" />
        </motion.button>

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
                <PageRenderer page={currentPageData} photos={photoMap} />
              )}
            </motion.div>
          </AnimatePresence>
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

      {/* Thumbnails */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 z-10"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {book.pages.map((page, index) => (
                  <motion.button
                    key={page.id}
                    onClick={() => setCurrentPage(index)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden border-2 transition-all ${
                      currentPage === index
                        ? 'border-purple-500 ring-4 ring-purple-500/50'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">{index + 1}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Page Renderer Component
function PageRenderer({
  page,
  photos,
}: {
  page: Page;
  photos: Map<string, Photo>;
}) {
  const layouts = page.layoutData?.layouts || [];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
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
              transition={{ delay: index * 0.1 }}
              className="absolute overflow-hidden shadow-lg"
              style={{
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                width: `${width * 100}%`,
                height: `${height * 100}%`,
              }}
            >
              <img
                src={photo.processedUrl || photo.originalUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {page.textContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-8 right-8 text-center"
        >
          <p className="text-gray-700 text-lg italic font-light">
            {page.textContent}
          </p>
        </motion.div>
      )}

      <div className="absolute bottom-4 right-8 text-gray-400 text-sm">
        {page.pageNumber}
      </div>
    </div>
  );
}
