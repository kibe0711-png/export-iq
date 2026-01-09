"use client";

interface HarvestPlan {
  id: number;
  cropCode: string;
  crop: string;
  kgs: number;
}

interface HarvestPlanTableProps {
  plans: HarvestPlan[];
  onDelete: (id: number) => void;
}

export default function HarvestPlanTable({ plans, onDelete }: HarvestPlanTableProps) {
  const totalKgs = plans.reduce((acc, plan) => acc + plan.kgs, 0);
  const uniqueCrops = new Set(plans.map((p) => p.cropCode)).size;

  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
        <div className="text-gray-400 mb-3">
          <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 12V6" />
            <path d="M12 12l4 2" />
            <path d="M22 2L12 12" />
          </svg>
        </div>
        <p className="text-sm font-light text-gray-500">No harvest planned for this week</p>
        <p className="text-xs text-gray-400 mt-1">Add entries using the form on the left</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-semibold text-emerald-600">{uniqueCrops}</div>
          <div className="text-xs font-light text-gray-500">Crops</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-emerald-600">{totalKgs.toLocaleString()}</div>
          <div className="text-xs font-light text-gray-500">Total kg</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Crop Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Crop</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Kilograms</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-gray-600">{plan.cropCode}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                    {plan.crop}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono font-medium text-gray-900">
                  {plan.kgs.toLocaleString()} kg
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
