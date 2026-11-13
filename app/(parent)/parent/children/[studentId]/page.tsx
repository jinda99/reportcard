'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatOrdinal } from '@/lib/grading/engine';
import { ArrowLeft, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ParentChildTermsPage() {
  const params = useParams();
  const studentId = (params?.studentId as string) || 'st_1';

  const terms = [
    {
      termId: 'trm_first',
      name: 'First Term',
      sessionName: '2024/2025',
      isPublished: true,
      publishedAt: '2024-12-15T12:00:00Z',
      average: 88.75,
      position: 1,
      classSize: 40,
    },
    {
      termId: 'trm_second',
      name: 'Second Term',
      sessionName: '2024/2025',
      isPublished: false,
    },
    {
      termId: 'trm_third',
      name: 'Third Term',
      sessionName: '2024/2025',
      isPublished: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/parent"
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Terms & Results</h1>
          <p className="text-xs text-slate-500">Emeka David Okafor · JSS 1A</p>
        </div>
      </div>

      <div className="space-y-3">
        {terms.map((t) => (
          <div
            key={t.termId}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-base text-slate-900">{t.name}</span>
                <span className="text-xs font-mono text-slate-500 font-medium">({t.sessionName})</span>
                {t.isPublished ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    Pending Publication
                  </span>
                )}
              </div>

              {t.isPublished ? (
                <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                  <span>Average: <strong className="text-slate-900 font-mono">{t.average}%</strong></span>
                  <span>Rank: <strong className="text-slate-900 font-mono">{formatOrdinal(t.position)}</strong> of {t.classSize}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-1">Scores not yet finalized by administration.</p>
              )}
            </div>

            {t.isPublished && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/parent/children/${studentId}/results/${t.termId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  View Scores <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/parent/children/${studentId}/report/${t.termId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  Report Card
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
