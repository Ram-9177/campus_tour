'use client';

import { useMemo, useState } from 'react';
import { mockAIQuestions } from '@/data/mockAIQuestions';

const FALLBACK_ANSWER =
  'Please contact the official SMRU admissions team or check the official university sources.';

export default function AIGuidePlaceholder() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categories = useMemo(
    () => ['all', ...new Set(mockAIQuestions.map((item) => item.category))],
    []
  );

  const filtered = useMemo(
    () =>
      mockAIQuestions.filter((item) => {
        const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
        const searchMatch = !search || item.question.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [activeCategory, search]
  );

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions (placeholder)"
          className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          aria-label="Search questions"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`min-h-10 rounded-full px-3 text-xs font-semibold ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Suggested Questions</p>
        <div className="space-y-2">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{item.question}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{FALLBACK_ANSWER}</p>
            </article>
          ))}
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-slate-200 p-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
              {FALLBACK_ANSWER}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
