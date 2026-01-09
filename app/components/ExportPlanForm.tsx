"use client";

import { useState, useEffect, useMemo } from "react";

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

interface ExportPlanFormProps {
  specSheets: SpecSheet[];
  weekStart: Date;
  onSubmit: (plan: {
    customerCode: string;
    cropCode: string;
    crop: string;
    packagingType: string;
    quantity: number;
    palletWeight: number;
    unitWeight: number;
    price: number;
    totalWeight: number;
    unitCount: number;
    revenue: number;
  }) => void;
}

export default function ExportPlanForm({ specSheets, weekStart, onSubmit }: ExportPlanFormProps) {
  const [customerCode, setCustomerCode] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [quantity, setQuantity] = useState<number>(0);

  const customers = useMemo(() => {
    return [...new Set(specSheets.map((s) => s.customerCode))].sort();
  }, [specSheets]);

  const packagingOptions = useMemo(() => {
    if (!customerCode) return [];
    return specSheets
      .filter((s) => s.customerCode === customerCode)
      .map((s) => ({ packaging: s.packagingType, crop: s.crop }));
  }, [specSheets, customerCode]);

  const selectedSpec = useMemo(() => {
    if (!customerCode || !packagingType) return null;
    return specSheets.find(
      (s) => s.customerCode === customerCode && s.packagingType === packagingType
    ) || null;
  }, [specSheets, customerCode, packagingType]);

  const computed = useMemo(() => {
    if (!selectedSpec || quantity <= 0) {
      return { totalWeight: 0, unitCount: 0, revenue: 0 };
    }
    const totalWeight = selectedSpec.palletWeight * quantity;
    const unitCount = selectedSpec.unit > 0 ? totalWeight / selectedSpec.unit : 0;
    const revenue = selectedSpec.price * unitCount;
    return { totalWeight, unitCount, revenue };
  }, [selectedSpec, quantity]);

  useEffect(() => {
    setPackagingType("");
    setQuantity(0);
  }, [customerCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpec || quantity <= 0) return;

    onSubmit({
      customerCode: selectedSpec.customerCode,
      cropCode: selectedSpec.cropCode,
      crop: selectedSpec.crop,
      packagingType: selectedSpec.packagingType,
      quantity,
      palletWeight: selectedSpec.palletWeight,
      unitWeight: selectedSpec.unit,
      price: selectedSpec.price,
      totalWeight: computed.totalWeight,
      unitCount: computed.unitCount,
      revenue: computed.revenue,
    });

    setCustomerCode("");
    setPackagingType("");
    setQuantity(0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-medium text-gray-900 mb-4">Add Export Entry</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1.5">Customer</label>
          <select
            value={customerCode}
            onChange={(e) => setCustomerCode(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-light text-gray-500 mb-1.5">Packaging</label>
          <select
            value={packagingType}
            onChange={(e) => setPackagingType(e.target.value)}
            disabled={!customerCode}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          >
            <option value="">Select packaging</option>
            {packagingOptions.map((opt, i) => (
              <option key={i} value={opt.packaging}>
                {opt.packaging} ({opt.crop})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-light text-gray-500 mb-1.5">Quantity (Pallets)</label>
          <input
            type="number"
            min="0"
            value={quantity || ""}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            disabled={!packagingType}
            placeholder="0"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
        </div>

        {selectedSpec && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-light text-gray-500">Crop</span>
              <span className="text-gray-900">{selectedSpec.crop}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-light text-gray-500">Pallet Weight</span>
              <span className="text-gray-900">{selectedSpec.palletWeight.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-light text-gray-500">Unit Weight</span>
              <span className="text-gray-900">{selectedSpec.unit.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-light text-gray-500">Price/Unit</span>
              <span className="text-gray-900">${selectedSpec.price.toFixed(2)}</span>
            </div>

            {quantity > 0 && (
              <>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-gray-500">Total Weight</span>
                    <span className="font-medium text-gray-900">{computed.totalWeight.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="font-light text-gray-500">Unit Count</span>
                    <span className="font-medium text-gray-900">{computed.unitCount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="font-light text-gray-500">Revenue</span>
                    <span className="font-semibold text-emerald-600">${computed.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedSpec || quantity <= 0}
          className="w-full mt-4 px-4 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Plan
        </button>
      </div>
    </form>
  );
}
