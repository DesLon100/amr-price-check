// js/pricecheck.js

// ------------------------------------------------------------
// LocationCode -> "Auction house · CITY" mapping (197 entries)
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

// Convert "House · CITY" -> "House (City)" for tooltips
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

function quantile(sortedArr, q){
  if(!sortedArr.length) return NaN;
  const pos = (sortedArr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if(sortedArr[base+1] === undefined) return sortedArr[base];
  return sortedArr[base] + rest * (sortedArr[base+1] - sortedArr[base]);
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

// Accept YYYYMM or YYYY-MM or YYYY-MM-DD; returns month-start UTC or null.
function parseTargetMonth(s){
  const t = String(s || "").trim();
  if(!t) return null;

  // YYYYMM
  if(/^\d{6}$/.test(t)){
    return parseYYYYMM(t);
  }

  // YYYY-MM or YYYY-MM-DD
  if(/^\d{4}-\d{2}(-\d{2})?$/.test(t)){
    const parts = t.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    if(!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return null;
    return new Date(Date.UTC(y, m-1, 1));
  }

  return null;
}

function addMonthsUTC(d, deltaMonths){
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + deltaMonths, 1));
}

function windowN(allRows, endDate, months){
  const start = addMonthsUTC(endDate, -(months - 1));
  return allRows.filter(r => r.date >= start && r.date <= endDate);
}

// Month key used for stable lookups
function monthKeyUTC(d){
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

// ------------------------------------------------------------
// Helpers for 24M rolling p50 + regression transport
// ------------------------------------------------------------
function monthStartUTC(d){
  if(!(d instanceof Date)) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
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
  const months = [];
  for(let i = a; i <= b; i++){
    months.push(monthFromIndexUTC(i));
  }
  return months;
}

function ols(xs, ys){
  const n = xs.length;
  if(n < 2) return null;

  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for(let i=0;i<n;i++){
    const x = xs[i], y = ys[i];
    sx += x; sy += y;
    sxx += x * x;
    sxy += x * y;
  }
  const denom = (n * sxx - sx * sx);
  if(denom === 0) return null;

  const b = (n * sxy - sx * sy) / denom;
  const a = (sy - b * sx) / n;
  return { a, b };
}

// Movement slider: single FMV slider with date axis + speech bubbles
function renderFMVSlider(el, {
  purchaseMonth,
  purchasePrice,
  targetMonth,
  targetValue,
  minDate,
  maxDate
}){
  if(!el) return;

  // widen range slightly so bubbles have breathing room
  const padL = addMonthsUTC(minDate, -2);
  const padR = addMonthsUTC(maxDate,  2);

  const y0 = 0;
  const bubbleY = 0.34;

  const traces = [
    // baseline line
    {
      x:[padL, padR],
      y:[y0, y0],
      type:"scatter",
      mode:"lines",
      line:{width:10, color:"rgba(44,58,92,0.10)"},
      hoverinfo:"skip",
      showlegend:false
    },
    // My Artwork dot
    {
      x:[purchaseMonth],
      y:[y0],
      type:"scatter",
      mode:"markers",
      marker:{size:12, color:"#fee7b1", line:{width:3, color:"#2c3a5c"}},
      hovertemplate:`My Artwork<br>%{x|%b %Y}<br><b>${fmtGBP(purchasePrice)}</b><extra></extra>`,
      showlegend:false
    },
    // Revaluation dot
    {
      x:[targetMonth],
      y:[y0],
      type:"scatter",
      mode:"markers",
      marker:{size:11, color:"#2c3a5c"},
      hovertemplate:`Revaluation<br>%{x|%b %Y}<br><b>${fmtGBP(targetValue)}</b><extra></extra>`,
      showlegend:false
    }
  ];

  const annotations = [
    {
      x: purchaseMonth, y: bubbleY,
      xref:"x", yref:"y",
      text: `My Artwork<br><b>${fmtGBP(purchasePrice)}</b>`,
      showarrow:true,
      arrowhead:2,
      arrowsize:1,
      arrowwidth:1,
      ax: 0, ay: 18,
      align:"center",
      bgcolor:"rgba(255,255,255,0.96)",
      bordercolor:"rgba(44,58,92,0.25)",
      borderwidth:1,
      borderpad:6,
      font:{size:12, color:"#111"}
    },
    {
      x: targetMonth, y: bubbleY,
      xref:"x", yref:"y",
      text: `Revaluation<br><b>${fmtGBP(targetValue)}</b>`,
      showarrow:true,
      arrowhead:2,
      arrowsize:1,
      arrowwidth:1,
      ax: 0, ay: 18,
      align:"center",
      bgcolor:"rgba(255,255,255,0.96)",
      bordercolor:"rgba(44,58,92,0.25)",
      borderwidth:1,
      borderpad:6,
      font:{size:12, color:"#111"}
    }
  ];

  Plotly.newPlot(el, traces, {
    margin:{l:16,r:16,t:18,b:44},
    xaxis:{
      type:"date",
      range:[padL, padR],
      showgrid:false,
      zeroline:false,
      ticks:"outside",
      ticklen:4,
      // every 2 years looks clean on a small slider
      dtick:"M24",
      tickformat:"%Y"
    },
    yaxis:{
      visible:false,
      range:[-0.6, 0.6]
    },
    annotations,
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, {displayModeBar:false, responsive:true});
}

// CSV fields
function getLocationCode(r){ return String(r.LocationCode ?? "").trim(); }
function getLotNo(r){ return String(r.LotNo ?? "").trim() || "—"; }
function getSaleURL(r){ return String(r.SaleURL ?? "").trim(); }

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

  // Scatter dots (baseline)
  const baseTrace = {
    x, y, customdata,
    type:"scattergl",
    mode:"markers",
    marker:{size:6, color:"#2f3b63"},
    hovertemplate,
    showlegend:false,
    meta:"pc_base"
  };

  // ------------------------------------------------------------
  // Precompute 24M rolling p50 + regression (hidden by default)
  // ------------------------------------------------------------
  const months = buildMonthRangeUTC(all[0].date, all[all.length-1].date);
  const allM = all.map(r => ({ ...r, _m: monthStartUTC(r.date) }));

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

    const prices = win.map(r=>r.price).filter(Number.isFinite).sort((a,b)=>a-b);
    if(prices.length < MIN_SALES_IN_WINDOW) continue;

    const med = quantile(prices, 0.5);
    if(!Number.isFinite(med) || med <= 0) continue;

    p50Dates.push(endMonth);
    p50Vals.push(med);
    p50T.push(i);
    monthToT.set(monthKeyUTC(endMonth), i);
  }

  let reg = null;
  if(p50T.length >= 2){
    const ys = p50Vals.map(v => Math.log(v));
    reg = ols(p50T, ys);
  }

  const regDates = [];
  const regVals  = [];
  if(reg){
    for(let i=0;i<months.length;i++){
      const ln = reg.a + reg.b * i;
      const v = Math.exp(ln);
      if(Number.isFinite(v) && v > 0){
        regDates.push(months[i]);
        regVals.push(v);
      }
    }
  }

  const purchaseMonth = monthStartUTC(artworkDate);

  // SVG lines (always render above scattergl dots)
  const p50Trace = (p50Dates.length >= 2) ? {
    x: p50Dates,
    y: p50Vals,
    type:"scatter",
    mode:"lines",
    line:{width:3.5, color:"rgba(47,59,99,0.45)"},
    hovertemplate:"24M rolling median (p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
    meta:"pc_p50_24"
  } : null;

  const regTrace = (regDates.length >= 2) ? {
    x: regDates,
    y: regVals,
    type:"scatter",
    mode:"lines",
    line:{width:4.5, color:"rgba(47,59,99,0.90)"},
    hovertemplate:"Trend line (regression through rolling p50)<br>%{x|%b %Y}<br><b>£%{y:,.0f}</b><extra></extra>",
    showlegend:false,
    visible:false,
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

  const traces = [baseTrace];
  if(p50Trace) traces.push(p50Trace);
  if(regTrace) traces.push(regTrace);
  if(myArtworkTrace) traces.push(myArtworkTrace);

  const plotPromise = Plotly.newPlot(elChart, traces, {
    margin:{l:56,r:18,t:26,b:48},
    yaxis:{type:(yScale==="log")?"log":"linear"},
    xaxis:{type:"date"},
    hovermode:"closest",
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  }, {responsive:true, displayModeBar:false});

  // Purchase-month percentile (unchanged)
  const thenUniverse = all.filter(r => r.date <= artworkDate);
  const thenPricesAll = thenUniverse.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPricesAll, price);

  // ---- implied value using regression ratio (input month -> target month)
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

  const defaultTargetMonth = monthStartUTC(latestDate);
  const equivNow = impliedValueAt(defaultTargetMonth);

  // ------------------------------------------------------------
  // UI behaviour: baseline -> open FMV -> show lines + FMV slider
  // plus optional target date input (no second slider).
  // ------------------------------------------------------------
  plotPromise.then(() => {
    const gd = elChart;

    const DARK_DOT  = "#2f3b63";
    const LIGHT_DOT = "#9bb7e0";

    // traces indexes
    const dataNow = (gd && gd.data) ? gd.data : [];
    const idxBase = dataNow.findIndex(tr => tr && tr.meta === "pc_base");
    const idxP50  = dataNow.findIndex(tr => tr && tr.meta === "pc_p50_24");
    const idxReg  = dataNow.findIndex(tr => tr && tr.meta === "pc_p50_reg");

    // DOM
    let btn   = document.getElementById("pc-move-toggle");
    const panel = document.getElementById("pc-move");
    const moveEl = document.getElementById("pc-move-chart");
    const capEl  = document.getElementById("pc-move-caption");

    const addTarget = document.getElementById("pc-add-target");
    const targetUI  = document.getElementById("pc-target-ui");
    const targetInp = document.getElementById("pc-target-month");
    const targetHint= document.getElementById("pc-target-hint");

    if(!btn || !panel) return;

    // kill any previous click handlers (reruns)
    const btnClone = btn.cloneNode(true);
    btn.parentNode.replaceChild(btnClone, btn);
    btn = btnClone;

    let currentTargetMonth = defaultTargetMonth;

    const clearFMV = () => {
      if(moveEl) moveEl.innerHTML = "";
      if(capEl) capEl.textContent = "";
    };

    const hideTargetBox = () => {
      if(addTarget) addTarget.checked = false;
      if(targetUI) targetUI.classList.add("hidden");
      if(targetInp) targetInp.value = "";
      if(targetHint) targetHint.textContent = "";
      currentTargetMonth = defaultTargetMonth;
    };

    const renderFMV = (targetMonthUTC) => {
      if(!moveEl) return;

      const v = impliedValueAt(targetMonthUTC);

      if(!Number.isFinite(v)){
        clearFMV();
        if(capEl){
          capEl.textContent =
            "Not enough auction activity around one of the selected dates to compute a fair-market revaluation for this artist.";
        }
        return;
      }

      renderFMVSlider(moveEl, {
        purchaseMonth,
        purchasePrice: price,
        targetMonth: monthStartUTC(targetMonthUTC),
        targetValue: v,
        minDate: months[0],
        maxDate: months[months.length - 1]
      });

      if(capEl){
        capEl.textContent =
          "For retrospective valuations, add target month to recalculate.";
      }
    };

    const applyBaseline = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": DARK_DOT }, [idxBase]);
      if(idxP50  >= 0) Plotly.restyle(gd, { visible:false }, [idxP50]);
      if(idxReg  >= 0) Plotly.restyle(gd, { visible:false }, [idxReg]);

      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▾";

      hideTargetBox();
      clearFMV();
    };

    const applyOn = () => {
      if(idxBase >= 0) Plotly.restyle(gd, { "marker.color": LIGHT_DOT }, [idxBase]);
      if(idxP50  >= 0) Plotly.restyle(gd, { visible:true }, [idxP50]);
      if(idxReg  >= 0) Plotly.restyle(gd, { visible:true }, [idxReg]);

      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = "▴";

      // default render = "today" target
      currentTargetMonth = defaultTargetMonth;
      renderFMV(currentTargetMonth);

      // keep target box hidden until opted-in
      hideTargetBox();
    };

    // target month opt-in
    if(addTarget){
      addTarget.onchange = () => {
        const on = !!addTarget.checked;
        if(targetUI) targetUI.classList.toggle("hidden", !on);

        if(on){
          if(targetHint){
            targetHint.textContent = "Enter a month to move the revaluation dot.";
          }
          // keep current as today until user enters a valid date
          currentTargetMonth = defaultTargetMonth;
          renderFMV(currentTargetMonth);
        } else {
          hideTargetBox();
          renderFMV(defaultTargetMonth);
        }
      };
    }

    // parse + apply target month on input (Enter / blur)
    const applyTargetFromInput = () => {
      if(!addTarget || !addTarget.checked) return;
      if(!targetInp) return;

      const d = parseTargetMonth(targetInp.value);
      if(!d){
        if(targetHint) targetHint.textContent = "Format: YYYYMM (e.g. 201906) or YYYY-MM.";
        return;
      }

      // clamp to dataset month range
      const minM = months[0];
      const maxM = months[months.length - 1];
      let dd = d;
      if(dd < minM) dd = minM;
      if(dd > maxM) dd = maxM;

      currentTargetMonth = dd;

      if(targetHint){
        targetHint.textContent = `Target set to ${dd.toLocaleString("en-GB", {month:"short", year:"numeric", timeZone:"UTC"})}.`;
      }

      renderFMV(currentTargetMonth);
    };

    if(targetInp){
      targetInp.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
          e.preventDefault();
          applyTargetFromInput();
          targetInp.blur();
        }
      });
      targetInp.addEventListener("blur", () => {
        applyTargetFromInput();
      });
    }

    // initial baseline
    applyBaseline();

    // FMV toggle binding
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if(isOpen) applyBaseline();
      else applyOn();
    });
  });

  return { pct, equivNow, plotPromise };
}
