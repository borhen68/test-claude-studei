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
  Edit3,
  Wand2,
} from 'lucide-react';

import StudioLayout from '@/components/studio/StudioLayout';
import StudioHeader from '@/components/studio/StudioHeader';
import PageSidebar from '@/components/studio/PageSidebar';
import StudioCanvas from '@/components/studio/StudioCanvas';
import EditorToolbar from '@/components/studio/EditorToolbar';
import UnusedPhotos from '@/components/studio/UnusedPhotos';

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
  const [editMode, setEditMode] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showUnusedPhotos, setShowUnusedPhotos] = useState(false);

  const {
    state: historyState,
    set: setHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<Book | null>(null);

  const saveToServer = useCallback(async (bookData: Book) => {
    try {
      await fetch(`/api/books/${bookData.id}/pages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages: bookData.pages, title: bookData.title }),
      });
    } catch (error) {
      console.error('Failed to save:', error);
      throw error;
    }
  }, []);

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
        }
      } catch (error) {
        console.error('Failed to fetch book:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [resolvedParams.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editMode) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
          e.preventDefault();
          redo();
        }
      } else {
        if (e.key === 'ArrowLeft' && currentPage > 0) setCurrentPage(p => p - 1);
        if (e.key === 'ArrowRight' && book && currentPage < book.pages.length - 1) setCurrentPage(p => p + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, currentPage, book, canUndo, canRedo]);

  const handleManualSave = async () => {
    if (!book) return;
    try {
      await saveToServer(book);
      alert('Saved!');
    } catch (error) {
      alert('Failed to save');
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/books/${resolvedParams.id}/export`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.pdfUrl) window.open(data.pdfUrl, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
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
        <Loader2 className="h-16 w-16 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Book not found</p>
      </div>
    );
  }

  const currentPageData = book.pages[currentPage];
  const photoMap = new Map(book.photos.map((p) => [p.id, p]));
  const unusedPhotos = getUnusedPhotos();

  if (editMode) {
    return (
      <StudioLayout
        header={
          <StudioHeader
            bookTitle={book.title}
            onTitleChange={(title) => {
              const updated = { ...book, title };
              setBook(updated);
              setHistoryState(updated);
            }}
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
            onReorder={() => {}}
            onAdd={() => {
              const newPage: Page = {
                id: `page-${Date.now()}`,
                pageNumber: book.pages.length + 1,
                template: 'duo',
                photoIds: [],
                layoutData: { layouts: [] },
              };
              const updated = { ...book, pages: [...book.pages, newPage] };
              setBook(updated);
              setHistoryState(updated);
            }}
            onDelete={(id) => {
              const updated = { ...book, pages: book.pages.filter(p => p.id !== id) };
              setBook(updated);
              setHistoryState(updated);
            }}
            onDuplicate={(id) => {
              const page = book.pages.find(p => p.id === id);
              if (page) {
                const newPage = { ...page, id: `page-${Date.now()}` };
                const updated = { ...book, pages: [...book.pages, newPage] };
                setBook(updated);
                setHistoryState(updated);
              }
            }}
            onNavigate={setCurrentPage}
          />
        }
        canvas={
          currentPageData && (
            <StudioCanvas
              page={currentPageData}
              photos={photoMap}
              onPhotoMove={() => {}}
              onPhotoEdit={(photoId) => {
                setSelectedPhoto(photoId);
                setActiveTab('photo');
              }}
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
            onThemeChange={(theme) => {
              const updated = { ...book, theme };
              setBook(updated);
              setHistoryState(updated);
            }}
            onLayoutChange={(layout) => {
              const pages = [...book.pages];
              if (pages[currentPage]) {
                pages[currentPage].template = layout;
                const updated = { ...book, pages };
                setBook(updated);
                setHistoryState(updated);
              }
            }}
            onCaptionUpdate={(caption) => {
              const pages = [...book.pages];
              if (pages[currentPage]) {
                pages[currentPage].textContent = caption;
                const updated = { ...book, pages };
                setBook(updated);
                setHistoryState(updated);
              }
            }}
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
            onAddToPage={() => {}}
          />
        }
        showUnusedPhotos={unusedPhotos.length > 0}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/30 backdrop-blur-xl border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{book.title}</h1>
            <p className="text-sm text-purple-300">Page {currentPage + 1} of {book.pages.length}</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setEditMode(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <Wand2 className="h-4 w-4" />
              Open Studio
            </motion.button>

            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl flex items-center gap-2"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export PDF
            </button>

            <button
              onClick={() => router.push(`/checkout?bookId=${resolvedParams.id}`)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Order Print
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-8 relative">
        <motion.button
          onClick={() => currentPage > 0 && setCurrentPage(p => p - 1)}
          disabled={currentPage === 0}
          className="absolute left-8 z-20 p-4 bg-white/90 rounded-full shadow-2xl hover:bg-white disabled:opacity-20"
        >
          <ChevronLeft className="h-8 w-8 text-purple-900" />
        </motion.button>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white shadow-2xl rounded-lg overflow-hidden"
              style={{
                width: Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 200 : 1000),
                height: Math.min(750, typeof window !== 'undefined' ? window.innerHeight - 300 : 750),
                transform: `scale(${zoom})`,
              }}
            >
              {currentPageData && (
                <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
                  <p className="text-gray-500 text-center pt-8">Page {currentPageData.pageNumber}</p>
                  {currentPageData.textContent && (
                    <p className="absolute bottom-8 left-8 right-8 text-center text-gray-700 italic">
                      {currentPageData.textContent}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={() => currentPage < book.pages.length - 1 && setCurrentPage(p => p + 1)}
          disabled={currentPage === book.pages.length - 1}
          className="absolute right-8 z-20 p-4 bg-white/90 rounded-full shadow-2xl hover:bg-white disabled:opacity-20"
        >
          <ChevronRight className="h-8 w-8 text-purple-900" />
        </motion.button>
      </div>
    </div>
  );
}
