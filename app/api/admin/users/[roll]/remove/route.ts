// app/api/admin/users/[roll]/remove/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/lib/models/Registration";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ roll: string }> }
) {
  try {
    const token = (req as any).cookies?.get?.("admin_token")?.value ?? null;
    const admin = token ? await verifyAdminToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roll } = await context.params;
    if (!roll) {
      return NextResponse.json({ error: "roll param required" }, { status: 400 });
    }

    await connectDB();

    const user = await Registration.findOne({ rollNumber: roll });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ BLOCK: Cannot remove ORGANIZER role users
    if (user.role === "ORGANIZER") {
      return NextResponse.json(
        { error: "Cannot remove organizer role users from participants list" },
        { status: 403 }
      );
    }

    user.isPaid = false;
    user.approvedAt = undefined;
    await user.save();

    return NextResponse.json(
      {
        message: "User removed",
        user: {
          rollNumber: user.rollNumber,
          isPaid: user.isPaid,
          approvedAt: user.approvedAt,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Admin remove error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to remove" },
      { status: 500 }
    );
  }
}
