'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { CreditCard, CheckCircle2, AlertTriangle, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminBillingPage() {
  const [upgrading, setUpgrading] = useState(false);
  const [subscription, setSubscription] = useState({
    planName: 'Annual Premium',
    amountNgn: 135000,
    status: 'ACTIVE',
    nextPayment: '2025-09-01',
    daysRemaining: 284,
    learnerLimit: 2000,
  });

  const [invoices, setInvoices] = useState([
    {
      id: 'inv_1001',
      date: '01 Sep 2024',
      amountNgn: 135000,
      status: 'PAID',
      period: '2024/2025 Academic Session',
      ref: 'pstk_ref_9823412',
    },
  ]);

  const handleSimulatePayment = () => {
    setUpgrading(true);
    setTimeout(() => {
      alert('Paystack Checkout Successful (Test Mode)! Subscription renewed.');
      setUpgrading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            School Subscription & Billing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your Paystack SaaS subscription plan and view payment receipts
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Current Plan</span>
                <h2 className="text-xl font-bold text-slate-900">{subscription.planName}</h2>
                <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Status: {subscription.status} ({subscription.daysRemaining} days left)
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">₦{subscription.amountNgn.toLocaleString()}</div>
              <span className="text-xs text-slate-500">Renews on {subscription.nextPayment}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs text-slate-600">
              Coverage: Up to <strong>{subscription.learnerLimit} students</strong> across all arms and classes.
            </div>
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={upgrading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              {upgrading ? 'Processing...' : 'Pay with Paystack (Test Mode)'}
            </button>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Payment Invoices & Receipts</h2>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="py-2.5 px-4">Invoice ID</th>
                  <th className="py-2.5 px-4">Billing Period</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{inv.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{inv.period}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">₦{inv.amountNgn.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Receipt downloaded for ${inv.id}`)}
                        className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
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
