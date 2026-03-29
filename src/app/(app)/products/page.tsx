"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TiPencil } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";

type Product = {
  id: number;
  sku: string;
  name: string;
  unit_price: string;
  cost_price: string;
  stock_quantity: number;
  is_active: boolean;
};

type Paginated<T> = {
  data: T[];
  links: { next: string | null; prev: string | null };
  meta: { current_page: number; last_page: number };
};

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Paginated<Product>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<Paginated<Product>>(`/products?page=${page}`);
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
    if (!confirm("Delete this product?")) return;
    await api(`/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <Link
          href="/products/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Add product
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
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Active</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 font-mono text-slate-300">
                      {p.sku}
                    </td>
                    <td className="px-4 py-2 text-slate-200">{p.name}</td>
                    <td className="px-4 py-2 text-slate-400">
                      Rs. {Number(p.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">{p.stock_quantity}</td>
                    <td className="px-4 py-2">
                      {p.is_active ? (
                        <span className="text-emerald-400">Yes</span>
                      ) : (
                        <span className="text-slate-600">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {" "}
                        {/* Added this wrapper */}
                        <Link
                          href={`/products/${p.id}/edit`}
                          className="text-emerald-500 hover:text-emerald-400 transition-colors"
                        >
                          <TiPencil size={20} />{" "}
                          {/* Added size for better visibility */}
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(p.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <RiDeleteBin6Line size={18} /> {/* Added size */}
                        </button>
                      </div>
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
