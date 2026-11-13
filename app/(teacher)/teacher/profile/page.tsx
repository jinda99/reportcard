'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Navbar } from '@/components/ui/Navbar';
import { User, LogOut, BookOpen, School } from 'lucide-react';

export default function TeacherProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Account Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Your profile and academic assignments</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl">
              {user?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{user?.name || 'Mr. Babatunde Adeyemi'}</h2>
              <span className="text-xs text-slate-500 block">{user?.email || 'teacher.adeyemi@brightfuture.edu.ng'}</span>
              <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Subject Teacher
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">School:</span>
              <span className="font-semibold text-slate-800">{user?.schoolName || 'Bright Future College'}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Assigned Classes:</span>
              <span className="font-semibold text-slate-800">JSS 1A, JSS 2A</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Assigned Subjects:</span>
              <span className="font-semibold text-slate-800">Mathematics, English Language</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="inline-flex items-center gap-2 px-4 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of Portal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
