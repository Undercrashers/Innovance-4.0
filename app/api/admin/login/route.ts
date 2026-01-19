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

    let admin = null;

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      admin = {
        username: process.env.ADMIN_USERNAME,
        role: process.env.ADMIN_ROLE,
      };
    }

    // Check second admin credentials
    else if (
      username === process.env.ADMIN_USERNAME2 &&
      password === process.env.ADMIN_PASSWORD2
    ) {
      admin = {
        username: process.env.ADMIN_USERNAME2,
        role: process.env.ADMIN_ROLE2,
      };
    }

    // If neither matched
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Sign token with admin info
    const token = signAdminToken(admin);

    const res = NextResponse.json({
      message: "Login successful",
      admin,
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set to true in production with HTTPS
      path: "/",
      maxAge: 60 * 60 * 6, // 6 hours
    });

    return res;
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
