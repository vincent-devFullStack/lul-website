import { getRoomBySlug } from "@/lib/db";

export async function GET(req, { params }) {
  const { slug } = params;
  const room = await getRoomBySlug(slug);

  if (!room) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(room), { status: 200 });
}
