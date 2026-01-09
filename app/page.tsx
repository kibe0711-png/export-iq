"use client";

import { useState, useEffect, useCallback } from "react";
import Navigation from "./components/Navigation";
import CSVUploader from "./components/CSVUploader";
import SpecSheetTable from "./components/SpecSheetTable";

interface SpecSheet {
  id: number;
  customerCode: string;
  cropCode: string;
  crop: string;
  packagingType: string;
  palletWeight: number;
  unit: number;
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
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:sticky lg:top-20">
            <CSVUploader onUploadComplete={fetchSpecSheets} />
          </div>

          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-sm font-light">Loading specifications...</p>
              </div>
            ) : (
              <SpecSheetTable data={specSheets} onRefresh={fetchSpecSheets} />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-4 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-light text-gray-400">
          <p>Souk ExportIQ</p>
          <p>Powered by Neon PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
