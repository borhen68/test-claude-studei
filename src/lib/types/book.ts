export type Book = {
  id: string;
  sessionToken: string;
  title: string;
  theme: 'auto' | 'warm' | 'cool' | 'bw' | 'vintage';
  pageCount: number | null;
  status: 'uploading' | 'processing' | 'ready' | 'purchased' | 'error';
  coverImageUrl: string | null;
  previewPdfUrl: string | null;
  finalPdfUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Photo = {
  id: string;
  bookId: string;
  originalUrl: string;
  processedUrl: string | null;
  thumbnailUrl: string | null;
  filename: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  aspectRatio: number;
  dateTaken: Date | null;
  qualityScore: number;
  hasFaces: boolean;
  faceCount: number;
  dominantColor: string;
  orientation: 'portrait' | 'landscape' | 'square';
  sortOrder: number;
  createdAt: Date;
};

export type Page = {
  id: string;
  bookId: string;
  pageNumber: number;
  template: 'hero' | 'duo_horizontal' | 'duo_vertical' | 'trio' | 'quad' | 'gallery' | 'quote';
  photoIds: string[];
  layoutData: Record<string, any>;
  previewUrl: string | null;
};
