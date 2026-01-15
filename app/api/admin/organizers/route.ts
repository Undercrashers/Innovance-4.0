// app/api/admin/organizers/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/lib/models/Registration";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(req: Request) {
  try {
    const token = (req as any).cookies?.get?.("admin_token")?.value ?? null;
    const admin = token ? await verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const users = await Registration.find({})
      .select("fullName rollNumber email phone uniqueId university role isPaid approvedAt timestamp")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (err: any) {
    console.error("Admin get organizers error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
