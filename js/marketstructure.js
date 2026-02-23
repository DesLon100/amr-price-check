
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
