'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { ReportCardView, ReportCardData } from '@/components/domain/ReportCardView';
import { ArrowLeft } from 'lucide-react';

export default function AdminStudentReportPage() {
  const params = useParams();
  const studentId = (params?.studentId as string) || 'st_1';
  const termId = (params?.termId as string) || 'trm_first';

  // Demo data matching Section 14 Emeka Okafor at Bright Future College
  const reportData: ReportCardData = {
    school: {
      name: 'Bright Future College',
      address: 'Plot 15, Ahmadu Bello Way, Victoria Island, Lagos, Nigeria',
      phone: '+234 802 345 6789',
      email: 'info@brightfuture.edu.ng',
      primaryColor: '#16a34a',
    },
    student: {
      fullName: 'Emeka David Okafor',
      admissionNo: 'BFC/2024/001',
      className: 'JSS 1A',
      gender: 'MALE',
    },
    term: {
      name: 'First Term',
      sessionName: '2024/2025',
    },
    result: {
      totalScore: 710,
      average: 88.75,
      subjectsCount: 8,
      positionInClass: 1,
      classSize: 40,
      attendanceDaysOpen: 110,
      attendanceDaysPresent: 108,
      classTeacherComment: 'A very dedicated, disciplined, and brilliant scholar. Demonstrates high leadership qualities in class.',
      headTeacherComment: 'An outstanding academic performance. Recommended for academic merit honours.',
      publishedAt: '2024-12-15T12:00:00Z',
    },
    subjects: [
      {
        subjectName: 'Mathematics',
        subjectCode: 'MTH',
        caScores: { test1: 9, test2: 8, assignment: 18 },
        caTotal: 35,
        examScore: 54,
        totalScore: 89,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 1,
      },
      {
        subjectName: 'English Language',
        subjectCode: 'ENG',
        caScores: { test1: 8, test2: 9, assignment: 17 },
        caTotal: 34,
        examScore: 52,
        totalScore: 86,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 2,
      },
      {
        subjectName: 'Basic Science',
        subjectCode: 'BSC',
        caScores: { test1: 9, test2: 9, assignment: 19 },
        caTotal: 37,
        examScore: 54,
        totalScore: 91,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 1,
      },
      {
        subjectName: 'Computer Studies (ICT)',
        subjectCode: 'ICT',
        caScores: { test1: 10, test2: 10, assignment: 19 },
        caTotal: 39,
        examScore: 55,
        totalScore: 94,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 1,
      },
      {
        subjectName: 'Civic Education',
        subjectCode: 'CVE',
        caScores: { test1: 8, test2: 8, assignment: 18 },
        caTotal: 34,
        examScore: 54,
        totalScore: 88,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 3,
      },
      {
        subjectName: 'Agricultural Science',
        subjectCode: 'AGS',
        caScores: { test1: 8, test2: 8, assignment: 17 },
        caTotal: 33,
        examScore: 53,
        totalScore: 86,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 2,
      },
      {
        subjectName: 'Social Studies',
        subjectCode: 'SOS',
        caScores: { test1: 9, test2: 8, assignment: 18 },
        caTotal: 35,
        examScore: 55,
        totalScore: 90,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 1,
      },
      {
        subjectName: 'Business Studies',
        subjectCode: 'BST',
        caScores: { test1: 8, test2: 8, assignment: 18 },
        caTotal: 34,
        examScore: 52,
        totalScore: 86,
        grade: 'A1',
        remark: 'Excellent',
        subjectPosition: 4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-4">
        <div className="flex items-center gap-3 no-print">
          <Link
            href="/admin/results"
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-semibold text-slate-700">Back to Results Board</span>
        </div>

        <ReportCardView data={reportData} />
      </main>
    </div>
  );
}
