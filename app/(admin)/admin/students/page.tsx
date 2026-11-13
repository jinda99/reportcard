'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Users,
  Upload,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  X,
  ArrowRight,
} from 'lucide-react';

interface StudentItem {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  gender: 'MALE' | 'FEMALE';
  className: string;
  parentLinked: boolean;
  parentEmail?: string | null;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<1 | 2 | 3 | 4>(1);
  const [csvContent, setCsvContent] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    // Seed initial 40 students or demo list matching Section 14
    setLoading(true);
    setTimeout(() => {
      setStudents([
        { id: 'st_1', admissionNo: 'BFC/2024/001', firstName: 'Emeka', lastName: 'Okafor', middleName: 'David', gender: 'MALE', className: 'JSS 1A', parentLinked: true, parentEmail: 'parent.okafor@gmail.com' },
        { id: 'st_2', admissionNo: 'BFC/2024/002', firstName: 'Amina', lastName: 'Bello', middleName: 'Fatima', gender: 'FEMALE', className: 'JSS 1A', parentLinked: true, parentEmail: 'bello.family@gmail.com' },
        { id: 'st_3', admissionNo: 'BFC/2024/003', firstName: 'Chukwudi', lastName: 'Eze', middleName: 'Paul', gender: 'MALE', className: 'JSS 1A', parentLinked: false },
        { id: 'st_4', admissionNo: 'BFC/2024/004', firstName: 'Zainab', lastName: 'Usman', middleName: 'Hauwa', gender: 'FEMALE', className: 'JSS 1A', parentLinked: false },
        { id: 'st_5', admissionNo: 'BFC/2024/005', firstName: 'Tolu', lastName: 'Ogunlesi', middleName: 'Segun', gender: 'MALE', className: 'JSS 1A', parentLinked: true, parentEmail: 'parent.okafor@gmail.com' }, // 2nd child of parent.okafor
        { id: 'st_6', admissionNo: 'BFC/2024/006', firstName: 'Ngozi', lastName: 'Okeke', gender: 'FEMALE', className: 'JSS 2A', parentLinked: false },
        { id: 'st_7', admissionNo: 'BFC/2024/007', firstName: 'Bilal', lastName: 'Yakubu', gender: 'MALE', className: 'SSS 1A', parentLinked: false },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      processCsv(text);
    };
    reader.readAsText(file);
  };

  const processCsv = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      setValidationErrors(['CSV file must have a header row and at least one student data row.']);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    const errors: string[] = [];
    const seenAdmissionNos = new Set(students.map(s => s.admissionNo.toLowerCase()));

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',').map(v => v.trim());

      const rowObj: any = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      // Validation
      if (!rowObj.admissionNo) {
        errors.push(`Row ${i + 1}: Missing admissionNo`);
      } else if (seenAdmissionNos.has(rowObj.admissionNo.toLowerCase())) {
        errors.push(`Row ${i + 1}: Duplicate admissionNo '${rowObj.admissionNo}'`);
      } else {
        seenAdmissionNos.add(rowObj.admissionNo.toLowerCase());
      }

      if (!rowObj.firstName || !rowObj.lastName) {
        errors.push(`Row ${i + 1}: Missing student first name or last name`);
      }

      rows.push(rowObj);
    }

