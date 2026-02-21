// js/data.js
// Minimal CSV loader for PriceCheck only (no Workbench dependency)

function parseCSV(text){
  const lines = String(text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if(lines.length < 2) return { header: [], rows: [] };

  // naive CSV split (OK if your fields don’t contain commas inside quotes)
  const header = lines[0].split(",").map(s => s.trim());
  const rows = lines.slice(1).map(line => line.split(","));

  return { header, rows };
}

function idxOf(header, names){
  const lower = header.map(h => h.toLowerCase());
  for(const n of names){
    const i = lower.indexOf(n.toLowerCase());
    if(i !== -1) return i;
  }
  return -1;
}

function parseYYYYMM(v){
  const t = String(v || "").trim();
  if(!/^\d{6}$/.test(t)) return null;
  const y = Number(t.slice(0,4));
  const m = Number(t.slice(4,6));
  if(!(y>=1900 && m>=1 && m<=12)) return null;
  return new Date(Date.UTC(y, m-1, 1));
}

export function loadPriceCheckCSV(text){
  const { header, rows } = parseCSV(text);

  // Accept a few common header variants
  const iArtistId   = idxOf(header, ["artistid","artist_id","id"]);
  const iArtistName = idxOf(header, ["artistname","artist_name","name"]);
  const iPrice      = idxOf(header, ["valuegbp","pricegbp","hammergbp","price","value"]);
  const iMonth      = idxOf(header, ["monthyyyy","monthyyy","yyyymm","month"]);

  if(iArtistId === -1 || iArtistName === -1 || iPrice === -1 || iMonth === -1){
    throw new Error(
      "CSV headers not recognised. Need ArtistID, ArtistName, ValueGBP, MonthYYYY (YYYYMM)."
    );
  }

  const lotRows = [];
  for(const r of rows){
    const id = (r[iArtistId] ?? "").trim();
    const name = (r[iArtistName] ?? "").trim();
    const price = Number(String(r[iPrice] ?? "").replace(/[^0-9.\-]/g,""));
    const date = parseYYYYMM(r[iMonth]);

    if(!id || !name) continue;
    if(!Number.isFinite(price) || price <= 0) continue;
    if(!date) continue;

    lotRows.push({
      id,
      name,
      price,
      date,

      // optional fields if present later
      lotNo: null,
      auctionId: null,
      locationCode: null,
      saleUrl: null
    });
  }

  if(!lotRows.length){
    throw new Error("No valid rows parsed. Check MonthYYYY is YYYYMM and prices are numeric.");
  }

  // artists list
  const nameById = new Map();
  for(const r of lotRows) nameById.set(r.id, r.name);

  const artists = [...nameById.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a,b)=>a.name.localeCompare(b.name));

  return {
    lotRows,
    artists,
    getArtistName: (id)=> nameById.get(id) || id
  };
}
