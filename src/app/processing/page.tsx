'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Camera, 
  Palette, 
  LayoutGrid, 
  Brain,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Zap,
  TrendingUp,
  Calendar,
  Map
} from 'lucide-react';

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

interface Chapter {
  id: string;
  title: string;
  photoCount: number;
  dateRange: string;
  preview: string[];
}

interface LayoutPage {
  pageNumber: number;
  template: string;
  photoIds: string[];
  photoCount: number;
}

type Stage = 'init' | 'loading' | 'analyzing' | 'grouping' | 'layouting' | 'finalizing' | 'done';

export default function ProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get('bookId');
  
  const [stage, setStage] = useState<Stage>('init');
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [layoutPages, setLayoutPages] = useState<LayoutPage[]>([]);
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
      const groupedChapters = await groupPhotos(photosData);
      if (!mountedRef.current) return;
      
      setChapters(groupedChapters);

      // Stage 4: Generate layout
      setStage('layouting');
      await animateProgress(75, 90, 1500);
      
      // Call actual processing API
      const response = await fetch(`/api/books/${bookId}/process`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const result = await response.json();
      if (!mountedRef.current) return;
      
      if (result.success && result.pages) {
        setLayoutPages(result.pages.map((p: any) => ({
          pageNumber: p.pageNumber,
          template: p.template,
          photoIds: p.photoIds,
          photoCount: p.photoIds.length,
        })));
      }

      // Stage 5: Finalize
      setStage('finalizing');
      await animateProgress(90, 100, 800);

      // Stage 6: Done
      if (!mountedRef.current) return;
      setStage('done');
      
      setTimeout(() => {
        if (mountedRef.current) {
          router.push(`/book/${bookId}`);
        }
      }, 1500);
      
    } catch (error) {
      console.error('Processing failed:', error);
      // Don't show error UI, just redirect
      router.push(`/book/${bookId}`);
    }
  }

  async function fetchPhotos(): Promise<Photo[]> {
    const response = await fetch(`/api/books/${bookId}`);
    const data = await response.json();
    
    if (data.success && data.book) {
      return data.book.photos || [];
    }
    
    return [];
  }

  async function analyzePhotos(photosList: Photo[]) {
    const duration = 50;
    const delay = Math.max(30, Math.floor(3000 / photosList.length));
    
    for (let i = 0; i < photosList.length; i++) {
      if (!mountedRef.current) break;
      
      setCurrentPhotoIndex(i);
      const currentProgress = 10 + ((i + 1) / photosList.length) * 50;
      setProgress(currentProgress);
      
      // Update stats
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

  async function groupPhotos(photosList: Photo[]): Promise<Chapter[]> {
    const mockChapters: Chapter[] = [];
    let currentGroup: Photo[] = [];
    let lastDate: string | null = null;

    for (const photo of photosList) {
      const photoDate = photo.dateTaken?.split('T')[0] || null;
      
      if (lastDate && photoDate) {
        const daysDiff = Math.abs(
          (new Date(photoDate).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysDiff > 7 || currentGroup.length >= 20) {
          if (currentGroup.length > 0) {
            mockChapters.push(createChapter(currentGroup, mockChapters.length));
            currentGroup = [];
          }
        }
      }
      
      currentGroup.push(photo);
      lastDate = photoDate;
    }
    
    if (currentGroup.length > 0) {
      mockChapters.push(createChapter(currentGroup, mockChapters.length));
    }

    return mockChapters.length > 0 ? mockChapters : [
      {
        id: 'all',
        title: 'Your Memories',
        photoCount: photosList.length,
        dateRange: 'All Photos',
        preview: photosList.slice(0, 4).map(p => p.thumbnailUrl || '').filter(Boolean),
      }
    ];
  }

  function createChapter(photos: Photo[], index: number): Chapter {
    const dates = photos.map(p => p.dateTaken).filter(Boolean).sort();
    const firstDate = dates[0] ? new Date(dates[0]) : null;
    const lastDate = dates[dates.length - 1] ? new Date(dates[dates.length - 1]) : null;
    
    let dateRange = 'Recent Photos';
    if (firstDate && lastDate) {
      const isSameMonth = firstDate.getMonth() === lastDate.getMonth() && 
                          firstDate.getFullYear() === lastDate.getFullYear();
      
      if (isSameMonth) {
        dateRange = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } else {
        const start = firstDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const end = lastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        dateRange = `${start} - ${end}`;
      }
    }
    
    const title = firstDate ? 
      firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
      `Chapter ${index + 1}`;

    return {
      id: `chapter-${index}`,
      title,
      photoCount: photos.length,
      dateRange,
      preview: photos.slice(0, 4).map(p => p.thumbnailUrl || '').filter(Boolean),
    };
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

  const getStageInfo = () => {
    switch (stage) {
      case 'init':
      case 'loading':
        return {
          title: 'Loading Your Photos',
          subtitle: 'Preparing for analysis...',
          icon: ImageIcon,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
        };
      case 'analyzing':
        return {
          title: 'Analyzing Photos',
          subtitle: `Extracting EXIF data, detecting faces, scoring quality...`,
          icon: Brain,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
        };
      case 'grouping':
        return {
          title: 'Grouping Memories',
          subtitle: 'Organizing photos into smart chapters...',
          icon: Calendar,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        };
      case 'layouting':
        return {
          title: 'Designing Your Book',
          subtitle: 'AI selecting perfect layouts for each page...',
          icon: LayoutGrid,
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
        };
      case 'finalizing':
        return {
          title: 'Finalizing',
          subtitle: 'Putting the finishing touches...',
          icon: Zap,
          color: 'text-rose-500',
          bgColor: 'bg-rose-50',
        };
      case 'done':
        return {
          title: 'Your Book is Ready!',
          subtitle: 'Taking you to preview...',
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        };
      default:
        return {
          title: 'Processing',
          subtitle: 'Working on your book...',
          icon: Sparkles,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
        };
    }
  };

  const stageInfo = getStageInfo();
  const StageIcon = stageInfo.icon;
  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex p-6 rounded-2xl ${stageInfo.bgColor} mb-6 animate-pulse-slow`}>
                <StageIcon className={`w-16 h-16 ${stageInfo.color}`} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                {stageInfo.title}
              </h1>
              <p className="text-lg text-gray-600">
                {stageInfo.subtitle}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-600">{Math.round(progress)}%</span>
                <span className="text-gray-500">
                  {stage === 'done' ? 'Complete!' : 'Processing...'}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            {stage === 'analyzing' && stats.totalPhotos > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={<ImageIcon className="w-5 h-5" />}
                  label="Analyzed"
                  value={`${stats.analyzed}/${stats.totalPhotos}`}
                  color="bg-blue-50 text-blue-600"
                />
                <StatCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Avg Quality"
                  value={`${stats.avgQuality}%`}
                  color="bg-green-50 text-green-600"
                />
                <StatCard
                  icon={<Camera className="w-5 h-5" />}
                  label="With Faces"
                  value={stats.withFaces}
                  color="bg-purple-50 text-purple-600"
                />
                <StatCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Dates"
                  value={stats.uniqueDates}
                  color="bg-amber-50 text-amber-600"
                />
              </div>
            )}

            {/* Current Photo Being Analyzed */}
            {stage === 'analyzing' && currentPhoto && (
              <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 transform hover:scale-[1.02] transition-transform">
                <div className="flex items-start gap-6">
                  {currentPhoto.thumbnailUrl && (
                    <div className="relative flex-shrink-0">
                      <img
                        src={currentPhoto.thumbnailUrl}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-2 shadow-lg animate-ping-slow">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-3 truncate">
                      {currentPhoto.filename}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <AnalysisItem
                        icon={<TrendingUp className="w-4 h-4" />}
                        label="Quality"
                        value={`${currentPhoto.qualityScore}%`}
                        highlight={currentPhoto.qualityScore > 70}
                      />
                      <AnalysisItem
                        icon={<Palette className="w-4 h-4" />}
                        label="Color"
                        value={
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: currentPhoto.dominantColor }}
                            />
                            <span className="text-xs text-gray-600">{currentPhoto.dominantColor}</span>
                          </div>
                        }
                      />
                      {currentPhoto.hasFaces && (
                        <AnalysisItem
                          icon={<Camera className="w-4 h-4" />}
                          label="Faces"
                          value={`${currentPhoto.faceCount} detected`}
                          highlight
                        />
                      )}
                      <AnalysisItem
                        icon={<LayoutGrid className="w-4 h-4" />}
                        label="Orientation"
                        value={currentPhoto.orientation}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapters Preview */}
            {stage === 'grouping' && chapters.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📚 {chapters.length} Chapter{chapters.length !== 1 ? 's' : ''} Created
                </h3>
                <div className="space-y-3">
                  {chapters.map((chapter, idx) => (
                    <div
                      key={chapter.id}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 transform hover:scale-[1.02] transition-transform"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="grid grid-cols-2 gap-1 w-16 h-16">
                            {chapter.preview.slice(0, 4).map((url, i) => (
                              <div key={i} className="bg-white rounded overflow-hidden">
                                {url ? (
                                  <img src={url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-200" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {chapter.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {chapter.photoCount} photos · {chapter.dateRange}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout Preview */}
            {stage === 'layouting' && layoutPages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📖 {layoutPages.length} Pages Designed
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {layoutPages.slice(0, 12).map((page, idx) => (
                    <div
                      key={page.pageNumber}
                      className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-2 flex flex-col items-center justify-center text-center hover:scale-110 transition-transform"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="text-2xl mb-1">{getTemplateEmoji(page.template)}</div>
                      <div className="text-xs font-medium text-gray-700">
                        Page {page.pageNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {page.photoCount} photo{page.photoCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
                {layoutPages.length > 12 && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    + {layoutPages.length - 12} more pages
                  </p>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
              {[
                { key: 'loading', label: 'Load', icon: '📥' },
                { key: 'analyzing', label: 'Analyze', icon: '🔍' },
                { key: 'grouping', label: 'Group', icon: '📚' },
                { key: 'layouting', label: 'Layout', icon: '🎨' },
                { key: 'done', label: 'Done', icon: '✨' },
              ].map((step, idx) => {
                const stageOrder = ['init', 'loading', 'analyzing', 'grouping', 'layouting', 'finalizing', 'done'];
                const currentIdx = stageOrder.indexOf(stage);
                const stepIdx = stageOrder.indexOf(step.key);
                const isActive = stepIdx === currentIdx;
                const isDone = stepIdx < currentIdx;

                return (
                  <div
                    key={step.key}
                    className={`text-center p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 scale-105 shadow-lg'
                        : isDone
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`text-2xl md:text-3xl mb-1 ${isActive ? 'animate-bounce' : ''}`}>
                      {isDone ? '✓' : step.icon}
                    </div>
                    <div
                      className={`text-xs md:text-sm font-medium ${
                        isActive ? 'text-purple-700' : isDone ? 'text-green-700' : 'text-gray-600'
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            <Clock className="w-4 h-4 inline mr-1" />
            This usually takes 10-30 seconds
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
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
    <div className={`${color} rounded-xl p-4 text-center transform hover:scale-105 transition-transform`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

function AnalysisItem({ 
  icon, 
  label, 
  value, 
  highlight 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: React.ReactNode; 
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2 ${highlight ? 'text-purple-700' : 'text-gray-700'}`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

function getTemplateEmoji(template: string): string {
  const emojiMap: Record<string, string> = {
    hero: '🖼️',
    duo_horizontal: '⬛⬛',
    duo_vertical: '⬜⬜',
    trio: '🎯',
    trio_asymmetric: '🎨',
    quad: '⊞',
    quad_grid: '▦',
    gallery_6: '📸',
    gallery: '🖼️',
    quote: '💭',
  };
  
  return emojiMap[template] || '📄';
}
