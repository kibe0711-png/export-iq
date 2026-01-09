"use client";

import { useState, useEffect, useCallback } from "react";
import Navigation from "../components/Navigation";
import WeekSelector from "../components/WeekSelector";
import ExportPlanForm from "../components/ExportPlanForm";
import ExportPlanTable from "../components/ExportPlanTable";

interface SpecSheet {
  id: number;
  customerCode: string;
  crop: string;
  packagingType: string;
  palletWeight: number;
  unit: number;
  price: number;
}

interface ExportPlan {
  id: number;
  weekStart: string;
  customerCode: string;
  crop: string;
  packagingType: string;
  quantity: number;
  palletWeight: number;
  unitWeight: number;
  price: number;
  totalWeight: number;
  unitCount: number;
  revenue: number;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ExportPlanPage() {
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()));
  const [specSheets, setSpecSheets] = useState<SpecSheet[]>([]);
  const [exportPlans, setExportPlans] = useState<ExportPlan[]>([]);
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
    }
  }, []);

  const fetchExportPlans = useCallback(async () => {
    try {
      const weekStart = getMonday(selectedDate).toISOString();
      const response = await fetch(`/api/export-plans?weekStart=${weekStart}`);
      if (response.ok) {
        const data = await response.json();
        setExportPlans(data);
      }
    } catch (error) {
      console.error("Failed to fetch export plans:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchSpecSheets();
  }, [fetchSpecSheets]);

  useEffect(() => {
    setIsLoading(true);
    fetchExportPlans();
  }, [fetchExportPlans]);

  const handleAddPlan = async (plan: {
    customerCode: string;
    crop: string;
    packagingType: string;
    quantity: number;
    palletWeight: number;
    unitWeight: number;
    price: number;
    totalWeight: number;
    unitCount: number;
    revenue: number;
  }) => {
    try {
      const response = await fetch("/api/export-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart: getMonday(selectedDate).toISOString(),
          ...plan,
        }),
      });

      if (response.ok) {
        fetchExportPlans();
      }
    } catch (error) {
      console.error("Failed to add export plan:", error);
    }
  };

  const handleDeletePlan = async (id: number) => {
    try {
      const response = await fetch(`/api/export-plans?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExportPlans((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete export plan:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">Export Plan</h1>
          <WeekSelector selectedDate={selectedDate} onChange={setSelectedDate} />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:sticky lg:top-24">
            <ExportPlanForm
              specSheets={specSheets}
              weekStart={selectedDate}
              onSubmit={handleAddPlan}
            />
          </div>

          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 text-sm font-light">Loading plans...</p>
              </div>
            ) : (
              <ExportPlanTable plans={exportPlans} onDelete={handleDeletePlan} />
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
