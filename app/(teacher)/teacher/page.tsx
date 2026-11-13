'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

interface TeacherAssignmentItem {
  classSubjectId: string;
  className: string;
  subjectName: string;
  subjectCode: string;
  studentCount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  submittedAt?: string | null;
  completionRate: number; // e.g. 100% or 60%
}

export default function TeacherClassesPage() {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<TeacherAssignmentItem[]>([
    {
      classSubjectId: 'cs_jss1a_mth',
      className: 'JSS 1A',
      subjectName: 'Mathematics',
      subjectCode: 'MTH',
      studentCount: 40,
      status: 'APPROVED',
      submittedAt: '2024-12-10T14:30:00Z',
      completionRate: 100,
    },
    {
      classSubjectId: 'cs_jss1a_eng',
      className: 'JSS 1A',
      subjectName: 'English Language',
      subjectCode: 'ENG',
      studentCount: 40,
      status: 'APPROVED',
      submittedAt: '2024-12-10T15:00:00Z',
      completionRate: 100,
    },
    {
      classSubjectId: 'cs_jss2a_mth',
      className: 'JSS 2A',
      subjectName: 'Mathematics',
      subjectCode: 'MTH',
      studentCount: 38,
      status: 'DRAFT',
      completionRate: 75,
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Portal</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Welcome, Mr. Babatunde Adeyemi · Bright Future College
            </p>
          </div>
          <div className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Active Term: First Term (2024/2025)
          </div>
        </div>

        {/* Classes & Assignments Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">My Assigned Class-Subjects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((item) => (
              <div
                key={item.classSubjectId}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.subjectCode}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'SUBMITTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{item.subjectName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Class: <strong className="text-slate-800">{item.className}</strong> · {item.studentCount} Students
                  </p>

                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Roster Completion</span>
                      <span className="font-bold">{item.completionRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.completionRate === 100 ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {item.submittedAt ? `Submitted on ${new Date(item.submittedAt).toLocaleDateString()}` : 'In progress'}
                  </span>
                  <Link
                    href={`/teacher/scores/${item.classSubjectId}?term=trm_first`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Open Score Grid <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
