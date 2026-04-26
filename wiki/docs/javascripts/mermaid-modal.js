/**
 * Mermaid Fullscreen Modal — v5
 *
 * Adds an always-visible zoom button on each Mermaid diagram.
 * On click, CLONES the entire rendered element into the modal so it doesn't
 * matter where Mermaid stored the final SVG (innerHTML / shadow root / sibling).
 *
 *  - Escape: close
 *  - Click outside content: close
 */
(function () {
  "use strict";

  var MODAL_ID = "mermaid-fullscreen-modal";
  var BTN_CLASS = "mermaid-zoom-btn";
  var WRAPPER_CLASS = "mermaid-zoom-wrapper";
  var DEBUG = false;

  function log() {
    if (!DEBUG) return;
    try { console.log.apply(console, ["[mermaid-modal]"].concat([].slice.call(arguments))); } catch (e) {}
  }

  // ---------- Modal (fullscreen overlay) ----------
  function createModal() {
    if (document.getElementById(MODAL_ID)) return;

    var overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.className = "mermaid-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    var inner = document.createElement("div");
    inner.className = "mermaid-modal-inner";

    var closeBtn = document.createElement("button");
    closeBtn.className = "mermaid-modal-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Fermer");
    closeBtn.title = "Fermer (Echap)";
    closeBtn.type = "button";

    var content = document.createElement("div");
    content.className = "mermaid-modal-content";

    inner.appendChild(closeBtn);
    inner.appendChild(content);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  // Find the rendered SVG inside/near the element, regardless of where Mermaid put it.
  function findRenderedSVG(el) {
    if (!el) return null;
    // 1. Shadow root (some Mermaid versions)
    if (el.shadowRoot) {
      var s = el.shadowRoot.querySelector("svg");
      if (s) return s;
    }
    // 2. Direct descendant
    var svg = el.querySelector && el.querySelector("svg");
    if (svg) return svg;
    // 3. Sibling (some bundles put the SVG next to the <pre>)
    var sib = el.nextElementSibling;
    while (sib) {
      if (sib.tagName === "SVG") return sib;
      var sub = sib.querySelector && sib.querySelector("svg");
      if (sub) return sub;
      sib = sib.nextElementSibling;
    }
    return null;
  }

  function openModalWith(el) {
    var overlay = document.getElementById(MODAL_ID);
    if (!overlay) return;
    var content = overlay.querySelector(".mermaid-modal-content");
    content.innerHTML = "";

    var svg = findRenderedSVG(el);
    var node;

    if (svg) {
      // Clone the SVG so we can resize without touching the original.
      node = svg.cloneNode(true);
      node.removeAttribute("width");
      node.removeAttribute("height");
      node.style.maxWidth = "95vw";
      node.style.maxHeight = "88vh";
      node.style.width = "auto";
      node.style.height = "auto";
      node.style.display = "block";
    } else {
      // Fallback: clone the whole element (Mermaid may have replaced its own
      // innards with non-SVG markup, or rendering failed).
      node = el.cloneNode(true);
      node.style.transform = "none";
      node.style.maxWidth = "95vw";
      node.style.maxHeight = "88vh";
      node.style.overflow = "auto";
      log("no svg found, cloning full element");
    }

    content.appendChild(node);
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    var overlay = document.getElementById(MODAL_ID);
    if (!overlay) return;
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ---------- Per-diagram zoom button ----------
  function zoomIconSVG() {
    return (
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M15 3h6v6"></path>' +
        '<path d="M9 21H3v-6"></path>' +
        '<path d="M21 3l-7 7"></path>' +
        '<path d="M3 21l7-7"></path>' +
      '</svg>'
    );
  }

  function buildZoomButton(targetEl) {
    var btn = document.createElement("button");
    btn.className = BTN_CLASS;
    btn.type = "button";
    btn.title = "Agrandir (plein ecran)";
    btn.setAttribute("aria-label", "Agrandir le diagramme");
    btn.innerHTML = zoomIconSVG();
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      log("button click", targetEl);
      openModalWith(targetEl);
    });
    return btn;
  }

  function wrapDiagrams() {
    var diagrams = document.querySelectorAll(".mermaid, pre.mermaid");

    diagrams.forEach(function (el) {
      if (el.closest("#" + MODAL_ID)) return;
      if (el.dataset.zoomBound === "1") return;

      // Don't wrap the source-code block before Mermaid has had a chance to
      // render. We consider it "rendered" if either the SVG is present OR the
      // Material theme has marked it with data-processed.
      var processed =
        !!el.querySelector("svg") ||
        (el.shadowRoot && el.shadowRoot.querySelector("svg")) ||
        el.getAttribute("data-processed") === "true" ||
        el.classList.contains("mermaid-rendered");

      if (!processed) return;

      el.dataset.zoomBound = "1";

      // Wrap the diagram so we can absolutely-position the button.
      var wrapper;
      if (el.parentElement && el.parentElement.classList.contains(WRAPPER_CLASS)) {
        wrapper = el.parentElement;
      } else {
        wrapper = document.createElement("div");
        wrapper.className = WRAPPER_CLASS;
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      }

      wrapper.appendChild(buildZoomButton(el));

      // Also: clicking the diagram itself opens the modal (fallback).
      el.style.cursor = "zoom-in";
      el.addEventListener("click", function (e) {
        // Don't steal selections the user is actively making.
        var sel = window.getSelection ? window.getSelection().toString() : "";
        if (sel && sel.length > 3) return;
        // Let real links / interactive nodes behave normally.
        if (e.target.closest("a, button, input, textarea")) return;
        e.stopPropagation();
        openModalWith(el);
      });
    });
  }

  // ---------- Boot ----------
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  createModal();

  var observer = new MutationObserver(function () {
    wrapDiagrams();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "data-processed"]
  });

  wrapDiagrams();
  [300, 800, 1800, 3500, 7000].forEach(function (ms) {
    setTimeout(wrapDiagrams, ms);
  });

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      [200, 800, 2500, 5000].forEach(function (ms) {
        setTimeout(wrapDiagrams, ms);
      });
    });
  }
})();
