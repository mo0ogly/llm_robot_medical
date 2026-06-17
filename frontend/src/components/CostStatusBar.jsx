import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "../config";

const POLL_INTERVAL_MS = 15000;

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export default function CostStatusBar() {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [error, setError] = useState(false);

  const fetchCost = useCallback(() => {
    fetch(CONFIG.API_BASE + "/api/cost/session")
      .then(r => r.json())
      .then(data => { setSession(data.session); setError(false); })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    fetchCost();
    const id = setInterval(fetchCost, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchCost]);

  const handleReset = () => {
    fetch(CONFIG.API_BASE + "/api/cost/reset", { method: "POST" })
      .then(() => fetchCost());
  };

  if (error || !session) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500 px-2">
        <span className="opacity-40">{t("cost.title")}</span>
        <span className="opacity-30">{error ? "—" : t("cost.loading")}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-mono select-none">
      <span className="text-cyan-400 opacity-70">{t("cost.title")}</span>
      <span className="text-gray-300">
        {fmt(session.total_tokens)}
        <span className="text-gray-500 ml-1">{t("cost.tokens")}</span>
      </span>
      <span className="text-gray-500">|</span>
      <span className="text-green-400">{session.cost_usd_display}</span>
      <button
        onClick={handleReset}
        title={t("cost.reset")}
        className="ml-1 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
      >
        ↺
      </button>
    </div>
  );
}
