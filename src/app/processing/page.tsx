'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Check } from 'lucide-react';

export default function ProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get('bookId');
  
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'analyzing' | 'sorting' | 'layouting' | 'done'>('analyzing');

  useEffect(() => {
    if (!bookId) {
      router.push('/');
      return;
    }

    processBook();
  }, [bookId]);

  async function processBook() {
    try {
      // Stage 1: Analyzing
      setStage('analyzing');
      await simulateProgress(0, 33, 2000);
      
      // Stage 2: Sorting
      setStage('sorting');
      await simulateProgress(33, 66, 1500);
      
      // Stage 3: Layout
      setStage('layouting');
      await simulateProgress(66, 100, 2000);
      
      // Call actual processing API
      const response = await fetch(`/api/books/${bookId}/process`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setStage('done');
        setTimeout(() => {
          router.push(`/book/${bookId}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Processing failed:', error);
    }
  }

  async function simulateProgress(from: number, to: number, duration: number) {
    const steps = 20;
    const stepDuration = duration / steps;
    const increment = (to - from) / steps;

    for (let i = 0; i <= steps; i++) {
      setProgress(from + increment * i);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  const stages = [
    { key: 'analyzing', label: 'Analyzing your photos...', icon: '📸' },
    { key: 'sorting', label: 'Finding the best moments...', icon: '✨' },
    { key: 'layouting', label: 'Creating your book...', icon: '📖' },
    { key: 'done', label: 'Ready!', icon: '🎉' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex p-6 rounded-full bg-white shadow-2xl mb-6">
            <Sparkles className="w-16 h-16 text-rose-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Creating Magic...
          </h1>
          <p className="text-xl text-gray-600">
            This usually takes 10-20 seconds
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-full h-4 overflow-hidden shadow-lg mb-8">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stages */}
        <div className="space-y-4">
          {stages.map((s, i) => {
            const isActive = s.key === stage;
            const isDone = stages.findIndex(st => st.key === stage) > i;

            return (
              <div
                key={s.key}
                className={`flex items-center gap-4 p-4 rounded-2xl transition ${
                  isActive ? 'bg-white shadow-lg scale-105' : 
                  isDone ? 'bg-white/50' : 'bg-white/30'
                }`}
              >
                <div className={`text-3xl ${isActive ? 'animate-bounce' : ''}`}>
                  {isDone ? <Check className="w-8 h-8 text-green-500" /> : s.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                    {s.label}
                  </div>
                </div>
                {isDone && <Check className="w-6 h-6 text-green-500" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
