// js/data.js

function stripBOM(s){
  return String(s || "").replace(/^\uFEFF/, "");
}

function cleanHeader(h){
  return stripBOM(h).trim();
}

function toNumber(x){
  const n = Number(String(x ?? "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function parseYYYYMMToDate(yyyymm){
  const t = String(yyyymm || "").trim();
  if(!/^\d{6}$/.test(t)) return null;
  const y = Number(t.slice(0,4));
  const m = Number(t.slice(4,6));
  if(!(y >= 1900 && m >= 1 && m <= 12)) return null;
  return new Date(Date.UTC(y, m-1, 1));
}

// Robust CSV row parser (handles quotes and commas)
function parseCSV(text){
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  const s = stripBOM(text || "");
  for(let i=0;i<s.length;i++){
    const c = s[i];

    if(inQuotes){
      if(c === '"'){
        const next = s[i+1];
        if(next === '"'){ field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if(c === '"'){
        inQuotes = true;
      } else if(c === ","){
        row.push(field);
        field = "";
      } else if(c === "\n"){
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if(c === "\r"){
        // ignore
      } else {
        field += c;
      }
    }
  }
  // last field
  row.push(field);
  rows.push(row);

  // drop empty trailing lines
  return rows.filter(r => r.some(v => String(v ?? "").trim() !== ""));
}

export function loadPriceCheckCSV(csvText){
  const table = parseCSV(csvText);
  if(!table.length) throw new Error("CSV is empty.");

  const rawHeaders = table[0].map(cleanHeader);
  const headersLower = rawHeaders.map(h => h.toLowerCase());

  // helper: find column index by any of these names (case-insensitive)
  const col = (...names) => {
    for(const nm of names){
      const idx = headersLower.indexOf(String(nm).toLowerCase());
      if(idx >= 0) return idx;
    }
    return -1;
  };

  const idxArtistID   = col("ArtistID");
  const idxArtistName = col("ArtistName");
  const idxMonth      = col("MonthYYYYMM", "Month", "YYYYMM");
  const idxValue      = col("ValueGBP", "PriceGBP", "Price", "Value");
  const idxLocCode    = col("LocationCode", "LocCode");
  const idxLotNo      = col("LotNo", "Lot", "LotNumber");
  const idxSaleURL    = col("SaleURL", "SaleUrl", "URL", "Link");

  if(idxArtistID < 0 || idxArtistName < 0 || idxMonth < 0 || idxValue < 0){
    throw new Error(
      "CSV headers not recognised. Need at least: ArtistID, ArtistName, MonthYYYYMM, ValueGBP."
    );
  }

  const lotRows = [];
  const artistMap = new Map();

  for(let r=1; r<table.length; r++){
    const row = table[r];

    const idRaw = row[idxArtistID];
    const nameRaw = row[idxArtistName];

    const id = String(idRaw ?? "").trim();
    const name = String(nameRaw ?? "").trim();
    if(!id || !name) continue;

    const date = parseYYYYMMToDate(row[idxMonth]);
    if(!date) continue;

    const price = toNumber(row[idxValue]);
    if(!Number.isFinite(price)) continue;

    const LocationCode = idxLocCode >= 0 ? String(row[idxLocCode] ?? "").trim() : "";
    const LotNo = idxLotNo >= 0 ? String(row[idxLotNo] ?? "").trim() : "";
    let SaleURL = idxSaleURL >= 0 ? String(row[idxSaleURL] ?? "").trim() : "";

    // Some exports put spaces or invisible chars in URLs
    SaleURL = SaleURL.replace(/\s+/g, "");
    if(SaleURL && !SaleURL.startsWith("http")) {
      // if it’s something like "www.sothebys.com/..." fix it
      if(SaleURL.startsWith("www.")) SaleURL = "https://" + SaleURL;
    }

    lotRows.push({
      id,
      name,
      date,
      price,
      LocationCode,
      LotNo,
      SaleURL
    });

    if(!artistMap.has(id)){
      artistMap.set(id, { id, name });
    }
  }

  const artists = Array.from(artistMap.values()).sort((a,b) => a.name.localeCompare(b.name));

  return {
    lotRows,
    artists,
    getArtistName: (id) => artistMap.get(String(id))?.name || String(id)
  };
}
