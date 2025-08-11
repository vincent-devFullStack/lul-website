import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function GET(request) {
  const token = request.cookies.get("token")?.value; // works, no await needed

  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return NextResponse.json(
      { authenticated: true, user: { id: payload.id, email: payload.email } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }
}
