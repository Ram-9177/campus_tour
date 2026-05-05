"use client";

import { useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { campusLocations } from '@/data/campusLocations';
import { clearScriptOverride, getScriptForLocation, setScriptOverride } from '@/lib/scriptStore';

type Language = 'en' | 'te' | 'hi';

export default function AudioAdminPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  const visibleLocations = useMemo(() => campusLocations, []);

  if (typeof window !== 'undefined') {
    window.onbeforeunload = Object.keys(drafts).length > 0 ? () => true : null;
  }

  const getDraftValue = (locationId: string, fallback: string): string => {
    if (Object.prototype.hasOwnProperty.call(drafts, locationId)) {
      return drafts[locationId];
    }
    return fallback;
  };

  const onDraftChange = (locationId: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [locationId]: value }));
  };

  const onSave = (locationId: string) => {
    const location = visibleLocations.find((item) => item.id === locationId);
    if (!location) return;
    const fallback = getScriptForLocation(location, language);
    const value = getDraftValue(locationId, fallback);
    if (value.trim().length < 30 || value.trim().length > 2500) return;
    setScriptOverride(locationId, language, value);
    setSavedAt(new Date().toLocaleTimeString());
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[locationId];
      return next;
    });
  };

  const onPublish = (locationId: string) => {
    const location = visibleLocations.find((item) => item.id === locationId);
    if (!location) return;
    const fallback = getScriptForLocation(location, language);
    const value = getDraftValue(locationId, fallback);
    if (value.trim().length < 30 || value.trim().length > 2500) return;
    setScriptOverride(locationId, language, value);
    setPublishedAt(new Date().toLocaleTimeString());
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[locationId];
      return next;
    });
  };

  const onResetAllLanguages = (locationId: string) => {
    if (!window.confirm('Reset all languages for this location?')) return;
    (['en', 'te', 'hi'] as const).forEach((lang) => clearScriptOverride(locationId, lang));
    setSavedAt(new Date().toLocaleTimeString());
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[locationId];
      return next;
    });
  };

  const onReset = (locationId: string) => {
    clearScriptOverride(locationId, language);
    setSavedAt(new Date().toLocaleTimeString());
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[locationId];
      return next;
    });
  };

  return (
    <AdminShell title="Audio Guides" subtitle="Manage multilingual audio scripts and recordings" backHref="/admin">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Audio Guide Manager</h2>
        <p className="text-sm text-slate-600 mb-4">
          Manage scripts and audio for SMRU campus locations. Published script changes are reflected in tour playback.
        </p>
        {savedAt ? (
          <p className="mb-4 text-xs font-medium text-emerald-700">Saved at {savedAt}</p>
        ) : null}
        {publishedAt ? (
          <p className="mb-4 text-xs font-medium text-blue-700">Published at {publishedAt}</p>
        ) : null}

        {/* Language tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {(['en', 'te', 'hi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                lang === language
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'en' ? '🇬🇧 English' : lang === 'te' ? '🇮🇳 Telugu' : '🇮🇳 Hindi'}
            </button>
          ))}
        </div>

        {/* Audio scripts by location */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Audio Scripts ({language.toUpperCase()})</h3>
          {visibleLocations.map((location) => {
            const effectiveScript = getScriptForLocation(location, language);
            const draftValue = getDraftValue(location.id, effectiveScript);
            const isDirty = draftValue !== effectiveScript;
            const chars = draftValue.trim().length;
            const valid = chars >= 30 && chars <= 2500;

            return (
              <div key={location.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-slate-900">{location.name[language]}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      Audio file: <span className="font-mono text-blue-600">{location.audio[language]}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-medium transition">
                      ▶ Preview
                    </button>
                    <button className="px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 text-xs font-medium transition">
                      📤 Upload
                    </button>
                  </div>
                </div>

                {/* Script editor */}
                <div className="mt-2 space-y-2">
                  <textarea
                    value={draftValue}
                    onChange={(event) => onDraftChange(location.id, event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Write dummy script here..."
                  />
                  <div className="flex flex-wrap gap-2">
                    <div className={`text-xs ${valid ? 'text-slate-500' : 'text-red-600'}`}>{chars}/2500 (min 30)</div>
                    <button
                      onClick={() => onSave(location.id)}
                      disabled={!isDirty || !valid}
                      className="h-9 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => onPublish(location.id)}
                      disabled={!valid}
                      className="h-9 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Publish
                    </button>
                    <button
                      onClick={() => onReset(location.id)}
                      className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Reset Current Language
                    </button>
                    <button
                      onClick={() => onResetAllLanguages(location.id)}
                      className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Reset All Languages
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all button */}
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">
          End-to-end wired: updates here are immediately available in location bottom sheet and virtual tour script blocks.
        </div>
      </section>

      {/* Recording guidelines */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Recording Guidelines</h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex gap-2">
            <span className="text-lg">🎯</span>
            <div>
              <div className="font-semibold text-slate-900">Tone & Pace</div>
              <div>Speak clearly at a moderate pace, friendly and informative</div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">⏱</span>
            <div>
              <div className="font-semibold text-slate-900">Duration</div>
              <div>Keep each guide between 30 seconds to 2 minutes</div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">🎙</span>
            <div>
              <div className="font-semibold text-slate-900">Audio Quality</div>
              <div>MP3 format, 192 kbps, 44.1 kHz sample rate</div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-lg">🌐</span>
            <div>
              <div className="font-semibold text-slate-900">Languages</div>
              <div>Record in English, Telugu, and Hindi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Future features */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="text-sm font-semibold text-amber-900 mb-2">🔮 Future CMS Features</div>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>✓ Browser-based audio recorder</li>
          <li>✓ Upload audio files (MP3, WAV, OGG)</li>
          <li>✓ Audio waveform editor and trim tool</li>
          <li>✓ Auto-transcription and translation</li>
          <li>✓ Text-to-speech preview</li>
          <li>✓ Multi-language audio synchronization</li>
          <li>✓ Audio quality checker</li>
          <li>✓ Batch audio file management</li>
        </ul>
      </section>
    </AdminShell>
  );
}
