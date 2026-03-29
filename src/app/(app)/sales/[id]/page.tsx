"use client";

import { SaleBillDocument } from "@/components/bill-print";
import { api } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type SaleDetail = {
  id: number;
  invoice_no: string;
  customer_name: string | null;
  customer_phone: string | null;
  sale_date: string;
  subtotal: string;
  tax_amount: string;
  total: string;
  notes: string | null;
  user?: { name: string };
  items: {
    id: number;
    quantity: number;
    unit_price: string;
    line_total: string;
    product?: { name: string; sku: string } | null;
    service?: { name: string } | null;
  }[];
};

export default function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<SaleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<SaleDetail>(`/sales/${id}`)
      .then(setSale)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id]);

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!sale) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link href="/sales" className="text-sm text-emerald-500 hover:underline">
          ← Sales
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
        <SaleBillDocument sale={sale} />
      </div>
    </div>
  );
}
