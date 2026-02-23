// js/pricecheck.js

// ------------------------------------------------------------
// LocationCode -> "Auction house · CITY" mapping
// ------------------------------------------------------------
const LOCATION_LOOKUP = {
  "33AUBALI": "33 Auction · BALI",
  "33AUJAKA": "33 Auction · JAKARTA",
  "33AUONLI": "33 Auction · ONLINE",
  "33AUOSGD": "33 Auction · ONLINE SGD",
  "33AUSING": "33 Auction · SINGAPORE",
  "ARTCDROU": "Artcurial · DROUOT",
  "ARTCMARR": "Artcurial · MARRAKESH",
  "ARTCMCAR": "Artcurial · MONTE CARLO",
  "ARTCOEUR": "Artcurial · ONLINE EUR",
  "ARTCPARI": "Artcurial · PARIS",
  "ARTHLAGO": "ArtHouseNG · LAGOS",
  "AUCTONLI": "Auctionsverket · ONLINE",
  "AUCTOSEK": "Auctionsverket · ONLINE SEK",
  "AUCTSTOC": "Auctionsverket · STOCKHOLM",
  "AUCTOLDD": "Auctionsverket · ONLINE DKK",
  "AUCTOEUR": "Auctionsverket · ONLINE EUR",
  "AUCTOUSD": "Auctionsverket · ONLINE USD",
  "CHPOBEIJ": "Beijing Poly Intl · BEIJING",
  "CHPOHONG": "Beijing Poly Intl · HONG KONG",
  "BONHBRED": "Bonhams · BREDGATE",
  "BONHEDIN": "Bonhams · EDINBURGH",
  "BONHHONG": "Bonhams · HONG KONG",
  "BONHLOND": "Bonhams · LONDON",
  "BONHLOSA": "Bonhams · LOS ANGELES",
  "BONHMARL": "Bonhams · MARLBOROUGH",
  "BONHMELB": "Bonhams · MELBOURNE",
  "BONHNEWY": "Bonhams · NEW YORK",
  "BONHONLI": "Bonhams · ONLINE",
  "BONHOAUD": "Bonhams · ONLINE AUD",
  "BONHOHCF": "Bonhams · ONLINE CHF",
  "BONHODKK": "Bonhams · ONLINE DKK",
  "BONHOEUR": "Bonhams · ONLINE EUR",
  "BONHOGBP": "Bonhams · ONLINE GBP",
  "BONHOHKD": "Bonhams · ONLINE HKD",
  "BONHOUSD": "Bonhams · ONLINE USD",
  "BONHOXFO": "Bonhams · OXFORD",
  "BONHPARI": "Bonhams · PARIS",
  "BONHSANF": "Bonhams · SAN FRANCISCO",
  "BONHSYDN": "Bonhams · SYDNEY",
  "BONHBRUS": "Bonhams · BRUSSELS",
  "BUKOHELS": "Bukowskis · HELSINKY",
  "BUKOONLI": "Bukowskis · ONLINE",
  "BUKOOEUR": "Bukowskis · ONLINE EUR",
  "BUKOOSEK": "Bukowskis · ONLINE SEK",
  "BUKOSTOC": "Bukowskis · STOCKHOLM",
  "CHGUBEIJ": "China Guardian · BEIJING",
  "CHGUHONG": "China Guardian · HONG KONG",
  "CHRIAMST": "Christie's · AMSTERDAM",
  "CHRIDOHA": "Christie's · DOHA",
  "CHRIDUBA": "Christie's · DUBAI",
  "CHRIGENE": "Christie's · GENEVA",
  "CHRIHONG": "Christie's · HONG KONG",
  "CHRILOND": "Christie's · LONDON",
  "CHRIMILA": "Christie's · MILAN",
  "CHRINEWY": "Christie's · NEW YORK",
  "CHRIONLI": "Christie's · ONLINE",
  "CHRIOHCF": "Christie's · ONLINE CHF",
  "CHRIOEUR": "Christie's · ONLINE EUR",
  "CHRIOGBP": "Christie's · ONLINE GBP",
  "CHRIOHKD": "Christie's · ONLINE HKD",
  "CHRIOUSD": "Christie's · ONLINE USD",
  "CHRIPARI": "Christie's · PARIS",
  "CHRISHAN": "Christie's · SHANGHAI",
  "CHRIZURI": "Christie's · ZURICH",
  "AGUTDROU": "Claude Aguttes · DROUOT",
  "AGUTLYON": "Claude Aguttes · LYON",
  "AGUTNEUI": "Claude Aguttes · NEUILLY",
  "AGUTONLI": "Claude Aguttes · ONLINE",
  "AGUTOEUR": "Claude Aguttes · ONLINE EUR",
  "AGUTPARI": "Claude Aguttes · PARIS",
  "COUEONLI": "Couer D'Alene · ONLINE",
  "COUERENO": "Couer D'Alene · RENO",
  "DOROGRAZ": "Dorotheum · GRAZ",
  "DOROKLAG": "Dorotheum · KLAGENFURT",
  "DOROLINZ": "Dorotheum · LINZ",
  "DOROONLI": "Dorotheum · ONLINE",
  "DOROOEUR": "Dorotheum · ONLINE EUR",
  "DOROPRAG": "Dorotheum · PRAGUE",
  "DOROSALZ": "Dorotheum · SALZBURG",
  "DOROWIEN": "Dorotheum · WIEN",
  "DOYLNEWY": "Doyle · NEW YORK",
  "FARSCORT": "Farsetti · CORTINA",
  "FARSMILA": "Farsetti · MILAN",
  "FARSONLI": "Farsetti · ONLINE",
  "FARSOEUR": "Farsetti · ONLINE EUR",
  "FARSPRAT": "Farsetti · PRATO",
  "HEFFONLI": "Heffel · ONLINE",
  "HEFFOCAD": "Heffel · ONLINE CAD",
  "HEFFTORO": "Heffel · TORONTO",
  "HEFFVANC": "Heffel · VANCOUVER",
  "HERINEWY": "Heritage · NEW YORK",
  "KORNBASE": "Kornfeld · BASEL",
  "KORNBERN": "Kornfeld · BERN",
  "KORNONLI": "Kornfeld · ONLINE",
  "KORNOHCF": "Kornfeld · ONLINE CHF",
  "LARABALI": "Larasati · BALI",
  "LARAJAKA": "Larasati · JAKARTA",
  "LARALOND": "Larasati · LONDON",
  "LARAOGBP": "Larasati · ONLINE GBP",
  "LARAOSGD": "Larasati · ONLINE SGD",
  "LARASING": "Larasati · SINGAPORE",
  "LEMPBERL": "Lempertz · BERLIN",
  "LEMPBRUS": "Lempertz · BRUSSELS",
  "LEMPCOLO": "Lempertz · COLOGNE",
  "LEMPOEUR": "Lempertz · ONLINE EUR",
  "LJOEMELB": "Leonard Joel · MELBOURNE",
  "LJOEONLI": "Leonard Joel · ONLINE",
  "LJOEOAUD": "Leonard Joel · ONLINE AUD",
  "LJOESYAR": "Leonard Joel · SOUTH YARA",
  "LJOESYDN": "Leonard Joel · SYDNEY",
  "LJOEWOOL": "Leonard Joel · WOOLHARA",
  "MEETONLI": "Meeting Art · ONLINE",
  "MEETVERC": "Meeting Art · VERCELLI",
  "MORTMEXC": "Morton Subastas · MEXICO CITY",
  "MORTOMXN": "Morton Subastas · ONLINE MXN",
  "PANDFLOR": "Pandolfini · FLORENCE",
  "PANDMILA": "Pandolfini · MILAN",
  "PANDONLI": "Pandolfini · ONLINE",
  "PANDOEUR": "Pandolfini · ONLINE EUR",
  "PHILGENE": "Phillips · GENEVA",
  "PHILHONG": "Phillips · HONG KONG",
  "PHILLOND": "Phillips · LONDON",
  "PHILMOSC": "Phillips · MOSCOW",
  "PHILNEWY": "Phillips · NEW YORK",
  "PHILONLI": "Phillips · ONLINE",
  "PHILOHCF": "Phillips · ONLINE CHF",
  "PHILOEUR": "Phillips · ONLINE EUR",
  "PHILOGBP": "Phillips · ONLINE GBP",
  "PHILOHKD": "Phillips · ONLINE HKD",
  "PHILOIDR": "Phillips · ONLINE IDR",
  "PHILOUSD": "Phillips · ONLINE USD",
  "PHILPARI": "Phillips · PARIS",
  "PHILTAIP": "Phillips · TAIPEI",
  "PHILTOKY": "Phillips · TOKYO",
  "RASMBRED": "Rasmussen · BREDGATE",
  "RASMONLI": "Rasmussen · ONLINE",
  "RASMODKK": "Rasmussen · ONLINE DKK",
  "RAVEONLI": "Ravenel · ONLINE",
  "RAVEONTD": "Ravenel · ONLINE NTD",
  "RAVETAIP": "Ravenel · TAIPEI",
  "SAFFKOCH": "Saffron Art · KOCHI",
  "SAFFMUMB": "Saffron Art · MUMBAI",
  "SAFFNDEL": "Saffron Art · NEW DELHI",
  "SAFFONLI": "Saffron Art · ONLINE",
  "SAFFOINR": "Saffron Art · ONLINE INR",
  "SALCMANI": "Salcedo · MANILA",
  "SALCONLI": "Salcedo · ONLINE",
  "SALCOPHP": "Salcedo · ONLINE PHP",
  "SEOUBUSA": "Seoul · BUSAN",
  "SEQUDAEG": "Seoul · DAEGU",
  "SEOUHONG": "Seoul · HONG KONG",
  "SEOUONLI": "Seoul · ONLINE",
  "SEOUOKRW": "Seoul · ONLINE KRW",
  "SEOUSEUL": "Seoul · SEOUL",
  "SMSIMELB": "Smith & Singer · MELBOURNE",
  "SMSIONLI": "Smith & Singer · ONLINE",
  "SMSISYDN": "Smith & Singer · SYDNEY",
  "SOTHCOLO": "Sotheby's · COLOGNE",
  "SOTHDOHA": "Sotheby's · DOHA",
  "SOTHDUBA": "Sotheby's · DUBAI",
  "SOTHGENE": "Sotheby's · GENEVA",
  "SOTHHONG": "Sotheby's · HONG KONG",
  "SOTHLASV": "Sotheby's · LAS VEGAS",
  "SOTHLOND": "Sotheby's · LONDON",
  "SOTHMIAM": "Sotheby's · MIAMI",
  "SOTHMILA": "Sotheby's · MILAN",
  "SOTHMCAR": "Sotheby's · MONTE CARLO",
  "SOTHMUMB": "Sotheby's · MUMBAI",
  "SOTHNEWY": "Sotheby's · NEW YORK",
  "SOTHONLI": "Sotheby's · ONLINE",
  "SOTHOCHF": "Sotheby's · ONLINE CHF",
  "SOTHOEUR": "Sotheby's · ONLINE EUR",
  "SOTHOGBP": "Sotheby's · ONLINE GBP",
  "SOTHOHKD": "Sotheby's · ONLINE HKD",
  "SOTHOIDR": "Sotheby's · ONLINE IDR",
  "SOTHOUSD": "Sotheby's · ONLINE USD",
  "SOTHPARI": "Sotheby's · PARIS",
  "SOTHSING": "Sotheby's · SINGAPORE",
  "SOTHZURI": "Sotheby's · ZURICH",
  "SWELCAPE": "Stephan Welz · CAPE TOWN",
  "SWELJOHA": "Stephan Welz · JOHANNESBURG",
  "SWELONLI": "Stephan Welz · ONLINE",
  "SWELOZAR": "Stephan Welz · ONLINE ZAR",
  "STRACAPE": "Strauss · CAPE TOWN",
  "STRAJOHA": "Strauss · JOHANNESBURG",
  "STRAONLI": "Strauss · ONLINE",
  "STRAOZAR": "Strauss · ONLINE ZAR",
  "SWANNEWY": "Swann · NEW YORK",
  "TAJAONLI": "Tajan · ONLINE",
  "TAJAOEUR": "Tajan · ONLINE EUR",
  "TAJAPARI": "Tajan · PARIS",
  "TEHATEHR": "Tehran Auction · TEHRAN",
  "VGRIBERL": "Villa Grisebach · BERLIN",
  "VGRIONLI": "Villa Grisebach · ONLINE",
  "VGRIOEUR": "Villa Grisebach · ONLINE EUR",
  "ARTCBASE": "Artcurial · BASEL",
  "ARTCOCHF": "Artcurial · ONLINE EUR",
  "AUCTHELS": "Auktionsverket · HELSINKY",
  "SOTHSAAR": "Sothebys · SAUDI ARABIA"
};

