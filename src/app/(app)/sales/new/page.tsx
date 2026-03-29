"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Product = { id: number; name: string; sku: string };
type Service = { id: number; name: string };

type Line = { type: "product" | "service"; id: number; quantity: number };

export default function NewSalePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [saleDate, setSaleDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [taxAmount, setTaxAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([
    { type: "product", id: 0, quantity: 1 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ data: Product[] }>("/products?active_only=1&per_page=100"),
      api<{ data: Service[] }>("/services?active_only=1&per_page=100"),
    ]).then(([p, s]) => {
      setProducts(p.data);
      setServices(s.data);
      setLines((prev) =>
        prev.map((l, i) =>
          i === 0 && l.id === 0 && p.data[0]
            ? { ...l, id: p.data[0].id }
            : l
        )
      );
    });
  }, []);

  function addLine() {
    const firstP = products[0]?.id ?? 0;
    setLines((prev) => [...prev, { type: "product", id: firstP, quantity: 1 }]);
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
    const validLines = lines.filter((l) => l.id > 0 && l.quantity >= 1);
    if (validLines.length === 0) {
      setError("Add at least one line with a product or service selected.");
      return;
    }
    setPending(true);
    try {
      await api("/sales", {
        method: "POST",
        body: JSON.stringify({
          customer_name: customerName || null,
          customer_phone: customerPhone || null,
          sale_date: saleDate,
          tax_amount: Number(taxAmount) || 0,
          notes: notes || null,
          items: validLines.map((l) => ({
            type: l.type,
            id: l.id,
            quantity: l.quantity,
          })),
        }),
      });
      router.push("/sales");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/sales" className="text-sm text-emerald-500 hover:underline">
          ← Sales
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">New sale</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Customer name
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Phone
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Sale date
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Tax amount
            </label>
            <input
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={taxAmount}
              onChange={(e) => setTaxAmount(e.target.value)}
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
                <div>
                  <label className="block text-xs text-slate-500">Type</label>
                  <select
                    className="rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                    value={line.type}
                    onChange={(e) => {
                      const t = e.target.value as "product" | "service";
                      const nextId =
                        t === "product"
                          ? products[0]?.id ?? 0
                          : services[0]?.id ?? 0;
                      updateLine(i, { type: t, id: nextId });
                    }}
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div className="min-w-[180px] flex-1">
                  <label className="block text-xs text-slate-500">Item</label>
                  <select
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                    value={line.id}
                    onChange={(e) =>
                      updateLine(i, { id: Number(e.target.value) })
                    }
                  >
                    {(line.type === "product" ? products : services).map(
                      (x) => (
                        <option key={x.id} value={x.id}>
                          {"sku" in x ? `${x.sku} — ${x.name}` : x.name}
                        </option>
                      )
                    )}
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
          {pending ? "Saving…" : "Create sale"}
        </button>
      </form>
    </div>
  );
}
