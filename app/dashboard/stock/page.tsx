"use client";

import AppSidebar from "@/components/AppSidebar";
import AppTopbar from "@/components/AppTopbar";
import StockList from "@/components/stock-list";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <AppTopbar />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Daftar Barang
              </h1>
              <p className="text-muted-foreground">
                Berikut adalah daftar Barang yang diambil dari API Laravel.
              </p>

              <div className="border rounded-lg p-4 bg-muted">
                <StockList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
