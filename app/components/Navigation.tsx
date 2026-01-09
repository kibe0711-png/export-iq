"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Spec Sheets" },
  { href: "/harvest-plan", label: "Harvest Plan" },
  { href: "/export-plan", label: "Export Plan" },
  { href: "#", label: "Analytics", disabled: true },
  { href: "#", label: "Settings", disabled: true },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-900">Souk ExportIQ</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href + item.label}
                href={item.disabled ? "#" : item.href}
                className={`px-4 py-2 text-sm transition-colors rounded-md ${
                  item.disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : isActive
                    ? "text-emerald-600 bg-emerald-50 font-medium"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 font-light"
                }`}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
