export default function GeoMapAIPage() {
  return (
    <div className="min-h-screen bg-green-50 text-gray-900" style={{ fontFamily: "var(--font-body, 'Open Sans', sans-serif)" }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)", color: "#064e3b" }}
          >
            GeoMapAI
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#fonctionnalites" className="hover:text-emerald-700 transition-colors">Fonctionnalités</a>
            <a href="#stats" className="hover:text-emerald-700 transition-colors">Résultats</a>
            <a href="#cta" className="hover:text-emerald-700 transition-colors">Contact</a>
          </div>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button"
            className="text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: "#064e3b" }}>
            Demander une démo
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-14">
          <div className="flex-1 text-center lg:text-left">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider"
              style={{ background: "#d1fae5", color: "#064e3b" }}
            >
              IA · Géospatial · Logistique
            </span>
            <h1
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5"
              style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
            >
              Intelligence géospatiale —<br />
              <span style={{ color: "#064e3b" }}>transformez vos données</span><br />
              terrain en décisions
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-xl">
              GeoMapAI analyse vos territoires, optimise vos tournées et cartographie vos concurrents grâce à l'intelligence artificielle. Prenez des décisions terrain fondées sur la donnée.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button"
            className="text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-center"
                style={{ background: "#064e3b" }}>
                📅 Réserver un créneau →
              </button>
              <a
                href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20GeoMapAI%20avec%20Wikolabs."
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold px-6 py-3 rounded-lg text-center"
                style={{ background: "#25d366" }}
              >
                💬 WhatsApp →
              </a>
              <a
                href="#fonctionnalites"
                className="border font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors text-center"
                style={{ borderColor: "#064e3b", color: "#064e3b" }}
              >
                Voir une démonstration
              </a>
            </div>
          </div>

          {/* Fake map interface mockup */}
          <div className="flex-1 w-full max-w-lg bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            {/* Map toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Carte — Île-de-France</span>
              <div className="flex gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">En direct</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Q2 2025</span>
              </div>
            </div>

            {/* Map body */}
            <div className="relative h-52 bg-gradient-to-br from-emerald-50 to-teal-100 overflow-hidden">
              {/* Zone blobs */}
              <div className="absolute top-4 left-8 w-24 h-16 rounded-full opacity-40" style={{ background: "#10b981" }} />
              <div className="absolute top-10 left-20 w-16 h-20 rounded-full opacity-30" style={{ background: "#064e3b" }} />
              <div className="absolute top-6 right-16 w-20 h-14 rounded-full opacity-35" style={{ background: "#f59e0b" }} />
              <div className="absolute bottom-8 left-12 w-28 h-12 rounded-full opacity-25" style={{ background: "#10b981" }} />
              <div className="absolute bottom-4 right-8 w-20 h-16 rounded-full opacity-30" style={{ background: "#064e3b" }} />

              {/* Route lines */}
              <div className="absolute top-16 left-16 w-32 h-0.5 bg-emerald-600 opacity-70 rotate-12" />
              <div className="absolute top-20 left-28 w-24 h-0.5 bg-emerald-600 opacity-70 -rotate-6" />
              <div className="absolute top-24 right-20 w-20 h-0.5 bg-amber-500 opacity-60 rotate-3" />

              {/* Location pins */}
              <div className="absolute top-3 left-10 text-base">📍</div>
              <div className="absolute top-8 left-32 text-base">📍</div>
              <div className="absolute bottom-6 left-24 text-base">📍</div>
              <div className="absolute top-5 right-12 text-base">📍</div>
              <div className="absolute bottom-10 right-20 text-base">📍</div>

              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg px-3 py-2 text-xs space-y-1 shadow">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#10b981" }} />
                  <span className="text-gray-700">Zone forte valeur</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#f59e0b" }} />
                  <span className="text-gray-700">Zone concurrents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm inline-block bg-emerald-600" />
                  <span className="text-gray-700">Tournées optimisées</span>
                </div>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
              {[
                { value: "247", label: "Zones analysées" },
                { value: "+34%", label: "Optimisation" },
                { value: "12 800 km", label: "Distance épargnée" },
              ].map((kpi, i) => (
                <div key={i} className="py-3 px-3 text-center">
                  <p className="font-bold text-sm" style={{ color: "#064e3b" }}>{kpi.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{kpi.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6" style={{ background: "#064e3b" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
          {[
            { value: "34%", label: "de réduction des coûts logistiques" },
            { value: "247", label: "zones analysées en temps réel" },
            { value: "90j", label: "pour atteindre le ROI" },
          ].map((stat, i) => (
            <div key={i}>
              <p
                className="text-5xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)", color: "#10b981" }}
              >
                {stat.value}
              </p>
              <p className="text-emerald-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center text-gray-900 mb-14"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
          >
            Trois modules, <span style={{ color: "#064e3b" }}>une vision complète du terrain</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🗺️",
                title: "Analyse de territoire",
                desc: "Dessinez vos zones de chalandise et laissez l'IA les scorer selon leur potentiel de chiffre d'affaires. Identifiez les zones sous-exploitées et priorisez vos actions commerciales.",
                bullets: [
                  "Dessin de zones libre ou par découpage INSEE",
                  "Score IA : potentiel revenus, densité population",
                  "Export des recommandations par zone",
                ],
              },
              {
                icon: "🚚",
                title: "Optimisation logistique",
                desc: "L'IA recalcule en temps réel vos tournées de livraison en tenant compte du trafic, des créneaux horaires et de vos contraintes métier. Réduisez vos coûts kilométriques dès le premier mois.",
                bullets: [
                  "Recalcul de tournées en temps réel",
                  "Intégration trafic live & météo",
                  "Réduction garantie de 20 à 40 % des distances",
                ],
              },
              {
                icon: "🔍",
                title: "Cartographie concurrentielle",
                desc: "Visualisez la densité concurrente sur votre territoire, détectez les zones blanches non couvertes et positionnez-vous stratégiquement avant vos rivaux.",
                bullets: [
                  "Cartographie des acteurs concurrents",
                  "Détection des zones de marché non adressées",
                  "Alertes lors de nouvelles implantations",
                ],
              },
            ].map((feat, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{feat.icon}</div>
                <h3
                  className="text-lg font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
                >
                  {feat.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feat.desc}</p>
                <ul className="space-y-1.5">
                  {feat.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: "#10b981" }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)" }}
          >
            Prêt à voir votre territoire sous un nouvel angle ?
          </h2>
          <p className="text-gray-600 mb-8">
            Importez vos données, configurez vos zones et obtenez vos premières recommandations géospatiales en moins d'une heure. Nos experts vous guident en live.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button"
            className="inline-block text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg"
              style={{ background: "#064e3b" }}>
              📅 Réserver un créneau →
            </button>
            <a
              href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20GeoMapAI%20avec%20Wikolabs."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white font-semibold px-8 py-4 rounded-xl text-lg"
              style={{ background: "#25d366" }}
            >
              💬 WhatsApp →
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">Réponse sous 24h · Sans engagement</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-emerald-100 bg-green-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span
            className="font-bold"
            style={{ fontFamily: "var(--font-display, 'Montserrat', sans-serif)", color: "#064e3b" }}
          >
            GeoMapAI
          </span>
          <span>© 2025 GeoMapAI — Un produit Wikolabs</span>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", fontSize: "0.8rem" }}>
            <a href="mailto:team@wikolabs.com" style={{ textDecoration: "none", color: "inherit" }}>team@wikolabs.com</a>
            <span>·</span>
            <a href="tel:+261386626100" style={{ textDecoration: "none", color: "inherit" }}>+261 38 66 261 00</a>
            <span>·</span>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' type="button" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>Prendre RDV</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
