"use client";

import { PurchaseBillDocument } from "@/components/bill-print";
import { api } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type PurchaseDetail = {
  id: number;
  reference: string | null;
  supplier_name: string;
  purchase_date: string;
  subtotal: string;
  total: string;
  notes: string | null;
  user?: { name: string };
  items: {
    id: number;
    quantity: number;
    unit_cost: string;
    line_total: string;
    product?: { name: string; sku: string };
  }[];
};

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<PurchaseDetail>(`/purchases/${id}`)
      .then(setPurchase)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id]);

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!purchase) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/purchases" className="text-sm text-emerald-500 hover:underline">
          ← Purchases
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Print bill
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm print:border-0 print:bg-white print:p-0 print:shadow-none">
        <PurchaseBillDocument purchase={purchase} />
      </div>
    </div>
  );
}
