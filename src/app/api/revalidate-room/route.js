// app/api/revalidate-room/route.js
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { withAuth } from "@/lib/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

export const POST = withAuth(async (req) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalide" },
      { status: 400, headers: noStore }
    );
  }

  const slug = String(body?.slug || "").trim();
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug" },
      { status: 400, headers: noStore }
    );
  }

  try {
    revalidateTag(`room:${slug}`);
    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch (e) {
    console.error("Revalidate error:", e);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500, headers: noStore }
    );
  }
});
