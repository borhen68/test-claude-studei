"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Eye,
  X,
  Undo2,
  Redo2,
  Share2,
  Check,
  Loader2,
} from "lucide-react";

interface StudioHeaderProps {
  bookTitle: string;
  onTitleChange: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  lastSaved?: Date;
  isSaving?: boolean;
  onPreview: () => void;
  onExit: () => void;
  onSave: () => void;
}

export default function StudioHeader({
  bookTitle,
  onTitleChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  lastSaved,
  isSaving = false,
  onPreview,
  onExit,
  onSave,
}: StudioHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(bookTitle);

  const handleTitleSave = () => {
    onTitleChange(title);
    setIsEditingTitle(false);
  };

  const getTimeSinceLastSave = () => {
    if (!lastSaved) return "Never";
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return seconds + "s ago";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + "m ago";
    return "Over an hour ago";
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Frametale
          </div>
          <div className="h-8 w-px bg-white/20" />
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setTitle(bookTitle);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleTitleSave}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Check className="h-4 w-4 text-green-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-xl font-semibold text-white hover:text-purple-300 transition-colors"
            >
              {bookTitle}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <motion.button
              onClick={onUndo}
              disabled={!canUndo}
              whileHover={canUndo ? { scale: 1.05 } : {}}
              whileTap={canUndo ? { scale: 0.95 } : {}}
              className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Undo"
            >
              <Undo2 className="h-4 w-4 text-white" />
            </motion.button>
            <motion.button
              onClick={onRedo}
              disabled={!canRedo}
              whileHover={canRedo ? { scale: 1.05 } : {}}
              whileTap={canRedo ? { scale: 0.95 } : {}}
              className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Redo"
            >
              <Redo2 className="h-4 w-4 text-white" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                <span className="text-sm text-white font-light">Saving...</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white font-light">
                  💾 {getTimeSinceLastSave()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={onSave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2 border border-white/10"
          >
            <Save className="h-4 w-4" />
            Save
          </motion.button>

          <motion.button
            onClick={onPreview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Eye className="h-4 w-4" />
            Preview
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2 border border-white/10"
          >
            <Share2 className="h-4 w-4" />
            Share
          </motion.button>

          <motion.button
            onClick={onExit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-xl transition-all flex items-center gap-2 border border-red-500/30"
          >
            <X className="h-4 w-4" />
            Exit
          </motion.button>
        </div>
      </div>
    </div>
  );
}
