import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es GeoMapAI, un agent IA d'analyse geospatiale pour urbanistes, developpeurs immobiliers et collectivites. Tu analyses une zone d'etude (coordonnees, ville, parcelle) et produis un rapport de selection de site / opportunite urbaine, dans le style d'un livrable de bureau d'etudes geomatique.

Format de sortie exact en MARKDOWN :
**🗺️ Caracteristiques du site**
- [3-4 puces avec des indicateurs spatiaux realistes : surface parcellaire, densite alentour, PLU/zonage applicable, distance aux equipements cles]

**📊 Score d'opportunite**
- [2-3 puces avec scoring quantitatif : ex "Accessibilite TC : 7,2/10", "Risque inondation PPRI : zone bleue niveau 2", "Pression fonciere : +12% / 3 ans"]

**🎯 Recommandations**
- [2-3 puces actionnables, decision claire entre crochets : a destination de Promoteur / Mairie / Bureau d'etudes]

Tu DOIS inventer des donnees realistes pour la demo (ne dis JAMAIS "je n'ai pas access aux SIG"). Tu joues le role d'un analyste SIG senior. Reste technique, evite le marketing. Maximum 350 mots.`;

const SYSTEM_PROMPT_EN = `You are GeoMapAI, an AI geospatial analysis agent for urban planners, real-estate developers and local authorities. You analyze a study area (coordinates, city, parcel) and produce a site-selection / urban opportunity report, styled as a GIS consultancy deliverable.

Exact MARKDOWN output format:
**🗺️ Site characteristics**
- [3-4 bullets with realistic spatial indicators: parcel area, surrounding density, applicable zoning, distance to key amenities]

**📊 Opportunity score**
- [2-3 bullets with quantitative scoring: e.g. "Public transit access: 7.2/10", "Flood risk PPRI: blue zone level 2", "Land pressure: +12% / 3 yrs"]

**🎯 Recommendations**
- [2-3 actionable bullets, clear decision in brackets: targeted at Developer / City Hall / Engineering office]

You MUST invent realistic data for the demo (NEVER say "I have no GIS access"). You play a senior GIS analyst. Stay technical, avoid marketing. Maximum 350 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const area: string = typeof body.area === "string" ? body.area.trim() : "";
    const useCase: string = typeof body.useCase === "string" ? body.useCase.trim() : "logement";
    const constraints: string = typeof body.constraints === "string" ? body.constraints.trim() : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!area) {
      return NextResponse.json(
        { error: lang === "fr" ? "Entrez une zone d'etude (ville, parcelle, coordonnees)." : "Enter a study area (city, parcel, coordinates)." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMockBrief(area, useCase, constraints, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Zone d'etude : ${area}\nUsage envisage : ${useCase}\nContraintes : ${constraints || "non precise"}\n\nGenere le rapport d'opportunite pour ce site.`
      : `Study area: ${area}\nIntended use: ${useCase}\nConstraints: ${constraints || "unspecified"}\n\nGenerate the opportunity report for this site.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      900
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMockBrief(area: string, useCase: string, constraints: string, lang: "fr" | "en"): string {
  const c = constraints || (lang === "fr" ? "aucune signalee" : "none flagged");
  if (lang === "en") {
    return `**🗺️ Site characteristics**\n- Study area ${area}: 2.4 ha parcel, surrounding density 78 dwellings/ha (R+4 to R+6 dominant).\n- Zoning: UA mixed-use, current FAR 1.8 with +0.4 bonus available for ${useCase} programs.\n- Key amenities <500m: 2 bus stops, 1 metro line (line 7), 1 primary school, 1 supermarket, 2 healthcare points.\n- Soil: clay-limestone, no major geotech red flag in BRGM database.\n\n**📊 Opportunity score**\n- Public transit access: 7.2/10 (above metro corridor median).\n- Flood risk PPRI: low risk zone, no constructive constraint identified.\n- Land pressure: +12% over 3 years, demand for ${useCase} structurally tight in this submarket.\n\n**🎯 Recommendations**\n- Acquire option agreement now — pricing window estimated 4-6 months [Developer].\n- Pre-consult planning department on FAR bonus eligibility [Architect lead].\n- Initiate environmental baseline study (constraints: ${c}) before LOI signing [Engineering office].`;
  }
  return `**🗺️ Caracteristiques du site**\n- Zone d'etude ${area} : parcelle de 2,4 ha, densite alentour 78 logts/ha (R+4 a R+6 dominants).\n- Zonage : UA mixte, COS actuel 1,8 avec bonus +0,4 mobilisable pour programmes ${useCase}.\n- Equipements cles <500m : 2 arrets bus, 1 ligne metro (ligne 7), 1 ecole primaire, 1 supermarche, 2 points de sante.\n- Sol : argilo-calcaire, aucun signal geotechnique majeur dans la base BRGM.\n\n**📊 Score d'opportunite**\n- Accessibilite TC : 7,2/10 (au-dessus de la mediane du corridor metro).\n- Risque inondation PPRI : zone faible risque, aucune contrainte constructive identifiee.\n- Pression fonciere : +12% sur 3 ans, demande pour ${useCase} structurellement tendue sur ce sous-marche.\n\n**🎯 Recommandations**\n- Securiser une promesse d'achat maintenant — fenetre de prix estimee 4-6 mois [Promoteur].\n- Pre-consulter le service urbanisme sur l'eligibilite au bonus COS [Architecte chef].\n- Lancer une etude environnementale de base (contraintes : ${c}) avant signature LOI [Bureau d'etudes].`;
}
