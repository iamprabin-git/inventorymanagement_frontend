"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  unit_price: string;
  is_active: boolean;
};

type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number };
};

export default function ServicesPage() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Service[]>([]);
  const [meta, setMeta] = useState<Paginated<Service>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<Paginated<Service>>(`/services?page=${page}`);
      setRows(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm("Delete this service?")) return;
    await api(`/services/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">Services</h1>
        <Link
          href="/services/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Add service
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
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2 text-slate-200">{s.name}</td>
                    <td className="px-4 py-2 text-slate-400">
                      ${Number(s.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {s.is_active ? (
                        <span className="text-emerald-400">Yes</span>
                      ) : (
                        <span className="text-slate-600">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/services/${s.id}/edit`}
                        className="text-emerald-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(s.id)}
                        className="ml-3 text-red-400 hover:underline"
                      >
                        Delete
                      </button>
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
