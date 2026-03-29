"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Product = { id: number; name: string; sku: string };

type Line = { product_id: number; quantity: number; unit_cost: string };

export default function NewPurchasePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierName, setSupplierName] = useState("");
  const [reference, setReference] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { product_id: 0, quantity: 1, unit_cost: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<{ data: Product[] }>("/products?active_only=1&per_page=100").then(
      (res) => {
        setProducts(res.data);
        if (res.data[0]) {
          setLines((prev) =>
            prev.map((l, i) =>
              i === 0 && l.product_id === 0
                ? { ...l, product_id: res.data[0].id }
                : l
            )
          );
        }
      }
    );
  }, []);

  function addLine() {
    const pid = products[0]?.id ?? 0;
    setLines((prev) => [
      ...prev,
      { product_id: pid, quantity: 1, unit_cost: "" },
    ]);
  }

  function updateLine(i: number, patch: Partial<Line>) {
    setLines((prev) =>
      prev.map((line, j) => (j === i ? { ...line, ...patch } : line))
    );
  }

  function removeLine(i: number) {
    setLines((prev) => prev.filter((_, j) => j !== i));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const validLines = lines.filter(
      (l) => l.product_id > 0 && l.quantity >= 1 && l.unit_cost !== ""
    );
    if (validLines.length === 0) {
      setError("Add at least one line with product, quantity, and unit cost.");
      return;
    }
    setPending(true);
    try {
      await api("/purchases", {
        method: "POST",
        body: JSON.stringify({
          supplier_name: supplierName,
          reference: reference || null,
          purchase_date: purchaseDate,
          notes: notes || null,
          items: validLines.map((l) => ({
            product_id: l.product_id,
            quantity: l.quantity,
            unit_cost: Number(l.unit_cost),
          })),
        }),
      });
      router.push("/purchases");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/purchases" className="text-sm text-emerald-500 hover:underline">
          ← Purchases
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">New purchase</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Supplier name *
          </label>
          <input
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Reference
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Purchase date *
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">Notes</label>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Line items</span>
            <button
              type="button"
              onClick={addLine}
              className="text-sm text-emerald-500 hover:underline"
            >
              + Add line
            </button>
          </div>
          <div className="space-y-3 rounded-lg border border-slate-800 p-4">
            {lines.map((line, i) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-2 border-b border-slate-800 pb-3 last:border-0"
              >
                <div className="min-w-[200px] flex-1">
                  <label className="block text-xs text-slate-500">Product</label>
                  <select
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                    value={line.product_id}
                    onChange={(e) =>
                      updateLine(i, { product_id: Number(e.target.value) })
                    }
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} — {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500">Qty</label>
                  <input
                    type="number"
                    min={1}
                    className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(i, { quantity: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">Unit cost</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-28 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                    value={line.unit_cost}
                    onChange={(e) =>
                      updateLine(i, { unit_cost: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(i)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Create purchase"}
        </button>
      </form>
    </div>
  );
}
