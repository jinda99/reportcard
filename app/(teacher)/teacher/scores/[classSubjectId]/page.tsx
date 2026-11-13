'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { GradeBadge } from '@/components/domain/GradeBadge';
import {
  computeStudentScore,
  DEFAULT_WAEC_GRADE_BANDS,
  DEFAULT_CA_COMPONENTS,
  DEFAULT_EXAM_MAX,
  GradingSchemeConfig,
} from '@/lib/grading/engine';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Send,
  HelpCircle,
  Smartphone,
  RotateCcw,
} from 'lucide-react';

interface GridRow {
  studentId: string;
  admissionNo: string;
  studentName: string;
  caScores: Record<string, number | null>;
  examScore: number | null;
  caTotal: number;
  totalScore: number | null;
  grade: string | null;
  isComplete: boolean;
}

export default function ScoreEntryGridPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classSubjectId = (params?.classSubjectId as string) || 'cs_jss1a_mth';
  const termId = searchParams?.get('term') || 'trm_first';

  const storageKey = `draft:${termId}:${classSubjectId}`;

  const scheme: GradingSchemeConfig = {
    scaleType: 'WAEC_9POINT',
    caComponents: DEFAULT_CA_COMPONENTS,
    examMax: DEFAULT_EXAM_MAX,
    gradeBands: DEFAULT_WAEC_GRADE_BANDS,
  };

  const [rows, setRows] = useState<GridRow[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'offline_saved'>('saved');
  const [showDraftRestorePrompt, setShowDraftRestorePrompt] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize sample roster matching Section 14
  useEffect(() => {
    const initialRoster: GridRow[] = [
      {
        studentId: 'st_1',
        admissionNo: 'BFC/2024/001',
        studentName: 'Emeka Okafor',
        caScores: { test1: 9, test2: 8, assignment: 18 },
        examScore: 54,
        caTotal: 35,
        totalScore: 89,
        grade: 'A1',
        isComplete: true,
      },
      {
        studentId: 'st_2',
        admissionNo: 'BFC/2024/002',
        studentName: 'Amina Bello',
        caScores: { test1: 10, test2: 9, assignment: 19 },
        examScore: 56,
        caTotal: 38,
        totalScore: 94,
        grade: 'A1',
        isComplete: true,
      },
      {
        studentId: 'st_3',
        admissionNo: 'BFC/2024/003',
        studentName: 'Chukwudi Eze',
        caScores: { test1: 7, test2: 7, assignment: 15 },
        examScore: 45,
        caTotal: 29,
        totalScore: 74,
        grade: 'B2',
        isComplete: true,
      },
      {
        studentId: 'st_4',
        admissionNo: 'BFC/2024/004',
        studentName: 'Zainab Usman',
        caScores: { test1: 8, test2: 6, assignment: 14 },
        examScore: 38,
        caTotal: 28,
        totalScore: 66,
        grade: 'B3',
        isComplete: true,
      },
    ];

    // Check local draft protection
    const localDraft = localStorage.getItem(storageKey);
    if (localDraft) {
      try {
        const parsed = JSON.parse(localDraft);
        if (JSON.stringify(parsed) !== JSON.stringify(initialRoster)) {
          setShowDraftRestorePrompt(true);
        }
      } catch (e) {
        // ignore
      }
    }

    setRows(initialRoster);
  }, [storageKey]);

  // Recalculate row using pure grading engine contract
  const recalculateRow = useCallback(
    (row: GridRow): GridRow => {
      const computed = computeStudentScore(
        {
          studentId: row.studentId,
          caScores: row.caScores,
          examScore: row.examScore,
        },
        scheme
      );

      const hasAllCa = scheme.caComponents.every(
        (c) => row.caScores[c.key] !== null && row.caScores[c.key] !== undefined
      );
      const isComplete = hasAllCa && row.examScore !== null;

      return {
        ...row,
        caTotal: computed.caTotal,
        totalScore: computed.totalScore,
        grade: computed.grade,
        isComplete,
      };
    },
    [scheme]
  );

  // Autosave debounce 2s to localStorage and server simulation
  useEffect(() => {
    if (rows.length === 0 || isSubmitted) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(rows));
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('offline_saved');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [rows, storageKey, isSubmitted]);

  // Handle single cell edit with integer & max validation
  const handleCellChange = (
    rowIndex: number,
    field: string,
    rawVal: string,
    maxLimit: number
  ) => {
    if (isSubmitted) return;

    let parsedVal: number | null = null;
    if (rawVal.trim() !== '') {
      const num = parseInt(rawVal, 10);
      if (isNaN(num)) return; // block non-numeric
      parsedVal = Math.max(0, Math.min(maxLimit, num)); // clamp to [0, max]
    }

    setRows((prev) => {
      const updated = [...prev];
      const target = { ...updated[rowIndex] };

      if (field === 'examScore') {
        target.examScore = parsedVal;
      } else {
        target.caScores = {
          ...target.caScores,
          [field]: parsedVal,
        };
      }

      updated[rowIndex] = recalculateRow(target);
      return updated;
    });
  };

  // Keyboard navigation: Enter = next row, Tab = next col, Arrow keys
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById(`cell-${rowIndex + 1}-${colIndex}`);
      nextInput?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextInput = document.getElementById(`cell-${rowIndex + 1}-${colIndex}`);
      nextInput?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.getElementById(`cell-${rowIndex - 1}-${colIndex}`);
      prevInput?.focus();
    }
  };

  // Bulk paste from Excel
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    startRowIndex: number,
    field: string,
    maxLimit: number
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const lines = pasteData
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l !== '');

    if (lines.length === 0) return;

    setRows((prev) => {
      const updated = [...prev];
      for (let i = 0; i < lines.length; i++) {
        const targetRowIdx = startRowIndex + i;
        if (targetRowIdx >= updated.length) break;

        const val = parseInt(lines[i], 10);
        if (!isNaN(val)) {
          const clamped = Math.max(0, Math.min(maxLimit, val));
          const target = { ...updated[targetRowIdx] };

          if (field === 'examScore') {
            target.examScore = clamped;
          } else {
            target.caScores = {
              ...target.caScores,
              [field]: clamped,
            };
          }
          updated[targetRowIdx] = recalculateRow(target);
        }
      }
      return updated;
    });
  };

  const restoreDraft = () => {
    const draft = localStorage.getItem(storageKey);
    if (draft) {
      setRows(JSON.parse(draft));
    }
    setShowDraftRestorePrompt(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(storageKey);
    setShowDraftRestorePrompt(false);
  };

  const handleSubmitForReview = () => {
    setSubmitting(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setSubmittedDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
      setSubmitting(false);
      setShowSubmitModal(false);
    }, 500);
  };

  const allComplete = rows.length > 0 && rows.every((r) => r.isComplete);
  const completeCount = rows.filter((r) => r.isComplete).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-4">
        {/* Header Navigation & Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher"
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Mathematics — JSS 1A
                </h1>
                {isSubmitted && (
                  <span className="bg-amber-100 text-amber-900 font-semibold text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Submitted
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                First Term (2024/2025) · WAEC 9-Point Scheme (40% CA + 60% Exam)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Save Status Indicator */}
            <div className="text-xs flex items-center gap-1.5 font-medium">
              {saveStatus === 'saving' && (
                <span className="text-amber-600 animate-pulse">Saving…</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved just now
                </span>
              )}
              {saveStatus === 'offline_saved' && (
                <span className="text-slate-600">Saved locally — retrying</span>
              )}
            </div>

            {/* Submit Button */}
            {!isSubmitted ? (
              <button
                type="button"
                disabled={!allComplete}
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                Submit for Review ({completeCount}/{rows.length})
              </button>
            ) : (
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
                Submitted on {submittedDate}. Contact admin to reopen.
              </span>
            )}
          </div>
        </div>

        {/* Local Draft Protection Prompt Banner */}
        {showDraftRestorePrompt && !isSubmitted && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Unsaved changes found on this device. Would you like to restore them?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={restoreDraft}
                className="font-bold text-amber-950 underline hover:no-underline"
              >
                Restore
              </button>
              <button onClick={discardDraft} className="text-amber-700 hover:underline">
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Mobile Viewport Notice (<768px) */}
        <div className="block md:hidden bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-800 flex items-center gap-2">
          <Smartphone className="w-4 h-4 flex-shrink-0" />
          <span>
            Read-only table view on mobile. Score keyboard entry and bulk paste require a tablet or desktop screen.
          </span>
        </div>

        {/* TanStack Table / Score Grid */}
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-20 backdrop-blur-sm">
                <tr>
                  <th className="py-3 px-4 sticky left-0 bg-slate-100 z-30 min-w-[180px] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                    Student Name
                  </th>
                  <th className="py-3 px-3 text-center min-w-[100px]">CA Test 1 (10)</th>
                  <th className="py-3 px-3 text-center min-w-[100px]">CA Test 2 (10)</th>
                  <th className="py-3 px-3 text-center min-w-[110px]">Project (20)</th>
                  <th className="py-3 px-3 text-center min-w-[90px] bg-slate-50 font-bold">CA Total (40)</th>
                  <th className="py-3 px-3 text-center min-w-[100px]">Exam (60)</th>
                  <th className="py-3 px-3 text-center min-w-[100px] bg-emerald-50/50 font-black text-emerald-950">
                    Total (100)
                  </th>
                  <th className="py-3 px-3 text-center min-w-[80px]">Grade</th>
                  <th className="py-3 px-3 text-center min-w-[60px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row, rIdx) => (
                  <tr key={row.studentId} className="hover:bg-slate-50/60 transition">
                    {/* Sticky Student Name Column */}
                    <td className="py-2.5 px-4 sticky left-0 bg-white hover:bg-slate-50 z-10 font-semibold text-slate-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                      <div>{row.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {row.admissionNo}
                      </div>
                    </td>

                    {/* CA Test 1 Input */}
                    <td className="py-1.5 px-2 text-center">
                      <input
                        id={`cell-${rIdx}-0`}
                        type="number"
                        min={0}
                        max={10}
                        disabled={isSubmitted}
                        value={row.caScores.test1 ?? ''}
                        onChange={(e) => handleCellChange(rIdx, 'test1', e.target.value, 10)}
                        onKeyDown={(e) => handleKeyDown(e, rIdx, 0)}
                        onPaste={(e) => handlePaste(e, rIdx, 'test1', 10)}
                        className="w-16 text-center py-1.5 px-1 border border-slate-300 rounded font-mono font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </td>

                    {/* CA Test 2 Input */}
                    <td className="py-1.5 px-2 text-center">
                      <input
                        id={`cell-${rIdx}-1`}
                        type="number"
                        min={0}
                        max={10}
                        disabled={isSubmitted}
                        value={row.caScores.test2 ?? ''}
                        onChange={(e) => handleCellChange(rIdx, 'test2', e.target.value, 10)}
                        onKeyDown={(e) => handleKeyDown(e, rIdx, 1)}
                        onPaste={(e) => handlePaste(e, rIdx, 'test2', 10)}
                        className="w-16 text-center py-1.5 px-1 border border-slate-300 rounded font-mono font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </td>

                    {/* Assignment / Project Input */}
                    <td className="py-1.5 px-2 text-center">
                      <input
                        id={`cell-${rIdx}-2`}
                        type="number"
                        min={0}
                        max={20}
                        disabled={isSubmitted}
                        value={row.caScores.assignment ?? ''}
                        onChange={(e) => handleCellChange(rIdx, 'assignment', e.target.value, 20)}
                        onKeyDown={(e) => handleKeyDown(e, rIdx, 2)}
                        onPaste={(e) => handlePaste(e, rIdx, 'assignment', 20)}
                        className="w-16 text-center py-1.5 px-1 border border-slate-300 rounded font-mono font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </td>

                    {/* CA Total (computed, read-only) */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold bg-slate-50 text-slate-800">
                      {row.caTotal}
                    </td>

                    {/* Terminal Exam Input */}
                    <td className="py-1.5 px-2 text-center">
                      <input
                        id={`cell-${rIdx}-3`}
                        type="number"
                        min={0}
                        max={60}
                        disabled={isSubmitted}
                        value={row.examScore ?? ''}
                        onChange={(e) => handleCellChange(rIdx, 'examScore', e.target.value, 60)}
                        onKeyDown={(e) => handleKeyDown(e, rIdx, 3)}
                        onPaste={(e) => handlePaste(e, rIdx, 'examScore', 60)}
                        className="w-16 text-center py-1.5 px-1 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </td>

                    {/* Overall Total (computed, read-only) */}
                    <td className="py-2.5 px-2 text-center font-mono font-black text-slate-900 bg-emerald-50/50">
                      {row.totalScore ?? '—'}
                    </td>

                    {/* Grade (computed, read-only) */}
                    <td className="py-2.5 px-2 text-center">
                      <GradeBadge grade={row.grade} />
                    </td>

                    {/* Row Completeness Indicator */}
                    <td className="py-2.5 px-2 text-center">
                      {row.isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto" title="Incomplete" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Submit Scores for Review?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to submit complete scores for <strong>{rows.length} students</strong> in Mathematics (JSS 1A). Once submitted, the scores will be locked to read-only until approved by the school administrator.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <div>Total Students: <strong>{rows.length}</strong></div>
              <div>Complete Rows: <strong>{completeCount}</strong></div>
              <div>Incomplete Rows: <strong>0</strong></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitForReview}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow transition"
              >
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
