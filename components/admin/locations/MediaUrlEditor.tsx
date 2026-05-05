import React, { useState } from 'react';

interface Props {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  placeholder?: string;
  type: 'image' | 'video';
}

export default function MediaUrlEditor({ label, urls, onChange, placeholder, type }: Props) {
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = () => {
    if (newUrl.trim()) {
      onChange([...urls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-500 uppercase">{label}</label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
          placeholder={placeholder || `https://example.com/${type}.jpg`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="h-10 px-4 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-black transition"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        {urls.map((url, idx) => (
          <div key={idx} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 aspect-video">
            {type === 'image' ? (
              <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x225?text=Invalid+URL')} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-[10px] font-bold">
                VIDEO LINK
              </div>
            )}
            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-1 truncate px-2">
              {url}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
