'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { GradeBadge } from '@/components/domain/GradeBadge';
import {
  computeClassTermResults,
  formatOrdinal,
  DEFAULT_WAEC_GRADE_BANDS,
  DEFAULT_CA_COMPONENTS,
  DEFAULT_EXAM_MAX,
} from '@/lib/grading/engine';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Filter,
  Lock,
  Eye,
  Check,
  Printer,
} from 'lucide-react';

interface SubjectStatus {
  id: string;
  name: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
}

interface ReviewStudentRow {
  studentId: string;
  admissionNo: string;
  studentName: string;
  subjectScores: Record<string, { total: number | null; grade: string | null }>;
}

export default function AdminResultsPage() {
  const [selectedTerm, setSelectedTerm] = useState('trm_first');
  const [selectedClass, setSelectedClass] = useState('cls_jss1a');
  const [isPublished, setIsPublished] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');

  // Sample subjects status matching Section 14
  const [subjects, setSubjects] = useState<SubjectStatus[]>([
    { id: 'sub_mth', name: 'Mathematics', status: 'APPROVED' },
    { id: 'sub_eng', name: 'English Language', status: 'APPROVED' },
    { id: 'sub_sci', name: 'Basic Science', status: 'APPROVED' },
    { id: 'sub_ict', name: 'Computer Studies', status: 'APPROVED' },
  ]);

  // Sample student review data
  const [students, setStudents] = useState<ReviewStudentRow[]>([
    {
      studentId: 'st_1',
      admissionNo: 'BFC/2024/001',
      studentName: 'Emeka Okafor',
      subjectScores: {
        sub_mth: { total: 89, grade: 'A1' },
        sub_eng: { total: 86, grade: 'A1' },
        sub_sci: { total: 91, grade: 'A1' },
        sub_ict: { total: 94, grade: 'A1' },
      },
    },
    {
      studentId: 'st_2',
      admissionNo: 'BFC/2024/002',
      studentName: 'Amina Bello',
      subjectScores: {
        sub_mth: { total: 94, grade: 'A1' },
        sub_eng: { total: 86, grade: 'A1' },
        sub_sci: { total: 88, grade: 'A1' },
        sub_ict: { total: 90, grade: 'A1' },
      },
    },
    {
      studentId: 'st_3',
      admissionNo: 'BFC/2024/003',
      studentName: 'Chukwudi Eze',
      subjectScores: {
        sub_mth: { total: 74, grade: 'B2' },
        sub_eng: { total: 68, grade: 'B3' },
        sub_sci: { total: 75, grade: 'A1' },
        sub_ict: { total: 70, grade: 'B2' },
      },
    },
    {
      studentId: 'st_4',
      admissionNo: 'BFC/2024/004',
      studentName: 'Zainab Usman',
      subjectScores: {
        sub_mth: { total: 66, grade: 'B3' },
        sub_eng: { total: 75, grade: 'A1' },
        sub_sci: { total: 64, grade: 'C4' },
        sub_ict: { total: 71, grade: 'B2' },
      },
    },
    {
      studentId: 'st_5_incomplete',
      admissionNo: 'BFC/2024/005',
      studentName: 'Tolu Ogunlesi',
      subjectScores: {
        sub_mth: { total: 70, grade: 'B2' },
        sub_eng: { total: null, grade: null }, // Incomplete!
        sub_sci: { total: 72, grade: 'B2' },
        sub_ict: { total: 80, grade: 'A1' },
      },
    },
  ]);

  // Compute positions using pure grading engine contract
  const studentScoresMap = new Map();
  students.forEach((st) => {
    studentScoresMap.set(
      st.studentId,
      Object.values(st.subjectScores).map((s) => ({
        studentId: st.studentId,
        totalScore: s.total,
        grade: s.grade,
      }))
    );
  });

  const termAggregates = computeClassTermResults(
    selectedClass,
    selectedTerm,
    studentScoresMap,
    subjects.length
  );

  const allApproved = subjects.every((s) => s.status === 'APPROVED');
  const unapprovedSubjects = subjects.filter((s) => s.status !== 'APPROVED');

  const handleApproveAll = () => {
    setSubjects(subjects.map((s) => ({ ...s, status: 'APPROVED' })));
  };

  const handlePublish = () => {
    if (!allApproved) return;
    setPublishing(true);
    setTimeout(() => {
      setIsPublished(true);
      setPublishing(false);
      setPublishSuccessMsg('Results successfully published! Linked parents can now view report cards.');
      setTimeout(() => setPublishSuccessMsg(''), 4000);
    }, 600);
  };

  const handleUnpublish = () => {
    setIsPublished(false);
    setPublishSuccessMsg('Results unpublished. Parent report card viewing is now gated.');
    setTimeout(() => setPublishSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Title and Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Results Review & Publication Gate
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review teacher score submissions, compute terminal ranks, and publish official report cards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPublished ? (
              <button
                type="button"
                onClick={handleUnpublish}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Unpublish Results
              </button>
            ) : (
              <button
                type="button"
                disabled={!allApproved || publishing}
                onClick={handlePublish}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                {publishing ? 'Computing & Publishing...' : 'Approve & Publish Results'}
              </button>
            )}
          </div>
        </div>

        {/* Publication Status & Notification Banner */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isPublished
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3">
            {isPublished ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold text-sm block">
                {isPublished ? 'Publication State: PUBLISHED' : 'Publication State: DRAFT (Hidden from Parents)'}
              </span>
              <span className="text-xs">
                {isPublished
                  ? 'All student report cards are currently visible in the Parent Portal.'
                  : 'Parents cannot view results until all subjects are approved and results are published.'}
              </span>
            </div>
          </div>

          {!allApproved && (
            <div className="text-xs text-rose-700 font-semibold bg-rose-100 px-3 py-1 rounded-full">
              Blocked: {unapprovedSubjects.length} subjects unapproved
            </div>
          )}
        </div>

        {publishSuccessMsg && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            {publishSuccessMsg}
          </div>
        )}

        {/* Filters: Session / Term / Class */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Session:</span>
            <span className="font-bold text-slate-800">2024/2025</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Term:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1 bg-white font-medium"
            >
              <option value="trm_first">First Term</option>
              <option value="trm_second">Second Term</option>
              <option value="trm_third">Third Term</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Class & Arm:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1 bg-white font-medium"
            >
              <option value="cls_jss1a">JSS 1A (40 Students)</option>
              <option value="cls_jss2a">JSS 2A (38 Students)</option>
              <option value="cls_sss1a">SSS 1A (35 Students)</option>
            </select>
          </div>
        </div>

        {/* Subject Status Board */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Subject Submission Status Board</h2>
              <p className="text-xs text-slate-500">Every subject must be approved before publication</p>
            </div>
            {!allApproved && (
              <button
                onClick={handleApproveAll}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Approve All Subjects
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {subjects.map((sub) => (
              <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800 block truncate">{sub.name}</span>
                <span
                  className={`inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    sub.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sub.status === 'SUBMITTED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Broad Review Grid with Live Computation Engine Results */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Computed Broad Review Grid</h2>
              <p className="text-xs text-slate-500">
                Positions and averages calculated by pure grading engine contract. Incomplete students are flagged.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  {subjects.map((sub) => (
                    <th key={sub.id} className="py-2.5 px-2 text-center">{sub.name}</th>
                  ))}
                  <th className="py-2.5 px-2 text-center bg-slate-50 font-bold">Total Marks</th>
                  <th className="py-2.5 px-2 text-center bg-blue-50/50 font-bold">Average</th>
                  <th className="py-2.5 px-2 text-center bg-amber-50/50 font-bold">Class Position</th>
                  <th className="py-2.5 px-3 text-right">Report Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const aggregate = termAggregates.find((a) => a.studentId === st.studentId);
                  return (
                    <tr key={st.studentId} className="hover:bg-slate-50/50 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        <div>{st.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-normal">
                          {st.admissionNo}
                        </div>
                      </td>

                      {/* Subject Marks */}
                      {subjects.map((sub) => {
                        const score = st.subjectScores[sub.id];
                        return (
                          <td key={sub.id} className="py-2 px-2 text-center font-mono">
                            {score?.total !== null && score?.total !== undefined ? (
                              <span>
                                {score.total} <span className="text-[10px] text-slate-400">({score.grade})</span>
                              </span>
                            ) : (
                              <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">
                                Missing
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Total */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900 bg-slate-50/50">
                        {aggregate?.totalScore ?? '—'}
                      </td>

                      {/* Average */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-blue-900 bg-blue-50/30">
                        {aggregate?.average !== null ? `${aggregate?.average}%` : '—'}
                      </td>

                      {/* Class Position or Incomplete Flag */}
                      <td className="py-2.5 px-2 text-center">
                        {aggregate?.isIncomplete ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Incomplete
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-slate-900">
                            {formatOrdinal(aggregate?.positionInClass)}
                          </span>
                        )}
                      </td>

                      {/* View Report Card */}
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href={`/admin/reports/${st.studentId}/${selectedTerm}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
