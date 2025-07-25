"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Customers", href: "/dashboard/pelanggan", icon: "👥" },
  { name: "Category", href: "/dashboard/kategori", icon: "📂" },
  { name: "Products", href: "/dashboard/products", icon: "📦" },
  { name: "Stock", href: "/dashboard/stock", icon: "📈" },
  { name: "Orders", href: "/dashboard/order", icon: "🛒" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-[#f57224] to-[#92278f] text-white min-h-screen p-8 flex flex-col shadow-lg">
      {/* Logo + Branding */}
      <div className="flex flex-col items-center mb-12">
        <img
          src="/logo.png"
          alt="Lazada Logo"
          className="w-20 h-20 object-contain"
        />
        <span className="text-sm text-white/70 tracking-wide">
          Seller Center
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-3 font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-4 px-4 py-3 rounded-md transition-all duration-300 select-none",
                isActive
                  ? "bg-white text-[#92278f] font-semibold shadow"
                  : "hover:bg-white/10 hover:text-white text-white/90"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-8 text-xs text-white/60">
        © 2025 Lazada. All rights reserved.
      </div>
    </aside>
  );
}
