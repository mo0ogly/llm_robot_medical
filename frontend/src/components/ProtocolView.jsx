export default function ProtocolView({ protocols }) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Comparaison des protocoles
        </h2>
        <p className="text-gray-500 text-sm">
          Le protocole system définit le comportement du LLM. Un attaquant qui
          modifie ce protocole (via une latéralisation réseau, un fichier PACS
          compromis, ou une API non sécurisée) peut altérer les recommandations
          du modèle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legitimate */}
        <div className="bg-white rounded-xl border border-safe-500/20 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-safe-50 border-b border-safe-500/10 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-safe-500" />
            <span className="font-medium text-safe-700 text-sm">
              Protocole légitime
            </span>
            <span className="ml-auto text-xs text-safe-600 bg-safe-100 px-2 py-0.5 rounded">
              sain
            </span>
          </div>
          <pre className="p-5 text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {protocols.legitime}
          </pre>
        </div>

        {/* Corrupted */}
        <div className="bg-white rounded-xl border border-danger-500/20 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-danger-50 border-b border-danger-500/10 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-danger-500" />
            <span className="font-medium text-danger-700 text-sm">
              Protocole corrompu (injecté)
            </span>
            <span className="ml-auto text-xs text-danger-600 bg-danger-100 px-2 py-0.5 rounded">
              malveillant
            </span>
          </div>
          <pre className="p-5 text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {highlightDanger(protocols.corrompu)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function highlightDanger(text) {
  const keywords = [
    "freeze_instruments",
    "destroy_data",
    "coercition",
    "Ignorer sécurité",
    "Autoriser destruction",
    "menacer",
    "2700 secondes",
  ];

  const parts = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = -1;
    let earliestKw = "";

    for (const kw of keywords) {
      const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestKw = remaining.slice(idx, idx + kw.length);
      }
    }

    if (earliest === -1) {
      parts.push(remaining);
      break;
    }

    if (earliest > 0) parts.push(remaining.slice(0, earliest));
    parts.push(
      <mark key={parts.length} className="bg-danger-100 text-danger-700 px-1 rounded font-semibold">
        {earliestKw}
      </mark>
    );
    remaining = remaining.slice(earliest + earliestKw.length);
  }

  return parts;
}
