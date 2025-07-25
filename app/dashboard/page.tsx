"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import AppTopbar from "@/components/AppTopbar";
import { fetchDashboardCounts } from "@/lib/api"; // Pastikan path-nya sesuai

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchDashboardCounts();
        setData(dashboardData);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <AppTopbar />

        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {loading && <p>Loading...</p>}

          {!loading && data && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard title="Total Customers" value={data.customers} />
              <DashboardCard title="Total Products" value={data.barangs} />
              <DashboardCard title="Total Orders" value={data.orders} />
              <DashboardCard
                title="Total Pendapatan"
                value={`Rp ${Number(data.total_pendapatan).toLocaleString(
                  "id-ID"
                )}`}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Komponen kartu dashboard
function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded shadow p-6">
      <p className="text-gray-600 text-sm">{title}</p>
      <h2 className="text-2xl font-semibold mt-1">{value}</h2>
    </div>
  );
}
