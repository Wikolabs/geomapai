import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In docker-compose: BACKEND_URL=http://geomapai-backend:8000
// In local dev (next dev outside compose): falls back to localhost
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: Request) {
  let body: { area?: string; useCase?: string; constraints?: string; lang?: "fr" | "en" } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const area = typeof body.area === "string" ? body.area.trim() : "";
  const useCase = typeof body.useCase === "string" ? body.useCase.trim() : "logement";
  const constraints = typeof body.constraints === "string" ? body.constraints.trim() : "";
  const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

  if (!area) {
    return NextResponse.json(
      { error: lang === "fr" ? "Entrez une zone d'etude (ville, parcelle, coordonnees)." : "Enter a study area (city, parcel, coordinates)." },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area, use_case: useCase, constraints, lang }),
      cache: "no-store",
    });
    const j = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: j.detail || "backend_error" }, { status: r.status });
    }
    return NextResponse.json({
      brief: j.brief,
      model: j.model,
      generatedAt: j.generated_at,
      staticMode: Boolean(j.static_mode),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ error: `backend_unreachable: ${msg}` }, { status: 502 });
  }
}
