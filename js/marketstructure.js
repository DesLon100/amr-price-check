// js/marketstructure.js

export function renderMarketStructure({ elTop, elBottom, toggleBtn, panelEl, noteEl, workbench, artistId, myMonthYYYYMM }) {
  if (!toggleBtn || !panelEl || !elTop || !elBottom) return;

  // IMPORTANT: prevent multiple bindings when "Check price" is run again
  if (toggleBtn.dataset.msBound === "1") return;
  toggleBtn.dataset.msBound = "1";

  // collapsed by default
  panelEl.classList.add("hidden");
  toggleBtn.setAttribute("aria-expanded", "false");

  toggleBtn.addEventListener("click", () => {
    const willOpen = panelEl.classList.contains("hidden");
    panelEl.classList.toggle("hidden", !willOpen);
    toggleBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");

    const chev = toggleBtn.querySelector(".chev");
    if (chev) chev.textContent = willOpen ? "▴" : "▾";

    // placeholder so you can see it is working
    if (willOpen && noteEl) {
      noteEl.textContent = "Market Structure module ready.";
    }
  });
}
