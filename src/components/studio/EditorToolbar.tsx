'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette, LayoutGrid, Type, Settings, Wand2, ChevronRight
} from 'lucide-react';

interface EditorToolbarProps {
  selectedPhotoId: string | null;
  currentPage: any;
  theme: string;
  onThemeChange: (theme: string) => void;
  onTemplateChange: (template: string) => void;
  onCaptionChange: (caption: string) => void;
  onPhotoReplace: (photoId: string) => void;
}

const THEMES = [
  { id: 'classic', name: 'Classic', colors: ['#000000', '#FFFFFF'] },
  { id: 'modern', name: 'Modern', colors: ['#7C3AED', '#F59E0B'] },
  { id: 'vintage', name: 'Vintage', colors: ['#8B4513', '#D2B48C'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0077BE', '#00D4FF'] },
  { id: 'sunset', name: 'Sunset', colors: ['#FF6B35', '#F7931E'] },
];

const TEMPLATES = [
  { id: 'hero', name: 'Hero', icon: '🖼️', slots: 1 },
  { id: 'duo_horizontal', name: 'Duo H', icon: '⬛⬛', slots: 2 },
  { id: 'duo_vertical', name: 'Duo V', icon: '⬜⬜', slots: 2 },
  { id: 'trio', name: 'Trio', icon: '🎯', slots: 3 },
  { id: 'quad', name: 'Quad', icon: '⊞', slots: 4 },
  { id: 'gallery_6', name: 'Gallery', icon: '📸', slots: 6 },
];

export function EditorToolbar({
  selectedPhotoId,
  currentPage,
  theme,
  onThemeChange,
  onTemplateChange,
  onCaptionChange,
  onPhotoReplace,
}: EditorToolbarProps) {
  const [activeTab, setActiveTab] = useState<'themes' | 'layouts' | 'captions' | 'settings' | null>('layouts');

  return (
    <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-l border-slate-700 flex flex-col">
      {/* Tab Navigation */}
      <div className="p-3 border-b border-slate-700">
        <div className="grid grid-cols-4 gap-2">
          <TabButton
            icon={Palette}
            label="Themes"
            active={activeTab === 'themes'}
            onClick={() => setActiveTab(activeTab === 'themes' ? null : 'themes')}
          />
          <TabButton
            icon={LayoutGrid}
            label="Layouts"
            active={activeTab === 'layouts'}
            onClick={() => setActiveTab(activeTab === 'layouts' ? null : 'layouts')}
          />
          <TabButton
            icon={Type}
            label="Captions"
            active={activeTab === 'captions'}
            onClick={() => setActiveTab(activeTab === 'captions' ? null : 'captions')}
          />
          <TabButton
            icon={Settings}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab(activeTab === 'settings' ? null : 'settings')}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Color Themes</h3>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t.id)}
                  className={`w-full p-4 rounded-2xl transition-all ${
                    theme === t.id
                      ? 'bg-violet-600/20 ring-2 ring-violet-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{t.name}</span>
                    {theme === t.id && (
                      <div className="w-2 h-2 bg-violet-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {t.colors.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 h-8 rounded-lg border border-slate-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {activeTab === 'layouts' && (
            <motion.div
              key="layouts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Page Layouts</h3>
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTemplateChange(t.id)}
                  className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between ${
                    currentPage.template === t.id
                      ? 'bg-violet-600/20 ring-2 ring-violet-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-white text-sm">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.slots} photos</p>
                    </div>
                  </div>
                  {currentPage.template === t.id && (
                    <div className="w-2 h-2 bg-violet-500 rounded-full" />
                  )}
                </button>
              ))}
            </motion.div>
          )}

          {activeTab === 'captions' && (
            <motion.div
              key="captions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Captions</h3>
              {selectedPhotoId ? (
                <div>
                  <textarea
                    placeholder="Add a caption..."
                    className="w-full h-32 px-4 py-3 bg-slate-800 text-white rounded-2xl border-2 border-slate-700 focus:border-violet-500 focus:outline-none resize-none"
                    onChange={(e) => onCaptionChange(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Caption will appear below the photo
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Type className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">
                    Select a photo to add a caption
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Settings</h3>
              <div className="space-y-3">
                <SettingItem label="Auto-save" value="Enabled" />
                <SettingItem label="Image quality" value="High" />
                <SettingItem label="Page size" value="8.5 x 11 in" />
                <SettingItem label="Orientation" value="Portrait" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
        active
          ? 'bg-violet-600/20 text-violet-400'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function SettingItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm text-violet-400 font-medium">{value}</span>
    </div>
  );
}
