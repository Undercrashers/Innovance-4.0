// app/api/admin/users/[roll]/approve/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/Registration";
import { verifyAdminToken } from "@/lib/adminAuth.js";
export async function PATCH(req:any, { params }:any) {
  try {
    // await params because in this runtime params can be a Promise
    const resolvedParams = await params;
    console.log("=== APPROVE ROUTE HIT ===");
    console.log("req.url:", req?.url);
    console.log("resolved params:", resolvedParams);

    // read admin_token cookie (NextRequest cookie API)
    const token = req?.cookies?.get?.("admin_token")?.value ?? null;
    const admin = token ? await verifyAdminToken(token) : null;

    if (!admin) {
      console.log("approve: unauthorized (no/invalid token)");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roll } = resolvedParams || {};
    if (!roll) {
      console.log("approve: missing roll param in params:", resolvedParams);
      return NextResponse.json({ error: "roll param required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ rollNumber: roll });
    if (!user) {
      console.log("approve: user not found for roll:", roll);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.isPaymentSuccessful = true;
    user.approvedBy = admin?.username || "admin";
    user.approvedAt = new Date();

    await user.save();

    console.log("approve: success for roll:", roll);
    return NextResponse.json(
      {
        message: "User approved",
        user: {
          rollNumber: user.rollNumber,
          isPaymentSuccessful: user.isPaymentSuccessful,
          approvedAt: user.approvedAt,
        },
      },
      { status: 200 }
    );
  } catch (err:any) {
    console.error("Admin approve error:", err);
    return NextResponse.json({ error: err.message || "Failed to approve" }, { status: 500 });
  }
}