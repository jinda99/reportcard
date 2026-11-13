'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { GraduationCap, BookOpen, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminClassesPage() {
  const [classLevels, setClassLevels] = useState([
    { id: 'lvl_1', name: 'JSS 1', order: 1, classes: ['JSS 1A', 'JSS 1B'] },
    { id: 'lvl_2', name: 'JSS 2', order: 2, classes: ['JSS 2A'] },
    { id: 'lvl_3', name: 'JSS 3', order: 3, classes: ['JSS 3A'] },
    { id: 'lvl_4', name: 'SSS 1', order: 4, classes: ['SSS 1A (Science)', 'SSS 1B (Arts)'] },
    { id: 'lvl_5', name: 'SSS 2', order: 5, classes: ['SSS 2A'] },
    { id: 'lvl_6', name: 'SSS 3', order: 6, classes: ['SSS 3A'] },
  ]);

  const [subjects, setSubjects] = useState([
    { id: 'sub_1', name: 'Mathematics', code: 'MTH' },
    { id: 'sub_2', name: 'English Language', code: 'ENG' },
    { id: 'sub_3', name: 'Basic Science', code: 'BSC' },
    { id: 'sub_4', name: 'Social Studies', code: 'SOS' },
    { id: 'sub_5', name: 'Computer Studies (ICT)', code: 'ICT' },
    { id: 'sub_6', name: 'Civic Education', code: 'CVE' },
    { id: 'sub_7', name: 'Agricultural Science', code: 'AGS' },
    { id: 'sub_8', name: 'Business Studies', code: 'BST' },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Classes & Subjects Setup</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Nigerian junior and senior secondary levels, arms, and course curriculum
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Levels & Arms */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" /> Class Levels & Arms
              </h2>
            </div>

            <div className="space-y-3">
              {classLevels.map((lvl) => (
                <div key={lvl.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{lvl.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Tier #{lvl.order}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.classes.map((cls, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-lg font-medium">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Directory */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Subjects Catalog
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {subjects.map((sub) => (
                <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block truncate">{sub.name}</span>
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">{sub.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
