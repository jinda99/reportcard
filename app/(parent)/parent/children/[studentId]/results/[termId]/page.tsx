'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GradeBadge } from '@/components/domain/GradeBadge';
import { formatOrdinal } from '@/lib/grading/engine';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Printer,
  CheckCircle2,
  Calendar,
  Award,
} from 'lucide-react';

interface SubjectResultCard {
  id: string;
  name: string;
  code: string;
  caScores: {
    test1: number;
    test2: number;
    assignment: number;
  };
  caTotal: number;
  examScore: number;
  totalScore: number;
  grade: string;
  remark: string;
  subjectPosition: number;
}

export default function ParentSubjectResultsPage() {
  const params = useParams();
  const studentId = (params?.studentId as string) || 'st_1';
  const termId = (params?.termId as string) || 'trm_first';

  const [expandedId, setExpandedId] = useState<string | null>('sub_mth');

  const subjects: SubjectResultCard[] = [
    {
      id: 'sub_mth',
      name: 'Mathematics',
      code: 'MTH',
      caScores: { test1: 9, test2: 8, assignment: 18 },
      caTotal: 35,
      examScore: 54,
      totalScore: 89,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 1,
    },
    {
      id: 'sub_eng',
      name: 'English Language',
      code: 'ENG',
      caScores: { test1: 8, test2: 9, assignment: 17 },
      caTotal: 34,
      examScore: 52,
      totalScore: 86,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 2,
    },
    {
      id: 'sub_sci',
      name: 'Basic Science',
      code: 'BSC',
      caScores: { test1: 9, test2: 9, assignment: 19 },
      caTotal: 37,
      examScore: 54,
      totalScore: 91,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 1,
    },
    {
      id: 'sub_ict',
      name: 'Computer Studies (ICT)',
      code: 'ICT',
      caScores: { test1: 10, test2: 10, assignment: 19 },
      caTotal: 39,
      examScore: 55,
      totalScore: 94,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 1,
    },
    {
      id: 'sub_cve',
      name: 'Civic Education',
      code: 'CVE',
      caScores: { test1: 8, test2: 8, assignment: 18 },
      caTotal: 34,
      examScore: 54,
      totalScore: 88,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 3,
    },
    {
      id: 'sub_ags',
      name: 'Agricultural Science',
      code: 'AGS',
      caScores: { test1: 8, test2: 8, assignment: 17 },
      caTotal: 33,
      examScore: 53,
      totalScore: 86,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 2,
    },
    {
      id: 'sub_sos',
      name: 'Social Studies',
      code: 'SOS',
      caScores: { test1: 9, test2: 8, assignment: 18 },
      caTotal: 35,
      examScore: 55,
      totalScore: 90,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 1,
    },
    {
      id: 'sub_bst',
      name: 'Business Studies',
      code: 'BST',
      caScores: { test1: 8, test2: 8, assignment: 18 },
      caTotal: 34,
      examScore: 52,
      totalScore: 86,
      grade: 'A1',
      remark: 'Excellent',
      subjectPosition: 4,
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/parent"
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Subject Scores Breakdown</h1>
            <p className="text-xs text-slate-500">
              Emeka David Okafor · First Term (2024/2025)
            </p>
          </div>
        </div>

        <Link
          href={`/parent/children/${studentId}/report/${termId}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <Printer className="w-3.5 h-3.5" />
          Full Report Card
        </Link>
      </div>

      {/* Published Date Tag */}
      <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>Published 15 Dec 2024 · Verified terminal scores</span>
      </div>

      {/* Expandable Subject Cards List */}
      <div className="space-y-3">
        {subjects.map((sub) => {
          const isExpanded = expandedId === sub.id;
          return (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => toggleExpand(sub.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center font-mono">
                    {sub.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{sub.name}</h3>
                    <p className="text-xs text-slate-500">
                      Subject Position: <strong className="text-slate-800">{formatOrdinal(sub.subjectPosition)}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-black text-base text-slate-900 font-mono">{sub.totalScore}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">/ 100</span>
                  </div>
                  <GradeBadge grade={sub.grade} />
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded Assessment Component Breakdown */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Assessment Marks Breakdown
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">CA Test 1 (Max 10)</span>
                      <span className="font-bold text-slate-800 font-mono text-sm">{sub.caScores.test1}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">CA Test 2 (Max 10)</span>
                      <span className="font-bold text-slate-800 font-mono text-sm">{sub.caScores.test2}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Project (Max 20)</span>
                      <span className="font-bold text-slate-800 font-mono text-sm">{sub.caScores.assignment}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Exam Score (Max 60)</span>
                      <span className="font-bold text-slate-800 font-mono text-sm">{sub.examScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>Teacher's Subject Remark: <strong className="text-slate-800">{sub.remark}</strong></span>
                    <span className="font-mono text-[11px]">Total CA: {sub.caTotal}/40</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
