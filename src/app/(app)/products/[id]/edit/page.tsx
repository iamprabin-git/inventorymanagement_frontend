"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Product = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  unit_price: string;
  cost_price: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<Product>(`/products/${id}`)
      .then(setProduct)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!product) return;
    setPending(true);
    setError(null);
    try {
      await api(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          sku: product.sku,
          name: product.name,
          description: product.description,
          unit_price: Number(product.unit_price),
          cost_price: Number(product.cost_price),
          stock_quantity: product.stock_quantity,
          low_stock_threshold: product.low_stock_threshold,
          is_active: product.is_active,
        }),
      });
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  if (error && !product) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!product) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/products" className="text-sm text-emerald-500 hover:underline">
          ← Products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">Edit product</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {(
          [
            ["sku", "SKU"],
            ["name", "Name"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400">
              {label}
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={String(product[key])}
              onChange={(e) =>
                setProduct((p) => p && { ...p, [key]: e.target.value })
              }
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            rows={3}
            value={product.description ?? ""}
            onChange={(e) =>
              setProduct((p) => p && { ...p, description: e.target.value })
            }
          />
        </div>
        {(
          [
            ["unit_price", "Unit price"],
            ["cost_price", "Cost price"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400">
              {label}
            </label>
            <input
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={product[key]}
              onChange={(e) =>
                setProduct((p) => p && { ...p, [key]: e.target.value })
              }
              required
            />
          </div>
        ))}
        {(
          [
            ["stock_quantity", "Stock quantity"],
            ["low_stock_threshold", "Low stock threshold"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400">
              {label}
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={product[key]}
              onChange={(e) =>
                setProduct((p) =>
                  p ? { ...p, [key]: Number(e.target.value) } : p
                )
              }
              required
            />
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={product.is_active}
            onChange={(e) =>
              setProduct((p) => p && { ...p, is_active: e.target.checked })
            }
          />
          Active
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
