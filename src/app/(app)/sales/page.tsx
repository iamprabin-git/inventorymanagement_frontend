"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type SaleRow = {
  id: number;
  invoice_no: string;
  customer_name: string | null;
  sale_date: string;
  total: string;
  items_count: number;
};

type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number };
};

export default function SalesPage() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<SaleRow[]>([]);
  const [meta, setMeta] = useState<Paginated<SaleRow>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<Paginated<SaleRow> & { data: (SaleRow & { items_count?: number })[] }>(
        `/sales?page=${page}`
      );
      setRows(
        res.data.map((r) => ({
          ...r,
          items_count: (r as { items_count?: number }).items_count ?? 0,
        }))
      );
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">Sales</h1>
        <Link
          href="/sales/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          New sale
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Lines</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2 font-mono text-emerald-400">
                      {s.invoice_no}
                    </td>
                    <td className="px-4 py-2 text-slate-300">{s.sale_date}</td>
                    <td className="px-4 py-2 text-slate-400">
                      {s.customer_name ?? "—"}
                    </td>
                    <td className="px-4 py-2">{s.items_count}</td>
                    <td className="px-4 py-2 text-white">
                      Rs. {Number(s.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/sales/${s.id}`}
                        className="text-emerald-500 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta && meta.last_page > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-slate-700 px-3 py-1 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                type="button"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-slate-700 px-3 py-1 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
