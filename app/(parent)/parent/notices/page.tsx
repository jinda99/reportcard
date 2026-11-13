'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCircle2, Calendar } from 'lucide-react';

export default function ParentNoticesPage() {
  const notices = [
    {
      id: 'not_1',
      title: 'First Term 2024/2025 Results Published',
      body: 'Official examination and continuous assessment results for JSS 1 have been approved and published. You may view or print your child’s report card.',
      date: '15 Dec 2024',
      read: true,
      link: '/parent/children/st_1/report/trm_first',
    },
    {
      id: 'not_2',
      title: 'Resumption Date & Academic Calendar',
      body: 'The Second Term commences on Monday, 8th January 2025. All students are expected to resume promptly in complete official uniforms.',
      date: '12 Dec 2024',
      read: true,
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">School Notifications</h1>
          <p className="text-xs text-slate-500">Official broadcasts from Bright Future College</p>
        </div>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{n.title}</span>
              <span className="text-[11px] text-slate-400">{n.date}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
            {n.link && (
              <div className="pt-1">
                <Link
                  href={n.link}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  View Related Report Card →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
