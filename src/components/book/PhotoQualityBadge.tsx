'use client';

import { Star, Sparkles, Award, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoQualityBadgeProps {
  qualityScore: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function PhotoQualityBadge({
  qualityScore,
  size = 'md',
  showLabel = false,
  className,
}: PhotoQualityBadgeProps) {
  // Determine badge tier based on quality score (0-100)
  const getBadgeConfig = () => {
    if (qualityScore >= 90) {
      return {
        tier: 'excellent',
        label: 'Excellent',
        icon: Crown,
        bgColor: 'bg-gradient-to-br from-yellow-400 to-amber-500',
        textColor: 'text-amber-900',
        borderColor: 'border-amber-400',
        ringColor: 'ring-amber-400/20',
      };
    } else if (qualityScore >= 75) {
      return {
        tier: 'great',
        label: 'Great',
        icon: Award,
        bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
        textColor: 'text-purple-50',
        borderColor: 'border-purple-400',
        ringColor: 'ring-purple-400/20',
      };
    } else if (qualityScore >= 60) {
      return {
        tier: 'good',
        label: 'Good',
        icon: Sparkles,
        bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
        textColor: 'text-blue-50',
        borderColor: 'border-blue-400',
        ringColor: 'ring-blue-400/20',
      };
    } else {
      return {
        tier: 'fair',
        label: 'Fair',
        icon: Star,
        bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
        textColor: 'text-gray-50',
        borderColor: 'border-gray-400',
        ringColor: 'ring-gray-400/20',
      };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (!showLabel) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'border-2 shadow-lg ring-4',
          config.bgColor,
          config.borderColor,
          config.ringColor,
          sizeClasses[size],
          className
        )}
        title={`${config.label} Quality (${qualityScore}/100)`}
      >
        <Icon className={cn('drop-shadow-sm', config.textColor, iconSizes[size])} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'border-2 shadow-md ring-2',
        config.bgColor,
        config.borderColor,
        config.ringColor,
        'font-semibold',
        className
      )}
      title={`Quality Score: ${qualityScore}/100`}
    >
      <Icon className={cn('drop-shadow-sm', config.textColor, iconSizes[size])} />
      <span className={cn(config.textColor, size === 'sm' ? 'text-xs' : 'text-sm')}>
        {config.label}
      </span>
    </div>
  );
}

/**
 * Shows a ranked list of top quality photos
 */
export function TopPhotosIndicator({ rank }: { rank: number }) {
  if (rank > 20) return null;

  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-amber-300 ring-4 ring-amber-400/20">
        #{rank}
      </div>
    </div>
  );
}
