import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "secret123";

export function signAdminToken(admin) {
  return jwt.sign(
    {
      username: admin.username,
      role: admin.role
    },
    JWT_SECRET,
    { expiresIn: "6h" }
  );
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}