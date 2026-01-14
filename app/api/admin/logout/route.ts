// app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("admin_token", "", { path: "/", maxAge: 0 });
  return res;
}


import { verifyAdminToken } from "../../../../lib/adminAuth.js";

function getAdminFromRequest(req:any) {
  // req.cookies.get is available on NextRequest in App Router route handlers
  const cookie = req.cookies.get?.("admin_token")?.value ?? null;
  if (!cookie) return null;
  return verifyAdminToken(cookie);
}