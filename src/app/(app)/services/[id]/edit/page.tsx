"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  description: string | null;
  unit_price: string;
  is_active: boolean;
};

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<Service>(`/services/${id}`)
      .then(setService)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!service) return;
    setPending(true);
    setError(null);
    try {
      await api(`/services/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: service.name,
          description: service.description,
          unit_price: Number(service.unit_price),
          is_active: service.is_active,
        }),
      });
      router.push("/services");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  if (error && !service) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!service) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/services" className="text-sm text-emerald-500 hover:underline">
          ← Services
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">Edit service</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400">Name</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={service.name}
            onChange={(e) =>
              setService((s) => s && { ...s, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            rows={3}
            value={service.description ?? ""}
            onChange={(e) =>
              setService((s) => s && { ...s, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Unit price
          </label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={service.unit_price}
            onChange={(e) =>
              setService((s) => s && { ...s, unit_price: e.target.value })
            }
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={service.is_active}
            onChange={(e) =>
              setService((s) => s && { ...s, is_active: e.target.checked })
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
