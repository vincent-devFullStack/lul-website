import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);

    return NextResponse.json(
      {
        authenticated: true,
        user: payload,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
