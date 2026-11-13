'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Home, FileText, Bell, User } from 'lucide-react';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Home', href: '/parent', icon: Home, exact: true },
    { label: 'Results', href: '/parent/children/st_1', icon: FileText, exact: false },
    { label: 'Notices', href: '/parent/notices', icon: Bell, exact: false },
    { label: 'Profile', href: '/parent/profile', icon: User, exact: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-6">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </div>

      {/* Mobile-First Bottom Tab Bar (<768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-around shadow-lg no-print">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-1 text-xs font-medium transition ${
                isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
