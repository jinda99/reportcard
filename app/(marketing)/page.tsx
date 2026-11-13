import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Calculator,
  Printer,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Designed Specially for Nigerian Primary & Secondary Schools
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Terminal Report Cards & CA Computation, <span className="text-emerald-600">Simplified.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate endless manual broadsheets and late-night calculation stress. Empower teachers with fast score entry, automated WAEC-standard grading, and provide parents instantaneous mobile access.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-base shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              Register Your School
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 transition shadow-sm"
            >
              Sign In to Demo Portal
            </Link>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl max-w-2xl mx-auto text-xs text-slate-700 text-left">
            <span className="font-bold text-emerald-900 block mb-1">⚡ Quick Demo Logins (Password: Password123!):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div><strong className="text-purple-800 block">Platform Admin:</strong> platform@reportcard.ng</div>
              <div><strong className="text-emerald-800 block">School Admin:</strong> admin@brightfuture.edu.ng</div>
              <div><strong className="text-blue-800 block">Teacher:</strong> teacher.adeyemi@brightfuture.edu.ng</div>
              <div><strong className="text-amber-800 block">Parent:</strong> parent.okafor@gmail.com</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Value Propositions */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Nigerian Educators Love ReportCard</h2>
            <p className="text-sm text-slate-500 mt-2">Built around the exact academic and grading norms of Nigerian secondary institutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated WAEC & Letter Computation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter CA test and examination scores once. The engine automatically derives totals out of 100, assigns A1–F9 grades, and calculates class and subject competition rankings without manual errors.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Mobile-First Parent Portal</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Parents check terminal results right from their smartphone browsers. Instant breakdown of each CA component, verified teacher comments, and attendance records on a secure portal.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1-Click Official Report Card Printing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Print crisp, beautifully formatted single-page A4 report sheets complete with school crest, principal stamp section, and detailed remarks whenever physical copies are required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Affordable School Subscriptions</h2>
          <p className="text-sm text-slate-600 mt-2 mb-8">
            Parents always access free. Schools subscribe per term or annually with a 14-day free trial.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition"
            >
              View Pricing & Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ReportCard Portal Nigeria. All rights reserved.</p>
          <p>Powered by Next.js & PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
