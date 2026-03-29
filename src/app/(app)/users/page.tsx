"use client";

import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";

type UserRow = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const { user: current } = useAuth();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<UserRow[]>("/users");
      setRows(res);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(u: UserRow) {
    if (!confirm(`Delete user ${u.username}?`)) return;
    await api(`/users/${u.id}`, { method: "DELETE" });
    load();
  }

  if (current?.role !== "admin") {
    return (
      <p className="text-slate-500">
        You need administrator access to manage users.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <Link
          href="/users/new"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Add user
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/50">
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 text-slate-200">{u.name}</td>
                  <td className="px-4 py-2 font-mono text-slate-400">
                    {u.username}
                  </td>
                  <td className="px-4 py-2 text-slate-400">{u.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        u.role === "admin"
                          ? "text-emerald-400"
                          : "text-slate-400"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/users/${u.id}/edit`}
                      className="text-emerald-500 hover:underline inline-flex items-center"
                      title="Edit User"
                      aria-label={`Edit user ${u.name}`}
                    >
                      <GrEdit size={15}/>
                    </Link>

                    {u.id !== current?.id && (
                      <button
                        type="button"
                        onClick={() => remove(u)}
                        className="ml-3 text-red-400 hover:underline inline-flex items-center"
                        title="Delete User"
                        aria-label={`Delete user ${u.name}`}
                      >
                        <RiDeleteBinLine size={15}/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
