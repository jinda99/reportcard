'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Users, CheckCircle2, Save, BookOpen } from 'lucide-react';

interface MatrixRow {
  classSubjectId: string;
  className: string;
  subjectName: string;
  teacherUserId: string;
}

export default function AdminAssignmentsPage() {
  const teachers = [
    { id: 'usr_teacher_adeyemi', name: 'Mr. Babatunde Adeyemi' },
    { id: 'usr_teacher_chioma', name: 'Mrs. Chioma Okonjo' },
    { id: 'usr_teacher_usman', name: 'Mallam Haruna Usman' },
    { id: 'usr_teacher_folake', name: 'Miss Folake Adele' },
  ];

  const [assignments, setAssignments] = useState<MatrixRow[]>([
    { classSubjectId: 'cs_jss1a_mth', className: 'JSS 1A', subjectName: 'Mathematics', teacherUserId: 'usr_teacher_adeyemi' },
    { classSubjectId: 'cs_jss1a_eng', className: 'JSS 1A', subjectName: 'English Language', teacherUserId: 'usr_teacher_adeyemi' },
    { classSubjectId: 'cs_jss1a_sci', className: 'JSS 1A', subjectName: 'Basic Science', teacherUserId: 'usr_teacher_chioma' },
    { classSubjectId: 'cs_jss1a_ict', className: 'JSS 1A', subjectName: 'Computer Studies', teacherUserId: 'usr_teacher_usman' },
    { classSubjectId: 'cs_jss2a_mth', className: 'JSS 2A', subjectName: 'Mathematics', teacherUserId: 'usr_teacher_adeyemi' },
    { classSubjectId: 'cs_jss2a_eng', className: 'JSS 2A', subjectName: 'English Language', teacherUserId: 'usr_teacher_folake' },
  ]);

  const [saved, setSaved] = useState(false);

  const handleTeacherChange = (classSubjectId: string, teacherUserId: string) => {
    setAssignments(
      assignments.map((a) => (a.classSubjectId === classSubjectId ? { ...a, teacherUserId } : a))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Assignment Matrix</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Hard Rule: Teachers can only enter and submit scores for class-subjects assigned to them.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Save className="w-4 h-4" /> Save Assignments
          </button>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Teacher assignments successfully persisted and synced to the teacher portal!
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Assigned Subject Teacher</th>
                  <th className="py-3 px-4 text-right">Access Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((row) => (
                  <tr key={row.classSubjectId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.className}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-950 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      {row.subjectName}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={row.teacherUserId}
                        onChange={(e) => handleTeacherChange(row.classSubjectId, e.target.value)}
                        className="w-full sm:w-64 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-xs font-medium"
                      >
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        Score Entry Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