    setParsedRows(rows);
    setValidationErrors(errors);
    setImportStep(2);
  };

  const handleCommitImport = () => {
    setImporting(true);
    setTimeout(() => {
      const newItems: StudentItem[] = parsedRows.map((r, i) => ({
        id: `imported_${Date.now()}_${i}`,
        admissionNo: r.admissionNo || `BFC/2024/10${i}`,
        firstName: r.firstName || 'Student',
        lastName: r.lastName || 'Learner',
        middleName: r.middleName || null,
        gender: r.gender?.toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE',
        className: r.className || 'JSS 1A',
        parentLinked: !!r.parentEmail,
        parentEmail: r.parentEmail || null,
      }));

      setStudents(prev => [...prev, ...newItems]);
      setImporting(false);
      setShowImportModal(false);
      setImportStep(1);
      setParsedRows([]);
    }, 600);
  };

  const sampleCsvDownload = () => {
    const csv = `admissionNo,firstName,lastName,middleName,gender,className,parentEmail,parentName,relationship\nBFC/2024/020,Samuel,Akpan,Etim,MALE,JSS 1A,akpan.parent@gmail.com,Mr. Etim Akpan,FATHER\nBFC/2024/021,Fatima,Danjuma,,FEMALE,JSS 1A,danjuma.ha@gmail.com,Hajiya Danjuma,MOTHER`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_import_template.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        {/* Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Roster Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage learner biodata, class assignments, and parent links</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowImportModal(true);
                setImportStep(1);
              }}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-sm transition"
            >
              <Upload className="w-4 h-4" />
              CSV Import Wizard
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or admission no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Class:
            </span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="text-xs sm:text-sm border border-slate-300 rounded-lg py-1.5 px-3 bg-white"
            >
              <option value="ALL">All Classes (JSS 1 - SSS 3)</option>
              <option value="JSS 1A">JSS 1A</option>
              <option value="JSS 2A">JSS 2A</option>
              <option value="SSS 1A">SSS 1A</option>
            </select>
          </div>
        </div>

        {/* Table / Results */}
        {loading ? (
          <LoadingState message="Loading student roster..." />
        ) : filteredStudents.length === 0 ? (
          <EmptyState
            title="No students found"
            description="No learners match your search query or filter. You can add students via the CSV Import Wizard."
            actionText="Import Students via CSV"
            onAction={() => setShowImportModal(true)}
          />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Gender</th>
                    <th className="py-3 px-4">Parent Linked</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">{st.admissionNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {st.lastName}, {st.firstName} {st.middleName || ''}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-medium">
                          {st.className}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-xs">{st.gender}</td>
                      <td className="py-3 px-4">
                        {st.parentLinked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {st.parentEmail || 'Linked'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Not Linked
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/reports/${st.id}/trm_first`}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="py-3 px-4 bg-slate-50/60 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>Showing {filteredStudents.length} of {students.length} students</span>
              <span className="font-mono text-[11px]">School: Bright Future College</span>
            </div>
          </div>
        )}
      </main>

      {/* CSV Import Wizard Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Bulk Student CSV Import Wizard</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span className={importStep === 1 ? 'font-bold text-emerald-600' : ''}>1. Upload File</span>
              <span>→</span>
              <span className={importStep === 2 ? 'font-bold text-emerald-600' : ''}>2. Validate & Errors</span>
              <span>→</span>
              <span className={importStep === 3 ? 'font-bold text-emerald-600' : ''}>3. Commit Import</span>
            </div>

            {/* Step 1: Upload */}
            {importStep === 1 && (
              <div className="space-y-4 pt-2">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-500 transition cursor-pointer relative bg-slate-50/50">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Click to upload or drag & drop CSV</p>
                  <p className="text-xs text-slate-400 mt-1">Columns: admissionNo, firstName, lastName, gender, className, parentEmail...</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={sampleCsvDownload}
                    type="button"
                    className="text-xs text-emerald-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Sample CSV Template
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Validate & Preview */}
            {importStep === 2 && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-800">File Summary:</div>
                  <div>Rows detected: <strong>{parsedRows.length}</strong></div>
                  <div>Validation issues: <strong className={validationErrors.length > 0 ? 'text-rose-600' : 'text-emerald-600'}>{validationErrors.length}</strong></div>
                </div>

                {validationErrors.length > 0 ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 max-h-40 overflow-y-auto space-y-1">
                    <span className="font-bold block">Validation Errors:</span>
                    {validationErrors.map((err, i) => (
                      <div key={i} className="flex items-center gap-1 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>All {parsedRows.length} rows passed schema & admission number uniqueness validation!</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setImportStep(1)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={validationErrors.length > 0 || importing}
                    onClick={handleCommitImport}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 transition"
                  >
                    {importing ? 'Importing Roster...' : 'Commit Import'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
