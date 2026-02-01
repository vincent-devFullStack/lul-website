import { runHeartbeat } from "../../../../scripts/heartbeat.js";

export async function GET(request) {
  const token = process.env.HEARTBEAT_TOKEN;
  if (token) {
    const url = new URL(request.url);
    const provided =
      url.searchParams.get("token") || request.headers.get("x-heartbeat-token");
    if (provided !== token) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  await runHeartbeat();
  return new Response("ok");
}
