import React from 'react';
import type { CampusLocation } from '@/types/campusLocation';

interface Props {
  data: Partial<CampusLocation>;
  onChange: (data: Partial<CampusLocation>) => void;
}

export default function LocationAdmissionsForm({ data, onChange }: Props) {
  const updateAdmissions = (field: string, val: any) => {
    onChange({
      ...data,
      admissionsCta: {
        ...(data.admissionsCta || {}),
        [field]: val
      }
    });
  };

  const updateList = (field: 'uspTags' | 'parentTrustPoints' | 'studentHighlights', val: string) => {
    const list = val.split('\n').filter(s => s.trim() !== '');
    onChange({
      ...data,
      [field]: list
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">USP Tags (One per line)</label>
          <textarea
            value={data.uspTags?.join('\n') || ''}
            onChange={(e) => updateList('uspTags', e.target.value)}
            className="w-full h-32 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
            placeholder="World-class library&#10;Smart Classrooms&#10;24/7 Access"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Parent Trust Points (One per line)</label>
          <textarea
            value={data.parentTrustPoints?.join('\n') || ''}
            onChange={(e) => updateList('parentTrustPoints', e.target.value)}
            className="w-full h-32 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
            placeholder="Secure Campus&#10;Academic Excellence&#10;Career Guidance"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Student Highlights (One per line)</label>
          <textarea
            value={data.studentHighlights?.join('\n') || ''}
            onChange={(e) => updateList('studentHighlights', e.target.value)}
            className="w-full h-32 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
            placeholder="Modern Sports Complex&#10;Vibrant Cafeteria&#10;Innovation Hub"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <h4 className="text-sm font-bold text-slate-900 uppercase mb-4">Admissions Call to Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Apply URL</label>
            <input
              type="text"
              value={data.admissionsCta?.applyUrl || ''}
              onChange={(e) => updateAdmissions('applyUrl', e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              placeholder="https://smru.meritto.com/..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Brochure URL</label>
            <input
              type="text"
              value={data.admissionsCta?.brochureUrl || ''}
              onChange={(e) => updateAdmissions('brochureUrl', e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              placeholder="https://smru.edu.in/brochure.pdf"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WhatsApp URL</label>
            <input
              type="text"
              value={data.admissionsCta?.whatsappUrl || ''}
              onChange={(e) => updateAdmissions('whatsappUrl', e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              placeholder="https://wa.me/91..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Counsellor CTA Text</label>
            <input
              type="text"
              value={data.admissionsCta?.counsellorText || ''}
              onChange={(e) => updateAdmissions('counsellorText', e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              placeholder="Talk to Admissions Expert"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
