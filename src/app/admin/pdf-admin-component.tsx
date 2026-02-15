/**
 * PDF Admin Component
 * Add this to your admin dashboard to manage PDF generation
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PDFAdminPanel({ bookId }: { bookId: string }) {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePDFs = async () => {
    setGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'PDF generation failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = (type: 'cover' | 'interior') => {
    window.open(`/api/pdf/download/${type}/${bookId}`, '_blank');
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Print-Ready PDFs</h3>

      <div className="space-y-2">
        <Button
          onClick={generatePDFs}
          disabled={generating}
          className="w-full"
        >
          {generating ? 'Generating PDFs...' : 'Generate PDFs'}
        </Button>

        {result && (
          <div className="space-y-2 rounded bg-green-50 p-3 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✓ PDFs Generated Successfully
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadPDF('cover')}
              >
                Download Cover
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadPDF('interior')}
              >
                Download Interior
              </Button>
            </div>

            {result.warnings && result.warnings.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                  Warnings:
                </p>
                {result.warnings.map((warning: string, i: number) => (
                  <p key={i} className="text-xs text-yellow-600 dark:text-yellow-400">
                    • {warning}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="rounded bg-red-50 p-3 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              ✗ Error: {error}
            </p>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Specifications:</p>
        <ul className="mt-1 space-y-0.5">
          <li>• 300 DPI resolution</li>
          <li>• CMYK color profile</li>
          <li>• 3mm bleed margins</li>
          <li>• Separate cover + interior PDFs</li>
        </ul>
      </div>
    </div>
  );
}
