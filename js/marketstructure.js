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
