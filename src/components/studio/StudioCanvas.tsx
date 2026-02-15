"use client";
export default function StudioCanvas({ page, photos, zoom, showGrid, onZoomChange, onToggleGrid, onPhotoMove, onPhotoEdit, onPhotoSelect, selectedPhoto }: any) {
  return <div className="w-full h-full bg-white rounded-2xl shadow-2xl p-8">
    <p className="text-gray-500 text-center">Canvas: Page {page?.pageNumber}</p>
  </div>;
}
