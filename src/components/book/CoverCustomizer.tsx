'use client';

import { useState, useEffect } from 'react';
import { Image, Type, Palette, AlignCenter, Layout, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COVER_FONTS, extractPhotoColors } from '@/lib/themes';

interface CoverCustomization {
  photoId?: string;
  title?: string;
  font?: string;
  textColor?: string;
  textPosition?: 'top' | 'center' | 'bottom';
  layout?: 'full_bleed' | 'framed' | 'collage';
  collagePhotoIds?: string[];
}

interface CoverCustomizerProps {
  bookId: string;
  photos: Array<{ id: string; url: string; thumbnailUrl?: string }>;
  currentCover?: CoverCustomization;
  onSave?: (customization: CoverCustomization) => void;
  onChange?: (customization: CoverCustomization) => void;
}

export function CoverCustomizer({
  bookId,
  photos,
  currentCover,
  onSave,
  onChange,
}: CoverCustomizerProps) {
  const [customization, setCustomization] = useState<CoverCustomization>(
    currentCover || {
      photoId: photos[0]?.id,
      title: '',
      font: 'sans',
      textColor: '#FFFFFF',
      textPosition: 'center',
      layout: 'full_bleed',
    }
  );

  const [photoColors, setPhotoColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (customization.photoId) {
      const photo = photos.find((p) => p.id === customization.photoId);
      if (photo) {
        // Extract colors from the selected photo
        const colors = extractPhotoColors(photo.url);
        setPhotoColors(colors);
      }
    }
  }, [customization.photoId, photos]);

  const handleChange = (updates: Partial<CoverCustomization>) => {
    const newCustomization = { ...customization, ...updates };
    setCustomization(newCustomization);
    onChange?.(newCustomization);
  };

  const handleSave = async () => {
    // Save to backend
    await fetch(`/api/books/${bookId}/customize`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coverTitle: customization.title,
        coverFont: customization.font,
        coverTextColor: customization.textColor,
        coverTextPosition: customization.textPosition,
        coverLayout: customization.layout,
        coverImageUrl: photos.find((p) => p.id === customization.photoId)?.url,
      }),
    });

    onSave?.(customization);
  };

  const selectedPhoto = photos.find((p) => p.id === customization.photoId);
  const selectedFont = COVER_FONTS.find((f) => f.id === customization.font);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Layout className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Cover Customization</h3>
            <p className="text-sm text-gray-600">
              Create a stunning cover for your photo book
            </p>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-6">
        <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
          {/* Background Photo */}
          {selectedPhoto && (
            <img
              src={selectedPhoto.thumbnailUrl || selectedPhoto.url}
              alt="Cover preview"
              className={cn(
                'w-full h-full object-cover',
                customization.layout === 'framed' && 'scale-90'
              )}
            />
          )}

          {/* Frame Overlay */}
          {customization.layout === 'framed' && (
            <div className="absolute inset-0 border-8 border-white pointer-events-none" />
          )}

          {/* Title Overlay */}
          {customization.title && (
            <div
              className={cn(
                'absolute inset-x-0 flex items-center justify-center px-8',
                customization.textPosition === 'top' && 'top-12',
                customization.textPosition === 'center' && 'top-1/2 -translate-y-1/2',
                customization.textPosition === 'bottom' && 'bottom-12'
              )}
            >
              <h1
                className="text-4xl font-bold text-center drop-shadow-lg"
                style={{
                  fontFamily: selectedFont?.fontFamily,
                  color: customization.textColor,
                }}
              >
                {customization.title}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Customization Options */}
      <div className="p-4 space-y-6">
        {/* Cover Photo Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Image className="w-4 h-4" />
            Cover Photo
          </label>
          <div className="grid grid-cols-4 gap-2">
            {photos.slice(0, 12).map((photo) => (
              <button
                key={photo.id}
                onClick={() => handleChange({ photoId: photo.id })}
                className={cn(
                  'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                  customization.photoId === photo.id
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt="Photo option"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Cover Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type className="w-4 h-4" />
            Cover Title
          </label>
          <input
            type="text"
            value={customization.title || ''}
            onChange={(e) => handleChange({ title: e.target.value })}
            placeholder="e.g., Summer 2025, Our Wedding"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Font Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type className="w-4 h-4" />
            Font Style
          </label>
          <div className="grid grid-cols-5 gap-2">
            {COVER_FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => handleChange({ font: font.id })}
                className={cn(
                  'px-3 py-4 rounded-lg border-2 transition-all text-center',
                  customization.font === font.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div
                  className="text-lg mb-1"
                  style={{ fontFamily: font.fontFamily }}
                >
                  Aa
                </div>
                <div className="text-xs font-medium text-gray-600">
                  {font.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Palette className="w-4 h-4" />
            Text Color
          </label>
          <div className="flex items-center gap-2">
            {/* Photo palette colors */}
            {['#FFFFFF', '#000000', ...photoColors.slice(0, 4)].map((color) => (
              <button
                key={color}
                onClick={() => handleChange({ textColor: color })}
                className={cn(
                  'w-10 h-10 rounded-lg border-2 transition-all',
                  customization.textColor === color
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : 'border-gray-300 hover:border-gray-400'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
            
            {/* Custom color picker */}
            <div className="relative">
              <input
                type="color"
                value={customization.textColor}
                onChange={(e) => handleChange({ textColor: e.target.value })}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Text Position */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <AlignCenter className="w-4 h-4" />
            Text Position
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['top', 'center', 'bottom'] as const).map((position) => (
              <button
                key={position}
                onClick={() => handleChange({ textPosition: position })}
                className={cn(
                  'px-4 py-3 rounded-lg border-2 transition-all font-medium capitalize',
                  customization.textPosition === position
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        {/* Cover Layout */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Layout className="w-4 h-4" />
            Layout Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'full_bleed', name: 'Full Bleed', desc: 'Edge to edge' },
              { id: 'framed', name: 'Framed', desc: 'White border' },
              { id: 'collage', name: 'Collage', desc: '2-4 photos' },
            ].map((layout) => (
              <button
                key={layout.id}
                onClick={() => handleChange({ layout: layout.id as any })}
                className={cn(
                  'px-4 py-3 rounded-lg border-2 transition-all text-left',
                  customization.layout === layout.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="font-medium text-gray-900">{layout.name}</div>
                <div className="text-xs text-gray-600">{layout.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
        <button
          onClick={() => handleChange({
            title: '',
            font: 'sans',
            textColor: '#FFFFFF',
            textPosition: 'center',
            layout: 'full_bleed',
          })}
          className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium"
        >
          Reset to Default
        </button>
        
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Save Cover Design
        </button>
      </div>
    </div>
  );
}
