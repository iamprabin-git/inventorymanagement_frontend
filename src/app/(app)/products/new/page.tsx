"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    unit_price: "",
    cost_price: "",
    stock_quantity: "0",
    low_stock_threshold: "1",
    is_active: true,
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await api("/products", {
        method: "POST",
        body: JSON.stringify({
          sku: form.sku,
          name: form.name,
          description: form.description || null,
          unit_price: Number(form.unit_price),
          cost_price: Number(form.cost_price),
          stock_quantity: Number(form.stock_quantity),
          low_stock_threshold: Number(form.low_stock_threshold),
          is_active: form.is_active,
        }),
      });
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/products" className="text-sm text-emerald-500 hover:underline">
          ← Products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">New product</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {[
          ["sku", "SKU"],
          ["name", "Name"],
          ["description", "Description"],
          ["unit_price", "Unit price"],
          ["cost_price", "Cost price"],
          ["stock_quantity", "Stock quantity"],
          ["low_stock_threshold", "Low stock threshold"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400">
              {label}
            </label>
            {key === "description" ? (
              <textarea
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                rows={3}
                value={form[key as keyof typeof form] as string}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
            ) : (
              <input
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form[key as keyof typeof form] as string}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                required={key !== "description"}
              />
            )}
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_active: e.target.checked }))
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
          {pending ? "Saving…" : "Create"}
        </button>
      </form>
    </div>
  );
}
