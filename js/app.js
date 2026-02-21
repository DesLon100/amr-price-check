// js/app.js
import { workbench } from "./workbench.js";
import { runPriceCheck } from "./pricecheck.js";

const el = (id)=>document.getElementById(id);

const file = el("file");
const status = el("status");

// views
const tabs = Array.from(document.querySelectorAll(".tab"));
const views = {
  pricecheck: el("view-pricecheck"),
  workbench: el("view-workbench"),
  scatter: el("view-scatter")
};

// price check elements
const pcArtist = el("pc-artist");
const pcPrice = el("pc-price");
const pcMonth = el("pc-month");
const pcWindow = el("pc-window");
const pcRun = el("pc-run");
const pcResults = el("pc-results");
const pcKpis = el("pc-kpis");
const pcStructure = el("pc-structure");
const pcUniverse = el("pc-universe");

// tab switching
tabs.forEach(t=>{
  t.addEventListener("click", ()=>{
    tabs.forEach(x=>x.classList.remove("active"));
    t.classList.add("active");

    const v = t.getAttribute("data-view");
    Object.values(views).forEach(sec=>sec.classList.add("hidden"));
    views[v].classList.remove("hidden");

    // ensure Plotly resizes when switching
    setTimeout(()=>{ window.dispatchEvent(new Event("resize")); }, 40);
  });
});

file.addEventListener("change", async (e)=>{
  const f = e.target.files?.[0];
  if(!f) return;

  const text = await f.text();

  try{
    const info = workbench.loadFromCSVText(text);
    status.textContent = `Loaded ${info.rowCount.toLocaleString()} lots across ${info.artistCount.toLocaleString()} artists. (Local only)`;

    // populate Price Check dropdown (ArtistID values, name shown)
    const artists = workbench.getArtists();
    pcArtist.innerHTML = `<option value="">Select artist…</option>` + artists.map(a =>
      `<option value="${escapeHtml(a.id)}">${escapeHtml(a.name)}</option>`
    ).join("");
    pcArtist.disabled = false;
    pcRun.disabled = false;

    // default selection sync with workbench
    if(artists[0]){
      pcArtist.value = artists[0].id;
    }
  }catch(err){
    alert(err.message || String(err));
  }
});

pcRun.addEventListener("click", ()=>{
  const artistId = pcArtist.value;
  const price = Number(pcPrice.value);
  if(!artistId){ alert("Select an artist."); return; }
  if(!Number.isFinite(price) || price <= 0){ alert("Enter a valid price."); return; }

  const win = pcWindow.value === "all" ? null : Number(pcWindow.value);

  try{
    runPriceCheck({
      workbench,
      artistId,
      price,
      windowMonths: win,
      elKpis: pcKpis,
      elStructure: pcStructure,
      elChart: pcUniverse
    });

    pcResults.classList.remove("hidden");
    pcResults.scrollIntoView({behavior:"smooth", block:"start"});
  }catch(err){
    alert(err.message || String(err));
  }
});

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
}
