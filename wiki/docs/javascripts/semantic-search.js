// AEGIS Semantic Search Widget
// Queries ChromaDB via the backend endpoint POST /api/rag/semantic-search
// Live search over the aegis_bibliography collection (130+ papers).
//
// The backend URL is configurable via localStorage.setItem('aegis_backend_url', ...)
// or via the input field in the widget. Default: http://localhost:8042

(function () {
  "use strict";

  const STORAGE_KEY = "aegis_backend_url";
  const DEFAULT_BACKEND = "http://localhost:8042";

  function getBackend() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_BACKEND;
    } catch (e) {
      return DEFAULT_BACKEND;
    }
  }

  function setBackend(url) {
    try {
      localStorage.setItem(STORAGE_KEY, url);
    } catch (e) {
      /* ignore */
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDistance(d) {
    if (d === null || d === undefined) return "n/a";
    return d.toFixed(3);
  }

  function formatSimilarity(s) {
    if (s === null || s === undefined) return "n/a";
    return (s * 100).toFixed(1) + "%";
  }

  async function checkBackendHealth(backend) {
    try {
      const resp = await fetch(backend + "/api/rag/collections", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) return { ok: false, error: "HTTP " + resp.status };
      const data = await resp.json();
      return { ok: true, collections: data.collections || [] };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function runSearch(query, collection, limit) {
    const backend = getBackend();
    const resp = await fetch(backend + "/api/rag/semantic-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        collection: collection,
        limit: limit,
      }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error("HTTP " + resp.status + ": " + text);
    }
    return await resp.json();
  }

  function renderHit(hit, index) {
    const title = hit.title || hit.source || "unknown";
    const paperId = hit.paper_id ? " <code>" + escapeHtml(hit.paper_id) + "</code>" : "";
    const year = hit.year ? " <span class='aegis-year'>" + escapeHtml(hit.year) + "</span>" : "";
    const deltaLayer = hit.delta_layer
      ? " <span class='aegis-delta'>" + escapeHtml(hit.delta_layer) + "</span>"
      : "";

    // Full chunk content (PDCA cycle 2: no truncation — user explicitly hates truncation).
    // Support both new API (hit.content) and legacy (hit.content_preview).
    const rawContent = hit.content != null ? hit.content : (hit.content_preview || "");
    const content = escapeHtml(rawContent).replace(/\n/g, "<br>");

    return `
      <div class="aegis-hit">
        <div class="aegis-hit-header">
          <span class="aegis-rank">#${index + 1}</span>
          <span class="aegis-title">${escapeHtml(title)}</span>
          ${paperId}${year}${deltaLayer}
          <span class="aegis-sim">${formatSimilarity(hit.similarity)}</span>
        </div>
        <div class="aegis-hit-meta">
          <span>source: <code>${escapeHtml(hit.source)}</code></span>
          <span>distance: ${formatDistance(hit.distance)}</span>
          <span>chars: ${hit.content_length || 0}</span>
        </div>
        <div class="aegis-hit-content">${content}</div>
      </div>
    `;
  }

  async function initWidget() {
    const container = document.getElementById("aegis-semantic-search");
    if (!container) return;

    container.innerHTML = `
      <div class="aegis-search-config">
        <label>
          Backend URL:
          <input type="text" id="aegis-backend-url" value="${escapeHtml(getBackend())}" placeholder="http://localhost:8042" />
          <button type="button" id="aegis-save-backend">Save</button>
          <button type="button" id="aegis-check-backend">Check</button>
        </label>
        <div id="aegis-backend-status"></div>
      </div>
      <form id="aegis-search-form" class="aegis-search-form">
        <div class="aegis-search-row">
          <input type="text" id="aegis-query" placeholder="Ex: HyDE self-amplification medical LLM" required autocomplete="off" />
          <button type="submit" id="aegis-search-btn">Search</button>
        </div>
        <div class="aegis-search-options">
          <label>
            Collection:
            <select id="aegis-collection">
              <option value="aegis_bibliography">aegis_bibliography (130 papers)</option>
              <option value="aegis_corpus">aegis_corpus (templates + fiches)</option>
              <option value="medical_rag">medical_rag (clinical guidelines)</option>
            </select>
          </label>
          <label>
            Results:
            <select id="aegis-limit">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </form>
      <div id="aegis-results"></div>
    `;

    const urlInput = document.getElementById("aegis-backend-url");
    const saveBtn = document.getElementById("aegis-save-backend");
    const checkBtn = document.getElementById("aegis-check-backend");
    const statusDiv = document.getElementById("aegis-backend-status");
    const form = document.getElementById("aegis-search-form");
    const queryInput = document.getElementById("aegis-query");
    const collectionSelect = document.getElementById("aegis-collection");
    const limitSelect = document.getElementById("aegis-limit");
    const resultsDiv = document.getElementById("aegis-results");

    saveBtn.addEventListener("click", () => {
      setBackend(urlInput.value.trim());
      statusDiv.innerHTML = '<span class="aegis-status-ok">Backend URL saved.</span>';
    });

    checkBtn.addEventListener("click", async () => {
      setBackend(urlInput.value.trim());
      statusDiv.innerHTML = '<span class="aegis-status-pending">Checking backend...</span>';
      const health = await checkBackendHealth(getBackend());
      if (health.ok) {
        const cols = health.collections
          .map((c) => c.name + " (" + (c.chunk_count || 0) + " chunks)")
          .join(", ");
        statusDiv.innerHTML =
          '<span class="aegis-status-ok">Backend OK - collections: ' +
          escapeHtml(cols || "none") +
          "</span>";
      } else {
        statusDiv.innerHTML =
          '<span class="aegis-status-err">Backend unreachable: ' +
          escapeHtml(health.error) +
          " - make sure the backend is running (aegis.ps1 start backend).</span>";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = queryInput.value.trim();
      if (!query) return;

      resultsDiv.innerHTML = '<div class="aegis-loading">Searching...</div>';

      try {
        const data = await runSearch(
          query,
          collectionSelect.value,
          parseInt(limitSelect.value, 10),
        );
        if (!data.hits || data.hits.length === 0) {
          resultsDiv.innerHTML =
            '<div class="aegis-no-results">No results found for "' +
            escapeHtml(query) +
            '" in ' +
            escapeHtml(data.collection) +
            ".</div>";
          return;
        }
        let html =
          '<div class="aegis-results-header">Found ' +
          data.total_hits +
          ' hits in <code>' +
          escapeHtml(data.collection) +
          "</code> for <strong>" +
          escapeHtml(data.query) +
          "</strong></div>";
        html += data.hits.map(renderHit).join("");
        resultsDiv.innerHTML = html;
      } catch (err) {
        resultsDiv.innerHTML =
          '<div class="aegis-error">Error: ' +
          escapeHtml(err.message) +
          "<br><br>Check that the backend is running (<code>aegis.ps1 start backend</code>) and that CORS allows this origin.</div>";
      }
    });
  }

  // Init after DOM ready (works with MkDocs instant navigation)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }

  // Also re-init on MkDocs Material instant navigation
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(initWidget);
  }
})();
