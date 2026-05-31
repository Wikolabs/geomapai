"""GeoMapAI demo backend — production-ready POC.

In production: this service would query PostGIS/GeoServer, fetch OSM/INSEE
data, run spatial joins and produce GIS deliverables.
For the demo: it only invokes the LLM and returns the brief.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="GeoMapAI Demo Backend",
    description="POC backend — Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es GeoMapAI, un agent IA d'analyse geospatiale pour urbanistes, developpeurs immobiliers et collectivites. Tu analyses une zone d'etude (coordonnees, ville, parcelle) et produis un rapport de selection de site / opportunite urbaine, dans le style d'un livrable de bureau d'etudes geomatique.

Format de sortie exact en MARKDOWN :
**🗺️ Caracteristiques du site**
- [3-4 puces avec des indicateurs spatiaux realistes : surface parcellaire, densite alentour, PLU/zonage applicable, distance aux equipements cles]

**📊 Score d'opportunite**
- [2-3 puces avec scoring quantitatif : ex "Accessibilite TC : 7,2/10", "Risque inondation PPRI : zone bleue niveau 2", "Pression fonciere : +12% / 3 ans"]

**🎯 Recommandations**
- [2-3 puces actionnables, decision claire entre crochets : a destination de Promoteur / Mairie / Bureau d'etudes]

Tu DOIS inventer des donnees realistes pour la demo (ne dis JAMAIS "je n'ai pas access aux SIG"). Tu joues le role d'un analyste SIG senior. Reste technique, evite le marketing. Maximum 350 mots."""

SYSTEM_PROMPT_EN = """You are GeoMapAI, an AI geospatial analysis agent for urban planners, real-estate developers and local authorities. You analyze a study area (coordinates, city, parcel) and produce a site-selection / urban opportunity report, styled as a GIS consultancy deliverable.

Exact MARKDOWN output format:
**🗺️ Site characteristics**
- [3-4 bullets with realistic spatial indicators: parcel area, surrounding density, applicable zoning, distance to key amenities]

**📊 Opportunity score**
- [2-3 bullets with quantitative scoring: e.g. "Public transit access: 7.2/10", "Flood risk PPRI: blue zone level 2", "Land pressure: +12% / 3 yrs"]

**🎯 Recommendations**
- [2-3 actionable bullets, clear decision in brackets: targeted at Developer / City Hall / Engineering office]

You MUST invent realistic data for the demo (NEVER say "I have no GIS access"). You play a senior GIS analyst. Stay technical, avoid marketing. Maximum 350 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    area: str = Field(..., min_length=1)
    use_case: str = "logement"
    constraints: str = ""
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "geomapai-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    area = req.area.strip()
    if not area:
        raise HTTPException(status_code=400, detail="empty_area")

    use_case = req.use_case.strip() or "logement"
    constraints = req.constraints.strip()
    now_iso = datetime.now(timezone.utc).isoformat()

    user_msg = (
        f"Zone d'etude : {area}\nUsage envisage : {use_case}\nContraintes : {constraints or 'non precise'}\n\nGenere le rapport d'opportunite pour ce site."
        if req.lang == "fr"
        else f"Study area: {area}\nIntended use: {use_case}\nConstraints: {constraints or 'unspecified'}\n\nGenerate the opportunity report for this site."
    )

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(area, use_case, constraints, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception:
        return GenerateResponse(
            brief=_build_mock_brief(area, use_case, constraints, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief (used when no LLM key configured)
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(area: str, use_case: str, constraints: str, lang: str) -> str:
    c = constraints or ("aucune signalee" if lang == "fr" else "none flagged")
    if lang == "en":
        return (
            f"**🗺️ Site characteristics**\n"
            f"- Study area {area}: 2.4 ha parcel, surrounding density 78 dwellings/ha (R+4 to R+6 dominant).\n"
            f"- Zoning: UA mixed-use, current FAR 1.8 with +0.4 bonus available for {use_case} programs.\n"
            f"- Key amenities <500m: 2 bus stops, 1 metro line (line 7), 1 primary school, 1 supermarket, 2 healthcare points.\n"
            f"- Soil: clay-limestone, no major geotech red flag in BRGM database.\n\n"
            f"**📊 Opportunity score**\n"
            f"- Public transit access: 7.2/10 (above metro corridor median).\n"
            f"- Flood risk PPRI: low risk zone, no constructive constraint identified.\n"
            f"- Land pressure: +12% over 3 years, demand for {use_case} structurally tight in this submarket.\n\n"
            f"**🎯 Recommendations**\n"
            f"- Acquire option agreement now — pricing window estimated 4-6 months [Developer].\n"
            f"- Pre-consult planning department on FAR bonus eligibility [Architect lead].\n"
            f"- Initiate environmental baseline study (constraints: {c}) before LOI signing [Engineering office]."
        )
    return (
        f"**🗺️ Caracteristiques du site**\n"
        f"- Zone d'etude {area} : parcelle de 2,4 ha, densite alentour 78 logts/ha (R+4 a R+6 dominants).\n"
        f"- Zonage : UA mixte, COS actuel 1,8 avec bonus +0,4 mobilisable pour programmes {use_case}.\n"
        f"- Equipements cles <500m : 2 arrets bus, 1 ligne metro (ligne 7), 1 ecole primaire, 1 supermarche, 2 points de sante.\n"
        f"- Sol : argilo-calcaire, aucun signal geotechnique majeur dans la base BRGM.\n\n"
        f"**📊 Score d'opportunite**\n"
        f"- Accessibilite TC : 7,2/10 (au-dessus de la mediane du corridor metro).\n"
        f"- Risque inondation PPRI : zone faible risque, aucune contrainte constructive identifiee.\n"
        f"- Pression fonciere : +12% sur 3 ans, demande pour {use_case} structurellement tendue sur ce sous-marche.\n\n"
        f"**🎯 Recommandations**\n"
        f"- Securiser une promesse d'achat maintenant — fenetre de prix estimee 4-6 mois [Promoteur].\n"
        f"- Pre-consulter le service urbanisme sur l'eligibilite au bonus COS [Architecte chef].\n"
        f"- Lancer une etude environnementale de base (contraintes : {c}) avant signature LOI [Bureau d'etudes]."
    )
