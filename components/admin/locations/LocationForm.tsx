'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CampusLocation } from '@/types/campusLocation';
import type { AppUserType } from '@/types/appRules';
import LocationBasicInfoForm from './LocationBasicInfoForm';
import LocationCoordinateForm from './LocationCoordinateForm';
import LocationRadiusForm from './LocationRadiusForm';
import LocationContentEditor from './LocationContentEditor';
import LocationVariantEditor from './LocationVariantEditor';
import LocationAdmissionsForm from './LocationAdmissionsForm';
import LocationMapPreview from './LocationMapPreview';
import { validateLocation } from '@/lib/locationValidation';
import { LocationStore } from '@/lib/locationStore';

interface LocationFormProps {
  initialData?: Partial<CampusLocation>;
  onSave: (data: CampusLocation) => CampusLocation | void;
  onSaveAndStay?: (data: CampusLocation) => CampusLocation | void;
  onCancel: () => void;
  title: string;
}

const USER_TYPES: { value: AppUserType; label: string }[] = [
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'other', label: 'Other' },
];

const DEFAULT_I18N_TEXT: CampusLocation['name'] = { en: '', te: '', hi: '' };
const DEFAULT_I18N_MEDIA: CampusLocation['audio'] = { en: '', te: '', hi: '' };

function createInitialFormData(initialData?: Partial<CampusLocation>): Partial<CampusLocation> {
  const defaults: Partial<CampusLocation> = {
    active: true,
    recommendedFor: ['student', 'parent'],
    routeOrder: 1,
    radiusMeters: 20,
    name: DEFAULT_I18N_TEXT,
    images: [],
    videos: [],
    audio: DEFAULT_I18N_MEDIA,
    description: DEFAULT_I18N_TEXT,
    script: DEFAULT_I18N_TEXT,
    contentVariants: {
      physical: { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA },
      virtual: { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA },
      buggy: { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA },
    },
    uspTags: [],
    parentTrustPoints: [],
    studentHighlights: [],
    admissionsCta: { applyUrl: '', brochureUrl: '', whatsappUrl: '', counsellorText: '' }
  };

  if (!initialData) return defaults;

  return {
    ...defaults,
    ...initialData,
    name: {
      en: initialData.name?.en ?? '',
      te: initialData.name?.te ?? '',
      hi: initialData.name?.hi ?? '',
    },
    description: {
      en: initialData.description?.en ?? '',
      te: initialData.description?.te ?? '',
      hi: initialData.description?.hi ?? '',
    },
    script: {
      en: initialData.script?.en ?? '',
      te: initialData.script?.te ?? '',
      hi: initialData.script?.hi ?? '',
    },
    audio: {
      en: initialData.audio?.en ?? '',
      te: initialData.audio?.te ?? '',
      hi: initialData.audio?.hi ?? '',
    },
    contentVariants: {
      physical: initialData.contentVariants?.physical || { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA },
      virtual: initialData.contentVariants?.virtual || { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA },
      buggy: initialData.contentVariants?.buggy || { description: DEFAULT_I18N_TEXT, script: DEFAULT_I18N_TEXT, audio: DEFAULT_I18N_MEDIA },
    },
    images: Array.isArray(initialData.images) ? initialData.images : defaults.images,
    videos: Array.isArray(initialData.videos) ? initialData.videos : defaults.videos,
    uspTags: initialData.uspTags || [],
    parentTrustPoints: initialData.parentTrustPoints || [],
    studentHighlights: initialData.studentHighlights || [],
    admissionsCta: initialData.admissionsCta || defaults.admissionsCta,
    recommendedFor:
      Array.isArray(initialData.recommendedFor) && initialData.recommendedFor.length > 0
        ? initialData.recommendedFor
        : defaults.recommendedFor,
    active: typeof initialData.active === 'boolean' ? initialData.active : true,
  };
}

