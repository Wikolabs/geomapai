# GeoMapAI — Analyse géospatiale et intelligence territoriale par IA

> Transformez vos données de localisation en insights stratégiques pour votre territoire.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.4-336791?style=flat)](https://postgis.net)
[![Mapbox](https://img.shields.io/badge/Mapbox_GL-3.x-000000?style=flat)](https://mapbox.com)

---

## Vue d'ensemble

GeoMapAI est une plateforme d'analyse géospatiale et d'intelligence territoriale. Elle permet d'analyser des données de localisation (points d'intérêt, zones de chalandise, flux de déplacement), de calculer des scores d'attractivité territoriale, et de générer des cartes analytiques pour des décisions de localisation commerciale, logistique, ou urbanistique.

**Domaine :** Géospatial Analytics / Site Selection / Urban Intelligence  
**Port VM :** 3023 | **Sous-domaine :** geomapai.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Cartographie interactive Mapbox, analytics |
| Backend | FastAPI (Python 3.11), Uvicorn | API géospatiale, scoring, clustering |
| Database | **PostGIS** 3.4 + PostgreSQL 16 | Stockage et requêtes géospatiales |
| Cartographie | Mapbox GL JS v3 | Cartes vectorielles interactives |
| Spatial Analysis | GeoPandas, Shapely | Analyses zonales, distances, buffers |
| Clustering | scikit-learn (DBSCAN) | Clustering géographique |
| Isochrones | OpenRouteService API | Zones d'accessibilité temps/distance |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3023) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
geopandas==0.14.4
shapely==2.0.4
scikit-learn==1.4.2
pandas==2.2.2
numpy==1.26.4
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
pydantic==2.7.1
httpx==0.27.0
pyproj==3.6.1
```

---

## Architecture mono-repo

```
geomapai/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx              # Carte principale + dashboard
│   │   ├── analysis/             # Analyses territoriales
│   │   ├── site-scoring/         # Scoring localisation
│   │   └── zones/                # Zones de chalandise
│   └── src/components/
│       ├── MapCanvas.tsx         # Mapbox GL viewer interactif
│       ├── LayerControl.tsx      # Couches : POI, flux, scores
│       ├── IsochroneMap.tsx      # Zones d'accessibilité
│       ├── ScoreRadar.tsx        # Radar scoring site
│       └── TerritoryHeatmap.tsx  # Heatmap densité/activité
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── analysis.py       # Analyses territoriales
│   │   │   ├── scoring.py        # Score attractivité site
│   │   │   └── zones.py          # Zones de chalandise + isochrones
│   │   ├── services/
│   │   │   ├── spatial_engine.py # PostGIS queries + GeoPandas
│   │   │   ├── site_scorer.py    # Scoring multi-critères
│   │   │   ├── cluster.py        # DBSCAN clustering POI
│   │   │   └── isochrone.py      # OpenRouteService integration
│   │   └── models/
│   │       └── location.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#065f46', 'primaryTextColor': '#fff', 'primaryBorderColor': '#047857', 'lineColor': '#374151', 'secondaryColor': '#ecfdf5'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3023)"]
        NEXT["Next.js 14\nGeo Analytics"]
        API["FastAPI"]

        subgraph GEO["🗺️ Spatial Engine"]
            POSTGIS["PostGIS 3.4\nGeospatial queries"]
            GEOPANDAS["GeoPandas\nSpatial analysis"]
            CLUSTER["DBSCAN\nGeo clustering"]
            ISO["Isochrones\nAccessibility zones"]
        end
    end

    MAPBOX["Mapbox GL\nVector tiles"] --> NEXT
    ORS["OpenRouteService\nIsochrone API"] --> ISO
    OSM["OpenStreetMap\nPOI data"] --> POSTGIS
```

### Séquence — Analyse de site commercial

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#065f46', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant USER as Commercial Director
    participant API as FastAPI
    participant POSTGIS as PostGIS
    participant ISO as Isochrone
    participant SCORER as Site Scorer
    participant CLUSTER as DBSCAN

    USER->>API: POST /scoring/analyze {lat: 48.8566, lng: 2.3522, site_type: "retail"}

    API->>POSTGIS: ST_DWithin(location, point, radius_5km)
    POSTGIS-->>API: {poi_count: 847, competitors: 12, population_500m: 15200}

    API->>ISO: get_isochrone(point, mode=driving, time=10min)
    ISO-->>API: polygon_geojson (zone accessible 10min)

    API->>POSTGIS: ST_Intersects(catchment_area, demographic_data)
    POSTGIS-->>API: {pop_catchment: 45000, avg_income: 38000, households: 18500}

    API->>CLUSTER: cluster_competitors(competitor_locations)
    CLUSTER-->>API: {clusters: 3, nearest_competitor_m: 450}

    API->>SCORER: compute_score(poi_density, demographics, competition, accessibility)
    Note over SCORER: 5 dimensions: traffic, demographics, competition, accessibility, parking
    SCORER-->>API: {total_score: 78, rank: "B+", radar: {...}}

    API-->>USER: {score: 78, isochrone_geojson, competitors: 12, recommendation: "site favorable"}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#065f46', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    LOCATION {
        uuid id PK
        string name
        geometry point
        string category
        jsonb attributes
        timestamp created_at
    }
    SITE_ANALYSIS {
        uuid id PK
        geometry center_point
        string site_type
        float total_score
        jsonb score_dimensions
        int competitors_count
        int population_catchment
        geometry isochrone_10min
        timestamp analyzed_at
    }
    ZONE {
        uuid id PK
        string name
        string zone_type
        geometry polygon
        jsonb statistics
        timestamp updated_at
    }
    POI_LAYER {
        uuid id PK
        string category
        geometry point
        string name
        jsonb properties
        string source
    }

    SITE_ANALYSIS }o--o{ LOCATION : "considers"
```

---

## PRD

### Problème
Les décisions de localisation commerciale (ouverture de point de vente, entrepôt logistique, bureau) reposent souvent sur l'intuition. Les analyses de zones de chalandise manuelles prennent des semaines et restent obsolètes. Les collectivités manquent d'outils pour analyser leur territoire.

### Solution
GeoMapAI automatise l'analyse de site : scoring multi-critères (démographie, concurrence, accessibilité, trafic), zones de chalandise calculées en temps réel, et cartographie interactive pour la visualisation décisionnelle.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Directeur Expansion Retail | Identifier les meilleures localisations pour de nouveaux sites |
| Urbaniste / Collectivité | Analyser la distribution des équipements sur le territoire |
| Responsable Logistique | Optimiser les emplacements d'entrepôts |

### OKRs
- Analyse de site complète en < 30 secondes
- Score corrélé à 85% avec les performances réelles des sites
- Coverage : 100 000 communes françaises indexées

---

## User Stories

```
US-01 [Commercial] En tant que directeur commercial,
      je veux cliquer sur une adresse sur la carte
      et obtenir en 30 secondes un score de potentiel commercial
      afin de décider si l'emplacement vaut la peine d'être visité.

US-02 [Urbaniste] En tant qu'urbaniste,
      je veux visualiser la densité de population par commune
      et l'accessibilité aux services (médecins, écoles, commerces)
      afin d'identifier les déserts de services.

US-03 [Logistique] En tant que responsable logistique,
      je veux calculer la zone couverte en 30 minutes de livraison
      depuis un entrepôt potentiel
      afin de vérifier si nous couvrons nos clients cibles.

US-04 [Commercial] En tant que directeur expansion,
      je veux comparer 5 sites candidats côte à côte
      avec les mêmes critères de scoring
      afin de choisir objectivement le meilleur emplacement.

US-05 [Analyst] En tant qu'analyste,
      je veux importer mes propres données CSV (lat/lng + attributs)
      et les visualiser sur la carte
      afin de les superposer avec les données territoriales.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Score 5 dimensions | Traffic 25%, Démographie 30%, Concurrence 20%, Accessibilité 15%, Stationnement 10% | ✅ Radar chart |
| R2 | Zone de chalandise | Isochrone voiture 10 min via OpenRouteService | ✅ Isochrone map |
| R3 | Concurrence | Concurrents dans rayon 500m/1km/2km | ✅ Buffer radius |
| R4 | Clustering POI | DBSCAN : zones denses de commerces | ✅ Cluster viz |
| R5 | Heatmap densité | Population résidentielle + flux diurnes | ✅ Heatmap layer |
| R6 | Comparaison sites | Max 5 sites comparés simultanément | ✅ Multi-site |
| R7 | Import CSV | Lat/lng + attributs → couche personnalisée | ✅ CSV import |
| R8 | Export | Export GeoJSON / Shapefile / rapport PDF | ✅ Export options |
| R9 | Mise à jour | Données OSM + INSEE mise à jour mensuelle | ✅ Data freshness |
| R10 | Layers control | Activation/désactivation couches (POI, routes, démographie) | ✅ Layer toggle |

---

## Spécification API

**Base URL :** `http://geomapai.wikolabs.com/api/v1`

### POST /scoring/analyze
```json
{"lat": 48.8566, "lng": 2.3522, "site_type": "retail", "criteria_weights": {"demographics": 0.30}}
// Response: {"score": 78, "grade": "B+", "dimensions": {"traffic": 82, "demographics": 75, "competition": 70, "accessibility": 85}, "isochrone": {geojson}, "competitors": 12}
```

### GET /zones/catchment
```json
// GET /zones/catchment?lat=48.8566&lng=2.3522&mode=driving&minutes=10
// Response: {"type": "Feature", "geometry": {polygon_geojson}, "population": 45000}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Mapbox Canvas** | Carte vectorielle interactive avec layers switch |
| **Site Scoring** | Radar chart 5 dimensions + score total + recommandation |
| **Isochrone Map** | Zone de chalandise colorée sur la carte |
| **Heatmap Layer** | Densité population / activité commerciale |
| **Site Comparison** | Tableau côte-à-côte de 5 sites avec radar superposé |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    environment: {POSTGRES_DB: geomapai, POSTGRES_USER: gm_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
    volumes: [pg_data:/var/lib/postgresql/data]
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://gm_user:${POSTGRES_PASSWORD}@postgres/geomapai
      ORS_API_KEY: "${ORS_API_KEY}"
    depends_on: [postgres]
    expose: ["8000"]
  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_MAPBOX_TOKEN: "${MAPBOX_TOKEN}"
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3023:80"]
volumes:
  pg_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] PostGIS setup + POI import (OSM)
- [ ] Scoring 5 critères
- [ ] Mapbox GL viewer

### Phase 2 — Analyse
- [ ] Isochrones (OpenRouteService)
- [ ] Zones de chalandise
- [ ] Comparaison multi-sites

### Phase 3 — Intelligence
- [ ] ML score calibration sur performances réelles
- [ ] Prédiction revenus par site
- [ ] Intégration INSEE + IGN

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*
