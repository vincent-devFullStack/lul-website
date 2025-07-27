import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Clé secrète pour vérifier les tokens
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ne protège que les routes admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET); // valide le token
      return NextResponse.next();
    } catch (error) {
      console.error("Token invalide :", error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next(); // autoriser les autres pages
}

// Active uniquement sur les routes ciblées
export const config = {
  matcher: ["/admin/:path*"],
};
