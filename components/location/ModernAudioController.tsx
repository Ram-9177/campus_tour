'use client';

import React, { useEffect, useState } from 'react';
import audioEngine from '@/lib/audioGuideEngine';

const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const RotateCcwIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const FastForwardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 19 22 12 13 5 13 19" />
    <polygon points="2 19 11 12 2 5 2 19" />
  </svg>
);

const RewindIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 19 2 12 11 5 11 19" />
    <polygon points="22 19 13 12 22 5 22 19" />
  </svg>
);

const Settings2Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 7h-9" />
    <path d="M14 17H5" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="7" r="3" />
  </svg>
);

export default function ModernAudioController() {
  const [state, setState] = useState(audioEngine.getState());
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return audioEngine.subscribe(setState);
  }, []);

  if (!mounted) return null;
  if (!state.isAvailable && !state.isLoading && !state.error) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    audioEngine.seek(time);
  };

  const handlePlayToggle = () => {
    audioEngine.registerUserGesture();
    if (state.isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play();
    }
  };

  const handleSpeedChange = (rate: number) => {
    audioEngine.setPlaybackRate(rate);
  };

  return (
    <div className="w-full bg-slate-50/50 rounded-3xl p-5 border border-slate-200/60 shadow-inner">
      {state.error && (
        <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          {state.error}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-6">
        <input
          type="range"
          min="0"
          max={state.duration || 0}
          value={state.currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          style={{
            background: `linear-gradient(to right, #2563eb ${state.progress * 100}%, #e2e8f0 ${state.progress * 100}%)`
          }}
        />
        <div className="flex justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => audioEngine.seek(state.currentTime - 10)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          title="Back 10s"
        >
          <RewindIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => audioEngine.replay()}
            className="p-2 text-slate-400 hover:text-slate-900 transition-all"
            title="Restart"
          >
            <RotateCcwIcon className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayToggle}
            disabled={state.isLoading}
            className={`w-16 h-16 flex items-center justify-center rounded-full transition-all active:scale-90 shadow-xl ${
              state.isPlaying 
                ? 'bg-white text-slate-900 border border-slate-100 hover:shadow-2xl' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200/50'
            }`}
          >
            {state.isLoading ? (
              <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
            ) : state.isPlaying ? (
              <PauseIcon className="w-8 h-8 fill-current" />
            ) : (
              <PlayIcon className="w-8 h-8 fill-current translate-x-0.5" />
            )}
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 transition-all rounded-full ${showSettings ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
            title="Settings"
          >
            <Settings2Icon className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={() => audioEngine.seek(state.currentTime + 10)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          title="Forward 10s"
        >
          <FastForwardIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="mt-6 pt-5 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Playback Speed</span>
            <div className="flex gap-1">
              {[0.75, 1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    state.playbackRate === rate 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Auto Advance</span>
            <button
              onClick={() => audioEngine.setAutoAdvance(!state.autoAdvance)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                state.autoAdvance ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  state.autoAdvance ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
