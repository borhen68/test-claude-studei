'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Save, Eye, Undo, Redo, Sparkles,
  ShoppingCart, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorHeaderProps {
  book: { id: string; title: string };
  onTitleChange: (title: string) => void;
  onBack: () => void;
  onPreview: () => void;
  onCheckout: () => void;
  isSaving: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function EditorHeader({
  book,
  onTitleChange,
  onBack,
  onPreview,
  onCheckout,
  isSaving,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(book.title);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim()) {
      onTitleChange(title.trim());
    } else {
      setTitle(book.title);
    }
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white"
            aria-label="Back to dashboard"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                className="bg-slate-800 text-white px-3 py-1.5 rounded-xl border-2 border-violet-500 focus:outline-none text-lg font-semibold"
                autoFocus
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-xl font-bold text-white cursor-pointer hover:text-violet-400 transition-colors"
              >
                {book.title}
              </h1>
            )}
          </div>
        </div>

        {/* Center: Undo/Redo */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Undo"
          >
            <Undo className="h-5 w-5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Redo"
          >
            <Redo className="h-5 w-5" />
          </button>
        </div>

        {/* Right: Save Status + Actions */}
        <div className="flex items-center gap-3">
          {/* Save Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isSaving ? (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-slate-400">Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-slate-400">Saved</span>
              </>
            )}
          </div>

          {/* Preview Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={onPreview}
            className="bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          {/* Checkout Button */}
          <Button
            variant="primary"
            size="md"
            onClick={onCheckout}
            magnetic
          >
            <ShoppingCart className="h-4 w-4" />
            Order Now
          </Button>
        </div>
      </div>
    </header>
  );
}
