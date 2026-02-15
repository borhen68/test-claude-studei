'use client';

import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Photo } from '@/lib/db/schema';

interface QualityWarningProps {
  photo: Photo;
  compact?: boolean;
}

export function QualityWarning({ photo, compact = false }: QualityWarningProps) {
  const qualityLevel = getQualityLevel(photo);

  if (qualityLevel === 'good') {
    return null; // No warning needed for good quality
  }

  const config = getWarningConfig(qualityLevel);

  if (compact) {
    return (
      <div className={`absolute top-2 left-2 ${config.bgColor} ${config.textColor} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg`}>
        {config.icon}
      </div>
    );
  }

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <div className={config.textColor}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${config.textColor} mb-1`}>
            {config.title}
          </h4>
          <p className="text-xs text-gray-700">
            {config.message}
          </p>
          {qualityLevel === 'critical' && (
            <p className="text-xs text-red-700 mt-1 font-medium">
              Resolution: {photo.width}×{photo.height} pixels
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function QualityWarningsSummary({ 
  photos 
}: { 
  photos: Photo[];
}) {
  const warnings = photos.map(p => ({
    photo: p,
    level: getQualityLevel(p),
  }));

  const criticalCount = warnings.filter(w => w.level === 'critical').length;
  const warningCount = warnings.filter(w => w.level === 'warning').length;

  if (criticalCount === 0 && warningCount === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              All Photos Look Great! ✨
            </h3>
            <p className="text-sm text-gray-600">
              All {photos.length} photos meet our quality standards for printing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="bg-white p-2 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Quality Check
          </h3>
          <div className="space-y-2">
            {criticalCount > 0 && (
              <p className="text-sm text-red-700">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                <strong>{criticalCount} photo{criticalCount > 1 ? 's' : ''}</strong> may print poorly (low resolution)
              </p>
            )}
            {warningCount > 0 && (
              <p className="text-sm text-yellow-700">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                <strong>{warningCount} photo{warningCount > 1 ? 's' : ''}</strong> may not be optimal quality
              </p>
            )}
            <p className="text-xs text-gray-600 mt-2">
              Look for the warning badges on affected photos. We recommend using higher resolution images if available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutQualityBlocker({ photos }: { photos: Photo[] }) {
  const criticalPhotos = photos.filter(p => getQualityLevel(p) === 'critical');

  if (criticalPhotos.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-2">
            Warning: Low Resolution Photos Detected
          </h3>
          <p className="text-sm text-red-800 mb-3">
            Your book contains <strong>{criticalPhotos.length} photo{criticalPhotos.length > 1 ? 's' : ''}</strong> with 
            very low resolution. These may print blurry or pixelated.
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer text-red-700 font-medium hover:text-red-900">
              View affected photos ({criticalPhotos.length})
            </summary>
            <ul className="mt-2 space-y-1 text-xs text-red-700 ml-4">
              {criticalPhotos.slice(0, 10).map((photo) => (
                <li key={photo.id}>
                  • {photo.filename || 'Untitled'} ({photo.width}×{photo.height}px)
                </li>
              ))}
              {criticalPhotos.length > 10 && (
                <li className="text-red-600">
                  ... and {criticalPhotos.length - 10} more
                </li>
              )}
            </ul>
          </details>
          <div className="mt-3 flex gap-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" id="quality-acknowledge" />
              <span className="text-red-800">
                I understand these photos may not print well
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions

function getQualityLevel(photo: Photo): 'good' | 'warning' | 'critical' {
  const minPrintResolution = 1200; // pixels on shortest side
  const warningResolution = 1800;
  
  const shortestSide = Math.min(photo.width, photo.height);
  const qualityScore = photo.qualityScore || 50;

  // Critical: Very low resolution or quality
  if (shortestSide < minPrintResolution || qualityScore < 30) {
    return 'critical';
  }

  // Warning: Below ideal but acceptable
  if (shortestSide < warningResolution || qualityScore < 50) {
    return 'warning';
  }

  return 'good';
}

function getWarningConfig(level: 'warning' | 'critical') {
  if (level === 'critical') {
    return {
      icon: <AlertCircle className="w-5 h-5" />,
      title: 'Low Resolution',
      message: 'This photo may print blurry or pixelated. Consider using a higher quality version.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
    };
  }

  return {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Moderate Quality',
    message: 'This photo may not be optimal quality for printing. It will still work but might not be as sharp.',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
  };
}
