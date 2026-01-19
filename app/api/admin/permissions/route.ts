import { NextResponse } from "next/server";
import { verifyAdminToken, hasApprovePermissions } from "@/lib/adminAuth.js";

export async function GET(req: any) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = verifyAdminToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      canApprove: hasApprovePermissions(decoded)
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
