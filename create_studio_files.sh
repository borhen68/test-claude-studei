#!/bin/bash

# Create all studio component files

# 1. StudioLayout.tsx
cat > src/components/studio/StudioLayout.tsx << 'EOF'
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StudioLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  canvas: ReactNode;
  toolbar: ReactNode;
  unusedPhotos?: ReactNode;
  showUnusedPhotos?: boolean;
}

export default function StudioLayout({
  header,
  sidebar,
  canvas,
  toolbar,
  unusedPhotos,
  showUnusedPhotos = false,
}: StudioLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">{header}</div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Page Sidebar */}
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-[140px] flex-shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-sm overflow-y-auto"
        >
          {sidebar}
        </motion.div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          {canvas}
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-[280px] flex-shrink-0 border-l border-white/10 bg-black/20 backdrop-blur-sm overflow-y-auto"
        >
          {toolbar}
        </motion.div>
      </div>

      {/* Unused Photos Drawer */}
      {showUnusedPhotos && unusedPhotos && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 border-t border-white/10 bg-black/30 backdrop-blur-xl"
        >
          {unusedPhotos}
        </motion.div>
      )}
    </div>
  );
}
EOF

echo "Created StudioLayout.tsx"

