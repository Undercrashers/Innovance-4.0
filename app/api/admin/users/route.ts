// app/api/admin/users/[roll]/approve/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/Registration";
import { verifyAdminToken } from "@/lib/adminAuth.js";

export async function GET(req:any) {
  try {
    const token = req.cookies.get?.("admin_token")?.value ?? null;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const users = await User.find({})
      .select("rollNumber firstName lastName kiitEmail branch year paymentScreenshot isPaymentSuccessful createdAt approvedBy approvedAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (err:any) {
    console.error("Admin get users error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
  }
}