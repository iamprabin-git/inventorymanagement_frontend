"use client";

import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewUserPage() {
  const { user: current } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "staff" as "admin" | "staff",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await api("/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setPending(false);
    }
  }

  if (current?.role !== "admin") {
    return (
      <p className="text-slate-500">
        You need administrator access to create users.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/users" className="text-sm text-emerald-500 hover:underline">
          ← Users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">New user</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {(
          [
            ["name", "Name"],
            ["username", "Username"],
            ["email", "Email"],
            ["password", "Password"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400">
              {label}
            </label>
            <input
              type={key === "password" ? "password" : "text"}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              required
              autoComplete={key === "password" ? "new-password" : undefined}
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-slate-400">Role</label>
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                role: e.target.value as "admin" | "staff",
              }))
            }
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Create user"}
        </button>
      </form>
    </div>
  );
}
