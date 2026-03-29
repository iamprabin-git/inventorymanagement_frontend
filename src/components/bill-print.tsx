"use client";

import { COMPANY_NAME } from "@/lib/company";
import logo from "../../public/images/bless_logo.png";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

// 1. Fixed: Added back the missing Type Definitions
export type SaleItem = {
  id: number;
  quantity: number;
  unit_price: string;
  line_total: string;
  product?: { name: string; sku: string } | null;
  service?: { name: string } | null;
};

export type SaleBillData = {
  invoice_no: string;
  sale_date: string;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: string;
  tax_amount: string;
  total: string;
  notes: string | null;
  user?: { name: string };
  items: SaleItem[];
};

function money(n: string | number) {
  const v = typeof n === "string" ? Number(n) : n;
  return v.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function SaleBillDocument({ sale }: { sale: SaleBillData }) {
  return (
    <div className="bill-print-root mx-auto max-w-[800px] bg-white p-8 text-slate-900 shadow-sm print:max-w-full print:p-0 print:shadow-none">
      {/* Header Section */}
      <div className="flex justify-between border-b-2 border-slate-900 pb-6 items-center">
        {/* Left Side: Logo & Address */}
        <div className="flex items-center gap-6">
          <Image
            src={logo}
            alt="Bless Auto Logo"
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
          />

          {/* Center-aligned contact details column */}
          <div className="flex flex-col items-center border-l-2 border-slate-100 pl-6">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">
              {COMPANY_NAME}
            </h1>

            <div className="space-y-1 text-center" spellCheck="false">
              <p className="text-sm font-bold text-slate-600">
                Satdobato, Lalitpur
              </p>

              {/* Phone Numbers Row */}
              <div className="flex items-center justify-center gap-4 text-[13px] text-slate-500">
                <p className="flex items-center gap-1.5">
                  <FaPhoneAlt size={10} />
                  <span>+977-9851090167</span>
                </p>
                
              </div>

              {/* Email Row */}
              <div className="flex items-center justify-center gap-4 text-[13px] text-slate-500">
                <p className="flex items-center gap-1.5">
                <IoMail size={10}/>info@blessauto.com.np
              </p>
                
              </div>
              
            </div>
          </div>
        </div>

        {/* Right Side: Invoice Meta Data */}
        <div className="text-right flex flex-col items-end">
          <div className="mb-2 inline-block rounded bg-slate-900 px-2 py-1 text-[10px] font-bold tracking-widest text-white print:bg-transparent print:text-black print:border print:border-slate-200">
            PAN/VAT: 303668860
          </div>
          <h2 className="text-2xl font-black uppercase text-emerald-600 print:text-black leading-none mb-1">
            Tax Invoice
          </h2>
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-slate-800">
              No: #{sale.invoice_no}
            </p>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">
              Date: {sale.sale_date}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-12">
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 print:border-none print:bg-transparent">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Bill To
          </p>
          <p className="mt-1 text-base font-bold text-slate-900">
            {sale.customer_name ?? "Walking Customer"}
          </p>
          <p className="text-sm text-slate-600">{sale.customer_phone}</p>
        </div>
      </div>

      <div className="mt-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-slate-900 bg-slate-700 text-white print:bg-transparent print:text-black">
              <th className="py-3 px-2 text-left font-bold uppercase tracking-wider">
                Description
              </th>
              <th className="py-3 px-2 text-center font-bold uppercase tracking-wider">
                Qty
              </th>
              <th className="py-3 px-2 text-right font-bold uppercase tracking-wider">
                Rate
              </th>
              <th className="py-3 px-2 text-right font-bold uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* 2. Fixed: Added type definition to 'it' to resolve 'any' error */}
            {sale.items.map((it: SaleItem) => (
              <tr key={it.id} className="group">
                <td className="py-4 px-2">
                  <span className="font-bold text-slate-800">
                    {it.product ? it.product.name : it.service?.name}
                  </span>
                  {it.product && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      {it.product.sku}
                    </p>
                  )}
                </td>
                <td className="py-4 px-2 text-center text-slate-700">
                  {it.quantity}
                </td>
                <td className="py-4 px-2 text-right text-slate-700">
                  Rs. {money(it.unit_price)}
                </td>
                <td className="py-4 px-2 text-right font-bold text-slate-900">
                  Rs. {money(it.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-[400px] space-y-2 border-t-2 border-slate-900 pt-4">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>Rs. {money(sale.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>VAT (13%)</span>
            <span>Rs. {money(sale.tax_amount)}</span>
          </div>
          <div className="flex justify-between rounded bg-slate-700 p-2 text-lg font-black text-white print:bg-transparent print:text-black">
            <span>GRAND TOTAL</span>
            <span>Rs. {money(sale.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-12">
        <div className="text-[10px] text-slate-500 italic" spellCheck="false">
          <p className="font-bold uppercase not-italic text-slate-700 mb-1">
            Terms & Conditions:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Goods once sold are not returnable.</li>
            <li>
              Ownership transfer (Naamsari) must be initiated within 15 days.
            </li>
            <li>Subject to local jurisdiction.</li>
          </ul>
        </div>
        <div className="flex flex-col items-end justify-end space-y-10">
          <div className="flex w-full justify-between gap-8">
            <div className="flex-1 border-t border-slate-400 pt-2 text-center text-[10px] uppercase font-bold text-slate-600">
              Customer Signature
            </div>
            <div className="flex-1 border-t border-slate-400 pt-2 text-center text-[10px] uppercase font-bold text-slate-600">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 border-t border-slate-100 pt-4 text-center text-[10px] text-slate-400 print:text-neutral-500">
        This is a computer-generated invoice. No signature required unless
        specified.
      </footer>
    </div>
  );
}
