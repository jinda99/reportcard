'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { GraduationCap, LogOut, User, Shield, School, BookOpen, Users } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const role = user?.role;

  const getRoleBadge = (r?: string) => {
    switch (r) {
      case 'PLATFORM_ADMIN':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Platform SuperAdmin</span>;
      case 'SCHOOL_ADMIN':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">School Admin</span>;
      case 'TEACHER':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Teacher</span>;
      case 'PARENT':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">Parent Portal</span>;
      default:
        return null;
    }
  };

  const getHomeLink = () => {
    if (!role) return '/';
    if (role === 'PLATFORM_ADMIN') return '/platform';
    if (role === 'SCHOOL_ADMIN') return '/admin';
    if (role === 'TEACHER') return '/teacher';
    if (role === 'PARENT') return '/parent';
    return '/';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href={getHomeLink()} className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight">{user?.schoolName || 'ReportCard 🇳🇬'}</span>
                {user?.schoolName && <span className="text-[10px] text-slate-400 font-normal">ReportCard Portal</span>}
              </div>
            </Link>

            {/* Navigation links for Admin */}
            {role === 'SCHOOL_ADMIN' && (
              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                <Link href="/admin" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  Dashboard
                </Link>
                <Link href="/admin/results" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  Results & Publish
                </Link>
                <Link href="/admin/students" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  Students & CSV
                </Link>
                <Link href="/admin/grading" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  Grading Schemes
                </Link>
                <Link href="/admin/sessions" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  Sessions & Terms
                </Link>
                <Link href="/admin/assignments" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  Teacher Matrix
                </Link>
              </div>
            )}

            {/* Navigation links for Teacher */}
            {role === 'TEACHER' && (
              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                <Link href="/teacher" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  My Classes & Scores
                </Link>
              </div>
            )}

            {/* Navigation links for Parent */}
            {role === 'PARENT' && (
              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                <Link href="/parent" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  My Children
                </Link>
                <Link href="/parent/notices" className="px-3 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition">
                  Notices
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800">{user?.name}</span>
                  <div className="flex justify-end">{getRoleBadge(role)}</div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  type="button"
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                >
                  Register School
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
