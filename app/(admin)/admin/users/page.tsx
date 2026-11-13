'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Users, UserPlus, Mail, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'SCHOOL_ADMIN' | 'TEACHER';
  status: 'ACTIVE' | 'INVITED';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([
    { id: 'u_1', name: 'Dr. Mrs. Bola Tinubu-Kuti', email: 'admin@brightfuture.edu.ng', role: 'SCHOOL_ADMIN', status: 'ACTIVE' },
    { id: 'u_2', name: 'Mr. Babatunde Adeyemi', email: 'teacher.adeyemi@brightfuture.edu.ng', role: 'TEACHER', status: 'ACTIVE' },
    { id: 'u_3', name: 'Mrs. Chioma Okonjo', email: 'teacher.okonjo@brightfuture.edu.ng', role: 'TEACHER', status: 'ACTIVE' },
    { id: 'u_4', name: 'Mallam Haruna Usman', email: 'teacher.usman@brightfuture.edu.ng', role: 'TEACHER', status: 'ACTIVE' },
    { id: 'u_5', name: 'Miss Folake Adele', email: 'teacher.adele@brightfuture.edu.ng', role: 'TEACHER', status: 'INVITED' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'TEACHER' | 'SCHOOL_ADMIN'>('TEACHER');
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setUsers([
      ...users,
      {
        id: `u_${Date.now()}`,
        name: 'Pending Staff',
        email: inviteEmail,
        role: inviteRole,
        status: 'INVITED',
      },
    ]);

    setInvitedSuccess(true);
    setInviteEmail('');
    setTimeout(() => setInvitedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff & Teacher Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Invite academic staff, manage roles, and review pending invitations
          </p>
        </div>

        {/* Invite Form Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Invite New Staff Member</h2>
          </div>

          {invitedSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Invitation token successfully generated and sent to email!
            </div>
          )}

          <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teacher.name@brightfuture.edu.ng"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="w-full sm:w-44">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="TEACHER">Teacher</option>
                <option value="SCHOOL_ADMIN">School Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition"
            >
              Send Invitation
            </button>
          </form>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-xs">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.status}
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
