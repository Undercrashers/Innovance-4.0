"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [users, setUsers] = useState([]); // all users from server
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""); // search box
  const [selectedUser, setSelectedUser] = useState(null); // user object for detail modal
  const [approvingRoll, setApprovingRoll] = useState(null);

  // fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/users", { method: "GET", credentials: "include" });
      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load users");
      }

      // store users
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // search helper
  const normalizedQuery = query.trim().toLowerCase();
  const matchesSearch = (u) => {
    if (!normalizedQuery) return true;
    const rn = (u.rollNumber || "").toLowerCase();
    const fn = (u.firstName || "").toLowerCase();
    const ln = (u.lastName || "").toLowerCase();
    const mail = (u.kiitEmail || u.email || "").toLowerCase();
    return rn.includes(normalizedQuery) || fn.includes(normalizedQuery) || ln.includes(normalizedQuery) || mail.includes(normalizedQuery);
  };

  // Derived lists
  const pending = users
    .filter((u) => !u.isPaymentSuccessful && u.paymentScreenshot)
    .filter(matchesSearch)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const registeredNoPayment = users
    .filter((u) => !u.isPaymentSuccessful && !u.paymentScreenshot)
    .filter(matchesSearch)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const approved = users
    .filter((u) => u.isPaymentSuccessful)
    .filter(matchesSearch)
    .sort((a, b) => new Date(b.approvedAt || 0) - new Date(a.approvedAt || 0));

  // Approve API call
  const approveUser = async (roll) => {
    if (!roll) return;
    if (!confirm(`Approve payment for ${roll}?`)) return;

    setApprovingRoll(roll);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(roll)}/approve`, {
        method: "PATCH",
        credentials: "include",
      });

      const body = await res.json().catch(() => null);

      if (res.status === 401) {
        alert("Unauthorized — please login again.");
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        alert(body?.error || `Approve failed (${res.status})`);
        return;
      }

      // update local state: mark as approved (moves between lists automatically)
      setUsers((prev) =>
        prev.map((u) =>
          u.rollNumber === roll
            ? { ...u, isPaymentSuccessful: true, approvedAt: body?.user?.approvedAt ?? new Date().toISOString(), approvedBy: body?.user?.approvedBy ?? "admin" }
            : u
        )
      );

      if (selectedUser?.rollNumber === roll) {
        setSelectedUser((s) => (s ? { ...s, isPaymentSuccessful: true, approvedAt: body?.user?.approvedAt ?? new Date().toISOString() } : s));
      }

      alert("Approved");
    } catch (err) {
      console.error("approveUser error:", err);
      alert("Network error — see console");
    } finally {
      setApprovingRoll(null);
    }
  };

  // details modal helpers
  const openDetails = (user) => setSelectedUser(user);
  const closeDetails = () => setSelectedUser(null);

  // row component
  const UserRow = ({ u, showApprove }) => (
    <tr key={u.rollNumber} className="even:bg-white odd:bg-gray-50">
      <td className="p-3 text-sm text-gray-800 font-medium">{u.rollNumber}</td>
      <td className="p-3 text-sm text-gray-700">{u.firstName} {u.lastName}</td>
      <td className="p-3 text-sm text-gray-700">{u.branch} / {u.year}</td>
      <td className="p-3 text-sm">
        {u.paymentScreenshot ? (
          <button onClick={() => openDetails(u)} className="text-indigo-600 underline focus:outline-none focus:ring-2 focus:ring-indigo-300">
            View
          </button>
        ) : (
          <span className="text-gray-500">Not paid</span>
        )}
      </td>
      <td className="p-3">
        {u.isPaymentSuccessful ? (
          <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">Approved</span>
        ) : (
          <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-900 rounded">Pending</span>
        )}
      </td>
      <td className="p-3">
        {showApprove && !u.isPaymentSuccessful && u.paymentScreenshot ? (
          <button
            disabled={approvingRoll === u.rollNumber}
            onClick={() => approveUser(u.rollNumber)}
            className={`px-3 py-1 rounded text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-300 ${approvingRoll === u.rollNumber ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {approvingRoll === u.rollNumber ? "Approving..." : "Approve"}
          </button>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* main white card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <button onClick={fetchUsers} className="px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Refresh
              </button>
            </div>
          </div>

          {/* search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by roll, name or email..."
              className="flex-1 p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900 bg-white"
            />
            <div className="flex gap-2">
              <button onClick={() => { setQuery(""); fetchUsers(); }} className="px-4 py-2 bg-gray-100 rounded border hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">Reset</button>
            </div>
          </div>

          {/* Pending Approvals */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">Pending Approvals <span className="text-sm text-gray-600">({pending.length})</span></h2>
            </div>

            {loading ? (
              <div className="p-6 bg-white rounded shadow text-gray-600">Loading users...</div>
            ) : pending.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded text-gray-600">No pending approvals.</div>
            ) : (
              <div className="bg-white rounded overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-sm text-gray-700">Roll</th>
                      <th className="p-3 text-sm text-gray-700">Name</th>
                      <th className="p-3 text-sm text-gray-700">Branch/Year</th>
                      <th className="p-3 text-sm text-gray-700">Payment Screenshot</th>
                      <th className="p-3 text-sm text-gray-700">Status</th>
                      <th className="p-3 text-sm text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map(u => <UserRow key={u.rollNumber} u={u} showApprove={true} />)}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Registered but not paid */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">Registered (No Payment) <span className="text-sm text-gray-600">({registeredNoPayment.length})</span></h2>
            </div>

            {loading ? (
              <div className="p-6 bg-white rounded shadow text-gray-600">Loading users...</div>
            ) : registeredNoPayment.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded text-gray-600">No users waiting for payment.</div>
            ) : (
              <div className="bg-white rounded overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-sm text-gray-700">Roll</th>
                      <th className="p-3 text-sm text-gray-700">Name</th>
                      <th className="p-3 text-sm text-gray-700">Branch/Year</th>
                      <th className="p-3 text-sm text-gray-700">Payment Screenshot</th>
                      <th className="p-3 text-sm text-gray-700">Status</th>
                      <th className="p-3 text-sm text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredNoPayment.map(u => (
                      <tr key={u.rollNumber} className="even:bg-white odd:bg-gray-50">
                        <td className="p-3 text-sm text-gray-800 font-medium">{u.rollNumber}</td>
                        <td className="p-3 text-sm text-gray-700">{u.firstName} {u.lastName}</td>
                        <td className="p-3 text-sm text-gray-700">{u.branch} / {u.year}</td>
                        <td className="p-3 text-sm"><span className="text-gray-500">Not paid</span></td>
                        <td className="p-3"><span className="inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-900 rounded">Pending</span></td>
                        <td className="p-3"><span className="text-gray-500">—</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Approved Users */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">Approved Users <span className="text-sm text-gray-600">({approved.length})</span></h2>
            </div>

            {approved.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded text-gray-600">No approved users yet.</div>
            ) : (
              <div className="bg-white rounded overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-sm text-gray-700">Roll</th>
                      <th className="p-3 text-sm text-gray-700">Name</th>
                      <th className="p-3 text-sm text-gray-700">Branch/Year</th>
                      <th className="p-3 text-sm text-gray-700">Payment Screenshot</th>
                      <th className="p-3 text-sm text-gray-700">Approved At</th>
                      <th className="p-3 text-sm text-gray-700">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approved.map(u => (
                      <tr key={u.rollNumber} className="even:bg-white odd:bg-gray-50">
                        <td className="p-3 text-sm text-gray-800 font-medium">{u.rollNumber}</td>
                        <td className="p-3 text-sm text-gray-700">{u.firstName} {u.lastName}</td>
                        <td className="p-3 text-sm text-gray-700">{u.branch} / {u.year}</td>
                        <td className="p-3 text-sm">{u.paymentScreenshot ? <button onClick={() => openDetails(u)} className="text-indigo-600 underline">View</button> : "—"}</td>
                        <td className="p-3 text-sm text-gray-700">{u.approvedAt ? new Date(u.approvedAt).toLocaleString() : "-"}</td>
                        <td className="p-3 text-sm text-gray-700">{u.approvedBy || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Details modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className="fixed inset-0 bg-black/60" onClick={closeDetails} />
          <div className="relative z-10 bg-white w-full max-w-3xl mx-4 md:mx-0 rounded-lg shadow-2xl overflow-auto" style={{ maxHeight: "90vh" }}>
            <div className="p-5 border-b flex items-start justify-between">
              <h3 className="text-lg font-bold text-gray-900">User Details — {selectedUser.rollNumber}</h3>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 px-2 py-1 rounded">
                ✕
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm text-gray-800">
                <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                <p><strong>Roll:</strong> {selectedUser.rollNumber}</p>
                <p><strong>Email:</strong> {selectedUser.kiitEmail || selectedUser.email}</p>
                <p><strong>Branch / Year:</strong> {selectedUser.branch} / {selectedUser.year}</p>
                <p><strong>Phone:</strong> {selectedUser.phoneNumber || "-"}</p>
                <p><strong>WhatsApp:</strong> {selectedUser.whatsappNumber || "-"}</p>
                <p><strong>Registered At:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "-"}</p>
                <p><strong>Status:</strong> {selectedUser.isPaymentSuccessful ? `Approved at ${selectedUser.approvedAt ? new Date(selectedUser.approvedAt).toLocaleString() : "-"}` : "Pending"}</p>
              </div>

              <div>
                <p className="font-semibold mb-2 text-gray-800">Payment Screenshot</p>
                {selectedUser.paymentScreenshot ? (
                  <div className="flex items-center justify-center p-3 border rounded bg-gray-50">
                    <img src={selectedUser.paymentScreenshot} alt="screenshot" className="max-h-[60vh] max-w-full object-contain rounded" />
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded text-gray-600">No screenshot available</div>
                )}
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-3">
              {!selectedUser.isPaymentSuccessful && selectedUser.paymentScreenshot && (
                <button
                  onClick={() => { approveUser(selectedUser.rollNumber); }}
                  disabled={approvingRoll === selectedUser.rollNumber}
                  className={`px-4 py-2 rounded text-white ${approvingRoll === selectedUser.rollNumber ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-green-300`}
                >
                  {approvingRoll === selectedUser.rollNumber ? "Approving..." : "Approve"}
                </button>
              )}
              <button onClick={closeDetails} className="px-4 py-2 rounded border bg-white hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}