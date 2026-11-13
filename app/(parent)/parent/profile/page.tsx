'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Phone, Mail, ShieldCheck, LogOut, HeartHandshake } from 'lucide-react';

export default function ParentProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Parent Account & Profile</h1>
        <p className="text-xs text-slate-500">Manage your contact details and connected wards</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{user?.name || 'Chief Dr. Chidi Okafor'}</h2>
            <span className="text-xs text-slate-500 block">{user?.email || 'parent.okafor@gmail.com'}</span>
            <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Verified Parent / Guardian
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500">Phone Number:</span>
            <span className="font-semibold text-slate-800">+234 803 999 1122</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500">Linked School:</span>
            <span className="font-semibold text-slate-800">{user?.schoolName || 'Bright Future College'}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500">Registered Wards:</span>
            <span className="font-semibold text-slate-800">2 Children (Emeka & Tolu)</span>
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
    </div>
  );
}
