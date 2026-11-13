'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(searchParams?.get('error') || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Query session to route directly to correct role dashboard
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const role = session?.user?.role;

        if (role === 'PLATFORM_ADMIN') router.push('/platform');
        else if (role === 'SCHOOL_ADMIN') router.push('/admin');
        else if (role === 'TEACHER') router.push('/teacher');
        else if (role === 'PARENT') router.push('/parent');
        else router.push('/admin');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 text-emerald-700">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sign In to ReportCard
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter your school email or phone number to access your portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu.ng"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-emerald-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3 text-center">
              Quick-Fill Demo Roles (Password: Password123!)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemo('admin@brightfuture.edu.ng')}
                className="p-2 text-left border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/50 transition"
              >
                <span className="font-semibold text-emerald-900 block">School Admin</span>
                <span className="text-[10px] text-slate-500 truncate block">admin@brightfuture.edu.ng</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('teacher.adeyemi@brightfuture.edu.ng')}
                className="p-2 text-left border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition"
              >
                <span className="font-semibold text-blue-900 block">Teacher</span>
                <span className="text-[10px] text-slate-500 truncate block">teacher.adeyemi@...</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('parent.okafor@gmail.com')}
                className="p-2 text-left border border-slate-200 rounded-lg hover:border-amber-500 hover:bg-amber-50/50 transition"
              >
                <span className="font-semibold text-amber-900 block">Parent</span>
                <span className="text-[10px] text-slate-500 truncate block">parent.okafor@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('platform@reportcard.ng')}
                className="p-2 text-left border border-slate-200 rounded-lg hover:border-purple-500 hover:bg-purple-50/50 transition"
              >
                <span className="font-semibold text-purple-900 block">Platform Admin</span>
                <span className="text-[10px] text-slate-500 truncate block">platform@reportcard.ng</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Want to register a new school?{' '}
          <Link href="/register" className="font-semibold text-emerald-600 hover:underline">
            Register with 14-day trial
          </Link>
        </p>
      </div>
    </div>
  );
}
