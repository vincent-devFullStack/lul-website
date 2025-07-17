import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "DB not connected" }), {
      status: 500,
    });
  }
}
