import { NextResponse } from "next/server";
import { ADMINS } from "@/lib/adminList.js";
import { signAdminToken } from "@/lib/adminAuth.js";

export async function POST(req:any) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username & password required" }, { status: 400 });
    }

    const admin = ADMINS.find(
      (a) => a.username === username && a.password === password
    );

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken(admin);

    const res = NextResponse.json({
      message: "Login successful",
      admin: { username: admin.username, role: admin.role },
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 6,
    });

    return res;
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}