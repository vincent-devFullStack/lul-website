import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
