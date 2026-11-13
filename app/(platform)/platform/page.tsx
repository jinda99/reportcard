'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import {
  Building2,
  Users,
  DollarSign,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

interface SchoolTenant {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'READ_ONLY';
  learners: number;
  planName: string;
  amountNgn: number;
  joinedDate: string;
}

export default function PlatformAdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState<SchoolTenant[]>([
    {
      id: 'sch_1',
      name: 'Bright Future College',
      slug: 'bright-future',
      status: 'ACTIVE',
      learners: 40,
      planName: 'Annual Premium',
      amountNgn: 135000,
      joinedDate: '2024-09-01',
    },
    {
      id: 'sch_2',
      name: 'Grace Nursery & Primary School',
      slug: 'grace-nursery',
      status: 'ACTIVE',
      learners: 65,
      planName: 'Standard Termly',
      amountNgn: 50000,
      joinedDate: '2024-09-15',
    },
    {
      id: 'sch_3',
      name: 'Kingsway Comprehensive High School',
      slug: 'kingsway-high',
      status: 'PENDING',
      learners: 120,
      planName: '14-Day Free Trial',
      amountNgn: 0,
      joinedDate: '2024-11-01',
    },
  ]);

  const toggleStatus = (id: string, current: string) => {
    setSchools(
      schools.map((s) => {
        if (s.id === id) {
          const next = current === 'ACTIVE' ? 'READ_ONLY' : 'ACTIVE';
          return { ...s, status: next as any };
        }
        return s;
      })
    );
  };

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLearners = schools.reduce((sum, s) => sum + s.learners, 0);
  const totalRevenue = schools.reduce((sum, s) => sum + s.amountNgn, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Platform Master Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-tenant SaaS administration, active subscriptions, and school status control
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Registered Schools</span>
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{schools.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Multi-tenant instances</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Active Learners</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{totalLearners}</div>
            <p className="text-[11px] text-slate-500 mt-1">Across all primary & secondary tenants</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Subscription MRR</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-slate-500 mt-1">Termly and annual recurring</p>
          </div>
        </div>

        {/* Tenant Schools Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tenant School Accounts</h2>
              <p className="text-xs text-slate-500">Manage tenant statuses and view metrics</p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search school name or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3 px-4">School Name</th>
                  <th className="py-3 px-3">Slug</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Learners</th>
                  <th className="py-3 px-4">Active Plan</th>
                  <th className="py-3 px-4 text-right">Control Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-xs">{s.slug}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'READ_ONLY'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                      {s.learners}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {s.planName}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(s.id, s.status)}
                        className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                          s.status === 'ACTIVE'
                            ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Set READ_ONLY' : 'Set ACTIVE'}
                      </button>
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
