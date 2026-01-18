// app/admin/dashboard/page.tsx - ULTRA FAST TOASTS
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Registration = {
  fullName: string;
  rollNumber: string;
  email: string;
  phone: string;
  university: string;
  isPaid: boolean;
  uniqueId: string;
  approvedAt?: string;
  timestamp?: string;
};

type Toast = {
  id: string;
  message: string;
  type: "success" | "error";
  progress: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [confirmAction, setConfirmAction] = useState<
    | null
    | {
        type: "approve" | "remove";
        user: Registration;
      }
  >(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ⚡ ULTRA-FAST TOASTS (1.5s total, 100ms animation)
  const addToast = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, progress: 0 };
    setToasts((prev) => [...prev, toast]);

    // Super fast progress (1.5s total)
    const interval = setInterval(() => {
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, progress: Math.min(t.progress + 6.67, 100) } : t
        )
      );
    }, 50); // 50ms updates = buttery smooth

    setTimeout(() => {
      clearInterval(interval);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1500); 
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json().catch(() => null);
 console.log("🔥 RAW API DATA:", data.users?.[0]);
    console.log("🔥 uniqueId exists?", data.users?.[0]?.uniqueId);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load users");
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err: any) {
      console.error("fetchUsers error:", err);
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const matchesSearch = (u: Registration) => {
    if (!normalizedQuery) return true;
    return (
      (u.rollNumber || "").toLowerCase().includes(normalizedQuery) ||
      (u.fullName || "").toLowerCase().includes(normalizedQuery) ||
      (u.email || "").toLowerCase().includes(normalizedQuery)
    );
  };

  const participants = users
    .filter((u) => !u.isPaid)
    .filter(matchesSearch)
    .sort(
      (a, b) =>
        new Date(b.timestamp || 0).getTime() -
        new Date(a.timestamp || 0).getTime()
    );

  const approved = users
    .filter((u) => u.isPaid)
    .filter(matchesSearch)
    .sort(
      (a, b) =>
        new Date(b.approvedAt || 0).getTime() -
        new Date(a.approvedAt || 0).getTime()
    );

  const runAction = async () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;

    setActionLoading(true);
    try {
      const url =
        type === "approve"
          ? `/api/admin/users/${encodeURIComponent(user.rollNumber)}/approve`
          : `/api/admin/users/${encodeURIComponent(user.rollNumber)}/remove`;

      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
      });
      const body = await res.json().catch(() => null);

      if (res.status === 401) {
        addToast("Unauthorized — please login again.", "error");
        router.push("/admin/login");
        return;
      }
      
      if (!res.ok) {
        if (res.status === 403) {
          addToast("Cannot remove organizer.", "error");
          return;
        }
        addToast(body?.error || `${type} failed`, "error");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.rollNumber === user.rollNumber
            ? {
                ...u,
                isPaid: type === "approve",
                approvedAt:
                  type === "approve"
                    ? body?.user?.approvedAt ?? new Date().toISOString()
                    : undefined,
              }
            : u
        )
      );
      
      addToast(
        `${type === "approve" ? "Approved Successfully" : "Removed Successfully"}!`,
        "success"
      );
      setConfirmAction(null);
    } catch (err) {
      console.error(`${confirmAction.type} error:`, err);
      addToast("Network error", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const openApproveModal = (user: Registration) =>
    setConfirmAction({ type: "approve", user });
  const openRemoveModal = (user: Registration) =>
    setConfirmAction({ type: "remove", user });
  const closeModal = () => {
    if (!actionLoading) setConfirmAction(null);
  };

  const ParticipantRow = ({ u }: { u: Registration }) => (
    <tr className="even:bg-white odd:bg-gray-50">
      <td className="p-3 text-sm text-gray-800 font-medium">{u.fullName}</td>
      <td className="p-3 text-sm text-gray-700">{u.rollNumber}</td>
      <td className="p-3 text-sm text-gray-700">{u.email}</td>
      <td className="p-3 text-sm text-gray-700">{u.phone}</td>
      <td className="p-3 text-sm text-gray-700">{u.uniqueId}</td>
      <td className="p-3">
        <button
          onClick={() => openApproveModal(u)}
          className="px-4 py-2 text-sm rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-300 transition-all duration-200 w-full sm:w-auto min-h-[40px] sm:min-h-auto"
        >
          Approve
        </button>
      </td>
    </tr>
  );

  const ApprovedRow = ({ u }: { u: Registration }) => (
    <tr className="even:bg-white odd:bg-gray-50">
      <td className="p-3 text-sm text-gray-800 font-medium">{u.fullName}</td>
      <td className="p-3 text-sm text-gray-700">{u.email}</td>
      <td className="p-3 text-sm text-gray-700">{u.phone}</td>
      <td className="p-3 text-sm text-gray-700">{u.university}</td>
      <td className="p-3 text-sm text-gray-700">
        {u.approvedAt ? new Date(u.approvedAt).toLocaleString() : "-"}
      </td>
      <td className="p-3">
        <button
          onClick={() => openRemoveModal(u)}
          className="px-4 py-2 text-sm rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-300 transition-all duration-200 w-full sm:w-auto min-h-[40px] sm:min-h-auto"
        >
          Remove
        </button>
      </td>
    </tr>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center lg:justify-end">
                <button
                  onClick={fetchUsers}
                  className="flex-1 lg:flex-none px-6 py-3 text-sm lg:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all duration-200 min-h-[44px] font-semibold"
                >
                  Refresh
                </button>
                <button
                  onClick={() => router.push('/admin/organizers')}
                  className="flex-1 lg:flex-none px-6 py-3 text-sm lg:text-base bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300/50 transition-all duration-200 min-h-[44px] font-semibold"
                >
                  Organizer Approvals
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by roll, name or email..."
                  className="flex-1 p-4 text-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300/50 focus:border-indigo-300 bg-white/80 backdrop-blur-sm transition-all duration-200 min-h-[48px]"
                />
                <button
                  onClick={() => {
                    setQuery("");
                    fetchUsers();
                  }}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 border rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-300/50 transition-all duration-200 text-sm font-semibold min-h-[48px] w-full sm:w-auto"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Participants Section - TABLES UNCHANGED */}
            <section className="mb-8 lg:mb-12">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                  Participants <span className="text-sm lg:text-base text-gray-600">({participants.length})</span>
                </h2>
              </div>
              {loading ? (
                <div className="p-8 sm:p-12 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg text-gray-600 text-center text-lg animate-pulse">
                  Loading users...
                </div>
              ) : participants.length === 0 ? (
                <div className="p-8 sm:p-12 bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-sm text-gray-600 text-center text-lg">
                  No participants.
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-x-auto shadow-lg border border-gray-200/50">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-100/80 backdrop-blur-sm">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-gray-700">Name</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Roll</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Email</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Phone Number</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">KID</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((u) => (
                        <ParticipantRow key={u.rollNumber} u={u} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Approved Users Section - TABLES UNCHANGED */}
            <section>
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                  Approved Users <span className="text-sm lg:text-base text-gray-600">({approved.length})</span>
                </h2>
              </div>
              {approved.length === 0 ? (
                <div className="p-8 sm:p-12 bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-sm text-gray-600 text-center text-lg">
                  No approved users yet.
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-xl overflow-x-auto shadow-lg border border-gray-200/50">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-100/80 backdrop-blur-sm">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-gray-700">Name</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Email</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Phone Number</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Hostel</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Approved At</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approved.map((u) => (
                        <ApprovedRow key={u.rollNumber} u={u} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmAction && (
          <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 animate-in slide-in-from-bottom duration-200">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-200"
              onClick={closeModal}
            />
            <div className="relative z-10 w-full max-w-sm mx-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 sm:p-8 transform scale-95 animate-pop-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {confirmAction.type === "approve" ? "✅ Approve" : "❌ Remove"}
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border">
                <p className="font-semibold text-gray-900 text-lg">{confirmAction.user.fullName}</p>
                <p className="text-sm text-gray-600 font-mono">{confirmAction.user.rollNumber}</p>
              </div>
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                Confirm {confirmAction.type === "approve" ? "approve" : "remove"} this participant?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3.5 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300/50 shadow-sm text-sm font-semibold transition-all duration-200 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={runAction}
                  disabled={actionLoading}
                  className={`flex-1 px-6 py-3.5 rounded-xl text-white font-semibold shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 min-h-[44px] transform hover:scale-[1.02] active:scale-[0.98] ${
                    confirmAction.type === "approve"
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  } ${actionLoading ? "opacity-70 cursor-not-allowed scale-100" : ""}`}
                >
                  {actionLoading
                    ? confirmAction.type === "approve"
                      ? "Approving..."
                      : "Removing..."
                    : confirmAction.type === "approve"
                    ? "Confirm Approve"
                    : "Confirm Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ⚡ ULTRA-FAST ANIMATED TOASTS (100ms entry, 1.5s total) */}
      <div className="fixed top-6 right-4 sm:right-6 z-[100] flex flex-col gap-2 max-w-sm w-11/12 sm:w-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`group relative p-3.5 sm:p-4 rounded-xl shadow-2xl backdrop-blur-md border overflow-hidden transform scale-95 animate-slide-in-ultra duration-100 ease-out ${
              toast.type === "success"
                ? "bg-gradient-to-br from-green-500/95 to-green-600/95 text-white border-green-400/50"
                : "bg-gradient-to-br from-red-500/95 to-red-600/95 text-white border-red-400/50"
            }`}
          >
            {/* Fast pulse dot */}
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white/90 rounded-full animate-ping-fast" />
            
            {/* Compact content */}
            <div className="flex items-center gap-2.5 pr-10 relative z-10">
              <div className="w-2 h-2 bg-white/95 rounded-full animate-pulse" />
              <span className="font-bold text-sm leading-tight tracking-wide">{toast.message}</span>
            </div>
            
            {/* ⚡ SUPER FAST PROGRESS BAR */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-white/95 to-white/60 shadow-lg rounded-full transition-all duration-50 ease-linear"
                style={{ width: `${toast.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in-ultra {
          from {
            transform: translateX(110%) scale(0.92);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes slide-in-from-bottom {
          from {
            transform: translateY(30px) scale(0.92);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes pop-in {
          0% { transform: scale(0.75); opacity: 0; }
          60% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes ping-fast {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .animate-slide-in-ultra {
          animation: slide-in-ultra 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .slide-in-from-bottom { animation: slide-in-from-bottom 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-pop-in { animation: pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-ping-fast { animation: ping-fast 0.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-in { animation-fill-mode: both; }
      `}</style>
    </>
  );
}