export default function LocationForm({ initialData, onSave, onSaveAndStay, onCancel, title }: LocationFormProps) {
  const initialFormData = useMemo(() => createInitialFormData(initialData), [initialData]);
  const [formData, setFormData] = useState<Partial<CampusLocation>>(initialFormData);
  const [activeLang, setActiveLang] = useState<'en' | 'te' | 'hi'>('en');

  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const baselineRef = useRef<string>(JSON.stringify(initialFormData));

  useEffect(() => {
    setFormData(initialFormData);
    baselineRef.current = JSON.stringify(initialFormData);
  }, [initialFormData]);

  const isDirty = useMemo(() => JSON.stringify(formData) !== baselineRef.current, [formData]);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleToggleUserType = (type: AppUserType) => {
    const current = formData.recommendedFor || [];
    const updated = current.includes(type) 
      ? current.filter(t => t !== type)
      : [...current, type];
    setFormData({ ...formData, recommendedFor: updated });
  };

  const runValidation = () => {
    const validationErrors = validateLocation(formData, LocationStore.getAllLocations());
    
    // Additional validation for script length
    ['en', 'te', 'hi'].forEach(lang => {
      const script = (formData.script as any)?.[lang] || '';
      if (script.length > 2500) {
        validationErrors.push({ field: `script.${lang}`, message: `${lang.toUpperCase()} script exceeds 2500 characters.` });
      }
    });
    return validationErrors;
  };

  const commitSave = (stayOnPage: boolean): CampusLocation | null => {
    const validationErrors = runValidation();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Scroll to top to see errors or just alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return null;
    }

    setErrors([]);
    const saveTarget = stayOnPage && onSaveAndStay ? onSaveAndStay : onSave;
    const payload = formData as CampusLocation;
    const saved = saveTarget(payload);
    baselineRef.current = JSON.stringify(saved || payload);
    if (saved) {
      setFormData(saved);
      return saved;
    }
    return payload;
  };

  const handleSave = () => {
    commitSave(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
      const resetData = createInitialFormData(initialData);
      setFormData(resetData);
      baselineRef.current = JSON.stringify(resetData);
      setErrors([]);
    }
  };

  const handleCancel = () => {
    if (isDirty && !confirm('You have unsaved changes. Leave this page?')) return;
    onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {isDirty ? (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Unsaved
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Saved
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-blue-700 transition active:scale-95"
          >
            Save Location
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <h3 className="text-sm font-bold text-red-800 mb-2">Please fix the following errors:</h3>
          <ul className="text-xs text-red-700 list-disc pl-4 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 1: Basic Info */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
          Basic Information
        </h3>
        <LocationBasicInfoForm data={formData} onChange={setFormData} />
      </section>

      {/* Section 2: Coordinates */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
          Map Positioning
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LocationCoordinateForm data={formData} onChange={setFormData} />
          <div className="lg:border-l lg:pl-8 border-slate-100">
            <LocationMapPreview data={formData} />
          </div>
        </div>
      </section>

      {/* Section 3: Radius */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">3</span>
          Proximity Settings (Radius)
        </h3>
        <LocationRadiusForm data={formData} onChange={setFormData} />
      </section>

      {/* Section 4: Recommended For */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">4</span>
          Target Audience
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {USER_TYPES.map(type => {
            const isSelected = (formData.recommendedFor || []).includes(type.value);
            return (
              <button
                key={type.value}
                onClick={() => handleToggleUserType(type.value)}
                className={`h-12 rounded-xl border text-sm font-semibold transition-all ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 5: Default Content & Media */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">5</span>
          Media & Default Content
        </h3>
        <LocationContentEditor data={formData} onChange={setFormData} />
      </section>

      {/* Section 6: Mode Variants */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">6</span>
          Tour Mode Variants
        </h3>
        <LocationVariantEditor data={formData} onChange={setFormData} />
      </section>

      {/* Section 7: Admissions & Storytelling */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">7</span>
          Admissions & Storytelling
        </h3>
        <LocationAdmissionsForm data={formData} onChange={setFormData} />
      </section>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={handleReset}
          className="text-xs font-bold text-red-600 hover:underline"
        >
          Reset Form
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const saved = commitSave(true);
              if (!saved?.slug) return;
              window.open(`/stop/${saved.slug}`, '_blank', 'noopener,noreferrer');
            }}
            className="px-6 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Save & Preview
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-700 transition transform active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
