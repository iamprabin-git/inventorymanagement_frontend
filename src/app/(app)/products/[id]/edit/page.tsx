"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Save, ArrowLeft, Package, DollarSign, Database } from "lucide-react";

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
          ...product,
          unit_price: Number(product.unit_price),
          cost_price: Number(product.cost_price),
        }),
      });
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setPending(false);
    }
  }

  if (error && !product) return <div className="p-10 text-red-400 bg-red-400/10 rounded-lg border border-red-500/20">{error}</div>;
  if (!product) return <div className="flex h-96 items-center justify-center text-slate-500 animate-pulse font-bold tracking-widest uppercase text-xs">Accessing Records...</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800/60 pb-6">
        <Link href="/products" className="flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="h-3 w-3" /> Back to Inventory
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-white">Edit Record</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">System ID: <span className="text-emerald-500">#{id}</span></p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
        
        {/* Core Identity Section */}
        <section className="col-span-full space-y-4 rounded-xl border border-slate-800 bg-slate-900/20 p-6">
          <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Package className="h-3 w-3 text-emerald-500" /> Identity & Logistics
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="sku" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SKU Reference</label>
              <input
                id="sku"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={product.sku}
                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Name</label>
              <input
                id="name"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Technical Description</label>
            <textarea
              id="description"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              rows={3}
              value={product.description ?? ""}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/20 p-6">
          <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <DollarSign className="h-3 w-3 text-emerald-500" /> Financials
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="unit_price" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Unit Price (Rs. )</label>
              <input
                id="unit_price"
                type="number"
                step="0.01"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={product.unit_price}
                onChange={(e) => setProduct({ ...product, unit_price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cost_price" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cost Price (Rs. )</label>
              <input
                id="cost_price"
                type="number"
                step="0.01"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={product.cost_price}
                onChange={(e) => setProduct({ ...product, cost_price: e.target.value })}
                required
              />
            </div>
          </div>
        </section>

        {/* Inventory Section */}
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/20 p-6">
          <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Database className="h-3 w-3 text-emerald-500" /> Stock Control
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="stock_quantity" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Quantity</label>
              <input
                id="stock_quantity"
                type="number"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={product.stock_quantity}
                onChange={(e) => setProduct({ ...product, stock_quantity: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="low_stock_threshold" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Alert Threshold</label>
              <input
                id="low_stock_threshold"
                type="number"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={product.low_stock_threshold}
                onChange={(e) => setProduct({ ...product, low_stock_threshold: Number(e.target.value) })}
                required
              />
            </div>
          </div>
        </section>

        {/* Status and Action Section */}
        <div className="col-span-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
          <label htmlFor="is_active" className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/20 px-4 py-3 transition-colors hover:bg-slate-800/40">
            <input
              id="is_active"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/20"
              checked={product.is_active}
              onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Active Listing</span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-500 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <Save className="h-4 w-4" />
              {pending ? "Processing..." : "Commit Changes"}
            </button>
          </div>
        </div>

        {error && <p className="col-span-full text-center text-xs font-bold uppercase tracking-widest text-red-400">{error}</p>}
      </form>
    </div>
  );
}