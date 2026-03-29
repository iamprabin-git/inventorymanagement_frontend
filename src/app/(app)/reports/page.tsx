"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Summary = {
  period: { from: string; to: string };
  sales: { count: number; total: number };
  purchases: { count: number; total: number };
  inventory: { active_products: number };
};

type Financial = {
  period: { from: string; to: string };
  revenue: number;
  cost_of_goods_sold: number;
  gross_profit: number;
  purchase_spend: number;
  revenue_minus_purchase_spend: number;
};

type Valuation = {
  total_valuation: number;
  lines: {
    product_id: number;
    sku: string;
    name: string;
    quantity: number;
    cost_price: number;
    line_value: number;
  }[];
};

export default function ReportsPage() {
  const [from, setFrom] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
  );
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState<Summary | null>(null);
  const [financial, setFinancial] = useState<Financial | null>(null);
  const [valuation, setValuation] = useState<Valuation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = `?from=${from}&to=${to}`;
    Promise.all([
      api<Summary>(`/reports/summary${q}`),
      api<Financial>(`/reports/financial${q}`),
      api<Valuation>("/reports/inventory-valuation"),
    ])
      .then(([s, f, v]) => {
        setSummary(s);
        setFinancial(f);
        setValuation(v);
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  if (loading) {
    return <p className="text-slate-500">Loading reports…</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Filter activity and financial figures by date range.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400">From</label>
          <input
            type="date"
            className="mt-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">To</label>
          <input
            type="date"
            className="mt-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      {summary && (
        <section>
          <h2 className="mb-3 text-lg font-medium text-white">Activity summary</h2>
          <p className="mb-4 text-xs text-slate-500">
            {summary.period.from} → {summary.period.to}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">Sales count</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">
                {summary.sales.count}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">Sales total</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                Rs. {summary.sales.total.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">Purchases count</p>
              <p className="mt-1 text-2xl font-semibold text-amber-400">
                {summary.purchases.count}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">Purchases total</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                Rs. {summary.purchases.total.toFixed(2)}
              </p>
            </div>
          </div>
        </section>
      )}

      {financial && (
        <section>
          <h2 className="mb-3 text-lg font-medium text-white">Financial</h2>
          <p className="mb-4 text-xs text-slate-500">
            {financial.period.from} → {financial.period.to}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">Revenue</p>
              <p className="mt-1 text-xl font-semibold text-emerald-400">
                Rs. {financial.revenue.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">COGS (products)</p>
              <p className="mt-1 text-xl font-semibold text-slate-200">
                Rs. {financial.cost_of_goods_sold.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">Gross profit</p>
              <p className="mt-1 text-xl font-semibold text-white">
                Rs. {financial.gross_profit.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">Purchase spend</p>
              <p className="mt-1 text-xl font-semibold text-amber-400">
                Rs. {financial.purchase_spend.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-xs uppercase text-slate-500">
                Revenue − purchase spend
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-200">
                Rs. {financial.revenue_minus_purchase_spend.toFixed(2)}
              </p>
            </div>
          </div>
        </section>
      )}

      {valuation && (
        <section>
          <h2 className="mb-3 text-lg font-medium text-white">
            Inventory valuation (cost × qty)
          </h2>
          <p className="mb-4 text-2xl font-semibold text-white">
            Rs. {valuation.total_valuation.toFixed(2)}
          </p>
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Cost</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {valuation.lines.map((l) => (
                  <tr key={l.product_id}>
                    <td className="px-4 py-2 font-mono text-slate-400">
                      {l.sku}
                    </td>
                    <td className="px-4 py-2 text-slate-200">{l.name}</td>
                    <td className="px-4 py-2">{l.quantity}</td>
                    <td className="px-4 py-2 text-slate-400">
                      Rs. {l.cost_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-white">
                      Rs. {l.line_value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
