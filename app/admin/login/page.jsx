"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
        credentials: "include"
      });

      const body = await res.json().catch(()=>null);

      if (!res.ok) {
        setError(body?.error || `Login failed (${res.status})`);
        setLoading(false);
        return;
      }

      // success
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Check console.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Admin Login</h1>
            <p className="text-sm text-gray-600 mb-4">
              Enter your admin username and password to continue.
            </p>

            {error && (
              <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Username
                </label>
                <input
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900 bg-white"
                  placeholder="e.g. ADMIN"
                  aria-label="Admin username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900 bg-white"
                  placeholder="Your password"
                  aria-label="Admin password"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    loading ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>

            <div className="mt-4 text-sm text-gray-500">
              <strong>Note:</strong> Use your admin username & password. If you don't have credentials, contact the system owner.
            </div>
          </div>

          <div className="bg-gray-50 p-4 text-xs text-gray-500 text-center">
            <span>Admins are hard-coded for dev. Do not use in production.</span>
          </div>
        </div>
      </div>
    </div>
  );
}