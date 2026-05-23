import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type");

  if (!query && !type) {
    return NextResponse.json({ error: "Missing query or type parameter" }, { status: 400 });
  }

  // TODO: Implement actual PromQL mapping for types if needed
  // Example: type=total_users -> query=ludora_users_total
  let promql = query;
  // if (type === "total_users") promql = "ludora_users_total";
  if (type === "active_sessions") promql = "sessions_created_last_24_hours";
  if (type === "pending_invitations") promql = "total_pending_invitations";
  // if (type === "total_terrains") promql = "ludora_terrains_total";

  const prometheusUrl = process.env.PROMETHEUS_URL || "http://localhost:9090";

  try {
    const response = await fetch(
      `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(promql || "")}`,
      {
        headers: {
          // Add auth headers if needed
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Prometheus responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Prometheus Proxy Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
