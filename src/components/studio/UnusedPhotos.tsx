"use client";
export default function UnusedPhotos({ photos, isOpen, onToggle, onAddToPage }: any) {
  if (!isOpen) return <button onClick={onToggle} className="w-full py-3 bg-purple-600/20 text-white">Show Unused Photos ({photos.length})</button>;
  return <div className="p-4 text-white"><p>Unused: {photos.length}</p></div>;
}
