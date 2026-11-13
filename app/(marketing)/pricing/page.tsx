import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex-1">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Predictable School Subscription Pricing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            One simple school license covers all teachers, classes, and subjects. Parents enjoy 100% free lifetime access to check results.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* Termly Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block mb-2">Termly Option</span>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Standard Termly</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-slate-900">₦50,000</span>
                <span className="text-sm text-slate-500 font-medium">/ term</span>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Ideal for schools paying term-by-term during academic session billing.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Up to 500 enrolled learners
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Unlimited teachers & subjects
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Full WAEC & Letter grading engine
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Mobile-first parent portal
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Instant printable A4 report cards
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-600 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Annual Plan */}
          <div className="bg-emerald-900 text-white border border-emerald-800 rounded-2xl p-8 shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3 right-8 bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow">
              Best Value (Save ₦15,000)
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 block mb-2">Full Session</span>
              <h2 className="text-2xl font-bold text-white mb-4">Annual Premium</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-white">₦135,000</span>
                <span className="text-sm text-emerald-200 font-medium">/ year</span>
              </div>
              <p className="text-sm text-emerald-200 mb-6">
                Complete peace of mind for the entire 3 terms of the academic session.
              </p>
              <ul className="space-y-3 text-sm text-emerald-100 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Up to 2,000 enrolled learners
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Unlimited teachers, classes & arms
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Priority WhatsApp & phone support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Custom school branding & logo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> CSV bulk roster upload wizard
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition shadow"
            >
              Register with Annual Plan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto border-t border-slate-200 pt-16">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Do parents pay to view report cards?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Parents access the portal completely free. Only the school pays the termly or annual subscription fee.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">What payment methods are supported?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Subscriptions are powered by Paystack, allowing Nigerian debit cards (Mastercard, Visa, Verve), bank transfers, and USSD.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Can we customize our grading scale?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! Schools can select the standard WAEC 9-point scale, primary A–F letter scale, or configure custom grade bands and CA component splits (e.g. 40% CA, 60% Exam) as long as the total equals 100.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
