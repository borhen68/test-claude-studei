'use client';

import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { Edit2, Trash2, Replace, Crop, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface Photo {
  id: string;
  processedUrl: string;
  thumbnailUrl: string;
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

interface PhotoSlotProps {
  photo: Photo;
  layout: PhotoLayout;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export default function PhotoSlot({
  photo,
  layout,
  index,
  isSelected,
  onSelect,
  onEdit,
}: PhotoSlotProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: photo.id,
  });

  const { x, y, width, height } = layout.position;

  const style = {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 50 : isSelected ? 20 : 10,
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onClick={onSelect}
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
      className={`absolute overflow-hidden cursor-move shadow-lg transition-all ${
        isSelected ? 'ring-4 ring-purple-500 ring-offset-2' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      style={style}
      whileHover={{ scale: 1.02 }}
    >
      {/* Photo Image */}
      <img
        src={photo.processedUrl}
        alt="Photo"
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Glassmorphic Overlay on Hover */}
      {(showToolbar || isSelected) && !isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent backdrop-blur-[2px] flex flex-col items-center justify-center gap-2"
        >
          {/* Floating Toolbar */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-2 shadow-2xl">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors"
              title="Edit Photo"
            >
              <Edit2 className="h-4 w-4 text-purple-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              title="Crop"
            >
              <Crop className="h-4 w-4 text-blue-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-green-100 rounded-full transition-colors"
              title="Replace"
            >
              <Replace className="h-4 w-4 text-green-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-red-100 rounded-full transition-colors"
              title="Remove"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2">
          <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
            Selected
          </div>
        </div>
      )}
    </motion.div>
  );
}
