'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GradeBadge } from '@/components/domain/GradeBadge';
import { formatOrdinal } from '@/lib/grading/engine';
import {
  GraduationCap,
  ArrowRight,
  ChevronRight,
  Bell,
  Calendar,
  Award,
  Users,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';

interface ChildSummary {
  studentId: string;
  fullName: string;
  admissionNo: string;
  className: string;
  schoolName: string;
  isPublished: boolean;
  termResult?: {
    termName: string;
    sessionName: string;
    totalScore: number;
    average: number;
    positionInClass: number;
    classSize: number;
    publishedAt: string;
  };
}

export default function ParentHomePage() {
  const [childrenList, setChildrenList] = useState<ChildSummary[]>([
    {
      studentId: 'st_1',
      fullName: 'Emeka David Okafor',
      admissionNo: 'BFC/2024/001',
      className: 'JSS 1A',
      schoolName: 'Bright Future College',
      isPublished: true,
      termResult: {
        termName: 'First Term',
        sessionName: '2024/2025',
        totalScore: 710,
        average: 88.75,
        positionInClass: 1,
        classSize: 40,
        publishedAt: '2024-12-15T12:00:00Z',
      },
    },
    {
      studentId: 'st_5',
      fullName: 'Tolu Segun Ogunlesi',
      admissionNo: 'BFC/2024/005',
      className: 'JSS 1A',
      schoolName: 'Bright Future College',
      isPublished: false, // Pre-publication state!
    },
  ]);

  const [selectedChildId, setSelectedChildId] = useState('st_1');
  const [isOffline, setIsOffline] = useState(false);

  const activeChild = childrenList.find((c) => c.studentId === selectedChildId) || childrenList[0];

  return (
    <div className="space-y-6">
      {/* Offline Banner matching Section 9 */}
      {isOffline && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
          <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Showing saved results from 15 Dec 2024. Connect to the internet for the latest.</span>
        </div>
      )}

      {/* Child Switcher Pinned at Top (when >1 child) */}
      {childrenList.length > 1 && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] uppercase tracking-wide text-slate-400 font-bold block mb-2 px-1">
            Switch Child Account
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {childrenList.map((c) => (
              <button
                key={c.studentId}
                type="button"
                onClick={() => setSelectedChildId(c.studentId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  selectedChildId === c.studentId
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{c.fullName.split(' ')[0]} ({c.className})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Child Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              {activeChild.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activeChild.fullName}</h2>
              <p className="text-xs text-slate-500">
                {activeChild.className} · {activeChild.admissionNo} · {activeChild.schoolName}
              </p>
            </div>
          </div>
          <Link
            href={`/parent/children/${activeChild.studentId}`}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5"
          >
            All Terms <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Latest Published Term Result or Pre-publication State */}
        {activeChild.isPublished && activeChild.termResult ? (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  {activeChild.termResult.termName} ({activeChild.termResult.sessionName})
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Published {new Date(activeChild.termResult.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-semibold text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Published
              </span>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Term Average</span>
                <span className="text-xl font-black text-emerald-950">{activeChild.termResult.average}%</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Class Rank</span>
                <span className="text-xl font-black text-amber-950">
                  {formatOrdinal(activeChild.termResult.positionInClass)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Class Size</span>
                <span className="text-xl font-black text-slate-800">{activeChild.termResult.classSize}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                href={`/parent/children/${activeChild.studentId}/results/trm_first`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition"
              >
                View Subject Score Breakdown
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/parent/children/${activeChild.studentId}/report/trm_first`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
              >
                Official Report Card (Print / PDF)
              </Link>
            </div>
          </div>
        ) : (
          /* Section 10.5 Pre-publication state requirement */
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              Results for this term have not been published yet.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The school administration is finalizing score moderation and approval. You will receive an in-app notice as soon as results are officially released.
            </p>
          </div>
        )}
      </div>

      {/* School Notices */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Recent Notices & Announcements</h3>
          </div>
          <Link href="/parent/notices" className="text-xs font-semibold text-emerald-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5">
            <span className="font-semibold text-slate-900 block">First Term 2024/2025 Results Published</span>
            <span className="text-slate-500">Official term scores and grades are now accessible for viewing.</span>
          </div>
          <div className="py-2.5">
            <span className="font-semibold text-slate-900 block">Resumption Date for Second Term</span>
            <span className="text-slate-500">Academic activities resume on Monday, 8th January 2025.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
