// js/data.js
// Minimal CSV loader for PriceCheck only (no Workbench dependency)

function parseCSV(text){
  const lines = String(text || "")
    .replace(/\r/g, "")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if(lines.length < 2) return { header: [], rows: [] };

  // NOTE: naive CSV split (OK if your fields don’t contain commas inside quotes)
  const header = lines[0].split(",").map(s => s.trim());
  const rows = lines.slice(1).map(line => line.split(","));

  return { header, rows };
}

function idxOf(header, names){
  const lower = header.map(h => String(h || "").trim().toLowerCase());
  for(const n of names){
    const i = lower.indexOf(String(n).toLowerCase());
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

function cleanStr(v){
  const t = String(v ?? "").trim();
  if(!t) return "";
  const u = t.toUpperCase();
  if(u === "NULL" || u === "N/A" || u === "NA") return "";
  return t;
}

function cleanUrl(v){
  const t = cleanStr(v);
  // allow relative or absolute; just return empty if missing
  return t;
}

export function loadPriceCheckCSV(text){
  const { header, rows } = parseCSV(text);

  // Required columns (accept common variants)
  const iArtistId   = idxOf(header, ["artistid","artist_id","id"]);
  const iArtistName = idxOf(header, ["artistname","artist_name","name"]);
  const iPrice      = idxOf(header, ["valuegbp","pricegbp","hammergbp","hammer_price_gbp","price","value"]);
  const iMonth      = idxOf(header, ["monthyyyy","monthyyy","yyyymm","month"]);

  if(iArtistId === -1 || iArtistName === -1 || iPrice === -1 || iMonth === -1){
    throw new Error(
      "CSV headers not recognised. Need ArtistID, ArtistName, ValueGBP, MonthYYYY (YYYYMM)."
    );
  }

  // Optional columns for tooltip / click-through
  const iLotNo     = idxOf(header, ["lotno","lot_no","lotnumber","lot_number","lot"]);
  const iAuctionId = idxOf(header, ["auctionid","auction_id","saleid","sale_id","auction"]);
  const iLocCode   = idxOf(header, ["locationcode","location_code","loccode","loc_code","location"]);
  const iSaleUrl   = idxOf(header, ["saleurl","sale_url","url","loturl","lot_url","lotlink","lot_link"]);

  const lotRows = [];

  for(const r of rows){
    const id = cleanStr(r[iArtistId]);
    const name = cleanStr(r[iArtistName]);

    const priceRaw = cleanStr(r[iPrice]);
    const price = Number(priceRaw.replace(/[^0-9.\-]/g,""));

    const date = parseYYYYMM(cleanStr(r[iMonth]));

    if(!id || !name) continue;
    if(!Number.isFinite(price) || price <= 0) continue;
    if(!date) continue;

    const lotNo = (iLotNo !== -1) ? cleanStr(r[iLotNo]) : "";
    const auctionId = (iAuctionId !== -1) ? cleanStr(r[iAuctionId]) : "";
    const locationCode = (iLocCode !== -1) ? cleanStr(r[iLocCode]) : "";
    const saleUrl = (iSaleUrl !== -1) ? cleanUrl(r[iSaleUrl]) : "";

    lotRows.push({
      id,
      name,
      price,
      date,
      lotNo,
      auctionId,
      locationCode,
      saleUrl
    });
  }

  if(!lotRows.length){
    throw new Error("No valid rows parsed. Check MonthYYYY is YYYYMM and prices are numeric.");
  }

  // Artists list + lookup
  const nameById = new Map();
  for(const r of lotRows) nameById.set(r.id, r.name);

  const artists = [...nameById.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a,b)=>a.name.localeCompare(b.name));

  return {
    lotRows,
    artists,
    getArtistName: (id) => nameById.get(id) || id
  };
}
