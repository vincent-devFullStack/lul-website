import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // ❌ On efface le cookie en le vidant + en mettant une expiration passée
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
