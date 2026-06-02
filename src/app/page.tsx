"use client";
import { useState } from "react";

const PRODUCT = "GeoMapAI";

const PAL = {
  bg: "#FFFAF0",
  bg2: "#FFEDD5",
  surface: "rgba(0,0,0,0.035)",
  surfaceHover: "rgba(0,0,0,0.06)",
  border: "rgba(0,0,0,0.08)",
  txt1: "#1F1408",
  txt2: "#5A4528",
  txt3: "#9A8A6A",
  accent: "#C2410C",
  accentSoft: "rgba(194,65,12,0.10)",
  accentBorder: "rgba(194,65,12,0.30)",
  accentGlow: "rgba(194,65,12,0.15)",
  navBg: "rgba(255,250,240,0.85)",
};

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [area, setArea] = useState("");
  const [useCase, setUseCase] = useState("logement");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " — analyse geospatiale + selection de site",
    desc: "Saisissez une zone d'etude (ville, parcelle, coordonnees) et l'usage envisage. L'agent IA produit un rapport d'opportunite SIG. Aucune connexion reelle a un service de cartographie — c'est un POC qui montre la logique de production.",
    inputLabel: "Votre zone d'etude",
    plArea: "Zone (ex: Nantes 44, parcelle AB-123, 47.218,-1.553)",
    useCaseLabel: "Usage envisage",
    plConstraints: "Contraintes connues (ex: zone Natura 2000, PPRT, ABF)",
    generate: "Analyser la zone", generating: "Analyse en cours...",
    briefTitle: "Rapport SIG", emptyHint: "Le rapport s'affiche ici une fois genere.",
    btnArcgis: "Exporter vers ArcGIS", btnQgis: "Telecharger QGIS .qgz", btnPlanner: "Partager avec Urbaniste",
    arcgisMock: "Export ArcGIS Online declenche (mode demo, pas de connexion reelle ArcGIS)",
    qgisMock: "Telechargement QGIS .qgz prepare (mode demo, pas de fichier reel)",
    plannerMock: "Lien partage avec l'equipe urbanisme (mode demo, pas d'envoi reel)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC — aucune connexion reelle a ArcGIS, QGIS, IGN, BRGM, cadastre. L'IA imagine les donnees pour la demonstration.",
    uses: [
      { v: "logement", l: "Logement collectif" },
      { v: "commerce", l: "Commerce / Retail" },
      { v: "industrie", l: "Industrie / Logistique" },
      { v: "equipement", l: "Equipement public" },
      { v: "mixte", l: "Mixte" },
    ],
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " — geospatial analysis + site selection",
    desc: "Enter a study area (city, parcel, coordinates) and intended use. The AI agent produces a GIS opportunity report. No real mapping service connected — this is a POC showing the production logic.",
    inputLabel: "Your study area",
    plArea: "Area (e.g. Nantes 44, parcel AB-123, 47.218,-1.553)",
    useCaseLabel: "Intended use",
    plConstraints: "Known constraints (e.g. Natura 2000, PPRT, heritage)",
    generate: "Analyze area", generating: "Analyzing...",
    briefTitle: "GIS report", emptyHint: "The report will appear here once generated.",
    btnArcgis: "Export to ArcGIS", btnQgis: "Download QGIS .qgz", btnPlanner: "Share with planner",
    arcgisMock: "ArcGIS Online export triggered (demo mode, no real ArcGIS connection)",
    qgisMock: "QGIS .qgz download prepared (demo mode, no real file)",
    plannerMock: "Link shared with planning team (demo mode, no real send)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC — no real connection to ArcGIS, QGIS, IGN, BRGM, cadastre. The AI imagines data for demonstration.",
    uses: [
      { v: "housing", l: "Collective housing" },
      { v: "retail", l: "Retail / Commerce" },
      { v: "industry", l: "Industry / Logistics" },
      { v: "public", l: "Public facility" },
      { v: "mixed", l: "Mixed-use" },
    ],
  };

  async function generate() {
    setError(""); setBrief(""); setModel(""); setStaticMode(false);
    if (!area.trim()) {
      setError(lang === "fr" ? "Entrez une zone d'etude." : "Enter a study area.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, useCase, constraints, lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setBrief(j.mockBrief || "");
        setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setBrief(j.brief || "");
        setModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #FFFFFF; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: ${PAL.surface}; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← {t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: PAL.surface }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#FFFFFF" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} · <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
          <section style={{ background: PAL.surface, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 14px" }}>{t.inputLabel}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <input className="wk-input" value={area} onChange={(e) => setArea(e.target.value)} placeholder={t.plArea} />
              <label style={{ color: PAL.txt3, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginTop: 4 }}>{t.useCaseLabel}</label>
              <select className="wk-input" value={useCase} onChange={(e) => setUseCase(e.target.value)}>
                {t.uses.map((u) => <option key={u.v} value={u.v}>{u.l}</option>)}
              </select>
              <input className="wk-input" value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder={t.plConstraints} />
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? `⏳ ${t.generating}` : `🗺️ ${t.generate}`}
            </button>
            {error && <div style={{ marginTop: 12, color: "#B91C1C", fontSize: 13, padding: "8px 12px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: brief ? "#16A34A" : PAL.txt3 }} />
                {t.briefTitle}
              </h2>
              {model && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {model}</span>}
            </div>

            {!brief ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>
                {t.emptyHint}
              </div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} />
            )}

            {brief && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.arcgisMock)}>🌐 {t.btnArcgis}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.qgisMock)}>📥 {t.btnQgis}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.plannerMock)}>📤 {t.btnPlanner}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: PAL.bg, border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, backdropFilter: "blur(20px)", boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}
