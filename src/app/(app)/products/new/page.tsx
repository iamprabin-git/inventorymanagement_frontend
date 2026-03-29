"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, PlusCircle, Package, DollarSign, Database } from "lucide-react";

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
          ...form,
          description: form.description || null,
          unit_price: Number(form.unit_price),
          cost_price: Number(form.cost_price),
          stock_quantity: Number(form.stock_quantity),
          low_stock_threshold: Number(form.low_stock_threshold),
        }),
      });
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800/60 pb-6">
        <Link href="/products" className="flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Inventory
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-white">Register Product</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Initialize New Inventory Record</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
        
        {/* Identity Section */}
        <section className="col-span-full space-y-4 rounded-xl border border-slate-800 bg-slate-900/20 p-6">
          <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Package className="h-3 w-3 text-emerald-500" /> Identity Details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="sku" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SKU Reference</label>
              <input
                id="sku"
                placeholder="e.g. BIK-RECON-001"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Name</label>
              <input
                id="name"
                placeholder="Internal name"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Technical Description</label>
            <textarea
              id="description"
              placeholder="Detailed specifications..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </section>

        {/* Financials Section */}
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/20 p-6">
          <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <DollarSign className="h-3 w-3 text-emerald-500" /> Financials
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="unit_price" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Selling Price (Rs. )</label>
              <input
                id="unit_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={form.unit_price}
                onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cost_price" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cost Basis (Rs. )</label>
              <input
                id="cost_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={form.cost_price}
                onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                required
              />
            </div>
          </div>
        </section>

        {/* Inventory Management Section */}
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/20 p-6">
          <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Database className="h-3 w-3 text-emerald-500" /> Inventory
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="stock_quantity" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initial Stock</label>
              <input
                id="stock_quantity"
                type="number"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="low_stock_threshold" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Alert Threshold</label>
              <input
                id="low_stock_threshold"
                type="number"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={form.low_stock_threshold}
                onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })}
                required
              />
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="col-span-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
          <label htmlFor="is_active" className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/20 px-4 py-3 transition-colors hover:bg-slate-800/40">
            <input
              id="is_active"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/20"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Publish to Marketplace</span>
          </label>

          <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-10 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-500 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <PlusCircle className="h-4 w-4" />
            {pending ? "Creating..." : "Create Product"}
          </button>
        </div>

        {error && <p className="col-span-full text-center text-xs font-bold uppercase tracking-widest text-red-400">{error}</p>}
      </form>
    </div>
  );
}