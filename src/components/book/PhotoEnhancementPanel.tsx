'use client';

import { useState, useEffect } from 'react';
import { Wand2, RotateCcw, Settings, Eye, EyeOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  EnhancementSettings,
  getEnhancementPresets,
  generateCSSFilters,
  getRecommendedEnhancementLevel,
} from '@/lib/photo-enhancement';

interface PhotoEnhancementPanelProps {
  photoUrl: string;
  qualityScore?: number;
  onEnhancementChange?: (settings: EnhancementSettings) => void;
  onSave?: (settings: EnhancementSettings) => void;
  defaultLevel?: 'none' | 'light' | 'moderate' | 'strong' | 'auto';
}

export function PhotoEnhancementPanel({
  photoUrl,
  qualityScore = 75,
  onEnhancementChange,
  onSave,
  defaultLevel = 'auto',
}: PhotoEnhancementPanelProps) {
  const presets = getEnhancementPresets();
  
  const [selectedLevel, setSelectedLevel] = useState<'none' | 'light' | 'moderate' | 'strong'>(
    defaultLevel === 'auto'
      ? getRecommendedEnhancementLevel(qualityScore)
      : (defaultLevel as 'none' | 'light' | 'moderate' | 'strong')
  );
  
  const [settings, setSettings] = useState<EnhancementSettings>(
    presets[selectedLevel].settings
  );
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBefore, setShowBefore] = useState(false);

  useEffect(() => {
    setSettings(presets[selectedLevel].settings);
    onEnhancementChange?.(presets[selectedLevel].settings);
  }, [selectedLevel]);

  const handleSettingChange = (key: keyof EnhancementSettings, value: number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onEnhancementChange?.(newSettings);
  };

  const handleSave = () => {
    onSave?.(settings);
  };

  const handleReset = () => {
    setSelectedLevel('none');
    setSettings(presets.none.settings);
  };

  const cssFilter = generateCSSFilters(settings);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Wand2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Photo Enhancement</h3>
              <p className="text-sm text-gray-600">
                Automatically improve your photo's quality
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowBefore(!showBefore)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showBefore ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {showBefore ? 'Show After' : 'Show Before'}
            </span>
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={photoUrl}
            alt="Photo preview"
            className="w-full h-full object-contain"
            style={{
              filter: showBefore ? 'none' : cssFilter,
              transition: 'filter 0.3s ease',
            }}
          />
          
          {/* Before/After label */}
          <div className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {showBefore ? 'Before' : 'After'}
          </div>
        </div>
      </div>

      {/* Enhancement Levels */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-4 gap-2">
          {(['none', 'light', 'moderate', 'strong'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={cn(
                'px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm',
                selectedLevel === level
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="capitalize">{level}</div>
              {level === getRecommendedEnhancementLevel(qualityScore) && (
                <div className="text-xs text-purple-600 mt-0.5">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Recommended
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Advanced Controls
          <svg
            className={cn('w-4 h-4 transition-transform', showAdvanced && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* Brightness */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Brightness</label>
                <span className="text-sm text-gray-600">{settings.brightness}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={settings.brightness}
                onChange={(e) =>
                  handleSettingChange('brightness', parseInt(e.target.value))
                }
                className="w-full accent-purple-600"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Contrast</label>
                <span className="text-sm text-gray-600">{settings.contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={settings.contrast}
                onChange={(e) =>
                  handleSettingChange('contrast', parseInt(e.target.value))
                }
                className="w-full accent-purple-600"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Saturation</label>
                <span className="text-sm text-gray-600">{settings.saturation}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={settings.saturation}
                onChange={(e) =>
                  handleSettingChange('saturation', parseInt(e.target.value))
                }
                className="w-full accent-purple-600"
              />
            </div>

            {/* Sharpness */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Sharpness</label>
                <span className="text-sm text-gray-600">{settings.sharpness}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sharpness}
                onChange={(e) =>
                  handleSettingChange('sharpness', parseInt(e.target.value))
                }
                className="w-full accent-purple-600"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoLevel}
                  onChange={(e) =>
                    handleSettingChange('autoLevel', e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                Auto Level
              </label>
              
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.denoise}
                  onChange={(e) =>
                    handleSettingChange('denoise', e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                Denoise
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors font-semibold shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Apply Enhancement
        </button>
      </div>

      {/* Info */}
      <div className="px-4 pb-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> The "{getRecommendedEnhancementLevel(qualityScore)}" level is
            recommended based on your photo's quality score ({qualityScore}/100).
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact enhancement toggle for photo grids
 */
export function EnhancementToggle({
  isEnhanced,
  onChange,
}: {
  isEnhanced: boolean;
  onChange: (enhanced: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!isEnhanced)}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-sm',
        isEnhanced
          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
      title={isEnhanced ? 'Enhanced' : 'Original'}
    >
      <Wand2 className="w-3 h-3" />
      {isEnhanced ? 'Enhanced' : 'Original'}
    </button>
  );
}
