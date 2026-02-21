// js/app.js
import { workbench } from "./workbench.js";
import { runPriceCheck, setPriceCheckScale } from "./pricecheck.js";

const el = (id)=>document.getElementById(id);
const escapeHtml = (s)=>String(s).replace(/[&<>"']/g, m => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[m]));

const file = el("file");
const status = el("status");

// Price check elements
const pcFormCard = el("pc-form-card");
const pcArtist = el("pc-artist");
const pcPrice = el("pc-price");
const pcMonth = el("pc-month");
const pcRun = el("pc-run");

const pcResults = el("pc-results");
const pcKpis = el("pc-kpis");
const pcStory = el("pc-story");
const pcUniverse = el("pc-universe");
const pcLogToggle = el("pc-log");
const pcBack = el("pc-back");

let lastRun = null;

// Load CSV
if(file){
  file.addEventListener("change", async (e)=>{
    const f = e.target.files?.[0];
    if(!f) return;

    const text = await f.text();

    try{
      const info = workbench.loadFromCSVText(text);

      if(status){
        status.textContent =
          `Loaded ${info.rowCount.toLocaleString()} lots across ${info.artistCount.toLocaleString()} artists. (Local only)`;
      }

      // Populate artist dropdown (ArtistID under hood; name shown)
      const artists = workbench.getArtists();
      pcArtist.innerHTML =
        `<option value="">Select artist…</option>` +
        artists.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.name)}</option>`).join("");

      pcArtist.disabled = false;
      pcRun.disabled = false;

      if(artists[0]) pcArtist.value = artists[0].id;

      // Reset view state
      lastRun = null;
      if(pcLogToggle) pcLogToggle.checked = false;
      showForm();
    }catch(err){
      alert(err.message || String(err));
    }
  });
}

pcRun?.addEventListener("click", ()=>{
  const artistId = pcArtist.value;
  const price = Number(pcPrice.value);

  if(!artistId){ alert("Select an artist."); return; }
  if(!Number.isFinite(price) || price <= 0){ alert("Enter a valid price."); return; }

  const myMonth = (pcMonth.value || "").trim();
  const yScale = (pcLogToggle && pcLogToggle.checked) ? "log" : "linear";

  try{
    runPriceCheck({
      workbench,
      artistId,
      price,
      windowMonths: null,          // always full history
      myMonthYYYYMM: myMonth,
      yScale,
      elKpis: pcKpis,
      elStory: pcStory,
      elChart: pcUniverse
    });

    lastRun = { artistId, price, myMonthYYYYMM: myMonth };

    // Results screen
    pcResults?.classList.remove("hidden");
    pcFormCard?.classList.add("hidden");
    pcResults?.scrollIntoView({behavior:"smooth", block:"start"});

    // Ensure Plotly sizes correctly
    setTimeout(()=>window.dispatchEvent(new Event("resize")), 40);

  }catch(err){
    alert(err.message || String(err));
  }
});

// Toggle y-scale AFTER chart exists
pcLogToggle?.addEventListener("change", ()=>{
  if(!lastRun) return;
  const scale = pcLogToggle.checked ? "log" : "linear";
  setPriceCheckScale(pcUniverse, scale);
});

pcBack?.addEventListener("click", ()=>{
  showForm();
});

function showForm(){
  pcFormCard?.classList.remove("hidden");
  pcResults?.classList.add("hidden");
  setTimeout(()=>window.dispatchEvent(new Event("resize")), 40);
}
