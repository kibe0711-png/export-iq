"use client";

import { useState } from "react";

interface SpecSheet {
  id: number;
  customerCode: string;
  crop: string;
  packagingType: string;
  palletWeight: number;
  price: number;
}

interface SpecSheetTableProps {
  data: SpecSheet[];
  onRefresh: () => void;
}

export default function SpecSheetTable({ data, onRefresh }: SpecSheetTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof SpecSheet>("customerCode");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof SpecSheet) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = data.filter(
    (sheet) =>
      sheet.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.packagingType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * modifier;
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * modifier;
    }
    return 0;
  });

  const uniqueCustomers = [...new Set(data.map((s) => s.customerCode))].length;
  const uniqueCrops = [...new Set(data.map((s) => s.crop))].length;

  const SortIcon = ({ field }: { field: keyof SpecSheet }) => (
    <span className="ml-1 opacity-70">
      {sortField === field ? (sortDirection === "asc" ? "↑" : "↓") : ""}
    </span>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 pb-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Spec Sheets</h2>
          <p className="text-sm text-gray-500">{data.length} specifications loaded</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="flex flex-col p-4 bg-gray-50 rounded-lg text-center">
          <span className="text-3xl font-bold text-emerald-600">{uniqueCustomers}</span>
          <span className="text-xs text-gray-500 mt-1">Customers</span>
        </div>
        <div className="flex flex-col p-4 bg-gray-50 rounded-lg text-center">
          <span className="text-3xl font-bold text-emerald-600">{uniqueCrops}</span>
          <span className="text-xs text-gray-500 mt-1">Crops</span>
        </div>
        <div className="flex flex-col p-4 bg-gray-50 rounded-lg text-center">
          <span className="text-3xl font-bold text-emerald-600">{data.length}</span>
          <span className="text-xs text-gray-500 mt-1">Total Specs</span>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by customer, crop, or packaging..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-100">
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none"
                onClick={() => handleSort("customerCode")}
              >
                Customer Code <SortIcon field="customerCode" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none"
                onClick={() => handleSort("crop")}
              >
                Crop <SortIcon field="crop" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none"
                onClick={() => handleSort("packagingType")}
              >
                Type <SortIcon field="packagingType" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none"
                onClick={() => handleSort("palletWeight")}
              >
                Pallet Weight <SortIcon field="palletWeight" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                Price <SortIcon field="price" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                  {searchTerm ? "No matching specifications found" : "No specifications uploaded yet"}
                </td>
              </tr>
            ) : (
              sortedData.map((sheet) => (
                <tr key={sheet.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {sheet.customerCode}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                      {sheet.crop}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sheet.packagingType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">
                    {sheet.palletWeight.toLocaleString()} kg
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">
                    ${sheet.price.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sortedData.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-500">
          Showing {sortedData.length} of {data.length} specifications
        </div>
      )}
    </div>
  );
}
