import { COMPANY_NAME } from "@/lib/company";

type SaleItem = {
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

type PurchaseItem = {
  id: number;
  quantity: number;
  unit_cost: string;
  line_total: string;
  product?: { name: string; sku: string };
};

export type PurchaseBillData = {
  id: number;
  reference: string | null;
  supplier_name: string;
  purchase_date: string;
  subtotal: string;
  total: string;
  notes: string | null;
  user?: { name: string };
  items: PurchaseItem[];
};

function money(n: string | number) {
  const v = typeof n === "string" ? Number(n) : n;
  return v.toFixed(2);
}

export function SaleBillDocument({ sale }: { sale: SaleBillData }) {
  return (
    <div className="bill-print-root space-y-6 text-slate-900 print:text-black">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-4 print:border-black">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white print:text-black">
            {COMPANY_NAME}
          </h2>
          <p className="mt-1 text-sm text-slate-400 print:text-neutral-600">
            Sales invoice
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-mono text-lg font-semibold text-emerald-400 print:text-black">
            {sale.invoice_no}
          </p>
          <p className="text-slate-400 print:text-neutral-600">Date: {sale.sale_date}</p>
        </div>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium text-slate-500 print:text-neutral-600">Bill to</p>
          <p className="text-slate-200 print:text-black">{sale.customer_name ?? "—"}</p>
          <p className="text-slate-400 print:text-neutral-700">
            {sale.customer_phone ?? ""}
          </p>
        </div>
        {sale.user && (
          <div className="sm:text-right">
            <p className="font-medium text-slate-500 print:text-neutral-600">Prepared by</p>
            <p className="text-slate-200 print:text-black">{sale.user.name}</p>
          </div>
        )}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-600 print:border-black">
            <th className="py-2 text-left font-medium">Description</th>
            <th className="w-16 py-2 text-right font-medium">Qty</th>
            <th className="w-24 py-2 text-right font-medium">Unit</th>
            <th className="w-28 py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((it) => (
            <tr key={it.id} className="border-b border-slate-800 print:border-neutral-300">
              <td className="py-2 text-slate-200 print:text-black">
                {it.product
                  ? `${it.product.sku} — ${it.product.name}`
                  : it.service?.name ?? "—"}
              </td>
              <td className="py-2 text-right text-slate-300 print:text-black">{it.quantity}</td>
              <td className="py-2 text-right text-slate-300 print:text-black">
                ${money(it.unit_price)}
              </td>
              <td className="py-2 text-right font-medium text-white print:text-black">
                ${money(it.line_total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto w-full max-w-xs space-y-1 text-sm">
        <div className="flex justify-between text-slate-400 print:text-neutral-700">
          <span>Subtotal</span>
          <span>${money(sale.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-400 print:text-neutral-700">
          <span>Tax</span>
          <span>${money(sale.tax_amount)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-600 pt-2 text-base font-semibold text-white print:border-black print:text-black">
          <span>Total</span>
          <span>${money(sale.total)}</span>
        </div>
      </div>

      {sale.notes && (
        <div className="text-sm text-slate-400 print:text-neutral-700">
          <span className="font-medium text-slate-500 print:text-neutral-600">Notes: </span>
          {sale.notes}
        </div>
      )}

      <p className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500 print:border-neutral-300 print:text-neutral-600">
        Thank you for your business.
      </p>
    </div>
  );
}

export function PurchaseBillDocument({ purchase }: { purchase: PurchaseBillData }) {
  return (
    <div className="bill-print-root space-y-6 text-slate-900 print:text-black">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-300 pb-4 print:border-black">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white print:text-black">
            {COMPANY_NAME}
          </h2>
          <p className="mt-1 text-sm text-slate-400 print:text-neutral-600">
            Purchase bill
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-lg font-semibold text-amber-400 print:text-black">
            #{purchase.id}
          </p>
          {purchase.reference && (
            <p className="font-mono text-slate-300 print:text-neutral-800">
              Ref: {purchase.reference}
            </p>
          )}
          <p className="text-slate-400 print:text-neutral-600">Date: {purchase.purchase_date}</p>
        </div>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium text-slate-500 print:text-neutral-600">Supplier</p>
          <p className="text-lg text-slate-200 print:text-black">{purchase.supplier_name}</p>
        </div>
        {purchase.user && (
          <div className="sm:text-right">
            <p className="font-medium text-slate-500 print:text-neutral-600">Recorded by</p>
            <p className="text-slate-200 print:text-black">{purchase.user.name}</p>
          </div>
        )}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-600 print:border-black">
            <th className="py-2 text-left font-medium">Product</th>
            <th className="w-16 py-2 text-right font-medium">Qty</th>
            <th className="w-24 py-2 text-right font-medium">Unit cost</th>
            <th className="w-28 py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {purchase.items.map((it) => (
            <tr key={it.id} className="border-b border-slate-800 print:border-neutral-300">
              <td className="py-2 text-slate-200 print:text-black">
                {it.product
                  ? `${it.product.sku} — ${it.product.name}`
                  : "—"}
              </td>
              <td className="py-2 text-right text-slate-300 print:text-black">{it.quantity}</td>
              <td className="py-2 text-right text-slate-300 print:text-black">
                ${money(it.unit_cost)}
              </td>
              <td className="py-2 text-right font-medium text-white print:text-black">
                ${money(it.line_total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto w-full max-w-xs space-y-1 text-sm">
        <div className="flex justify-between text-slate-400 print:text-neutral-700">
          <span>Subtotal</span>
          <span>${money(purchase.subtotal)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-600 pt-2 text-base font-semibold text-white print:border-black print:text-black">
          <span>Total</span>
          <span>${money(purchase.total)}</span>
        </div>
      </div>

      {purchase.notes && (
        <div className="text-sm text-slate-400 print:text-neutral-700">
          <span className="font-medium text-slate-500 print:text-neutral-600">Notes: </span>
          {purchase.notes}
        </div>
      )}

      <p className="border-t border-slate-800 pt-4 text-center text-xs text-slate-500 print:border-neutral-300 print:text-neutral-600">
        Internal purchase record — {COMPANY_NAME}
      </p>
    </div>
  );
}
