"use client";

import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type UserRow = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
};

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const { user: current } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<UserRow | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    api<UserRow[]>("/users")
      .then((rows) => {
        const u = rows.find((r) => String(r.id) === id);
        if (u) {
          setForm(u);
        } else {
          setError("User not found");
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setPending(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
      };
      if (password.trim()) {
        body.password = password;
      }
      await api(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
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
        You need administrator access to edit users.
      </p>
    );
  }

  if (error && !form) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!form) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link href="/users" className="text-sm text-emerald-500 hover:underline">
          ← Users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">Edit user</h1>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {(
          [
            ["name", "Name"],
            ["username", "Username"],
            ["email", "Email"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400">
              {label}
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              value={form[key]}
              onChange={(e) =>
                setForm((f) => f && { ...f, [key]: e.target.value })
              }
              required
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-slate-400">
            New password (leave blank to keep)
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400">Role</label>
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={form.role}
            onChange={(e) =>
              setForm((f) => f && { ...f, role: e.target.value })
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
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
