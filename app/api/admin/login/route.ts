import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/adminAuth.js";

export async function POST(req: any) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username & password required" },
        { status: 400 }
      );
    }

    // Compare with environment variables
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const admin = {
      username: process.env.ADMIN_USERNAME,
      role: process.env.ADMIN_ROLE,
    };

    const token = signAdminToken(admin);

    const res = NextResponse.json({
      message: "Login successful",
      admin,
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