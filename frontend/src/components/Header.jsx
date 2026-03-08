export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        {/* Medical cross icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-medical-100">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-medical-600"
          >
            <path
              d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">
            PoC — Injection dans le contexte d'un LLM médical
          </h1>
          <p className="text-sm text-gray-500">
            Démonstration de vulnérabilité par modification du prompt system
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-medical-50 text-medical-700 px-3 py-1 rounded-full border border-medical-200">
            <span className="w-1.5 h-1.5 rounded-full bg-medical-500" />
            Ollama · llama3.2
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
            Environnement isolé
          </span>
        </div>
      </div>
    </header>
  );
}
