// js/pricecheck.js

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

function renderBands(el, opts){
  if(!el) return;

  const { p30, p50, p70, priceNow, equivNow, captionText="" } = opts;

  if(![p30,p50,p70,priceNow,equivNow].every(Number.isFinite)){
    el.innerHTML = "";
    return;
  }

  const xmin = Math.min(p30, p50, p70, priceNow, equivNow);
  const xmax = Math.max(p30, p50, p70, priceNow, equivNow);
  const pad = (xmax - xmin) * 0.08 || 1;
  const range = [Math.max(0, xmin - pad), xmax + pad];

  Plotly.newPlot(el, [
    {
      x:[p30,p70], y:[0,0],
      mode:"lines",
      line:{width:12,color:"rgba(44,58,92,0.10)"},
      hoverinfo:"skip",
      showlegend:false
    },
    {
      x:[p50,p50], y:[-0.18,0.18],
      mode:"lines",
      line:{width:2,color:"rgba(0,0,0,0.25)"},
      hoverinfo:"skip",
      showlegend:false
    },
    {
      x:[priceNow], y:[0],
      mode:"markers",
      marker:{size:12,color:"#fee7b1",line:{width:3,color:"#2c3a5c"}},
      text:[`Your price: ${fmtGBP(priceNow)}`],
      hoverinfo:"text",
      showlegend:false
    },
    {
      x:[equivNow], y:[0],
      mode:"markers",
      marker:{size:11,color:"#2c3a5c"},
      text:[`Equivalent level today: ${fmtGBP(equivNow)}`],
      hoverinfo:"text",
      showlegend:false
    }
  ],{
    margin:{l:16,r:16,t:10,b:34},
    xaxis:{
      range,
      showgrid:false,
      zeroline:false,
      showline:false,
      ticks:"outside",
      ticklen:4,
      separatethousands:true
    },
    yaxis:{visible:false,range:[-0.6,0.6]},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  },{displayModeBar:false,responsive:true});

  const capEl=document.getElementById("pc-bands-caption");
  if(capEl) capEl.textContent=captionText;
}

export function runPriceCheck({
  workbench,
  artistId,
  price,
  myMonthYYYYMM,
  yScale,
  elChart
}){

  const all = workbench.getLotRows()
    .filter(r=>r.id===artistId && Number.isFinite(r.price) && r.date)
    .sort((a,b)=>a.date-b.date);

  if(all.length < 40) throw new Error("Not enough auction history.");

  const artworkDate = parseYYYYMM(myMonthYYYYMM) || all[all.length-1].date;
  const latestDate  = all[all.length-1].date;

  function window48(endDate){
    const start = new Date(Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth()-47,
      1
    ));
    return all.filter(r=>r.date>=start && r.date<=endDate);
  }

  const thenRows = window48(artworkDate);
  const nowRows  = window48(latestDate);

  if(thenRows.length<25 || nowRows.length<25)
    throw new Error("Insufficient data in 48-month window.");

  const thenPrices = thenRows.map(r=>r.price).sort((a,b)=>a-b);
  const pct = percentileRank(thenPrices, price);

  const quartileIndex = Math.min(3, Math.floor(pct/25));

  function quartileAverage(rows,qIndex){
    const prices=rows.map(r=>r.price).sort((a,b)=>a-b);
    const low=quantile(prices,qIndex*0.25);
    const high=quantile(prices,(qIndex+1)*0.25);
    const band=prices.filter(p=>p>=low && p<=high);
    return band.reduce((a,b)=>a+b,0)/band.length;
  }

  const avgThen=quartileAverage(thenRows,quartileIndex);
  const avgNow =quartileAverage(nowRows,quartileIndex);

  let factor=(avgNow-avgThen)/avgThen;

  const yearsElapsed=Math.max(1,(latestDate-artworkDate)/(365*24*60*60*1000));
  const maxMove=Math.min(0.25,0.05*yearsElapsed);

  if(factor>maxMove) factor=maxMove;
  if(factor<-maxMove) factor=-maxMove;

  const equivNow=price*(1+factor);

  const nowPrices=nowRows.map(r=>r.price).sort((a,b)=>a-b);
  const p30=quantile(nowPrices,0.30);
  const p50=quantile(nowPrices,0.50);
  const p70=quantile(nowPrices,0.70);

  renderBands(document.getElementById("pc-bands-chart"),{
    p30,p50,p70,
    priceNow:price,
    equivNow,
    captionText:
      "Clearing bands reflect the most recent 48 months. " +
      "The marker shows the equivalent clearing level today at the same market position."
  });

  const x=all.map(r=>r.date);
  const y=all.map(r=>r.price);

  Plotly.newPlot(elChart,[{
    x,y,
    type:"scattergl",
    mode:"markers",
    marker:{size:6,color:"#2f3b63"}
  }],{
    margin:{l:56,r:18,t:26,b:48},
    yaxis:{type:(yScale==="log")?"log":"linear"},
    paper_bgcolor:"rgba(0,0,0,0)",
    plot_bgcolor:"rgba(0,0,0,0)"
  },{responsive:true});

  return { pct, equivNow };
}
