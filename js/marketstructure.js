import { renderMarketStructure } from "./marketstructure.js";

renderMarketStructure({
  workbench,
  artistId,
  elTop: document.getElementById("pc-structure-top"),
  elBottom: document.getElementById("pc-structure-bottom"),
  toggleBtn: document.getElementById("pc-structure-toggle"),
  panelEl: document.getElementById("pc-structure-panel"),
  noteEl: document.getElementById("pc-structure-note")
});
export function renderMarketStructure({ elTop, elBottom, toggleBtn, panelEl, noteEl, workbench, artistId }) {
  if (!toggleBtn || !panelEl || !elTop || !elBottom) return;

  // collapse default
  panelEl.classList.add("hidden");
  toggleBtn.setAttribute("aria-expanded", "false");

  toggleBtn.addEventListener("click", () => {
    const willOpen = panelEl.classList.contains("hidden");
    panelEl.classList.toggle("hidden", !willOpen);
    toggleBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    const chev = toggleBtn.querySelector(".chev");
    if (chev) chev.textContent = willOpen ? "▴" : "▾";

    // (optional) lazy-render charts only on first open
    // if (willOpen && !panelEl.dataset.rendered) { ...render...; panelEl.dataset.rendered = "1"; }
  });

  // ...rest of your chart computation/rendering...
}
