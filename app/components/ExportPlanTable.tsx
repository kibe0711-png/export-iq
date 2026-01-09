"use client";

interface ExportPlan {
  id: number;
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
}

interface ExportPlanTableProps {
  plans: ExportPlan[];
  onDelete: (id: number) => void;
}

export default function ExportPlanTable({ plans, onDelete }: ExportPlanTableProps) {
  const totals = plans.reduce(
    (acc, plan) => ({
      pallets: acc.pallets + plan.quantity,
      weight: acc.weight + plan.totalWeight,
      units: acc.units + plan.unitCount,
      revenue: acc.revenue + plan.revenue,
    }),
    { pallets: 0, weight: 0, units: 0, revenue: 0 }
  );

  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
        <div className="text-gray-400 mb-3">
          <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p className="text-sm font-light text-gray-500">No exports planned for this week</p>
        <p className="text-xs text-gray-400 mt-1">Add entries using the form on the left</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-semibold text-emerald-600">{totals.pallets}</div>
          <div className="text-xs font-light text-gray-500">Pallets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-emerald-600">{totals.weight.toLocaleString()}</div>
          <div className="text-xs font-light text-gray-500">Total kg</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-emerald-600">{totals.units.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="text-xs font-light text-gray-500">Units</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-emerald-600">${totals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-xs font-light text-gray-500">Revenue</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Crop</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Packaging</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Pallets</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Weight</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Revenue</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{plan.customerCode}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                    {plan.crop}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-light text-gray-600">{plan.packagingType}</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">{plan.quantity}</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">{plan.totalWeight.toLocaleString()} kg</td>
                <td className="px-4 py-3 text-sm text-right font-mono font-medium text-emerald-600">
                  ${plan.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDelete(plan.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    aria-label="Delete entry"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
