'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Shield, Search, Filter, Clock } from 'lucide-react';

interface AuditItem {
  id: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export default function AdminAuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [logs, setLogs] = useState<AuditItem[]>([
    {
      id: 'aud_1',
      actorName: 'Dr. Mrs. Bola Tinubu-Kuti (School Admin)',
      action: 'PUBLISH_RESULTS',
      entityType: 'ResultPublication',
      entityId: 'pub_jss1a_first_term',
      details: 'Published official terminal results for JSS 1A First Term',
      timestamp: '2024-12-15 12:00:14',
      ipAddress: '102.89.44.12',
    },
    {
      id: 'aud_2',
      actorName: 'Dr. Mrs. Bola Tinubu-Kuti (School Admin)',
      action: 'APPROVE_SCORES',
      entityType: 'ScoreRecord',
      entityId: 'cs_jss1a_mth',
      details: 'Approved Mathematics score roster for JSS 1A (40 students)',
      timestamp: '2024-12-15 11:45:00',
      ipAddress: '102.89.44.12',
    },
    {
      id: 'aud_3',
      actorName: 'Mr. Babatunde Adeyemi (Teacher)',
      action: 'SUBMIT_SCORES',
      entityType: 'ScoreRecord',
      entityId: 'cs_jss1a_mth',
      details: 'Submitted CA components and terminal exam scores for review',
      timestamp: '2024-12-10 14:30:22',
      ipAddress: '197.210.77.3',
    },
    {
      id: 'aud_4',
      actorName: 'Dr. Mrs. Bola Tinubu-Kuti (School Admin)',
      action: 'BULK_IMPORT_STUDENTS',
      entityType: 'Student',
      entityId: 'batch_2024_09',
      details: 'Imported 40 student biodata records via CSV wizard',
      timestamp: '2024-09-10 09:12:40',
      ipAddress: '102.89.44.12',
    },
  ]);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Audit Log</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive tamper-evident audit trail for score modifications, approvals, and publications
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search actions or actors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Audit Details</th>
                  <th className="py-3 px-4 font-mono text-slate-500 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.actorName}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {item.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.details}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400 text-right">
                      {item.ipAddress}
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
