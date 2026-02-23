/* ---------- FMV (date-axis) slider (DOM, not Plotly) ---------- */

.pc-bands-chart{
  /* give room for bubbles above track + axis below */
  height:auto !important;
  min-height: 120px;
}

.pc-fmv-row{
  position: relative;
  padding-top: 34px;       /* room for bubbles */
  padding-bottom: 10px;
}

.pc-fmv-track{
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: rgba(44,58,92,0.10);
}

/* dots */
.pc-fmv-dot{
  position:absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.pc-fmv-dot-my{
  background:#fee7b1;
  border:3px solid #2c3a5c;
}

.pc-fmv-dot-eq{
  background:#2c3a5c;
}

/* bubbles */
.pc-fmv-bubble{
  position:absolute;
  top: -34px;
  transform: translateX(-50%);
  padding: 8px 10px;
  border-radius: 12px;     /* rounded corners (as requested) */
  line-height: 1.05;
  box-shadow: 0 8px 18px rgba(0,0,0,.10);
  border: 1px solid rgba(44,58,92,0.18);
  white-space: nowrap;
  max-width: 44%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* colour-coded bubbles to match dots */
.pc-fmv-bubble-my{
  background: #fee7b1;
  border-color: rgba(44,58,92,0.35);
}

.pc-fmv-bubble-eq{
  background: #2c3a5c;
  color: #fff;
  border-color: rgba(255,255,255,0.20);
}

.pc-fmv-b1{
  font-size: 12px;
  font-weight: 700;
  opacity: .95;
}
.pc-fmv-b2{
  font-size: 13px;
  font-weight: 800;
  margin-top: 2px;
}

/* keep bubbles inside the panel (prevents falling off edges) */
.pc-fmv-bubble{
  left: clamp(6%, var(--left, 50%), 94%);
}

/* axis */
.pc-fmv-axis{
  position: relative;
  margin-top: 10px;
  height: 18px;
  font-size: 12px;
  color: rgba(17,17,17,.75);
}

.pc-fmv-tick{
  position:absolute;
  bottom:0;
  transform: translateX(-50%);
  white-space: nowrap;
}

.pc-fmv-tick::before{
  content:"";
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  bottom: 16px;
  width:1px;
  height:6px;
  background: rgba(44,58,92,0.22);
}

/* Target-month UI (input box) */
#pc-target-ui{
  margin-top: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(44,58,92,0.12);
  background: rgba(255,255,255,0.75);
}

#pc-target-month{
  height: 40px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
}
#pc-target-month:focus{
  border-color:#b8c0d3;
  box-shadow:0 0 0 3px rgba(44,58,92,.10);
}
