'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Sparkles, Camera, LayoutGrid, CheckCircle, Clock,
  Image as ImageIcon, Zap, TrendingUp, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Photo {
  id: string;
  filename: string;
  thumbnailUrl: string | null;
  dateTaken: string | null;
  qualityScore: number;
  dominantColor: string;
  orientation: 'portrait' | 'landscape' | 'square';
  hasFaces: boolean;
  faceCount: number;
}

type Stage = 'loading' | 'analyzing' | 'grouping' | 'layouting' | 'finalizing' | 'done';

export default function ProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get('bookId');
  
  const [stage, setStage] = useState<Stage>('loading');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    analyzed: 0,
    highQuality: 0,
    withFaces: 0,
    uniqueDates: 0,
    avgQuality: 0,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!bookId) {
      router.push('/');
      return;
    }
    processBook();
  }, [bookId]);

  async function processBook() {
    try {
      // Stage 1: Load photos
      setStage('loading');
      await animateProgress(0, 10, 800);
      
      const photosData = await fetchPhotos();
      if (!mountedRef.current) return;
      
      setPhotos(photosData);
      setStats(prev => ({ ...prev, totalPhotos: photosData.length }));

      // Stage 2: Analyze photos
      setStage('analyzing');
      await analyzePhotos(photosData);
      if (!mountedRef.current) return;

      // Stage 3: Group into chapters
      setStage('grouping');
      await animateProgress(60, 75, 1500);

      // Stage 4: Generate layout
      setStage('layouting');
      await animateProgress(75, 90, 1500);
      
      const response = await fetch(`/api/books/${bookId}/process`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Processing failed');

      // Stage 5: Finalize
      setStage('finalizing');
      await animateProgress(90, 100, 800);

      // Stage 6: Done
      if (!mountedRef.current) return;
      setStage('done');
      
      setTimeout(() => {
        if (mountedRef.current) router.push(`/book/${bookId}`);
      }, 1500);
      
    } catch (error) {
      console.error('Processing failed:', error);
      router.push(`/book/${bookId}`);
    }
  }

  async function fetchPhotos(): Promise<Photo[]> {
    const response = await fetch(`/api/books/${bookId}`);
    const data = await response.json();
    return data.success && data.book ? data.book.photos || [] : [];
  }

  async function analyzePhotos(photosList: Photo[]) {
    const delay = Math.max(30, Math.floor(3000 / photosList.length));
    
    for (let i = 0; i < photosList.length; i++) {
      if (!mountedRef.current) break;
      
      setCurrentPhotoIndex(i);
      const currentProgress = 10 + ((i + 1) / photosList.length) * 50;
      setProgress(currentProgress);
      
      const analyzed = photosList.slice(0, i + 1);
      const highQuality = analyzed.filter(p => p.qualityScore > 70).length;
      const withFaces = analyzed.filter(p => p.hasFaces).length;
      const uniqueDates = new Set(analyzed.map(p => p.dateTaken?.split('T')[0]).filter(Boolean)).size;
      const avgQuality = Math.round(analyzed.reduce((sum, p) => sum + p.qualityScore, 0) / analyzed.length);
      
      setStats({
        totalPhotos: photosList.length,
        analyzed: i + 1,
        highQuality,
        withFaces,
        uniqueDates,
        avgQuality,
      });
      
      await sleep(delay);
    }
  }

  async function animateProgress(from: number, to: number, duration: number) {
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = (to - from) / steps;

    for (let i = 0; i <= steps; i++) {
      if (!mountedRef.current) break;
      setProgress(from + increment * i);
      await sleep(stepDuration);
    }
  }

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const stageConfig = {
    loading: {
      title: 'Loading Your Photos',
      subtitle: 'Preparing for analysis...',
      icon: ImageIcon,
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-600',
    },
    analyzing: {
      title: 'Analyzing Composition',
      subtitle: 'Extracting metadata, detecting faces, scoring quality...',
      icon: Zap,
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-600',
    },
    grouping: {
      title: 'Organizing Memories',
      subtitle: 'Grouping photos into smart chapters...',
      icon: Calendar,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600',
    },
    layouting: {
      title: 'Designing Your Book',
      subtitle: 'Selecting perfect layouts for each page...',
      icon: LayoutGrid,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
    },
    finalizing: {
      title: 'Finalizing',
      subtitle: 'Putting the finishing touches...',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-600',
    },
    done: {
      title: 'Your Book is Ready!',
      subtitle: 'Taking you to preview...',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600',
    },
  };

  const config = stageConfig[stage];
  const StageIcon = config.icon;
  const currentPhoto = photos[currentPhotoIndex];
  const circumference = 2 * Math.PI * 120; // radius = 120

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/50 to-amber-50/30 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-5xl w-full">
          <motion.div 
            className="bg-white/80 backdrop-blur-xl border-2 border-neutral-200 rounded-[3rem] shadow-2xl p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Circular Progress */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative mb-8">
                <svg className="transform -rotate-90" width="280" height="280">
                  {/* Background circle */}
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    className="text-neutral-200"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="140"
                    cy="140"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ 
                      strokeDashoffset: circumference - (progress / 100) * circumference 
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    className={`p-6 rounded-3xl bg-gradient-to-br ${config.color} mb-3`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <StageIcon className="h-16 w-16 text-white" />
                  </motion.div>
                  <div className="text-5xl font-bold bg-gradient-to-br from-violet-600 to-purple-700 bg-clip-text text-transparent">
                    {Math.round(progress)}%
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-3 text-center">
                {config.title}
              </h1>
              <p className="text-lg text-neutral-600 text-center max-w-md">
                {config.subtitle}
              </p>
            </div>

            {/* Stats Grid - During Analysis */}
            {stage === 'analyzing' && stats.totalPhotos > 0 && (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StatCard
                  icon={<ImageIcon className="w-5 h-5" />}
                  label="Analyzed"
                  value={`${stats.analyzed}/${stats.totalPhotos}`}
                  color="bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600"
                />
                <StatCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Avg Quality"
                  value={`${stats.avgQuality}%`}
                  color="bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                />
                <StatCard
                  icon={<Camera className="w-5 h-5" />}
                  label="With Faces"
                  value={stats.withFaces}
                  color="bg-gradient-to-br from-violet-50 to-purple-50 text-violet-600"
                />
                <StatCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Unique Dates"
                  value={stats.uniqueDates}
                  color="bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600"
                />
              </motion.div>
            )}

            {/* Current Photo Being Analyzed */}
            {stage === 'analyzing' && currentPhoto?.thumbnailUrl && (
              <motion.div 
                className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-6 border-2 border-violet-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={currentPhotoIndex}
              >
                <div className="flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentPhoto.thumbnailUrl}
                      alt="Current"
                      className="w-40 h-40 object-cover rounded-2xl shadow-lg"
                    />
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-violet-500 text-white rounded-full p-2 shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-900 mb-4 text-lg truncate">
                      {currentPhoto.filename}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-500 mb-1">Quality Score</div>
                        <div className={`font-bold text-lg ${currentPhoto.qualityScore > 70 ? 'text-green-600' : 'text-amber-600'}`}>
                          {currentPhoto.qualityScore}%
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-500 mb-1">Dominant Color</div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-neutral-300"
                            style={{ backgroundColor: currentPhoto.dominantColor }}
                          />
                          <span className="text-xs text-neutral-600 font-mono">{currentPhoto.dominantColor}</span>
                        </div>
                      </div>
                      {currentPhoto.hasFaces && (
                        <div>
                          <div className="text-neutral-500 mb-1">Faces Detected</div>
                          <div className="font-bold text-lg text-violet-600">{currentPhoto.faceCount}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-neutral-500 mb-1">Orientation</div>
                        <div className="font-semibold capitalize text-neutral-700">{currentPhoto.orientation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            <div className="grid grid-cols-5 gap-2 mt-8">
              {[
                { key: 'loading', label: 'Load', icon: '📥' },
                { key: 'analyzing', label: 'Analyze', icon: '🔍' },
                { key: 'grouping', label: 'Group', icon: '📚' },
                { key: 'layouting', label: 'Layout', icon: '🎨' },
                { key: 'done', label: 'Done', icon: '✨' },
              ].map((step) => {
                const stages: Stage[] = ['loading', 'analyzing', 'grouping', 'layouting', 'finalizing', 'done'];
                const currentIdx = stages.indexOf(stage);
                const stepIdx = stages.indexOf(step.key as Stage);
                const isActive = stepIdx === currentIdx;
                const isDone = stepIdx < currentIdx;

                return (
                  <motion.div
                    key={step.key}
                    className={`text-center p-4 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-violet-100 to-purple-100 shadow-lg scale-105'
                        : isDone
                        ? 'bg-green-50'
                        : 'bg-neutral-100'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * stepIdx }}
                  >
                    <div className={`text-3xl mb-2 ${isActive ? 'animate-bounce' : ''}`}>
                      {isDone ? '✓' : step.icon}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        isActive ? 'text-violet-700' : isDone ? 'text-green-700' : 'text-neutral-600'
                      }`}
                    >
                      {step.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <p className="text-center text-sm text-neutral-600 mt-6 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            This usually takes 10-30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  color: string;
}) {
  return (
    <motion.div 
      className={`${color} rounded-2xl p-5 text-center shadow-md hover:shadow-lg transition-shadow`}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </motion.div>
  );
}
