import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading records...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
        <div className="w-1/2 h-full bg-emerald-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
