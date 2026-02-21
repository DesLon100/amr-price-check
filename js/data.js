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

function normHeader(h){
  // lower + remove spaces/underscores/dashes + keep alnum only
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-\/]+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function idxOfNorm(header, names){
  const norm = header.map(normHeader);
  for(const n of names){
    const target = normHeader(n);
    const i = norm.indexOf(target);
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
  if(!t) return "";
  return t; // allow relative or absolute
}

export function loadPriceCheckCSV(text){
  const { header, rows } = parseCSV(text);

  // Required columns (very tolerant matching)
  const iArtistId   = idxOfNorm(header, ["artistid","artist_id","id","artist"]);
  const iArtistName = idxOfNorm(header, ["artistname","artist_name","name","artistfullname"]);
  const iPrice      = idxOfNorm(header, ["valuegbp","pricegbp","hammergbp","hammerpricegbp","price","value"]);
  const iMonth      = idxOfNorm(header, ["monthyyyy","monthyyy","yyyymm","month","salemonth","auctionmonth"]);

  if(iArtistId === -1 || iArtistName === -1 || iPrice === -1 || iMonth === -1){
    throw new Error(
      "CSV headers not recognised. Need ArtistID, ArtistName, ValueGBP, MonthYYYY (YYYYMM)."
    );
  }

  // Optional columns for tooltip / click-through (very tolerant)
  const iLotNo = idxOfNorm(header, [
    "lotno","lotnumber","lot","lotid","lotnr","lot_num","lotnumbertext"
  ]);

  const iAuctionId = idxOfNorm(header, [
    "auctionid","saleid","sale_id","auction","auctioncode","auctionref"
  ]);

  const iLocCode = idxOfNorm(header, [
    "locationcode","loccode","location","location_code","salelocationcode"
  ]);

  const iSaleUrl = idxOfNorm(header, [
    "saleurl","loturl","url","link","lotlink","permalink","sale_link","lot_link"
  ]);

  // If you have house/city separately, we can build a locationCode-like string.
  // (This won’t match your HOUSE_MAP/CITY_MAP unless your data already uses codes,
  // but at least the tooltip won’t be blank.)
  const iHouse = idxOfNorm(header, ["house","auctionhouse","saleroom","provider"]);
  const iCity  = idxOfNorm(header, ["city","salecity","locationcity"]);

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

    let locationCode = (iLocCode !== -1) ? cleanStr(r[iLocCode]) : "";
    if(!locationCode && iHouse !== -1){
      const house = cleanStr(r[iHouse]);
      const city = (iCity !== -1) ? cleanStr(r[iCity]) : "";
      // Create something readable for the tooltip
      if(house || city) locationCode = city ? `${house} — ${city}` : house;
    }

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
