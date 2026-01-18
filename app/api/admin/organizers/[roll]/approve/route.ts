// app/api/admin/organizers/[roll]/approve/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/lib/models/Registration";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function PATCH(req: Request, context: { params: Promise<{ roll: string }> }) {
  try {
    const { roll } = await context.params;
    if (!roll) {
      return NextResponse.json({ error: "roll param required" }, { status: 400 });
    }

    const token = (req as any).cookies?.get?.("admin_token")?.value ?? null;
    const admin = token ? await verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await Registration.findOne({ rollNumber: roll });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.isPaid = true;
    user.role = "ORGANIZER";
    user.approvedAt = new Date();
    await user.save();

    return NextResponse.json(
      {
        message: "Organizer approved",
        user: {
          rollNumber: user.rollNumber,
          isPaid: user.isPaid,
          role: user.role,
          approvedAt: user.approvedAt,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Admin organizer approve error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to approve organizer" },
      { status: 500 }
    );
  }
}
