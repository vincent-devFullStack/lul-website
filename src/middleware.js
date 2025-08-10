import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "token";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

const NOINDEX_PATHS = [
  "/admin",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Petits utilitaires
  const setSecurityHeaders = (res) => {
    res.headers.set("Permissions-Policy", "interest-cohort=()");
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    return res;
  };

  const getToken = () => request.cookies.get(COOKIE_NAME)?.value;

  // 1) Zones protégées: /admin/*
  if (pathname.startsWith("/admin")) {
    const token = getToken();
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      return setSecurityHeaders(NextResponse.next());
    } catch {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete(COOKIE_NAME);
      return setSecurityHeaders(res);
    }
  }

  // 2) /login: si déjà connecté → /accueil
  if (pathname === "/login") {
    const token = getToken();
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        if (payload?.exp > now) {
          return setSecurityHeaders(
            NextResponse.redirect(new URL("/accueil", request.url))
          );
        }
      } catch {
        const res = NextResponse.next();
        res.cookies.delete(COOKIE_NAME);
        return setSecurityHeaders(res);
      }
    }
  }

  // 3) SEO: noindex/noarchive sur certaines pages
  const isNoindex = NOINDEX_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isNoindex) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return setSecurityHeaders(res);
  }

  // 4) Par défaut
  return setSecurityHeaders(NextResponse.next());
}

// Exécuter le middleware aussi sur les pages marquées noindex
export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
