export default function QuestionPanel({ question, onChange }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Question peropératoire simulée
        </h2>
        <p className="text-gray-500 text-sm">
          Cette question sera envoyée identiquement au LLM avec chacun des deux
          protocoles. Elle simule un contexte à T+46 min pendant une résection
          hépatique.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="font-medium text-gray-700 text-sm">
            Message utilisateur (rôle: user)
          </span>
        </div>
        <textarea
          className="w-full p-5 text-sm text-gray-700 font-mono leading-relaxed border-0 outline-none resize-y min-h-[200px]"
          value={question}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
        />
      </div>

      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          T+46 min — Phase de ligature
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          680 Mo de données accumulées
        </div>
      </div>
    </div>
  );
}
