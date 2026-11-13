'use client';

import React from 'react';
import { GradeBadge } from './GradeBadge';
import { formatOrdinal } from '@/lib/grading/engine';
import { Printer, GraduationCap, Calendar, User, Award, CheckCircle2 } from 'lucide-react';

export interface SubjectScoreItem {
  subjectName: string;
  subjectCode?: string | null;
  caScores: Record<string, number | null | undefined>;
  caTotal: number;
  examScore: number | null;
  totalScore: number | null;
  grade: string | null;
  remark: string | null;
  subjectPosition?: number | null;
}

export interface ReportCardData {
  school: {
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    logoUrl?: string | null;
    primaryColor?: string | null;
  };
  student: {
    fullName: string;
    admissionNo: string;
    className: string;
    gender: string;
  };
  term: {
    name: string;
    sessionName: string;
  };
  result: {
    totalScore: number;
    average: number;
    subjectsCount: number;
    positionInClass: number;
    classSize: number;
    attendanceDaysOpen?: number | null;
    attendanceDaysPresent?: number | null;
    classTeacherComment?: string | null;
    headTeacherComment?: string | null;
    publishedAt: string | Date;
  };
  subjects: SubjectScoreItem[];
}

export function ReportCardView({ data }: { data: ReportCardData }) {
  const handlePrint = () => {
    window.print();
  };

  const attendancePercentage =
    data.result.attendanceDaysOpen && data.result.attendanceDaysPresent
      ? Math.round((data.result.attendanceDaysPresent / data.result.attendanceDaysOpen) * 100)
      : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Verified & Published Term Report</h2>
            <p className="text-xs text-slate-500">
              Published on {new Date(data.result.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Official Report Card Printable Sheet */}
      <div className="report-card-container bg-white border border-slate-300 rounded-2xl shadow-sm p-6 sm:p-10 space-y-8">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-emerald-600 pb-6 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                {data.school.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{data.school.address || 'Lagos, Nigeria'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 mt-1">
                {data.school.phone && <span>Tel: {data.school.phone}</span>}
                {data.school.email && <span>Email: {data.school.email}</span>}
              </div>
            </div>
          </div>
          <div className="text-center sm:text-right bg-emerald-50/70 border border-emerald-100 px-4 py-2 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">Terminal Report</span>
            <span className="text-sm font-bold text-emerald-950">
              {data.term.name} ({data.term.sessionName})
            </span>
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 text-xs sm:text-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wide text-slate-400 block font-medium">Student Name</span>
            <span className="font-semibold text-slate-900">{data.student.fullName}</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wide text-slate-400 block font-medium">Admission No</span>
            <span className="font-mono font-medium text-slate-800">{data.student.admissionNo}</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wide text-slate-400 block font-medium">Class & Arm</span>
            <span className="font-semibold text-slate-900">{data.student.className}</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wide text-slate-400 block font-medium">Gender</span>
            <span className="font-medium text-slate-800">{data.student.gender}</span>
          </div>
        </div>

        {/* Performance Overview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 text-center">
            <span className="text-xs text-emerald-700 font-medium block">Total Marks</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-900">{data.result.totalScore}</span>
            <span className="text-[10px] text-emerald-600 block">Out of {data.result.subjectsCount * 100}</span>
          </div>
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3 text-center">
            <span className="text-xs text-blue-700 font-medium block">Term Average</span>
            <span className="text-xl sm:text-2xl font-black text-blue-900">{data.result.average}%</span>
            <span className="text-[10px] text-blue-600 block">{data.result.subjectsCount} Subjects Taken</span>
          </div>
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-center">
            <span className="text-xs text-amber-700 font-medium block">Class Position</span>
            <span className="text-xl sm:text-2xl font-black text-amber-900">
              {formatOrdinal(data.result.positionInClass)}
            </span>
            <span className="text-[10px] text-amber-700 block">Out of {data.result.classSize} students</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-xs text-slate-600 font-medium block">Attendance</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800">
              {data.result.attendanceDaysPresent ?? '—'}/{data.result.attendanceDaysOpen ?? '—'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {attendancePercentage !== null ? `${attendancePercentage}% Attendance` : 'Recorded days'}
            </span>
          </div>
        </div>

        {/* Academic Broad Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-2 text-center">CA Total (40)</th>
                <th className="py-2.5 px-2 text-center">Exam (60)</th>
                <th className="py-2.5 px-2 text-center font-bold">Total (100)</th>
                <th className="py-2.5 px-2 text-center">Grade</th>
                <th className="py-2.5 px-2 text-center">Pos.</th>
                <th className="py-2.5 px-3 text-left">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {sub.subjectName}
                    {sub.subjectCode && <span className="text-slate-400 text-xs ml-1">({sub.subjectCode})</span>}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">{sub.caTotal}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">{sub.examScore ?? '—'}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900">
                    {sub.totalScore ?? '—'}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <GradeBadge grade={sub.grade} />
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">
                    {formatOrdinal(sub.subjectPosition)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{sub.remark || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grading Scale Legend */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 items-center justify-between">
          <span className="font-semibold text-slate-700">WAEC Scale Key:</span>
          <span>A1: 75-100 (Excellent)</span>
          <span>B2: 70-74 (V.Good)</span>
          <span>B3: 65-69 (Good)</span>
          <span>C4-C6: 50-64 (Credit)</span>
          <span>D7: 45-49 (Pass)</span>
          <span>E8: 40-44 (Pass)</span>
          <span>F9: 0-39 (Fail)</span>
        </div>

        {/* Comments & Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Class Teacher's Remark
            </span>
            <p className="text-xs sm:text-sm text-slate-800 italic min-h-[40px]">
              "{data.result.classTeacherComment || 'Good effort shown this term. Continual focus advised.'}"
            </p>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
              <span>Signature & Date</span>
              <span className="font-mono text-[11px]">VERIFIED</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
              Principal / Head Teacher's Remark
            </span>
            <p className="text-xs sm:text-sm text-slate-800 italic min-h-[40px]">
              "{data.result.headTeacherComment || 'Promising result. Keep striving for higher academic excellence.'}"
            </p>
            <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
              <span>School Stamp & Seal</span>
              <span className="font-mono text-[11px]">APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
