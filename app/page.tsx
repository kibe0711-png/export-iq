"use client";

import { useState, useEffect, useCallback } from "react";
import CSVUploader from "./components/CSVUploader";
import SpecSheetTable from "./components/SpecSheetTable";

interface SpecSheet {
  id: number;
  customerCode: string;
  crop: string;
  packagingType: string;
  palletWeight: number;
  price: number;
}

export default function Home() {
  const [specSheets, setSpecSheets] = useState<SpecSheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpecSheets = useCallback(async () => {
    try {
      const response = await fetch("/api/spec-sheets");
      if (response.ok) {
        const data = await response.json();
        setSpecSheets(data);
      }
    } catch (error) {
      console.error("Failed to fetch spec sheets:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpecSheets();
  }, [fetchSpecSheets]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">Export IQ</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-sm font-semibold text-emerald-600">Spec Sheets</span>
            <span className="text-sm font-medium text-gray-400 cursor-not-allowed">Analytics</span>
            <span className="text-sm font-medium text-gray-400 cursor-not-allowed">Settings</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4">
            Customer Specifications
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Export Intelligence Engine</h1>
          <p className="text-gray-500 max-w-xl">
            Manage customer spec sheets with crop specifications, packaging types, pallet weights, and pricing.
            Upload CSV files to get started.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:sticky lg:top-24">
            <CSVUploader onUploadComplete={fetchSpecSheets} />
          </div>

          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Loading specifications...</p>
              </div>
            ) : (
              <SpecSheetTable data={specSheets} onRefresh={fetchSpecSheets} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <p>Export IQ - Export Intelligence Engine</p>
          <p className="text-gray-400">Powered by Neon PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
