import React from 'react';

type Props = {
  images?: string[];
  videos?: string[];
  virtual360Url?: string;
};

export default function LocationMediaGallery({ images = [], videos = [], virtual360Url }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Image gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((url, idx) => (
            <div key={idx} className="aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
              <img
                src={url}
                alt={`Gallery ${idx}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = '/images/location-fallback.svg')}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-32 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
          <span className="text-2xl mb-1">📸</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">No images available</span>
        </div>
      )}

      {/* Media types gallery */}
      <div className="grid grid-cols-3 gap-2">
        {videos.length > 0 && (
          <a 
            href={videos[0]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="aspect-video w-full overflow-hidden rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center text-xs font-bold text-red-600 hover:bg-red-100 transition shadow-sm"
          >
            <span className="text-lg">🎬</span>
            <span className="mt-1">Video</span>
          </a>
        )}
        
        {virtual360Url && (
          <a 
            href={virtual360Url}
            target="_blank" 
            rel="noopener noreferrer"
            className="aspect-video w-full overflow-hidden rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition shadow-sm"
          >
            <span className="text-lg">🌐</span>
            <span className="mt-1">360°</span>
          </a>
        )}

        {(videos.length > 1) && (
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
            <span className="text-lg">➕</span>
            <span className="mt-1">+{videos.length - 1} More</span>
          </div>
        )}
      </div>
    </div>
  );
}
