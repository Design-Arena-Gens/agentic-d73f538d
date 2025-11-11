import { fetchGoldHistory } from "@/lib/gold";
import { generateIdeas } from "@/lib/analysis";
import { NextResponse } from "next/server";

export const revalidate = 60; // cache for 60s on the edge/server

export async function GET() {
  try {
    const points = await fetchGoldHistory("XAUUSD=X", "6mo", "1d");
    const ideas = generateIdeas(points);
    const last = points.at(-1);
    return NextResponse.json({
      symbol: "XAUUSD=X",
      last,
      count: ideas.length,
      ideas,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
