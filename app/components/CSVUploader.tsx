"use client";

import { useState, useCallback, useRef } from "react";

interface UploadResult {
  success: boolean;
  inserted: number;
  total: number;
  skipped: number;
}

interface CSVUploaderProps {
  onUploadComplete: () => void;
}

export default function CSVUploader({ onUploadComplete }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [replaceAll, setReplaceAll] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("replaceAll", replaceAll.toString());

    try {
      const response = await fetch("/api/spec-sheets", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadResult(data);
      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg max-w-xl w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Spec Sheet</h2>
        <p className="text-sm text-gray-500">Import customer specifications from a CSV file</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-200 bg-gray-50 hover:border-gray-300"
        } ${isUploading ? "opacity-70 cursor-wait" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Processing your file...</p>
          </div>
        ) : (
          <>
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm mb-1">
              <span className="text-emerald-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-gray-400 text-xs">
              CSV with customer, crop, packaging, pallet_weight, price
            </p>
          </>
        )}
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={replaceAll}
            onChange={(e) => setReplaceAll(e.target.checked)}
            className="w-4 h-4 accent-emerald-600"
          />
          <span className="text-sm text-gray-600">Replace all existing spec sheets</span>
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {uploadResult && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>
            <strong>{uploadResult.inserted} spec sheets imported</strong>
            {uploadResult.skipped > 0 && (
              <span className="opacity-80"> ({uploadResult.skipped} rows skipped)</span>
            )}
          </span>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-2">Expected CSV format:</p>
        <code className="block p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono">
          customer,crop,packaging,pallet_weight,price
        </code>
      </div>
    </div>
  );
}
