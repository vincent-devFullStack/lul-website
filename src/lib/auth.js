import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyJWT(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      isValid: false,
      user: null,
      response: NextResponse.json(
        { error: "Token d'authentification requis" },
        { status: 401 }
      ),
    };
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      isValid: true,
      user: payload,
      response: null,
    };
  } catch (error) {
    console.error("❌ Token invalide:", error.message);
    return {
      isValid: false,
      user: null,
      response: NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 401 }
      ),
    };
  }
}

export function withAuth(handler) {
  return async function (request, context) {
    const { isValid, user, response } = await verifyJWT(request);

    if (!isValid) {
      return response;
    }

    return handler(request, { ...context, user });
  };
}
