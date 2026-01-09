"use client";

import { useState, useMemo } from "react";

interface CropOption {
  cropCode: string;
  crop: string;
}

interface HarvestPlanFormProps {
  cropOptions: CropOption[];
  onSubmit: (plan: { cropCode: string; crop: string; kgs: number }) => void;
}

export default function HarvestPlanForm({ cropOptions, onSubmit }: HarvestPlanFormProps) {
  const [cropCode, setCropCode] = useState("");
  const [kgs, setKgs] = useState<number>(0);

  const uniqueCropCodes = useMemo(() => {
    const seen = new Set<string>();
    return cropOptions
      .filter((opt) => {
        if (!opt.cropCode || seen.has(opt.cropCode)) return false;
        seen.add(opt.cropCode);
        return true;
      })
      .map((opt) => opt.cropCode)
      .sort();
  }, [cropOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropCode || kgs <= 0) return;

    onSubmit({
      cropCode: cropCode,
      crop: cropCode,
      kgs,
    });

    setCropCode("");
    setKgs(0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-medium text-gray-900 mb-4">Add Harvest Entry</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1.5">Crop Code</label>
          <select
            value={cropCode}
            onChange={(e) => setCropCode(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select crop code</option>
            {uniqueCropCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-light text-gray-500 mb-1.5">Kilograms (kg)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={kgs || ""}
            onChange={(e) => setKgs(parseFloat(e.target.value) || 0)}
            disabled={!cropCode}
            placeholder="0"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
        </div>

        {cropCode && kgs > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="font-light text-gray-500">Crop Code</span>
              <span className="font-mono text-gray-900">{cropCode}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="font-light text-gray-500">Total Harvest</span>
              <span className="font-semibold text-emerald-600">{kgs.toLocaleString()} kg</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!cropCode || kgs <= 0}
          className="w-full mt-4 px-4 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Plan
        </button>
      </div>
    </form>
  );
}
