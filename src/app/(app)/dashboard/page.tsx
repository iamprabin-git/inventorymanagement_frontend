"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, Package, ShoppingCart, Wallet } from "lucide-react";

type Summary = {
  period: { from: string; to: string };
  sales: { count: number; total: number };
  purchases: { count: number; total: number };
  inventory: {
    active_products: number;
    low_stock_items: {
      id: number;
      sku: string;
      name: string;
      stock_quantity: number;
      low_stock_threshold: number;
    }[];
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Summary>("/reports/summary")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dashboard"));
  }, []);

  if (error) return <div className="p-6 text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">{error}</div>;
  if (!data) return <p className="p-10 text-slate-500 animate-pulse text-center">Loading dashboard data...</p>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Activity period: <span className="font-medium text-slate-300">{data.period.from}</span> to <span className="font-medium text-slate-300">{data.period.to}</span>
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Sales (Period)" 
          value={data.sales.count} 
          subtext={`Rs. ${data.sales.total.toLocaleString()} total`} 
          icon={<ShoppingCart className="h-4 w-4 text-emerald-400" />} 
        />
        <StatCard 
          label="Purchases" 
          value={data.purchases.count} 
          subtext={`Rs. ${data.purchases.total.toLocaleString()} total`} 
          icon={<Wallet className="h-4 w-4 text-amber-400" />} 
        />
        <StatCard 
          label="Active Products" 
          value={data.inventory.active_products} 
          subtext="In-stock catalog items" 
          icon={<Package className="h-4 w-4 text-blue-400" />} 
        />
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
             <p className="text-xs uppercase font-bold text-slate-500">Low Stock Alerts</p>
             <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-red-400">{data.inventory.low_stock_items.length}</p>
          <Link href="/products" className="mt-2 inline-block text-xs text-emerald-500 hover:text-emerald-400 font-medium">
            Restock Inventory →
          </Link>
        </div>
      </div>

      {/* Low Stock Table */}
      {data.inventory.low_stock_items.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Critical Stock Alerts</h2>
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">SKU / Product</th>
                  <th className="px-6 py-3 text-right font-medium">Current Stock</th>
                  <th className="px-6 py-3 text-right font-medium">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.inventory.low_stock_items.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/30">
                    <td className="px-6 py-4">
                      <div className="font-mono text-emerald-500 text-xs font-bold">{p.sku}</div>
                      <div className="text-slate-200 font-medium">{p.name}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-1 rounded bg-red-400/10 text-red-400 font-bold">
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 font-medium">
                      {p.low_stock_threshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, subtext, icon }: { label: string, value: number, subtext: string, icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex justify-between items-start">
        <p className="text-xs uppercase font-bold text-slate-500">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 font-medium">{subtext}</p>
    </div>
  );
}