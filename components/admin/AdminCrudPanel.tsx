'use client';

import { useState } from 'react';

interface CrudItem {
  id: string;
  name: string;
  note: string;
}

interface AdminCrudPanelProps {
  title: string;
  itemLabel: string;
  initialItems?: CrudItem[];
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdminCrudPanel({
  title,
  itemLabel,
  initialItems = [],
}: AdminCrudPanelProps) {
  const [items, setItems] = useState<CrudItem[]>(initialItems);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingNote, setEditingNote] = useState('');

  const createItem = () => {
    if (!name.trim()) return;
    const newItem: CrudItem = { id: makeId(), name: name.trim(), note: note.trim() };
    setItems((prev) => [newItem, ...prev]);
    setName('');
    setNote('');
  };

  const startEdit = (item: CrudItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingNote(item.note);
  };

  const saveEdit = () => {
    if (!editingId || !editingName.trim()) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, name: editingName.trim(), note: editingNote.trim() } : item
      )
    );
    setEditingId(null);
    setEditingName('');
    setEditingNote('');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>

      <div className="mt-3 grid gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`${itemLabel} name`}
          className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notes (placeholder)"
          className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-950"
        />
        <button
          type="button"
          onClick={createItem}
          className="btn-primary inline-flex min-h-11 items-center justify-center text-sm"
        >
          Create {itemLabel}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No {itemLabel.toLowerCase()} items yet.
          </p>
        ) : null}

        {items.map((item) => {
          const isEditing = editingId === item.id;
          return (
            <article key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              {isEditing ? (
                <div className="grid gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                  <input
                    type="text"
                    value={editingNote}
                    onChange={(e) => setEditingNote(e.target.value)}
                    className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={saveEdit} className="btn-primary px-3 py-2 text-sm">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="btn-secondary px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {item.note || 'No notes'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="btn-secondary px-3 py-2 text-xs"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
