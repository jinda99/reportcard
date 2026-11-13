import type { Metadata } from 'next';
import './globals.css';
import { SessionProviderWrapper } from '@/components/ui/SessionProviderWrapper';

export const metadata: Metadata = {
  title: 'ReportCard | Virtual Report Card Portal for Nigerian Secondary Schools',
  description: 'Multi-tenant SaaS platform for continuous assessment (CA), automated WAEC-standard grading, and mobile-first parent report cards.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
