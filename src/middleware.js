import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Routes protégées
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.log("🚫 Accès admin sans token, redirection vers /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      console.log("✅ Token valide pour admin");
      return NextResponse.next();
    } catch (error) {
      console.log("❌ Token invalide pour admin, nettoyage et redirection");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // ✅ Redirection si déjà connecté et sur page login
  if (pathname === "/login") {
    const token = request.cookies.get("token")?.value;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp > now) {
          return NextResponse.redirect(new URL("/accueil", request.url));
        }
      } catch (error) {
        console.log("❌ Token invalide sur /login, nettoyage");
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
  }

  const response = NextResponse.next();
  response.headers.set("Permissions-Policy", "interest-cohort=()");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
