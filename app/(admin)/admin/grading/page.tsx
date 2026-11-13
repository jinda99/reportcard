'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import {
  DEFAULT_WAEC_GRADE_BANDS,
  DEFAULT_LETTER_GRADE_BANDS,
  DEFAULT_CA_COMPONENTS,
  DEFAULT_EXAM_MAX,
  validateSchemeTotalMarks,
  CAComponentConfig,
  GradeBandConfig,
} from '@/lib/grading/engine';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Save,
  Award,
} from 'lucide-react';

export default function AdminGradingPage() {
  const [scaleType, setScaleType] = useState<'WAEC_9POINT' | 'LETTER_AF' | 'CUSTOM'>('WAEC_9POINT');
  const [schemeName, setSchemeName] = useState('Senior Secondary WAEC Standard (40/60)');
  const [caComponents, setCaComponents] = useState<CAComponentConfig[]>(DEFAULT_CA_COMPONENTS);
  const [examMax, setExamMax] = useState<number>(DEFAULT_EXAM_MAX);
  const [gradeBands, setGradeBands] = useState<GradeBandConfig[]>(DEFAULT_WAEC_GRADE_BANDS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentCaSum = caComponents.reduce((sum, c) => sum + (Number(c.max) || 0), 0);
  const totalMarks = currentCaSum + Number(examMax);
  const isValidTotal = totalMarks === 100;

  const handlePresetChange = (preset: 'WAEC_9POINT' | 'LETTER_AF') => {
    setScaleType(preset);
    if (preset === 'WAEC_9POINT') {
      setSchemeName('Senior Secondary WAEC Standard (40/60)');
      setGradeBands(DEFAULT_WAEC_GRADE_BANDS);
      setCaComponents(DEFAULT_CA_COMPONENTS);
      setExamMax(60);
    } else {
      setSchemeName('Junior Secondary / Primary A-F Scale (30/70)');
      setGradeBands(DEFAULT_LETTER_GRADE_BANDS);
      setCaComponents([
        { key: 'test1', label: '1st CA Test', max: 15 },
        { key: 'test2', label: '2nd CA Test', max: 15 },
      ]);
      setExamMax(70);
    }
  };

  const addComponent = () => {
    const key = `ca_${Date.now()}`;
    setCaComponents([...caComponents, { key, label: `CA Assessment ${caComponents.length + 1}`, max: 10 }]);
  };

  const removeComponent = (index: number) => {
    setCaComponents(caComponents.filter((_, i) => i !== index));
  };

  const updateComponent = (index: number, field: 'label' | 'max', val: any) => {
    const updated = [...caComponents];
    if (field === 'max') {
      updated[index].max = Math.max(0, parseInt(val) || 0);
    } else {
      updated[index].label = val;
    }
    setCaComponents(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTotal) return;

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Grading Scheme Builder</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure continuous assessment (CA) components and exam weightings. Section 8 Contract mandates total must equal 100.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSchemeName(`${schemeName} (Copy)`);
                alert('Scheme cloned! You can now adjust weightings.');
              }}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition"
            >
              <Copy className="w-4 h-4" />
              Clone Scheme
            </button>
          </div>
        </div>

        {/* Live Validation Alert Banner */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isValidTotal
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {isValidTotal ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold text-sm block">
                {isValidTotal ? 'Valid 100% Mark Allocation' : 'Invalid Mark Allocation'}
              </span>
              <span className="text-xs">
                CA Total ({currentCaSum}) + Exam Max ({examMax}) = <strong>{totalMarks} / 100 marks</strong>
              </span>
            </div>
          </div>

          <div className="text-xs font-mono font-semibold">
            {isValidTotal ? (
              <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Save Allowed</span>
            ) : (
              <span className="text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                Must adjust by {100 - totalMarks > 0 ? `+${100 - totalMarks}` : 100 - totalMarks} marks
              </span>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Scheme configuration successfully saved and locked to current term!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Preset Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" /> 1. Scheme Presets & Scale Type
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handlePresetChange('WAEC_9POINT')}
                className={`p-4 rounded-xl border text-left transition ${
                  scaleType === 'WAEC_9POINT'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">WAEC 9-Point Scale</span>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">Senior Sec.</span>
                </div>
                <p className="text-xs text-slate-500">
                  Standard A1 (75-100) down to F9 (0-39). Default 40% CA, 60% Exam.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('LETTER_AF')}
                className={`p-4 rounded-xl border text-left transition ${
                  scaleType === 'LETTER_AF'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-900">Letter A–F Scale</span>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">Junior Sec.</span>
                </div>
                <p className="text-xs text-slate-500">
                  Standard A, B, C, D, E, F with 70% distinction. Default 30% CA, 70% Exam.
                </p>
              </button>
            </div>
          </div>

          {/* CA Components & Exam Allocation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">2. Continuous Assessment (CA) & Exam Split</h2>
                <p className="text-xs text-slate-500">Add or edit individual test/project mark limits</p>
              </div>
              <button
                type="button"
                onClick={addComponent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add CA Component
              </button>
            </div>

            <div className="space-y-3">
              {caComponents.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Component Label</label>
                    <input
                      type="text"
                      value={comp.label}
                      onChange={(e) => updateComponent(idx, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="w-28 sm:w-36">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Max Marks</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={comp.max}
                      onChange={(e) => updateComponent(idx, 'max', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white text-right font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeComponent(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg mt-4 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Terminal Examination Max */}
              <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <div>
                  <span className="font-bold text-sm text-emerald-950 block">End-of-Term Examination Max Score</span>
                  <span className="text-xs text-emerald-700">Terminal examination weighting</span>
                </div>
                <div className="w-28 sm:w-36">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={examMax}
                    onChange={(e) => setExamMax(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-emerald-300 rounded-lg bg-white text-right font-mono font-bold text-emerald-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grade Bands Table Preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">3. Active Grade Bands Mapping</h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Score Range</th>
                    <th className="py-2.5 px-4">Grade</th>
                    <th className="py-2.5 px-4">Official Remark</th>
                    <th className="py-2.5 px-4 text-center">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradeBands.map((b, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-2 px-4 font-mono">{b.min} – {b.max}</td>
                      <td className="py-2 px-4 font-bold text-emerald-800">{b.grade}</td>
                      <td className="py-2 px-4 text-slate-700">{b.remark}</td>
                      <td className="py-2 px-4 text-center font-mono text-slate-500">{b.points ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={!isValidTotal}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Grading Scheme
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
