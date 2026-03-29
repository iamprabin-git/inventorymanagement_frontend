"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!data) {
    return <p className="text-slate-500">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Period: {data.period.from} → {data.period.to}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-500">Sales (period)</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            {data.sales.count}
          </p>
          <p className="text-sm text-slate-400">
            ${data.sales.total.toFixed(2)} total
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-500">Purchases</p>
          <p className="mt-2 text-2xl font-semibold text-amber-400">
            {data.purchases.count}
          </p>
          <p className="text-sm text-slate-400">
            ${data.purchases.total.toFixed(2)} total
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-500">Active products</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {data.inventory.active_products}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs uppercase text-slate-500">Low stock alerts</p>
          <p className="mt-2 text-2xl font-semibold text-red-400">
            {data.inventory.low_stock_items.length}
          </p>
          <Link
            href="/products"
            className="text-xs text-emerald-500 hover:underline"
          >
            View products
          </Link>
        </div>
      </div>

      {data.inventory.low_stock_items.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-medium text-white">Low stock</h2>
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">SKU</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Stock</th>
                  <th className="px-4 py-2 font-medium">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {data.inventory.low_stock_items.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 font-mono text-slate-300">
                      {p.sku}
                    </td>
                    <td className="px-4 py-2 text-slate-200">{p.name}</td>
                    <td className="px-4 py-2 text-amber-400">
                      {p.stock_quantity}
                    </td>
                    <td className="px-4 py-2 text-slate-500">
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
