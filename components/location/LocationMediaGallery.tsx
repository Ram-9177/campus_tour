import React from 'react';

type Props = {
  images?: string[];
  videos?: string[];
  virtual360Url?: string;
};

const PlayCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

const View360Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

export default function LocationMediaGallery({ images = [], videos = [], virtual360Url }: Props) {
  const featuredImage = images[0];
  const thumbnails = images.slice(1, 4);

  return (
    <div className="flex flex-col gap-4">
      {images.length > 0 ? (
        <div className="space-y-3">
          {/* Featured Large Image */}
          <div className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
            <img
              src={featuredImage}
              alt="Featured campus view"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => (e.currentTarget.src = '/images/location-fallback.svg')}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Thumbnails Row */}
          {thumbnails.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {thumbnails.map((url, idx) => (
                <div key={idx} className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-transform active:scale-95">
                  <img
                    src={url}
                    alt={`Gallery thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/images/location-fallback.svg')}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
          <div className="text-sm font-bold uppercase tracking-widest opacity-60">Photos coming soon</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {videos.length > 0 && (
          <a
            href={videos[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-slate-900 text-white text-sm font-bold shadow-md transition-all hover:bg-slate-800 active:scale-95"
          >
            <PlayCircleIcon className="w-5 h-5" />
            Watch Video Guide
          </a>
        )}

        {virtual360Url && (
          <a
            href={virtual360Url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-bold shadow-sm transition-all hover:bg-indigo-100 active:scale-95"
          >
            <View360Icon className="w-5 h-5" />
            Explore in 360°
          </a>
        )}
      </div>
    </div>
  );
}
