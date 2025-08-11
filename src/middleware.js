import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "token";
const SECRET_STR = process.env.JWT_SECRET ?? "";
const JWT_SECRET = new TextEncoder().encode(SECRET_STR);

const NOINDEX_PREFIXES = [
  "/admin",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const isNoindexPath = (pathname) =>
  NOINDEX_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

function withHeaders(res, pathname) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Permissions-Policy", "browsing-topics=()");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-site");
  if (isNoindexPath(pathname)) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return res;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const getToken = () => request.cookies.get(COOKIE_NAME)?.value;

  // 1) /admin : requiert un JWT valide
  if (pathname.startsWith("/admin")) {
    const token = getToken();
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return withHeaders(NextResponse.redirect(url), pathname);
    }
    try {
      await jwtVerify(token, JWT_SECRET);
      return withHeaders(NextResponse.next(), pathname);
    } catch {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      const res = NextResponse.redirect(url);
      res.cookies.delete(COOKIE_NAME);
      return withHeaders(res, pathname);
    }
  }

  // 2) /login : si déjà connecté, redirige vers /accueil
  if (pathname === "/login") {
    const token = getToken();
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        if (payload?.exp && payload.exp > now) {
          const url = new URL("/accueil", request.url);
          return withHeaders(NextResponse.redirect(url), pathname);
        }
      } catch {
        const res = NextResponse.next();
        res.cookies.delete(COOKIE_NAME);
        return withHeaders(res, pathname);
      }
    }
  }

  // 3) Par défaut
  return withHeaders(NextResponse.next(), pathname);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/:path*", // couvre /reset-password/[token]
  ],
};
