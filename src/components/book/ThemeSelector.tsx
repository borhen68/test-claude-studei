'use client';

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BOOK_THEMES, Theme, getDefaultTheme } from '@/lib/themes';

interface ThemeSelectorProps {
  bookId: string;
  currentTheme?: Theme;
  onSelect?: (theme: Theme) => void;
  onSave?: (theme: Theme) => void;
}

export function ThemeSelector({
  bookId,
  currentTheme,
  onSelect,
  onSave,
}: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    currentTheme || getDefaultTheme()
  );

  const handleSelectTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    onSelect?.(theme);
  };

  const handleSave = async () => {
    // Save to backend
    await fetch(`/api/books/${bookId}/customize`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customizationTheme: {
          id: selectedTheme.id,
          bgColor: selectedTheme.bgColor,
          accentColor: selectedTheme.accentColor,
          textColor: selectedTheme.textColor,
          borderStyle: selectedTheme.borderStyle,
          borderColor: selectedTheme.borderColor,
          pageNumbers: selectedTheme.pageNumbers,
        },
      }),
    });

    onSave?.(selectedTheme);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Palette className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Book Theme</h3>
            <p className="text-sm text-gray-600">
              Choose a visual style for your photo book
            </p>
          </div>
        </div>
      </div>

      {/* Theme Preview */}
      <div className="p-6">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-xl border-4 border-gray-200">
          {/* Preview background */}
          <div
            className="absolute inset-0"
            style={{ background: selectedTheme.previewGradient }}
          />

          {/* Preview content */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
            style={{ backgroundColor: selectedTheme.bgColor }}
          >
            {/* Sample photo boxes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={cn(
                  'w-24 h-24 bg-gray-300 rounded',
                  selectedTheme.borderStyle === 'thin' && 'border border-gray-400',
                  selectedTheme.borderStyle === 'thick' && 'border-4 border-gray-400',
                  selectedTheme.borderStyle === 'rounded' && 'border-2 border-gray-400 rounded-lg'
                )}
                style={
                  selectedTheme.borderColor
                    ? { borderColor: selectedTheme.borderColor }
                    : {}
                }
              />
              <div
                className={cn(
                  'w-24 h-24 bg-gray-300 rounded',
                  selectedTheme.borderStyle === 'thin' && 'border border-gray-400',
                  selectedTheme.borderStyle === 'thick' && 'border-4 border-gray-400',
                  selectedTheme.borderStyle === 'rounded' && 'border-2 border-gray-400 rounded-lg'
                )}
                style={
                  selectedTheme.borderColor
                    ? { borderColor: selectedTheme.borderColor }
                    : {}
                }
              />
            </div>

            {/* Sample heading */}
            <h4
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: selectedTheme.headingFont,
                color: selectedTheme.textColor,
              }}
            >
              Your Photos
            </h4>

            {/* Sample body text */}
            <p
              className="text-sm text-center max-w-xs"
              style={{
                fontFamily: selectedTheme.bodyFont,
                color: selectedTheme.textColor,
              }}
            >
              Beautiful memories captured in a stunning layout
            </p>

            {/* Sample page number */}
            {selectedTheme.pageNumbers.show && (
              <div
                className={cn(
                  'absolute text-sm',
                  selectedTheme.pageNumbers.position === 'bottom-center' &&
                    'bottom-4 left-1/2 -translate-x-1/2',
                  selectedTheme.pageNumbers.position === 'bottom-right' &&
                    'bottom-4 right-4',
                  selectedTheme.pageNumbers.position === 'bottom-left' &&
                    'bottom-4 left-4'
                )}
                style={{ color: selectedTheme.pageNumbers.color }}
              >
                12
              </div>
            )}
          </div>
        </div>

        {/* Selected theme info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-lg flex-shrink-0"
              style={{ background: selectedTheme.previewGradient }}
            />
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{selectedTheme.name}</h4>
              <p className="text-sm text-gray-600">{selectedTheme.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Options */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {BOOK_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all text-left',
                selectedTheme.id === theme.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* Gradient Preview */}
              <div
                className="w-full h-16 rounded-md mb-3"
                style={{ background: theme.previewGradient }}
              />

              {/* Theme name */}
              <div className="font-semibold text-gray-900 text-sm">
                {theme.name}
              </div>

              {/* Check mark */}
              {selectedTheme.id === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Details */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">Background</div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: selectedTheme.bgColor }}
              />
              <span className="font-mono text-xs text-gray-700">
                {selectedTheme.bgColor}
              </span>
            </div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">Accent</div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: selectedTheme.accentColor }}
              />
              <span className="font-mono text-xs text-gray-700">
                {selectedTheme.accentColor}
              </span>
            </div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">Border</div>
            <div className="font-medium text-gray-900 capitalize">
              {selectedTheme.borderStyle}
            </div>
          </div>

          <div>
            <div className="text-gray-600 mb-1">Page Numbers</div>
            <div className="font-medium text-gray-900">
              {selectedTheme.pageNumbers.show ? 'Shown' : 'Hidden'}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-3">
        <button
          onClick={() => handleSelectTheme(getDefaultTheme())}
          className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium"
        >
          Reset to Modern
        </button>
        
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-semibold shadow-lg"
        >
          <Check className="w-4 h-4" />
          Apply Theme
        </button>
      </div>
    </div>
  );
}
