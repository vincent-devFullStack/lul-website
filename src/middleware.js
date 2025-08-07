import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");

  // ✅ Redirection apex → www
  if (host === "iconodule.fr") {
    return NextResponse.redirect(
      new URL(`https://www.iconodule.fr${request.nextUrl.pathname}`),
      308
    );
  }

  // 🔒 Protection des routes /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("Token invalide :", error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Active les routes protégées ET la racine
export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
