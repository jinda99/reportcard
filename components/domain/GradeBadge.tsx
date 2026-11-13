import React from 'react';

interface GradeBadgeProps {
  grade: string | null | undefined;
  className?: string;
}

export function GradeBadge({ grade, className = '' }: GradeBadgeProps) {
  if (!grade) {
    return <span className={`text-slate-400 font-mono text-xs ${className}`}>—</span>;
  }

  const cleanGrade = grade.trim().toUpperCase();

  // Color mapping based on WAEC / Letter performance standards
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (cleanGrade === 'A1' || cleanGrade === 'A') {
    colorStyles = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
  } else if (cleanGrade === 'B2' || cleanGrade === 'B3' || cleanGrade === 'B') {
    colorStyles = 'bg-blue-100 text-blue-800 border-blue-300 font-medium';
  } else if (cleanGrade.startsWith('C')) {
    colorStyles = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (cleanGrade.startsWith('D') || cleanGrade.startsWith('E')) {
    colorStyles = 'bg-orange-100 text-orange-800 border-orange-300';
  } else if (cleanGrade === 'F9' || cleanGrade === 'F') {
    colorStyles = 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs border font-mono ${colorStyles} ${className}`}
    >
      {cleanGrade}
    </span>
  );
}
