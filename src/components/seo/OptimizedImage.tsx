import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  src: string;
  alt: string;
  title?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  title, 
  priority = false,
  ...props 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      title={title || alt}
      loading={priority ? undefined : 'lazy'}
      priority={priority}
      {...props}
    />
  );
}
