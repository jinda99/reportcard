'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Calendar, Plus, CheckCircle2, Check, Clock } from 'lucide-react';

interface AcademicTermItem {
  id: string;
  name: string;
  sequence: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export default function AdminSessionsPage() {
  const [sessionName, setSessionName] = useState('2024/2025');
  const [terms, setTerms] = useState<AcademicTermItem[]>([
    {
      id: 'trm_1',
      name: 'First Term',
      sequence: 1,
      startDate: '2024-09-09',
      endDate: '2024-12-15',
      isCurrent: true,
    },
    {
      id: 'trm_2',
      name: 'Second Term',
      sequence: 2,
      startDate: '2025-01-08',
      endDate: '2025-04-10',
      isCurrent: false,
    },
    {
      id: 'trm_3',
      name: 'Third Term',
      sequence: 3,
      startDate: '2025-04-28',
      endDate: '2025-07-20',
      isCurrent: false,
    },
  ]);

  const setCurrentTerm = (id: string) => {
    setTerms(terms.map((t) => ({ ...t, isCurrent: t.id === id })));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Sessions & Terms</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure terminal dates, sequence numbers, and activate the active term for score entry.
          </p>
        </div>

        {/* Current Active Session Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Academic Session</span>
                <span className="text-lg font-black text-slate-900">{sessionName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Academic Terms in Current Session</h2>

          <div className="space-y-3">
            {terms.map((term) => (
              <div
                key={term.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  term.isCurrent
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{term.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">Sequence #{term.sequence}</span>
                    {term.isCurrent && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Term
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-1">
                    Duration: {term.startDate} to {term.endDate}
                  </span>
                </div>

                <div>
                  {!term.isCurrent ? (
                    <button
                      type="button"
                      onClick={() => setCurrentTerm(term.id)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-white rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition"
                    >
                      Set as Active Term
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold px-2 py-1">
                      Currently Open for Scores
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