function locationLabel(code){
  const c = String(code || "").trim();
  if(!c) return "—";
  const raw = LOCATION_LOOKUP[c] || c;

  if(raw.includes("·")){
    const [houseRaw, cityRaw] = raw.split("·").map(s => s.trim());
    const city = String(cityRaw || "")
      .toLowerCase()
      .replace(/\b\w/g, ch => ch.toUpperCase());
    return `${houseRaw} (${city})`;
  }
  return raw;
}

function fmtGBP(x){
  if(!Number.isFinite(x)) return "—";
  return "£" + Math.round(x).toLocaleString("en-GB");
}

function weightedQuantile(values, weights, q){
  const pairs = [];
  for(let i=0;i<values.length;i++){
    const v = values[i], w = weights[i];
    if(Number.isFinite(v) && Number.isFinite(w) && w > 0) pairs.push([v,w]);
  }
  if(!pairs.length) return NaN;
  pairs.sort((a,b)=>a[0]-b[0]);
  let total = 0;
  for(const [,w] of pairs) total += w;
  if(total <= 0) return NaN;

  const target = q * total;
  let cum = 0;
  for(const [v,w] of pairs){
    cum += w;
    if(cum >= target) return v;
  }
  return pairs[pairs.length-1][0];
}

function percentileRank(sortedArr, v){
  if(!sortedArr.length || !Number.isFinite(v)) return NaN;
  let lo = 0, hi = sortedArr.length;
  while(lo < hi){
    const mid = (lo + hi) >> 1;
    if(sortedArr[mid] <= v) lo = mid + 1;
    else hi = mid;
  }
  return (lo / sortedArr.length) * 100;
}

