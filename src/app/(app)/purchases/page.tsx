"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type PurchaseRow = {
  id: number;
  reference: string | null;
  supplier_name: string;
  purchase_date: string;
  total: string;
  items_count: number;
};

type Paginated<T> = {
  data: (T & { items_count?: number })[];
  meta: { current_page: number; last_page: number };
};

export default function PurchasesPage() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<PurchaseRow[]>([]);
  const [meta, setMeta] = useState<Paginated<PurchaseRow>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<Paginated<PurchaseRow>>(`/purchases?page=${page}`);
      setRows(
        res.data.map((r) => ({
          id: r.id,
          reference: r.reference,
          supplier_name: r.supplier_name,
          purchase_date: r.purchase_date,
          total: r.total,
          items_count: r.items_count ?? 0,
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
        <h1 className="text-2xl font-semibold text-white">Purchases</h1>
        <Link
          href="/purchases/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          New purchase
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
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Supplier</th>
                  <th className="px-4 py-2">Lines</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 font-mono text-slate-300">
                      {p.reference ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-slate-300">{p.purchase_date}</td>
                    <td className="px-4 py-2 text-slate-200">{p.supplier_name}</td>
                    <td className="px-4 py-2">{p.items_count}</td>
                    <td className="px-4 py-2 text-white">
                      Rs. {Number(p.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/purchases/${p.id}`}
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
