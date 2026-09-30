import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  FileCode,
  FileSpreadsheet,
  X
} from 'lucide-react';
import api from '../../services/api';
import { formatFileSize } from '../../utils/formatting';

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState('Annual Report');
  const [period, setPeriod] = useState('FY2026');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Active queue simulation for showcase
  const [queue, setQueue] = useState([
    {
      id: 'doc_001',
      name: 'Annual_Report_2026.pdf',
      type: 'Annual Report',
      size: 14500000,
      status: 'analyzed',
      progress: 100,
    },
    {
      id: 'doc_002',
      name: 'Management_Commentary.pdf',
      type: 'Commentary',
      size: 3800000,
      status: 'analyzed',
      progress: 100,
    },
    {
      id: 'doc_003',
      name: 'Q4_Financials.pdf',
      type: 'Quarterly Report',
      size: 5200000,
      status: 'processing',
      progress: 72,
    },
    {
      id: 'doc_004',
      name: 'Auditor_Report_2026.pdf',
      type: 'Audit Report',
      size: 4100000,
      status: 'queued',
      progress: 0,
    },
  ]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('documentType', docType);
    formData.append('period', period);
    formData.append('companyId', 'company_001');

    try {
      const res = await api.uploadDocument(formData, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      // Add to queue
      const newDoc = {
        id: res.data.documentId,
        name: res.data.fileName,
        type: docType,
        size: selectedFile.size,
        status: 'processing',
        progress: 35,
      };
      setQueue([newDoc, ...queue]);
      setSelectedFile(null);
      
      // Navigate to analysis page to see pipeline
      setTimeout(() => {
        navigate('/analysis');
      }, 1200);
    } catch (err) {
      console.error(err);
      // Even if offline, add to queue and redirect
      const newDoc = {
        id: `doc_${Date.now()}`,
        name: selectedFile.name,
        type: docType,
        size: selectedFile.size,
        status: 'processing',
        progress: 40,
      };
      setQueue([newDoc, ...queue]);
      setSelectedFile(null);
      navigate('/analysis');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    return <FileText className="w-5 h-5 text-brand-dark" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
          Upload Financial Documents
        </h1>
        <p className="text-xs text-navy-500 mt-1">
          Add annual reports, financial statements, management commentary and other documents for automated verification.
        </p>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-10 border-2 border-dashed rounded-card bg-surface flex flex-col items-center justify-center text-center transition-all ${
          dragActive
            ? 'border-brand-emerald bg-brand-mint/30'
            : 'border-border hover:border-brand-emerald/50'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-brand-mint text-brand-dark flex items-center justify-center mb-4 shadow-sm">
          <UploadCloud className="w-7 h-7" />
        </div>

        <p className="text-sm font-bold text-navy-900 mb-1">
          Drag & drop your files here
        </p>
        <p className="text-xs text-navy-500 mb-4">
          or click below to browse from your device
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-semibold rounded-lg shadow-subtle transition-all"
        >
          Browse Files
        </button>

        <div className="flex items-center gap-3 mt-6 text-[11px] font-medium text-navy-500">
          <span>Supported:</span>
          <span className="px-2 py-0.5 rounded bg-background border border-border">PDF</span>
          <span className="px-2 py-0.5 rounded bg-background border border-border">DOCX</span>
          <span className="px-2 py-0.5 rounded bg-background border border-border">XLSX</span>
        </div>
      </div>

      {/* Selected File Stage & Form */}
      {selectedFile && (
        <div className="bg-surface p-5 rounded-card border border-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-dark" />
              <div>
                <span className="text-xs font-bold text-navy-900">{selectedFile.name}</span>
                <p className="text-[10px] text-navy-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 text-navy-500 hover:text-navy-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border focus:border-brand-emerald rounded-lg outline-none"
              >
                <option value="Annual Report">Annual Report</option>
                <option value="Quarterly Report">Quarterly Report (Q4)</option>
                <option value="Commentary">Management Discussion & Analysis</option>
                <option value="Audit Report">Independent Auditor's Report</option>
                <option value="Notes & Schedules">Notes & Financial Schedules</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                Reporting Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-background border border-border focus:border-brand-emerald rounded-lg outline-none"
              >
                <option value="FY2026">FY2026 (Full Year)</option>
                <option value="Q4 2026">Q4 2026</option>
                <option value="FY2025">FY2025 (Comparative)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleUploadSubmit}
            disabled={uploading}
            className="w-full py-2.5 bg-brand-dark hover:bg-[#065f46] text-white text-xs font-bold rounded-lg shadow-subtle flex items-center justify-center gap-2 transition-all"
          >
            <span>{uploading ? `Uploading & Initializing (${uploadProgress}%)...` : 'Upload & Start Pipeline'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between">
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            Document Ingestion Queue
          </span>
          <span className="text-xs text-navy-500 font-medium">4 Total</span>
        </div>

        <div className="divide-y divide-border/60">
          {queue.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFBFB] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-mint text-brand-dark flex items-center justify-center shrink-0">
                  {getFileIcon(item.name)}
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-900">{item.name}</div>
                  <div className="text-[11px] text-navy-500 flex items-center gap-2 mt-0.5">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{formatFileSize(item.size)}</span>
                  </div>
                </div>
              </div>

              {/* Status & Progress */}
              <div className="flex items-center gap-4 sm:w-64">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-navy-700 mb-1">
                    <span className="capitalize">{item.status}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-background overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.status === 'analyzed'
                          ? 'bg-brand-dark'
                          : item.status === 'processing'
                          ? 'bg-brand-emerald animate-pulse'
                          : 'bg-navy-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                {item.status === 'analyzed' ? (
                  <button
                    onClick={() => navigate('/analysis')}
                    className="text-xs font-semibold text-brand-dark hover:underline"
                  >
                    View
                  </button>
                ) : (
                  <Clock className="w-4 h-4 text-navy-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