function parseYYYYMM(s){
  const t = String(s || "").trim();
  if(!/^\d{6}$/.test(t)) return null;
  const y = Number(t.slice(0,4));
  const m = Number(t.slice(4,6));
  return new Date(Date.UTC(y, m-1, 1));
}

function addMonthsUTC(d, deltaMonths){
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + deltaMonths, 1));
}

function windowN(allRows, endDate, months){
  const start = addMonthsUTC(endDate, -(months - 1));
  return allRows.filter(r => r.date >= start && r.date <= endDate);
}

function monthStartUTC(d){
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function monthKeyUTC(d){
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

function monthIndexUTC(d){
  return d.getUTCFullYear() * 12 + d.getUTCMonth();
}

function monthFromIndexUTC(idx){
  const y = Math.floor(idx / 12);
  const m = idx - y * 12;
  return new Date(Date.UTC(y, m, 1));
}

function buildMonthRangeUTC(minDate, maxDate){
  const a = monthIndexUTC(monthStartUTC(minDate));
  const b = monthIndexUTC(monthStartUTC(maxDate));
  const out = [];
  for(let i=a;i<=b;i++) out.push(monthFromIndexUTC(i));
  return out;
}

function ols(xs, ys){
  const n = xs.length;
  if(n < 2) return null;
  let sx=0, sy=0, sxx=0, sxy=0;
  for(let i=0;i<n;i++){
    const x = xs[i], y = ys[i];
    sx += x; sy += y;
    sxx += x*x; sxy += x*y;
  }
  const denom = (n*sxx - sx*sx);
  if(denom === 0) return null;
  const b = (n*sxy - sx*sy) / denom;
  const a = (sy - b*sx) / n;
  return { a, b };
}

// CSV fields (coming cleanly from data.js)
function getLocationCode(r){ return String(r.LocationCode ?? "").trim(); }
function getLotNo(r){ return String(r.LotNo ?? "").trim() || "—"; }
function getSaleURL(r){ return String(r.SaleURL ?? "").trim(); }

// ------------------------------------------------------------
// FMV slider (DOM + CSS)
// ------------------------------------------------------------
function renderMovement(el, {
  purchaseMonthUTC,
  latestMonthUTC,
  targetMonthUTC,
  price,
  equivValue
}){
  if(!el) return;
  el.innerHTML = "";

  const minD = purchaseMonthUTC;
  const maxD = (targetMonthUTC || latestMonthUTC);

  const minI = monthIndexUTC(minD);
  const maxI = monthIndexUTC(maxD);
  const span = Math.max(1, maxI - minI);

  const pct = (d) => ((monthIndexUTC(d) - minI) / span) * 100;

  const row = document.createElement("div");
  row.className = "pc-fmv-row";

  const track = document.createElement("div");
  track.className = "pc-fmv-track";

  const dotMy = document.createElement("div");
  dotMy.className = "pc-fmv-dot pc-fmv-dot-my";
  const dotEq = document.createElement("div");
  dotEq.className = "pc-fmv-dot pc-fmv-dot-eq";

  const bubMy = document.createElement("div");
  bubMy.className = "pc-fmv-bubble pc-fmv-bubble-my";
  bubMy.innerHTML = `<div class="pc-fmv-b1">My Artwork</div><div class="pc-fmv-b2">${fmtGBP(price)}</div>`;

  const bubEq = document.createElement("div");
  bubEq.className = "pc-fmv-bubble pc-fmv-bubble-eq";
  bubEq.innerHTML = `<div class="pc-fmv-b1">Revaluation</div><div class="pc-fmv-b2">${fmtGBP(equivValue)}</div>`;

  const myLeft = Math.max(0, Math.min(100, pct(purchaseMonthUTC)));
  const eqLeft = Math.max(0, Math.min(100, pct(maxD)));

  dotMy.style.left = `${myLeft}%`;
  dotEq.style.left = `${eqLeft}%`;
  bubMy.style.left = `${myLeft}%`;
  bubEq.style.left = `${eqLeft}%`;

  track.appendChild(dotMy);
  track.appendChild(dotEq);
  track.appendChild(bubMy);
  track.appendChild(bubEq);

  row.appendChild(track);

  const axis = document.createElement("div");
  axis.className = "pc-fmv-axis";

  const minY = minD.getUTCFullYear();
  const maxY = maxD.getUTCFullYear();

  for(let y=minY; y<=maxY; y++){
    const show = (y === minY || y === maxY || y % 2 === 0);
    if(!show) continue;

    const d = new Date(Date.UTC(y, 0, 1));
    if(monthIndexUTC(d) < minI) continue;
    if(monthIndexUTC(d) > maxI) continue;

    const t = document.createElement("div");
    t.className = "pc-fmv-tick";
    t.style.left = `${pct(d)}%`;
    t.textContent = String(y);
    axis.appendChild(t);
  }

  el.appendChild(row);
  el.appendChild(axis);
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------
export function runPriceCheck({
  workbench,
  artistId,
  price,
  myMonthYYYYMM,
  yScale,
  elChart
}){
  const all = workbench.getLotRows()
    .filter(r => r.id === artistId && Number.isFinite(r.price) && r.date)
    .sort((a,b)=>a.date-b.date);

  if(all.length < 10) throw new Error("Not enough auction history.");

  const artworkDate = parseYYYYMM(myMonthYYYYMM) || all[all.length-1].date;
  const latestDate  = all[all.length-1].date;

  const TRANSPORT_WINDOW_MONTHS = 24;
  const MIN_SALES_IN_WINDOW = 10;

  const x = all.map(r=>r.date);
  const y = all.map(r=>r.price);

  const customdata = all.map(r => [
    locationLabel(getLocationCode(r)),
    getLotNo(r),
    getSaleURL(r)
  ]);

  const hovertemplate =
    "%{x|%b %Y}<br>" +
    "<b>£%{y:,.0f}</b><br>" +
    "%{customdata[0]}<br>" +
    "Lot %{customdata[1]}" +
    "<extra>Click dot to open sale</extra>";

  // Base dots (WebGL)
  const baseTrace = {
    x, y, customdata,
    type:"scattergl",
    mode:"markers",
    marker:{size:6, color:"#2f3b63"},
    hovertemplate,
    showlegend:false,
    meta:"pc_base"
  };

  // ----------------------------
  // Weighted 24M rolling p50 + regression
  // ----------------------------
  const months = buildMonthRangeUTC(all[0].date, all[all.length-1].date);
  const allM = all.map(r => ({ ...r, _m: monthStartUTC(r.date) }));

  const monthCounts = new Map();
  for(const r of allM){
    const k = monthKeyUTC(r._m);
    monthCounts.set(k, (monthCounts.get(k) || 0) + 1);
  }

  let startPtr = 0;
  let endPtr = 0;

  const p50Dates = [];
  const p50Vals  = [];
  const p50T     = [];
  const monthToT = new Map();

  for(let i=0;i<months.length;i++){
    const endMonth = months[i];
    const startMonth = addMonthsUTC(endMonth, -(TRANSPORT_WINDOW_MONTHS - 1));

    while(endPtr < allM.length && allM[endPtr]._m <= endMonth) endPtr++;
    while(startPtr < allM.length && allM[startPtr]._m < startMonth) startPtr++;

    const win = allM.slice(startPtr, endPtr);
    if(win.length < MIN_SALES_IN_WINDOW) continue;

    const vals = [];
    const wts  = [];
    for(const r of win){
      const v = r.price;
      if(!Number.isFinite(v)) continue;
      const k = monthKeyUTC(r._m);
      const c = monthCounts.get(k) || 1;
      vals.push(v);
      wts.push(1 / c);
    }
    if(vals.length < MIN_SALES_IN_WINDOW) continue;

    const med = weightedQuantile(vals, wts, 0.5);
    if(!Number.isFinite(med) || med <= 0) continue;

    p50Dates.push(endMonth);
    p50Vals.push(med);
    p50T.push(i);
    monthToT.set(monthKeyUTC(endMonth), i);
  }

  let reg = null;
  if(p50T.length >= 2){
    reg = ols(p50T, p50Vals.map(v => Math.log(v)));
  }

  const regDates = [];
  const regVals  = [];
  if(reg){
    for(let i=0;i<months.length;i++){
      const v = Math.exp(reg.a + reg.b * i);
      if(Number.isFinite(v) && v > 0){
        regDates.push(months[i]);
        regVals.push(v);
      }
    }
  }

  const purchaseMonth = monthStartUTC(artworkDate);
  const latestMonth   = monthStartUTC(latestDate);

  function impliedValueAt(targetMonthUTC){
    if(!reg || !Number.isFinite(price) || price <= 0) return null;

    const tInput  = monthToT.get(monthKeyUTC(purchaseMonth));
    const tTarget = monthToT.get(monthKeyUTC(monthStartUTC(targetMonthUTC)));
    if(!Number.isFinite(tInput) || !Number.isFinite(tTarget)) return null;

    const winInput  = windowN(all, purchaseMonth, TRANSPORT_WINDOW_MONTHS);
    const winTarget = windowN(all, monthStartUTC(targetMonthUTC), TRANSPORT_WINDOW_MONTHS);
    if(winInput.length < MIN_SALES_IN_WINDOW || winTarget.length < MIN_SALES_IN_WINDOW) return null;

    const pInput  = Math.exp(reg.a + reg.b * tInput);
    const pTarget = Math.exp(reg.a + reg.b * tTarget);
    if(!Number.isFinite(pInput) || !Number.isFinite(pTarget) || pInput <= 0 || pTarget <= 0) return null;

    return price * (pTarget / pInput);
  }

  // IMPORTANT FIX:
  // Make p50 + regression ALSO scattergl so they draw ABOVE the dots (same canvas).
  const p50Trace = (p50Dates.length >= 2) ? {
    x: p50Dates,
    y: p50Vals,
    type:"scattergl",
    mode:"lines",
    line:{width:3.5, color:"rgba(47,59,99,0.45)"},
    hovertemplate:"24M rolling median (p50, month-weighted)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:true,
    meta:"pc_p50_24"
  } : null;

  const regTrace = (regDates.length >= 2) ? {
    x: regDates,
    y: regVals,
    type:"scattergl",
    mode:"lines",
    line:{width:4.5, color:"rgba(47,59,99,0.90)"},
    hovertemplate:"Trend line (regression through rolling p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:true,
    meta:"pc_p50_reg"
  } : null;

  const myArtworkTrace = Number.isFinite(price) ? {
    x:[purchaseMonth],
    y:[price],
    type:"scattergl",
    mode:"markers",
    marker:{size:14, color:"#fee7b1", line:{width:3, color:"#2c3a5c"}},
    hovertemplate:`My Artwork<br>%{x|%b %Y}<br><b>${fmtGBP(price)}</b><extra></extra>`,
    showlegend:false,
    meta:"pc_myartwork"
  } : null;

  const equivLatest = impliedValueAt(latestMonth);
  const revalTrace = (Number.isFinite(equivLatest)) ? {
    x:[latestMonth],
    y:[equivLatest],
    type:"scattergl",
    mode:"markers",
    marker:{size:12, color:"#2c3a5c"},
    hovertemplate:`Revaluation<br>%{x|%b %Y}<br><b>${fmtGBP(equivLatest)}</b><extra></extra>`,
    showlegend:false,
    meta:"pc_reval"
  } : null;

  // Order matters (later draws on top within same canvas)
  const traces = [];
  traces.push(baseTrace);
  if(p50Trace) traces.push(p50Trace);
  if(regTrace) traces.push(regTrace);
  if(myArtworkTrace) traces.push(myArtworkTrace);
  if(revalTrace) traces.push(revalTrace);

  const plotPromise = Plotly.newPlot(elChart, traces, {
    margin:{l:56,r:18,t:26,b:48},
    yaxis:{type:(yScale==="log")?"log":"linear"},
    xaxis:{type:"date"},
    hovermode:"closest",
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, {responsive:true, displayModeBar:false});

  // Percentile at purchase month
  const thenUniverse = all.filter(r => r.date <= artworkDate);
  const thenPricesAll = thenUniverse.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPricesAll, price);

  // ----------------------------
  // UI binding (restore light-blue dots on FMV open)
  // ----------------------------
  plotPromise.then(() => {
    const gd = elChart;

    const DARK_DOT  = "#2f3b63";
    const LIGHT_DOT = "#9bb7e0";

    const data = (gd && gd.data) ? gd.data : [];
    const idxBase  = data.findIndex(t => t && t.meta === "pc_base");
    const idxReval = data.findIndex(t => t && t.meta === "pc_reval");

    let btn = document.getElementById("pc-move-toggle");
    const panel  = document.getElementById("pc-move");
    const moveEl = document.getElementById("pc-move-chart");
    const capEl  = document.getElementById("pc-move-caption");

    const optin  = document.getElementById("pc-add-target");
    const uiWrap = document.getElementById("pc-target-ui");
    const inp    = document.getElementById("pc-target-month");
    const hint   = document.getElementById("pc-target-hint");

    if(!btn || !panel) return;

    // kill previous toggle listeners
    const btnClone = btn.cloneNode(true);
    btn.parentNode.replaceChild(btnClone, btn);
    btn = btnClone;

    const setHint = (t) => { if(hint) hint.textContent = t || ""; };

    const parseTarget = () => {
      const d = parseYYYYMM(inp?.value || "");
      if(!d) return null;
      if(d < months[0]) return months[0];
      if(d > months[months.length-1]) return months[months.length-1];
      return d;
    };

    const monthLabel = (d) =>
      d.toLocaleString("en-GB", { month:"short", year:"numeric", timeZone:"UTC" });

    function updateRevalDot(targetMonthUTC){
      if(idxReval < 0) return;
      const equiv = impliedValueAt(targetMonthUTC);
      if(!Number.isFinite(equiv)) return;

      Plotly.restyle(gd, {
        x: [[targetMonthUTC]],
        y: [[equiv]],
        hovertemplate: [`Revaluation<br>%{x|%b %Y}<br><b>${fmtGBP(equiv)}</b><extra></extra>`]
      }, [idxReval]);
    }

    function renderFMV(targetMonthUTC){
      const equiv = impliedValueAt(targetMonthUTC);
      if(!Number.isFinite(equiv)){
        if(moveEl) moveEl.innerHTML = "";
        if(capEl) capEl.textContent =
          "Not enough auction activity around one of the selected dates to compute a fair-market translation.";
        return;
      }

      renderMovement(moveEl, {
        purchaseMonthUTC: purchaseMonth,
        latestMonthUTC: latestMonth,
        targetMonthUTC: targetMonthUTC,
        price,
        equivValue: equiv
      });

      if(capEl){
        capEl.textContent = "For retrospective valuations, add target month to recalculate.";
      }

      updateRevalDot(targetMonthUTC);
    }

    function openPanel(){
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▴";

      // LIGHT BLUE dots on FMV open
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": LIGHT_DOT }, [idxBase]);

      renderFMV(latestMonth);

      if(optin) optin.checked = false;
      if(uiWrap) uiWrap.classList.add("hidden");
      if(inp) inp.value = "";
      setHint("Enter a month in YYYYMM.");
    }

    function closePanel(){
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▾";

      // revert dots on close
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": DARK_DOT }, [idxBase]);

      if(optin) optin.checked = false;
      if(uiWrap) uiWrap.classList.add("hidden");
      if(inp) inp.value = "";
      setHint("");
    }

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if(isOpen) closePanel();
      else openPanel();
    });

    if(optin){
      optin.onchange = () => {
        const on = !!optin.checked;
        if(uiWrap) uiWrap.classList.toggle("hidden", !on);

        if(!on){
          renderFMV(latestMonth);
          return;
        }

        setHint("Enter a month in YYYYMM.");
        const d = parseTarget();
        if(d) renderFMV(d);
      };
    }

    if(inp){
      inp.addEventListener("input", () => {
        if(!(optin && optin.checked)) return;

        const d = parseTarget();
        if(!d){
          setHint("Enter a month in YYYYMM.");
          return;
        }

        setHint(`Target set to ${monthLabel(d)}.`);
        renderFMV(d);
      });
    }
  });

  return { pct, equivNow: impliedValueAt(latestMonth), plotPromise };
}
