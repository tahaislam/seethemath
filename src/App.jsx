import { useState, useCallback, useMemo } from "react";

// ─── Design Tokens ───
const T = {
  bg: "#f7f5f0",
  card: "#ffffff",
  border: "#e8e3da",
  text: "#2a2520",
  textMid: "#5c5347",
  textMuted: "#9a8e7f",
  accent: "#2d6a4f",
  accentLight: "#2d6a4f18",
  accentMid: "#2d6a4f44",
  blue: "#3066be",
  blueLight: "#3066be18",
  orange: "#c4652a",
  orangeLight: "#c4652a18",
  purple: "#6b4fa0",
  purpleLight: "#6b4fa020",
  coral: "#c74d52",
  coralLight: "#c74d5218",
  font: "'Libre Baskerville', 'Georgia', serif",
  fontSans: "'Source Sans 3', 'Segoe UI', sans-serif",
  radius: 12,
  shadow: "0 2px 16px rgba(42,37,32,0.06)",
  shadowHover: "0 4px 24px rgba(42,37,32,0.10)",
};

// ─── Shared Components ───
function TopBar({ onHome, currentTopic }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 24px", borderBottom: `1px solid ${T.border}`,
      background: T.card, position: "sticky", top: 0, zIndex: 10,
    }}>
      <div onClick={onHome} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, background: T.accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: T.font,
        }}>∑</div>
        <span style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: "-0.3px" }}>SeeTheMath</span>
      </div>
      {currentTopic && (
        <button onClick={onHome} style={{
          background: T.accentLight, border: `1px solid ${T.accentMid}`,
          borderRadius: 8, padding: "6px 14px", fontFamily: T.fontSans,
          fontSize: 13, color: T.accent, cursor: "pointer", fontWeight: 600,
        }}>← All Topics</button>
      )}
    </div>
  );
}

function Chip({ children, active, onClick, color = T.accent }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", borderRadius: 20,
      border: active ? `2px solid ${color}` : `1.5px solid ${T.border}`,
      background: active ? color + "15" : T.card,
      color: active ? color : T.textMid,
      fontFamily: T.fontSans, fontSize: 13.5, fontWeight: active ? 700 : 500,
      cursor: "pointer", transition: "all 0.2s",
      boxShadow: active ? `0 0 0 3px ${color}10` : "none",
    }}>{children}</button>
  );
}

function StepWalkthrough({ steps, step, setStep, color = T.purple }) {
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0",
            opacity: i <= step ? 1 : 0.25, transition: "opacity 0.3s",
          }}>
            <div style={{
              minWidth: 26, height: 26, borderRadius: "50%",
              background: i <= step ? color : T.border,
              color: i <= step ? "#fff" : T.textMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, fontFamily: T.fontSans, transition: "all 0.3s",
            }}>{i + 1}</div>
            <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.text, margin: 0, lineHeight: 1.55, paddingTop: 3 }}>{s}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          style={{
            padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${T.border}`,
            background: T.card, fontFamily: T.fontSans, fontSize: 13, fontWeight: 600,
            color: step === 0 ? T.textMuted : T.text, cursor: step === 0 ? "default" : "pointer",
            opacity: step === 0 ? 0.5 : 1,
          }}>← Back</button>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}
          style={{
            padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${color}`,
            background: step === steps.length - 1 ? color + "18" : color,
            fontFamily: T.fontSans, fontSize: 13, fontWeight: 600,
            color: step === steps.length - 1 ? color : "#fff",
            cursor: step === steps.length - 1 ? "default" : "pointer",
          }}>{step === steps.length - 1 ? "Done ✓" : "Next Step →"}</button>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, min = 0, max = 12 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textMuted, fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{
          width: 28, height: 28, borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.bg, cursor: "pointer", fontSize: 16, color: T.textMid,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>−</button>
        <span style={{ width: 32, textAlign: "center", fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.text }}>{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{
          width: 28, height: 28, borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.bg, cursor: "pointer", fontSize: 16, color: T.textMid,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>+</button>
      </div>
    </div>
  );
}

function ModuleShell({ tag, tagColor, title, subtitle, children }) {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: T.fontSans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: tagColor, marginBottom: 6 }}>{tag}</div>
        <h2 style={{ fontFamily: T.font, fontSize: 26, fontWeight: 700, margin: 0, color: T.text }}>{title}</h2>
        <p style={{ fontFamily: T.fontSans, fontSize: 14.5, color: T.textMid, marginTop: 8, lineHeight: 1.5 }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ResultBadge({ label, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, justifyContent: "center",
      background: color + "12", border: `1.5px solid ${color}33`, borderRadius: 10, padding: "14px 20px", marginTop: 16,
    }}>
      <span style={{ fontFamily: T.fontSans, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color, opacity: 0.7 }}>Result</span>
      <span style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function formatFrac(n, d) {
  if (d === 1) return `${n}`;
  const g = gcd(Math.abs(n), Math.abs(d));
  const sn = n / g, sd = d / g;
  if (Math.abs(sn) >= sd) {
    const w = Math.floor(Math.abs(sn) / sd), rem = Math.abs(sn) % sd;
    const sign = sn < 0 ? "-" : "";
    return rem === 0 ? `${sign}${w}` : `${sign}${w} ${rem}/${sd}`;
  }
  return `${sn}/${sd}`;
}

// ─── Home ───
const topics = [
  { id: "fractions", icon: "◔", title: "Fractions", desc: "Area models and number lines for multiplying fractions — two visual models, one concept", color: T.accent, lightColor: T.accentLight, modules: ["Integer × Fraction", "Fraction × Fraction", "Mixed × Fraction", "Mixed × Mixed", "Number Line View"] },
  { id: "decimals", icon: "◒", title: "Decimals & Percents", desc: "From hundreds grids to real-world tax brackets — see percentages everywhere", color: T.blue, lightColor: T.blueLight, modules: ["Decimal place value", "Fraction → Decimal", "Percentage of a number", "Real World: Tax Brackets"] },
  { id: "ratios", icon: "⇌", title: "Ratios & Proportions", desc: "Tape diagrams and double number lines to see proportional relationships", color: T.orange, lightColor: T.orangeLight, modules: ["What is a ratio?", "Equivalent ratios", "Solving proportions"] },
  { id: "dilations", icon: "◇", title: "Dilations", desc: "Watch shapes grow and shrink around a center point with scale factors", color: T.coral, lightColor: T.coralLight, modules: ["Scale factor > 1", "Scale factor < 1", "Try your own dilation"] },
];

function HomePage({ onSelect }) {
  return (
    <div style={{ padding: "40px 24px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontFamily: T.font, fontSize: 36, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.8px", lineHeight: 1.2 }}>
          See the math. <span style={{ color: T.accent }}>Get the math.</span>
        </h1>
        <p style={{ fontFamily: T.fontSans, fontSize: 17, color: T.textMid, marginTop: 14, maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
          Interactive visual walkthroughs for the concepts that trip up middle schoolers. Built for students, parents, and teachers.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {topics.map((t) => (
          <div key={t.id} onClick={() => onSelect(t.id)} style={{
            background: T.card, border: `1.5px solid ${T.border}`, borderRadius: T.radius + 2,
            padding: "26px 24px", cursor: "pointer", boxShadow: T.shadow, transition: "all 0.25s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = T.shadowHover; e.currentTarget.style.borderColor = t.color + "66"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.borderColor = T.border; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: t.lightColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16, border: `1.5px solid ${t.color}22` }}>{t.icon}</div>
            <h3 style={{ fontFamily: T.font, fontSize: 19, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>{t.title}</h3>
            <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.textMid, lineHeight: 1.5, margin: "0 0 16px" }}>{t.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.modules.map((m, i) => (
                <span key={i} style={{ fontFamily: T.fontSans, fontSize: 11.5, color: t.color, background: t.lightColor, borderRadius: 6, padding: "3px 9px", fontWeight: 600, border: `1px solid ${t.color}20` }}>{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 56, padding: "20px 0", borderTop: `1px solid ${T.border}` }}>
        <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textMuted }}>SeeTheMath is free and open source. Built by Islam Taha for learners everywhere.</p>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
//  MODULE 1: FRACTIONS
// ════════════════════════════════════════════════════════════════

function SimpleAreaGrid({ rows, cols, shadeRows, shadeCols, labelTop, labelLeft, width = 340, height = 260, revealStep = 4 }) {
  // 0: just outer rectangle
  // 1: grid lines appear (division into rows/cols)
  // 2: shading appears on relevant columns/rows
  // 3: product cells fully highlighted, count visible
  // 4: same as 3 (result is shown in text below)
  const pad = { top: 44, left: 56, right: 16, bottom: 32 };
  const gw = width - pad.left - pad.right; const gh = height - pad.top - pad.bottom;
  const cw = gw / cols; const ch = gh / rows;

  const showGrid = revealStep >= 1;
  const showShading = revealStep >= 2;
  const showProductBorder = revealStep >= 3;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }}>
      <rect x={pad.left} y={pad.top} width={gw} height={gh} fill={T.accentLight} rx={3} />
      {/* Grid cells */}
      {showGrid && Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const isProduct = r < shadeRows && c < shadeCols;
          return (
            <rect key={`${r}-${c}`} x={pad.left + c * cw} y={pad.top + r * ch} width={cw} height={ch}
              fill={showShading && isProduct ? T.purple : "transparent"}
              opacity={showShading && isProduct ? 0.4 : 0.15}
              stroke={T.border} strokeWidth={1} rx={1} />
          );
        })
      )}
      {/* Product border */}
      {showProductBorder && (
        <rect x={pad.left} y={pad.top} width={shadeCols * cw} height={shadeRows * ch} fill="none" stroke={T.purple} strokeWidth={2.5} rx={2} />
      )}
      {/* Outer border */}
      <rect x={pad.left} y={pad.top} width={gw} height={gh} fill="none" stroke={T.textMuted} strokeWidth={1} rx={3} />
      {/* Labels — show top label from step 1, left label always */}
      {showShading && <text x={pad.left + (shadeCols * cw) / 2} y={pad.top - 14} textAnchor="middle" fill={T.purple} fontSize={15} fontWeight={700} fontFamily={T.font}>{labelTop}</text>}
      <text x={pad.left - 14} y={pad.top + (shadeRows * ch) / 2} textAnchor="middle" dominantBaseline="central" fill={T.purple} fontSize={15} fontWeight={700} fontFamily={T.font}
        transform={`rotate(-90, ${pad.left - 14}, ${pad.top + (shadeRows * ch) / 2})`}>{labelLeft}</text>
      {/* Denominator labels */}
      {showGrid && Array.from({ length: cols }).map((_, i) => (
        <text key={i} x={pad.left + i * cw + cw / 2} y={height - 8} textAnchor="middle" fill={T.textMuted} fontSize={10} fontFamily={T.fontSans}>1/{cols}</text>
      ))}
    </svg>
  );
}

function MixedGrid({ wholeR, fracR_n, fracR_d, wholeC, fracC_n, fracC_d, width = 420, height = 300, revealStep = 4 }) {
  // 0: outer rectangle + axis labels only
  // 1: section borders appear (decomposition visible)
  // 2: first partial products fill in with values
  // 3: all partial products visible
  // 4: equation bar below appears
  const pad = { top: 52, left: 64, right: 20, bottom: 24 };
  const gw = width - pad.left - pad.right; const gh = height - pad.top - pad.bottom;
  const totalRU = wholeR + fracR_n / fracR_d; const totalCU = wholeC + fracC_n / fracC_d;
  const pxR = gh / totalRU; const pxC = gw / totalCU;
  const rowSegs = []; const colSegs = [];
  if (wholeR > 0) rowSegs.push({ val: wholeR, label: `${wholeR}`, frac: false, n: wholeR, d: 1 });
  if (fracR_n > 0) rowSegs.push({ val: fracR_n / fracR_d, label: `${fracR_n}/${fracR_d}`, frac: true, n: fracR_n, d: fracR_d });
  if (wholeC > 0) colSegs.push({ val: wholeC, label: `${wholeC}`, frac: false, n: wholeC, d: 1 });
  if (fracC_n > 0) colSegs.push({ val: fracC_n / fracC_d, label: `${fracC_n}/${fracC_d}`, frac: true, n: fracC_n, d: fracC_d });
  let ry = 0; const rr = rowSegs.map(s => { const h2 = s.val * pxR; const o = { ...s, y: ry, h: h2 }; ry += h2; return o; });
  let cx = 0; const cr = colSegs.map(s => { const w2 = s.val * pxC; const o = { ...s, x: cx, w: w2 }; cx += w2; return o; });
  const colors = [[T.accent, T.blue], [T.orange, T.purple]];
  const partials = [];
  const totalSections = rr.length * cr.length;

  // Determine how many sections to reveal based on step
  const showBorders = revealStep >= 1;
  // At step 2, show first half of sections; at step 3+, show all
  const sectionsToShow = revealStep <= 1 ? 0 : revealStep === 2 ? Math.ceil(totalSections / 2) : totalSections;
  const showEquation = revealStep >= 3;

  let sectionIdx = 0;
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }}>
        <rect x={pad.left} y={pad.top} width={gw} height={gh} fill={T.accentLight} rx={3} />
        {rr.map((r, ri) => cr.map((c, ci) => {
          const color = colors[ri % 2][ci % 2];
          const num = r.n * c.n; const den = r.d * c.d;
          const label = den === 1 ? `${num}` : `${num}/${den}`;
          partials.push({ label, color });
          const idx = sectionIdx++;
          const showThisSection = idx < sectionsToShow;
          return (
            <g key={`${ri}-${ci}`}>
              {showThisSection && <rect x={pad.left + c.x} y={pad.top + r.y} width={c.w} height={r.h} fill={color} opacity={0.25} rx={2} />}
              {showBorders && <rect x={pad.left + c.x} y={pad.top + r.y} width={c.w} height={r.h} fill="none" stroke={showThisSection ? color : T.border} strokeWidth={showThisSection ? 2 : 1} strokeDasharray={showThisSection ? "none" : "4,4"} rx={2} />}
              {showThisSection && <text x={pad.left + c.x + c.w / 2} y={pad.top + r.y + r.h / 2} textAnchor="middle" dominantBaseline="central"
                fill={color} fontSize={r.h > 40 && c.w > 55 ? 16 : 12} fontWeight={700} fontFamily={T.font}>{label}</text>}
            </g>
          );
        }))}
        <rect x={pad.left} y={pad.top} width={gw} height={gh} fill="none" stroke={T.textMuted} strokeWidth={1} rx={3} />
        {rr.map((r, i) => <text key={`r${i}`} x={pad.left - 12} y={pad.top + r.y + r.h / 2} textAnchor="end" dominantBaseline="central" fill={T.text} fontSize={14} fontWeight={600} fontFamily={T.font}>{r.label}</text>)}
        {cr.map((c, i) => <text key={`c${i}`} x={pad.left + c.x + c.w / 2} y={pad.top - 16} textAnchor="middle" fill={T.text} fontSize={14} fontWeight={600} fontFamily={T.font}>{c.label}</text>)}
      </svg>
      {showEquation && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center", marginTop: 6, fontFamily: T.font, fontSize: 14 }}>
          {partials.map((p, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: T.textMuted }}>+</span>}
              <span style={{ background: p.color + "18", border: `1.5px solid ${p.color}44`, borderRadius: 6, padding: "3px 10px", fontWeight: 700, color: p.color }}>{p.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Number Line Visualization ───

function NumberLineFrac({ factorA, factorB, width = 480, height = 160, revealStep = 4 }) {
  // revealStep: 0=just line+0, 1=first hop, 2=second hop, 3=more hops, 4=product marked
  const aN = factorA.w * factorA.d + factorA.n;
  const aD = factorA.d;
  const bN = factorB.w * factorB.d + factorB.n;
  const bD = factorB.d;
  const prodN = aN * bN;
  const prodD = aD * bD;
  const prodVal = prodN / prodD;
  const aVal = aN / aD;
  const bVal = bN / bD;

  const lineMax = Math.max(prodVal, aVal, bVal, 1) * 1.15;
  const pad = { left: 40, right: 30, top: 30, bottom: 40 };
  const lw = width - pad.left - pad.right;
  const toX = (v) => pad.left + (v / lineMax) * lw;
  const lineY = 80;
  const arcH = 32;

  const isIntTimeFrac = factorA.w > 0 && factorA.n === 0 && factorB.w === 0;
  const isFracTimeFrac = factorA.w === 0 && factorB.w === 0;

  const ticks = new Map();
  ticks.set(0, "0");
  const addTick = (val, label) => { if (val >= 0 && val <= lineMax) ticks.set(val, label); };

  if (isIntTimeFrac) {
    for (let i = 1; i <= aN; i++) {
      const v = (bN * i) / bD;
      const g = gcd(bN * i, bD);
      addTick(v, bN * i / g === bD / g ? `${bN * i / g}` : `${bN * i / g}/${bD / g}`);
    }
    addTick(1, "1");
  } else if (isFracTimeFrac) {
    addTick(bVal, `${bN}/${bD}`);
    addTick(prodVal, formatFrac(prodN, prodD));
    addTick(1, "1");
    for (let i = 1; i < aD; i++) { addTick((bVal / aD) * i, ""); }
  } else {
    addTick(bVal, factorB.w > 0 ? (factorB.n > 0 ? `${factorB.w} ${factorB.n}/${factorB.d}` : `${factorB.w}`) : `${bN}/${bD}`);
    addTick(prodVal, formatFrac(prodN, prodD));
    addTick(1, "1");
    if (factorB.w > 0 && factorB.n > 0) addTick(factorB.w, `${factorB.w}`);
    if (factorA.w > 0) {
      for (let i = 1; i <= factorA.w; i++) {
        const v = bVal * i; const vn = bN * i; const vd = bD;
        const g2 = gcd(Math.abs(vn), vd);
        addTick(v, vn / g2 >= vd / g2 ? `${Math.floor(vn/vd)}${vn%vd ? ` ${(vn%vd)/g2}/${vd/g2}` : ""}` : `${vn / g2}/${vd / g2}`);
      }
    }
  }

  const sortedTicks = [...ticks.entries()].sort((a, b) => a[0] - b[0]);

  // Build all arcs
  const arcs = [];
  if (isIntTimeFrac) {
    for (let i = 0; i < aN; i++) {
      const x1 = toX(bVal * i); const x2 = toX(bVal * (i + 1));
      arcs.push({ x1, x2, mid: (x1 + x2) / 2, color: T.accent, label: i === 0 ? `${bN}/${bD}` : "", landVal: bVal * (i + 1) });
    }
  } else if (isFracTimeFrac) {
    arcs.push({ x1: toX(0), x2: toX(bVal), mid: (toX(0) + toX(bVal)) / 2, color: T.blue, label: `${bN}/${bD}`, isFirst: true, landVal: bVal });
    arcs.push({ x1: toX(0), x2: toX(prodVal), mid: (toX(0) + toX(prodVal)) / 2, color: T.coral, label: `${aN}/${aD} of ${bN}/${bD}`, isSecond: true, landVal: prodVal });
  } else {
    if (factorA.w > 0) {
      for (let i = 0; i < factorA.w; i++) {
        const x1 = toX(bVal * i); const x2 = toX(bVal * (i + 1));
        arcs.push({ x1, x2, mid: (x1 + x2) / 2, color: T.accent, label: i === 0 ? `1 × ${bN > bD ? formatFrac(bN, bD) : `${bN}/${bD}`}` : "", landVal: bVal * (i + 1) });
      }
    }
    if (factorA.n > 0) {
      const startV = bVal * factorA.w;
      arcs.push({ x1: toX(startV), x2: toX(prodVal), mid: (toX(startV) + toX(prodVal)) / 2, color: T.orange, label: `${factorA.n}/${factorA.d} of ${bN > bD ? formatFrac(bN, bD) : `${bN}/${bD}`}`, isFracPart: true, landVal: prodVal });
    }
  }

  // Progressive: how many arcs to show based on revealStep
  // step 0 = line only, step 1 = first arc, step 2 = second arc, etc.
  const arcsToShow = Math.min(revealStep, arcs.length);
  const showProductDot = revealStep >= 4;

  // Only show ticks that have been "reached" by visible arcs
  const maxLandVal = arcsToShow > 0 ? arcs[arcsToShow - 1].landVal : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }}>
      <line x1={pad.left - 10} y1={lineY} x2={width - pad.right} y2={lineY} stroke={T.textMid} strokeWidth={2} />
      <polygon points={`${width - pad.right},${lineY} ${width - pad.right - 8},${lineY - 4} ${width - pad.right - 8},${lineY + 4}`} fill={T.textMid} />

      {/* Tick marks — show 0 always, "1" always, others only when reached */}
      {sortedTicks.map(([val, label], i) => {
        const x = toX(val);
        const isProduct = Math.abs(val - prodVal) < 0.001 && val > 0;
        const isReached = val === 0 || val === 1 || val <= maxLandVal + 0.001;
        if (!isReached && !showProductDot) return null;
        return (
          <g key={i}>
            <line x1={x} y1={lineY - 8} x2={x} y2={lineY + 8} stroke={isProduct && showProductDot ? T.purple : T.textMid} strokeWidth={isProduct && showProductDot ? 2.5 : 1.5} />
            {label && (
              <text x={x} y={lineY + 24} textAnchor="middle" fill={isProduct && showProductDot ? T.purple : T.text} fontSize={isProduct && showProductDot ? 13 : 11}
                fontWeight={isProduct && showProductDot ? 700 : 500} fontFamily={T.fontSans}>{label}</text>
            )}
            {isProduct && showProductDot && (
              <circle cx={x} cy={lineY} r={5} fill={T.purple} opacity={0.8} />
            )}
          </g>
        );
      })}

      {/* Arcs — progressive */}
      {arcs.slice(0, arcsToShow).map((arc, i) => {
        const dy = arc.isSecond ? arcH + 14 : arc.isFracPart ? arcH + 4 : arcH;
        const cp1x = arc.x1 + (arc.x2 - arc.x1) * 0.25;
        const cp2x = arc.x1 + (arc.x2 - arc.x1) * 0.75;
        const pathD = `M ${arc.x1} ${lineY} C ${cp1x} ${lineY - dy}, ${cp2x} ${lineY - dy}, ${arc.x2} ${lineY}`;
        return (
          <g key={i}>
            <path d={pathD} fill="none" stroke={arc.color} strokeWidth={2} strokeDasharray={arc.isFirst ? "6,3" : "none"} opacity={arc.isFirst ? 0.5 : 0.8} />
            <circle cx={arc.x2} cy={lineY} r={3} fill={arc.color} />
            {arc.label && (
              <text x={arc.mid} y={lineY - dy - 4} textAnchor="middle" fill={arc.color} fontSize={10} fontWeight={600} fontFamily={T.fontSans}>{arc.label}</text>
            )}
          </g>
        );
      })}

      <circle cx={toX(0)} cy={lineY} r={4} fill={T.text} />

      {showProductDot && prodVal > 0 && (
        <text x={toX(prodVal)} y={lineY + 40} textAnchor="middle" fill={T.purple} fontSize={10} fontWeight={700} fontFamily={T.fontSans}>
          ▲ product
        </text>
      )}
    </svg>
  );
}

const fracExamples = [
  { tab: "Integer × Fraction", title: "3 × 2/5", a: { w: 3, n: 0, d: 1 }, b: { w: 0, n: 2, d: 5 },
    steps: ["Draw a rectangle 3 units tall and 1 unit wide.", "Divide the width into 5 equal columns — each is 1/5.", "Shade 2 columns to represent 2/5 of each row.", "Count shaded cells: 3 rows × 2 columns = 6 cells, each worth 1/5.", "Result: 6/5 = 1 1/5"],
    nlSteps: ["Start at 0 on the number line. Each hop will be 2/5 long.", "First hop: 0 → 2/5. We've taken one group of 2/5.", "Second hop: 2/5 → 4/5. Two groups of 2/5.", "Third hop: 4/5 → 6/5. Three groups of 2/5 — we passed 1!", "Result: 3 hops of 2/5 = 6/5 = 1 1/5. Repeated addition on the line!"] },
  { tab: "Fraction × Fraction", title: "2/3 × 3/4", a: { w: 0, n: 2, d: 3 }, b: { w: 0, n: 3, d: 4 },
    steps: ["Start with a 1×1 unit square — this is 'one whole.'", "Divide into 3 rows (thirds) and 4 columns (fourths) → 12 cells.", "Shade 2 rows down for 2/3, and 3 columns across for 3/4.", "The overlap is the product: 2×3 = 6 cells out of 12 total.", "Result: 6/12 = 1/2"],
    nlSteps: ["Mark 3/4 on the number line (dashed bracket from 0).", "Now we need 2/3 OF that 3/4 distance.", "Divide the 3/4 segment into 3 equal parts (thirds of 3/4).", "Take 2 of those 3 parts. That's 2/3 of 3/4.", "We land at 1/2. Key insight: multiplying by a fraction < 1 makes the result smaller!"] },
  { tab: "Mixed × Fraction", title: "1 2/3 × 3/4", a: { w: 1, n: 2, d: 3 }, b: { w: 0, n: 3, d: 4 },
    steps: ["Decompose 1 2/3 into two parts: 1 and 2/3.", "Both parts get multiplied by 3/4 — creating two sections.", "Top section: 1 × 3/4 = 3/4", "Bottom section: 2/3 × 3/4 = 6/12 = 1/2", "Sum: 3/4 + 1/2 = 5/4 = 1 1/4"],
    nlSteps: ["Mark 3/4 on the number line. We need 1 2/3 copies of it.", "First: 1 full hop of 3/4 → land at 3/4.", "Now we need 2/3 MORE of 3/4 (the fractional part).", "2/3 of 3/4 = 1/2. So hop from 3/4 to 3/4 + 1/2 = 5/4.", "Result: We land at 5/4 = 1 1/4. One full hop + a fractional hop."] },
  { tab: "Mixed × Mixed", title: "2 1/3 × 1 2/5", a: { w: 2, n: 1, d: 3 }, b: { w: 1, n: 2, d: 5 },
    steps: ["Decompose both: (2 + 1/3) × (1 + 2/5).", "This creates a 2×2 grid — four partial products.", "Compute each: 2×1=2, 2×2/5=4/5, 1/3×1=1/3, 1/3×2/5=2/15.", "Find common denominator 15 and sum all parts.", "30/15 + 12/15 + 5/15 + 2/15 = 49/15 = 3 4/15"],
    nlSteps: ["Mark 1 2/5 (= 7/5) on the number line. We need 2 1/3 copies of it.", "First hop: 0 → 7/5 = 1.4. One full copy.", "Second hop: 7/5 → 14/5 = 2.8. Two full copies.", "Now take 1/3 of 7/5 = 7/15 more. Hop from 14/5 to 14/5 + 7/15.", "14/5 = 42/15. Add 7/15 → 49/15 = 3 4/15. Two big hops + one small hop!"] },
];

function FractionsModule() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [tryMode, setTryMode] = useState(false);
  const [vizMode, setVizMode] = useState("area"); // "area" or "numberline"
  const [tw, setTw] = useState(1); const [tn, setTn] = useState(2); const [td, setTd] = useState(3);
  const [tw2, setTw2] = useState(0); const [tn2, setTn2] = useState(3); const [td2, setTd2] = useState(4);
  const ex = fracExamples[idx];

  const renderGrid = (a, b, rs) => {
    if (a.w > 0 && a.n === 0 && b.w === 0) return <SimpleAreaGrid rows={a.w} cols={b.d} shadeRows={a.w} shadeCols={b.n} labelTop={`${b.n}/${b.d}`} labelLeft={`${a.w}`} revealStep={rs} />;
    if (a.w === 0 && b.w === 0) return <SimpleAreaGrid rows={a.d} cols={b.d} shadeRows={a.n} shadeCols={b.n} labelTop={`${b.n}/${b.d}`} labelLeft={`${a.n}/${a.d}`} revealStep={rs} />;
    return <MixedGrid wholeR={a.w} fracR_n={a.n} fracR_d={a.d} wholeC={b.w} fracC_n={b.n} fracC_d={b.d} revealStep={rs} />;
  };

  const tryRes = useMemo(() => formatFrac((tw * td + tn) * (tw2 * td2 + tn2), td * td2), [tw, tn, td, tw2, tn2, td2]);

  const currentSteps = vizMode === "numberline" ? ex.nlSteps : ex.steps;

  return (
    <ModuleShell tag="Fractions" tagColor={T.accent} title="Multiplying Fractions" subtitle="Two ways to see it: area models (2D) and number lines (1D). Switch between them!">
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Chip active={!tryMode} onClick={() => { setTryMode(false); setStep(0); }} color={T.accent}>Guided Examples</Chip>
        <Chip active={tryMode} onClick={() => setTryMode(true)} color={T.purple}>Try It Yourself</Chip>
      </div>
      {!tryMode ? (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {fracExamples.map((e, i) => <Chip key={i} active={idx === i} onClick={() => { setIdx(i); setStep(0); }} color={T.purple}>{e.tab}</Chip>)}
          </div>

          {/* Visual model toggle */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bg, borderRadius: 10, padding: 4, border: `1px solid ${T.border}`, width: "fit-content" }}>
            <button onClick={() => { setVizMode("area"); setStep(0); }} style={{
              padding: "6px 16px", borderRadius: 8, border: "none",
              background: vizMode === "area" ? T.accent : "transparent",
              color: vizMode === "area" ? "#fff" : T.textMid,
              fontFamily: T.fontSans, fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}>◔ Area Model</button>
            <button onClick={() => { setVizMode("numberline"); setStep(0); }} style={{
              padding: "6px 16px", borderRadius: 8, border: "none",
              background: vizMode === "numberline" ? T.accent : "transparent",
              color: vizMode === "numberline" ? "#fff" : T.textMid,
              fontFamily: T.fontSans, fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}>― Number Line</button>
          </div>

          <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
            <h3 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, margin: "0 0 20px", color: T.text }}>{ex.title}</h3>
            <div style={{ background: T.bg, borderRadius: 10, padding: "18px 12px", border: `1px solid ${T.border}`, marginBottom: 20, display: "flex", justifyContent: "center" }}>
              {vizMode === "area" ? renderGrid(ex.a, ex.b, step) : <NumberLineFrac factorA={ex.a} factorB={ex.b} revealStep={step} />}
            </div>
            <StepWalkthrough steps={currentSteps} step={step} setStep={setStep} />
          </div>
        </>
      ) : (
        <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
          <h3 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Build your own multiplication</h3>
          <p style={{ fontFamily: T.fontSans, fontSize: 13.5, color: T.textMid, margin: "0 0 20px" }}>Adjust the numbers and see both visualizations update live.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", marginBottom: 24, padding: 16, background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: T.fontSans, fontSize: 12, fontWeight: 700, color: T.purple, marginBottom: 10 }}>First Factor</div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <NumberInput label="Whole" value={tw} onChange={setTw} min={0} max={6} />
                <NumberInput label="Num" value={tn} onChange={setTn} min={0} max={9} />
                <span style={{ fontSize: 20, color: T.textMuted, paddingBottom: 4 }}>/</span>
                <NumberInput label="Den" value={td} onChange={setTd} min={1} max={12} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontFamily: T.font, color: T.textMuted, paddingTop: 20 }}>×</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: T.fontSans, fontSize: 12, fontWeight: 700, color: T.purple, marginBottom: 10 }}>Second Factor</div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                <NumberInput label="Whole" value={tw2} onChange={setTw2} min={0} max={6} />
                <NumberInput label="Num" value={tn2} onChange={setTn2} min={0} max={9} />
                <span style={{ fontSize: 20, color: T.textMuted, paddingBottom: 4 }}>/</span>
                <NumberInput label="Den" value={td2} onChange={setTd2} min={1} max={12} />
              </div>
            </div>
          </div>
          {(tw === 0 && tn === 0) || (tw2 === 0 && tn2 === 0) ? (
            <div style={{ background: T.bg, borderRadius: 10, padding: 30, border: `1px solid ${T.border}`, textAlign: "center" }}>
              <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.textMuted }}>Set both factors above zero to see the models.</p>
            </div>
          ) : (tw > 0 && tn === 0 && tw2 > 0 && tn2 === 0) ? (
            <div style={{ background: T.bg, borderRadius: 10, padding: 20, border: `1px solid ${T.border}`, textAlign: "center" }}>
              <p style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.purple }}>{tw} × {tw2} = {tw * tw2}</p>
              <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textMid, marginTop: 8 }}>Whole × whole — try adding a fractional part!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Area model */}
              <div>
                <div style={{ fontFamily: T.fontSans, fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>◔ Area Model</div>
                <div style={{ background: T.bg, borderRadius: 10, padding: "18px 12px", border: `1px solid ${T.border}`, display: "flex", justifyContent: "center" }}>
                  {renderGrid({ w: tw, n: tn, d: td }, { w: tw2, n: tn2, d: td2 })}
                </div>
              </div>
              {/* Number line */}
              <div>
                <div style={{ fontFamily: T.fontSans, fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>― Number Line</div>
                <div style={{ background: T.bg, borderRadius: 10, padding: "18px 12px", border: `1px solid ${T.border}`, display: "flex", justifyContent: "center" }}>
                  <NumberLineFrac factorA={{ w: tw, n: tn, d: td }} factorB={{ w: tw2, n: tn2, d: td2 }} />
                </div>
              </div>
            </div>
          )}
          {!((tw === 0 && tn === 0) || (tw2 === 0 && tn2 === 0)) && <ResultBadge label={tryRes} color={T.purple} />}
        </div>
      )}
    </ModuleShell>
  );
}


// ════════════════════════════════════════════════════════════════
//  MODULE 2: DECIMALS & PERCENTS
// ════════════════════════════════════════════════════════════════

function HundredGrid({ shaded, color = T.blue, width = 240 }) {
  const pad = 4; const cellSize = (width - pad * 2) / 10;
  return (
    <svg viewBox={`0 0 ${width} ${width}`} style={{ width: "100%", maxWidth: width }}>
      <rect x={0} y={0} width={width} height={width} fill={T.bg} rx={6} />
      {Array.from({ length: 100 }).map((_, i) => {
        const r = Math.floor(i / 10); const c = i % 10;
        return (
          <rect key={i} x={pad + c * cellSize + 1} y={pad + r * cellSize + 1}
            width={cellSize - 2} height={cellSize - 2}
            fill={i < shaded ? color : "#fff"} opacity={i < shaded ? 0.5 : 0.8}
            stroke={T.border} strokeWidth={0.5} rx={2} />
        );
      })}
      <rect x={pad} y={pad} width={cellSize * 10} height={cellSize * 10} fill="none" stroke={T.textMuted} strokeWidth={1} rx={4} />
      {/* Count label */}
      <text x={width / 2} y={width + 0} textAnchor="middle" fill={color} fontSize={13} fontWeight={700} fontFamily={T.fontSans}>
        {shaded}/100 shaded
      </text>
    </svg>
  );
}

function BarModel({ total, filled, label, subLabel, color = T.blue, width = 400 }) {
  const h = 44;
  const ratio = Math.min(filled / total, 1);
  return (
    <div style={{ width: "100%", maxWidth: width }}>
      <svg viewBox={`0 0 ${width} ${h + 40}`} style={{ width: "100%" }}>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <g key={i}>
            <line x1={p * width} y1={12} x2={p * width} y2={16} stroke={T.textMuted} strokeWidth={1} />
            <text x={p * width} y={9} textAnchor="middle" fill={T.textMuted} fontSize={9} fontFamily={T.fontSans}>{Math.round(p * 100)}%</text>
          </g>
        ))}
        <rect x={0} y={18} width={width} height={h} fill="#fff" stroke={T.border} strokeWidth={1.5} rx={6} />
        <rect x={0} y={18} width={width * ratio} height={h} fill={color} opacity={0.3} rx={6} />
        <rect x={0} y={18} width={width * ratio} height={h} fill="none" stroke={color} strokeWidth={2} rx={6} />
        <text x={width * ratio / 2} y={18 + h / 2} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={15} fontWeight={700} fontFamily={T.font}>{label}</text>
        <text x={width / 2} y={h + 36} textAnchor="middle" fill={T.textMuted} fontSize={11} fontFamily={T.fontSans}>{subLabel}</text>
      </svg>
    </div>
  );
}

const decExamples = [
  { tab: "Decimal Place Value", title: "What is 0.37?", shaded: 37,
    steps: ["Take a 10×10 grid — 100 equal squares. The whole grid = 1.", "Each square is 1/100 = 0.01 (one hundredth).", "Each full column of 10 squares is 10/100 = 0.1 (one tenth).", "0.37 means 3 tenths + 7 hundredths → shade 37 squares.", "37 out of 100 = 37/100 = 37% = 0.37 — all the same number!"] },
  { tab: "Fraction → Decimal", title: "3/4 as a decimal", shaded: 75,
    steps: ["3/4 means 3 out of 4 equal parts.", "Scale to hundredths: multiply top and bottom by 25 → 75/100.", "75/100 = 0.75 → shade 75 squares on the grid.", "75 squares = 7 full columns + 5 extra = 0.7 + 0.05.", "So 3/4 = 75/100 = 0.75 = 75%"] },
  { tab: "Percent of a Number", title: "40% of 60", shaded: 40,
    steps: ["40% means 40 out of every 100, or 0.40.", "Think of a bar: the full bar is 60 units.", "40% of the bar = 0.40 × 60 = 24 units.", "On the hundred grid: shade 40 squares → 40% of one whole.", "Result: 40% of 60 = 24"] },
];

// 2026 tax brackets — Canada Federal & Ontario Provincial
// Source: CRA + Ontario Ministry of Finance, indexed Jan 1 2026
const FED_BRACKETS_2026 = [
  { upTo: 58523, rate: 0.14 },
  { upTo: 117045, rate: 0.205 },
  { upTo: 181440, rate: 0.26 },
  { upTo: 258482, rate: 0.29 },
  { upTo: Infinity, rate: 0.33 },
];
const ON_BRACKETS_2026 = [
  { upTo: 53891, rate: 0.0505 },
  { upTo: 107785, rate: 0.0915 },
  { upTo: 150000, rate: 0.1116 },
  { upTo: 220000, rate: 0.1216 },
  { upTo: Infinity, rate: 0.1316 },
];

function computeBrackets(income, brackets) {
  const segments = [];
  let prev = 0;
  let totalTax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    const segStart = prev;
    const segEnd = b.upTo === Infinity ? income : Math.min(b.upTo, income);
    if (segEnd <= segStart) break;
    const amount = segEnd - segStart;
    const tax = amount * b.rate;
    totalTax += tax;
    segments.push({ bracketIdx: i, start: segStart, end: segEnd, amount, rate: b.rate, tax });
    prev = b.upTo;
    if (segEnd >= income) break;
  }
  return { segments, totalTax };
}


function DecimalsModule() {
  const [mode, setMode] = useState("guided"); // "guided", "tryit", or "tax"
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [tryPct, setTryPct] = useState(45);
  const [tryNum, setTryNum] = useState(200);
  const ex = decExamples[idx];

  const progressiveShade = (maxShade) => {
    if (step === 0) return 0;
    if (step === 1) return 1;
    if (step === 2) return 10;
    return maxShade;
  };

  return (
    <ModuleShell tag="Decimals & Percents" tagColor={T.blue} title="Hundreds Grid & Bar Models" subtitle="Every decimal, fraction, and percentage is just a different way to say the same number.">
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <Chip active={mode === "guided"} onClick={() => setMode("guided")} color={T.blue}>Guided Examples</Chip>
        <Chip active={mode === "tryit"} onClick={() => setMode("tryit")} color={T.purple}>Try It Yourself</Chip>
        <Chip active={mode === "tax"} onClick={() => setMode("tax")} color={T.orange}>Real World: Tax Brackets</Chip>
      </div>

      {mode === "guided" && (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {decExamples.map((e, i) => <Chip key={i} active={idx === i} onClick={() => { setIdx(i); setStep(0); }} color={T.blue}>{e.tab}</Chip>)}
          </div>
          <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
            <h3 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, margin: "0 0 20px", color: T.text }}>{ex.title}</h3>
            <div style={{ background: T.bg, borderRadius: 10, padding: "18px 12px", border: `1px solid ${T.border}`, marginBottom: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <HundredGrid shaded={progressiveShade(ex.shaded)} color={T.blue} />
              {idx === 2 && step >= 2 && (
                <BarModel total={60} filled={24} label="24" subLabel="Full bar = 60" />
              )}
            </div>
            <StepWalkthrough steps={ex.steps} step={step} setStep={setStep} color={T.blue} />
          </div>
        </>
      )}

      {mode === "tryit" && (
        <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
          <h3 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Explore percentages</h3>
          <p style={{ fontFamily: T.fontSans, fontSize: 13.5, color: T.textMid, margin: "0 0 20px" }}>Pick a percentage and a number. See both the grid and bar update.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", marginBottom: 24, padding: 16, background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <NumberInput label="Percent %" value={tryPct} onChange={setTryPct} min={0} max={100} />
            <NumberInput label="Of what number?" value={tryNum} onChange={setTryNum} min={1} max={999} />
          </div>
          <div style={{ background: T.bg, borderRadius: 10, padding: "18px 12px", border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <HundredGrid shaded={tryPct} color={T.blue} />
            <BarModel total={tryNum} filled={Math.round(tryPct / 100 * tryNum * 100) / 100}
              label={`${Math.round(tryPct / 100 * tryNum * 100) / 100}`}
              subLabel={`Full bar = ${tryNum}`} />
          </div>
          <ResultBadge label={`${tryPct}% of ${tryNum} = ${Math.round(tryPct / 100 * tryNum * 100) / 100}`} color={T.blue} />
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textMid }}>
              {tryPct}/100 = {(tryPct / 100).toFixed(2)} → {(tryPct / 100).toFixed(2)} × {tryNum} = {Math.round(tryPct / 100 * tryNum * 100) / 100}
            </p>
          </div>
        </div>
      )}

      {mode === "tax" && (
        <TaxFlowView />
      )}
    </ModuleShell>
  );
}

// ─── Tax Flow Visualization ───
// Shows income flowing through brackets one at a time, each split into tax (red) + take-home (green)

const TAX_INCOME_BLUE = "#3066be";
const TAX_TAX_RED = "#c74d52";
const TAX_NET_GREEN = "#2d8659";

function TaxFlowView() {
  const INCOME = 75000;
  const fed = computeBrackets(INCOME, FED_BRACKETS_2026);
  const on = computeBrackets(INCOME, ON_BRACKETS_2026);

  // Build a unified processing sequence:
  // step 0: intro — just show income bar
  // steps 1..fed.length: process federal bracket i (split slice into tax+net)
  // step fed.length + 1: header transition — start ontario
  // steps fed.length+2..fed.length+1+on.length: process ontario brackets
  // final step: combine totals into single bar
  const fedCount = fed.segments.length;
  const onCount = on.segments.length;
  const TOTAL_STEPS = 1 + fedCount + 1 + onCount + 1;
  // Step indices:
  // 0 = intro
  // 1..fedCount = federal bracket processing
  // fedCount+1 = ontario intro
  // fedCount+2..fedCount+1+onCount = ontario bracket processing
  // fedCount+2+onCount = final summary

  const [step, setStep] = useState(0);

  const stepLabels = [
    "Sara earns $75,000 in Ontario. We'll split her income through tax brackets, one slice at a time.",
    ...fed.segments.map((s, i) => {
      const sliceLabel = s.amount === INCOME ? `all $${INCOME.toLocaleString()}` : `the $${Math.round(s.amount).toLocaleString()} slice from $${Math.round(s.start).toLocaleString()}–$${Math.round(s.end).toLocaleString()}`;
      return `Federal bracket ${i + 1}: ${sliceLabel} is taxed at ${(s.rate * 100).toFixed(s.rate < 0.1 ? 2 : 1)}%. Tax = $${Math.round(s.tax).toLocaleString()}. The rest is take-home. Notice: most of the slice is still GREEN.`;
    }),
    `Federal done. Total federal tax: $${Math.round(fed.totalTax).toLocaleString()}. Now Ontario applies its own brackets to the same income.`,
    ...on.segments.map((s, i) => {
      const sliceLabel = s.amount === INCOME ? `all $${INCOME.toLocaleString()}` : `the $${Math.round(s.amount).toLocaleString()} slice from $${Math.round(s.start).toLocaleString()}–$${Math.round(s.end).toLocaleString()}`;
      return `Ontario bracket ${i + 1}: ${sliceLabel} is taxed at ${(s.rate * 100).toFixed(2)}%. Tax = $${Math.round(s.tax).toLocaleString()}.`;
    }),
    `Final view: combine everything back. Total tax (red) = $${Math.round(fed.totalTax + on.totalTax).toLocaleString()}. Take-home (green) = $${Math.round(INCOME - fed.totalTax - on.totalTax).toLocaleString()}. Effective rate: ${((fed.totalTax + on.totalTax) / INCOME * 100).toFixed(1)}%.`,
  ];

  // Layout
  const W = 460;
  const padX = 20;
  const barW = W - padX * 2;
  const barH = 38;
  const rowGap = 18;
  // We'll need vertical space for: top income bar + (federal label + brackets) + (ontario label + brackets) + final
  // For simplicity, render N bars stacked.

  // Determine what to render at this step
  const isIntro = step === 0;
  const isFedPhase = step >= 1 && step <= fedCount;
  const isFedDone = step === fedCount + 1;
  const isOnPhase = step >= fedCount + 2 && step <= fedCount + 1 + onCount;
  const isFinal = step === fedCount + 2 + onCount;

  const fedSegsProcessed = isIntro ? 0 : isFedPhase ? step : fedCount;
  const onSegsProcessed = isOnPhase ? step - (fedCount + 1) : (step > fedCount + 1 + onCount ? onCount : 0);

  // Build the rows we want to render
  const rows = [];

  // ROW 1: The "active income" bar — shrinks as brackets are processed
  // In intro: full blue
  // In fed phase: blue minus what's been processed, with a glow on the currently active slice
  // After fed: same logic carries to on phase
  if (!isFinal) {
    const processedSoFar = fedSegsProcessed > 0
      ? fed.segments.slice(0, fedSegsProcessed).reduce((s, x) => s + x.amount, 0)
      : 0;
    // For the income bar shown at the top, we always show the full income, but highlight what's been "consumed"
    // Approach: full bar with processed portion in lighter blue (faded) and remaining in bright blue
    rows.push({ type: "income-active", processedSoFar, currentBracketIdx: isFedPhase ? step - 1 : null });
  }

  // Federal processed brackets — show as small split bars (red+green)
  for (let i = 0; i < fedSegsProcessed; i++) {
    const seg = fed.segments[i];
    const isCurrent = isFedPhase && i === step - 1;
    rows.push({ type: "processed", side: "fed", segIdx: i, seg, isCurrent });
  }

  // Federal label + done indicator
  if (isFedDone || isOnPhase || isFinal) {
    if (!isFinal) {
      rows.push({ type: "phase-label", text: `Federal subtotal: $${Math.round(fed.totalTax).toLocaleString()} tax`, color: T.blue });
    }
  }

  // Ontario processed brackets
  for (let i = 0; i < onSegsProcessed; i++) {
    const seg = on.segments[i];
    const isCurrent = isOnPhase && i === step - (fedCount + 2);
    rows.push({ type: "processed", side: "on", segIdx: i, seg, isCurrent });
  }

  if (isFinal) {
    rows.push({ type: "ontario-subtotal", text: `Ontario subtotal: $${Math.round(on.totalTax).toLocaleString()} tax`, color: T.orange });
    rows.push({ type: "final-summary" });
  } else if (isOnPhase && onSegsProcessed > 0) {
    // Show ontario subtotal once any on segs processed (cumulative)
    // (we don't add a label until phase done)
  }

  // Compute total height
  const headerH = 30;
  const incomeBarH = 50; // includes its own label
  const processedRowH = barH + 24;
  const labelRowH = 22;
  const finalH = 90;

  let H = 20;
  rows.forEach(r => {
    if (r.type === "income-active") H += incomeBarH + rowGap;
    else if (r.type === "processed") H += processedRowH + 6;
    else if (r.type === "phase-label") H += labelRowH + 4;
    else if (r.type === "ontario-subtotal") H += labelRowH + 4;
    else if (r.type === "final-summary") H += finalH + 10;
  });
  H += 20;

  // Render
  let cursorY = 20;

  return (
    <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
      <div style={{
        display: "inline-block", padding: "3px 10px", background: T.orangeLight,
        border: `1px solid ${T.orange}33`, borderRadius: 6, marginBottom: 12,
        fontFamily: T.fontSans, fontSize: 11, fontWeight: 700, color: T.orange,
        textTransform: "uppercase", letterSpacing: 1,
      }}>Real World</div>
      <h3 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: T.text }}>
        Income through tax brackets
      </h3>
      <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.textMid, lineHeight: 1.55, margin: "0 0 20px" }}>
        Watch how Sara's $75,000 flows through Canadian and Ontario tax brackets — one slice at a time.
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, fontFamily: T.fontSans, fontSize: 12, color: T.textMid, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: TAX_INCOME_BLUE, opacity: 0.85 }} /> Income
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: TAX_TAX_RED, opacity: 0.85 }} /> Tax
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: TAX_NET_GREEN, opacity: 0.85 }} /> Take-home
        </span>
      </div>

      {/* Animated visualization */}
      <div style={{ background: T.bg, borderRadius: 10, padding: "16px 8px", border: `1px solid ${T.border}`, marginBottom: 18 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
          {(() => {
            const elements = [];
            let y = 20;
            rows.forEach((r, idx) => {
              if (r.type === "income-active") {
                // Top label
                elements.push(
                  <text key={`il-${idx}`} x={padX} y={y - 4} fill={T.textMid} fontSize={11} fontWeight={700} fontFamily={T.fontSans}>
                    Sara's income
                  </text>
                );
                elements.push(
                  <text key={`ir-${idx}`} x={padX + barW} y={y - 4} textAnchor="end" fill={T.text} fontSize={12} fontWeight={700} fontFamily={T.font}>
                    ${INCOME.toLocaleString()}
                  </text>
                );
                // Bar with processed (faded) and remaining (bright)
                const procPx = (r.processedSoFar / INCOME) * barW;
                const remainPx = barW - procPx;
                if (procPx > 0) {
                  elements.push(<rect key={`pf-${idx}`} x={padX} y={y} width={procPx} height={barH} fill={TAX_INCOME_BLUE} opacity={0.18} />);
                }
                if (remainPx > 0) {
                  elements.push(<rect key={`pr-${idx}`} x={padX + procPx} y={y} width={remainPx} height={barH} fill={TAX_INCOME_BLUE} opacity={0.85} rx={3} />);
                }
                // Glow on currently active bracket slice
                if (r.currentBracketIdx !== null && isFedPhase) {
                  const seg = fed.segments[r.currentBracketIdx];
                  const sx = padX + (seg.start / INCOME) * barW;
                  const sw = (seg.amount / INCOME) * barW;
                  elements.push(<rect key={`gl-${idx}`} x={sx} y={y - 3} width={sw} height={barH + 6} fill="none" stroke={TAX_TAX_RED} strokeWidth={2.5} rx={4} />);
                  elements.push(
                    <text key={`gll-${idx}`} x={sx + sw / 2} y={y + barH + 14} textAnchor="middle"
                      fill={TAX_TAX_RED} fontSize={10} fontWeight={700} fontFamily={T.fontSans}>
                      ↓ processing this slice
                    </text>
                  );
                }
                // Outer border
                elements.push(<rect key={`ob-${idx}`} x={padX} y={y} width={barW} height={barH} fill="none" stroke={T.textMid} strokeWidth={1} rx={3} />);
                y += incomeBarH + rowGap;
              } else if (r.type === "processed") {
                const seg = r.seg;
                const ratePct = (seg.rate * 100).toFixed(seg.rate < 0.1 ? 2 : 1);
                const slicePx = (seg.amount / INCOME) * barW; // each slice scaled to income for spatial consistency
                const taxPx = slicePx * seg.rate;
                const netPx = slicePx - taxPx;
                const startX = padX + (seg.start / INCOME) * barW;

                const opacity = r.isCurrent ? 1 : 0.65;
                const labelText = `${r.side === "fed" ? "Fed" : "ON"} bracket ${r.segIdx + 1}: ${ratePct}%`;

                // Label
                elements.push(
                  <text key={`lbl-${idx}`} x={padX} y={y - 4} fill={r.side === "fed" ? T.blue : T.orange} fontSize={10} fontWeight={700} fontFamily={T.fontSans} opacity={opacity}>
                    {labelText}
                  </text>
                );
                elements.push(
                  <text key={`lblr-${idx}`} x={padX + barW} y={y - 4} textAnchor="end" fill={T.textMid} fontSize={10} fontFamily={T.fontSans} opacity={opacity}>
                    ${Math.round(seg.start).toLocaleString()}–${Math.round(seg.end).toLocaleString()}
                  </text>
                );
                // Tax (red)
                elements.push(<rect key={`tx-${idx}`} x={startX} y={y} width={taxPx} height={barH} fill={TAX_TAX_RED} opacity={0.85 * opacity} rx={taxPx > 8 ? 3 : 0} />);
                // Net (green)
                elements.push(<rect key={`nt-${idx}`} x={startX + taxPx} y={y} width={netPx} height={barH} fill={TAX_NET_GREEN} opacity={0.85 * opacity} rx={3} />);
                // Inner labels
                if (taxPx > 40) {
                  elements.push(
                    <text key={`txl-${idx}`} x={startX + taxPx / 2} y={y + barH / 2} textAnchor="middle" dominantBaseline="central"
                      fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans} opacity={opacity}>
                      ${Math.round(seg.tax).toLocaleString()}
                    </text>
                  );
                }
                if (netPx > 50) {
                  elements.push(
                    <text key={`ntl-${idx}`} x={startX + taxPx + netPx / 2} y={y + barH / 2} textAnchor="middle" dominantBaseline="central"
                      fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans} opacity={opacity}>
                      ${Math.round(seg.amount - seg.tax).toLocaleString()}
                    </text>
                  );
                }
                // Border
                elements.push(<rect key={`pob-${idx}`} x={startX} y={y} width={slicePx} height={barH} fill="none" stroke={r.side === "fed" ? T.blue : T.orange} strokeWidth={r.isCurrent ? 2 : 1} opacity={opacity} rx={3} />);

                y += processedRowH + 6;
              } else if (r.type === "phase-label" || r.type === "ontario-subtotal") {
                elements.push(
                  <text key={`pl-${idx}`} x={padX} y={y + 14} fill={r.color} fontSize={12} fontWeight={700} fontFamily={T.fontSans}>
                    ✓ {r.text}
                  </text>
                );
                y += labelRowH + 4;
              } else if (r.type === "final-summary") {
                // The grand finale — single income bar split into total tax and total take-home
                const totalTax = fed.totalTax + on.totalTax;
                const taxPx = (totalTax / INCOME) * barW;
                const netPx = barW - taxPx;
                const fedTaxPx = (fed.totalTax / INCOME) * barW;
                const onTaxPx = (on.totalTax / INCOME) * barW;

                elements.push(
                  <text key={`fl-${idx}`} x={padX} y={y - 4} fill={T.text} fontSize={12} fontWeight={700} fontFamily={T.font}>
                    Final: $${INCOME.toLocaleString()} split into tax + take-home
                  </text>
                );
                // Tax portion split into Fed (darker) + Ontario (slightly different shade)
                elements.push(<rect key={`fft-${idx}`} x={padX} y={y} width={fedTaxPx} height={barH + 12} fill={TAX_TAX_RED} opacity={0.85} rx={4} />);
                elements.push(<rect key={`fot-${idx}`} x={padX + fedTaxPx} y={y} width={onTaxPx} height={barH + 12} fill={TAX_TAX_RED} opacity={0.6} />);
                elements.push(<rect key={`fnt-${idx}`} x={padX + taxPx} y={y} width={netPx} height={barH + 12} fill={TAX_NET_GREEN} opacity={0.85} rx={4} />);

                // Inner labels
                if (fedTaxPx > 50) {
                  elements.push(
                    <g key={`fft-l-${idx}`}>
                      <text x={padX + fedTaxPx / 2} y={y + (barH + 12) / 2 - 5} textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>Fed</text>
                      <text x={padX + fedTaxPx / 2} y={y + (barH + 12) / 2 + 8} textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>${Math.round(fed.totalTax).toLocaleString()}</text>
                    </g>
                  );
                }
                if (onTaxPx > 50) {
                  elements.push(
                    <g key={`fot-l-${idx}`}>
                      <text x={padX + fedTaxPx + onTaxPx / 2} y={y + (barH + 12) / 2 - 5} textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>ON</text>
                      <text x={padX + fedTaxPx + onTaxPx / 2} y={y + (barH + 12) / 2 + 8} textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>${Math.round(on.totalTax).toLocaleString()}</text>
                    </g>
                  );
                }
                if (netPx > 80) {
                  elements.push(
                    <g key={`fnt-l-${idx}`}>
                      <text x={padX + taxPx + netPx / 2} y={y + (barH + 12) / 2 - 5} textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={11} fontWeight={700} fontFamily={T.fontSans}>Take-home</text>
                      <text x={padX + taxPx + netPx / 2} y={y + (barH + 12) / 2 + 9} textAnchor="middle" dominantBaseline="central"
                        fill="#fff" fontSize={11} fontWeight={700} fontFamily={T.fontSans}>${Math.round(INCOME - totalTax).toLocaleString()}</text>
                    </g>
                  );
                }
                elements.push(<rect key={`fb-${idx}`} x={padX} y={y} width={barW} height={barH + 12} fill="none" stroke={T.textMid} strokeWidth={1.5} rx={4} />);

                y += finalH + 10;
              }
            });
            return elements;
          })()}
        </svg>
      </div>

      <StepWalkthrough steps={stepLabels} step={step} setStep={setStep} color={T.orange} />

      {/* Try any income — slider section */}
      <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
        <h4 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, margin: "0 0 4px", color: T.text }}>Try any income</h4>
        <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textMid, margin: "0 0 16px" }}>
          See the final split for any income level.
        </p>
        <TaxTrySlider />
      </div>

      <div style={{
        marginTop: 24, padding: "12px 16px", background: "#fff8e8",
        border: "1px solid #e8d5a8", borderRadius: 8,
      }}>
        <p style={{ fontFamily: T.fontSans, fontSize: 11.5, color: "#6b5417", lineHeight: 1.55, margin: 0 }}>
          <strong>Educational only.</strong> Simplified for learning — does not include CPP, EI, basic personal amount,
          tax credits, Ontario surtax, or deductions. Real tax filings are more complex. For actual tax filing in Canada,
          use CRA-approved software or consult a tax professional. Brackets shown are for tax year 2026.
        </p>
      </div>
    </div>
  );
}

function TaxTrySlider() {
  const [income, setIncome] = useState(75000);
  const fed = computeBrackets(income, FED_BRACKETS_2026);
  const on = computeBrackets(income, ON_BRACKETS_2026);
  const totalTax = fed.totalTax + on.totalTax;
  const takeHome = income - totalTax;
  const effective = (totalTax / income) * 100;
  const fedMarg = FED_BRACKETS_2026.find(b => income < b.upTo).rate;
  const onMarg = ON_BRACKETS_2026.find(b => income < b.upTo).rate;
  const marginal = (fedMarg + onMarg) * 100;

  const W = 460;
  const padX = 20;
  const barW = W - padX * 2;
  const barH = 50;
  const taxPx = (totalTax / income) * barW;
  const netPx = barW - taxPx;
  const fedTaxPx = (fed.totalTax / income) * barW;
  const onTaxPx = (on.totalTax / income) * barW;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 16, padding: 14, background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", maxWidth: 400 }}>
          <span style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.orange, minWidth: 96 }}>${income.toLocaleString()}</span>
          <input type="range" min={20000} max={300000} step={1000} value={income} onChange={e => setIncome(Number(e.target.value))}
            style={{ flex: 1, accentColor: T.orange }} />
        </div>
      </div>

      <div style={{ background: T.bg, borderRadius: 10, padding: "16px 8px", border: `1px solid ${T.border}`, marginBottom: 16 }}>
        <svg viewBox={`0 0 ${W} ${barH + 28}`} style={{ width: "100%", maxWidth: W }}>
          <text x={padX} y={14} fill={T.text} fontSize={11} fontWeight={700} fontFamily={T.fontSans}>Income split</text>
          <text x={padX + barW} y={14} textAnchor="end" fill={T.text} fontSize={12} fontWeight={700} fontFamily={T.font}>${income.toLocaleString()}</text>

          {fedTaxPx > 0 && <rect x={padX} y={20} width={fedTaxPx} height={barH} fill={TAX_TAX_RED} opacity={0.85} rx={4} />}
          {onTaxPx > 0 && <rect x={padX + fedTaxPx} y={20} width={onTaxPx} height={barH} fill={TAX_TAX_RED} opacity={0.6} />}
          {netPx > 0 && <rect x={padX + taxPx} y={20} width={netPx} height={barH} fill={TAX_NET_GREEN} opacity={0.85} rx={4} />}

          {fedTaxPx > 50 && (
            <g>
              <text x={padX + fedTaxPx / 2} y={20 + barH / 2 - 4} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>Fed</text>
              <text x={padX + fedTaxPx / 2} y={20 + barH / 2 + 9} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>${Math.round(fed.totalTax).toLocaleString()}</text>
            </g>
          )}
          {onTaxPx > 50 && (
            <g>
              <text x={padX + fedTaxPx + onTaxPx / 2} y={20 + barH / 2 - 4} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>ON</text>
              <text x={padX + fedTaxPx + onTaxPx / 2} y={20 + barH / 2 + 9} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={10} fontWeight={700} fontFamily={T.fontSans}>${Math.round(on.totalTax).toLocaleString()}</text>
            </g>
          )}
          {netPx > 90 && (
            <g>
              <text x={padX + taxPx + netPx / 2} y={20 + barH / 2 - 4} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={11} fontWeight={700} fontFamily={T.fontSans}>Take-home</text>
              <text x={padX + taxPx + netPx / 2} y={20 + barH / 2 + 10} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={11} fontWeight={700} fontFamily={T.fontSans}>${Math.round(takeHome).toLocaleString()}</text>
            </g>
          )}
          <rect x={padX} y={20} width={barW} height={barH} fill="none" stroke={T.textMid} strokeWidth={1} rx={4} />
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        <div style={{ padding: "10px 14px", background: T.coralLight, borderRadius: 8, border: `1.5px solid ${T.coral}33` }}>
          <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.coral, textTransform: "uppercase", letterSpacing: 1 }}>Total Tax</div>
          <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.coral, marginTop: 2 }}>${Math.round(totalTax).toLocaleString()}</div>
        </div>
        <div style={{ padding: "10px 14px", background: T.accentLight, borderRadius: 8, border: `1.5px solid ${T.accent}33` }}>
          <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: 1 }}>Take-Home</div>
          <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.accent, marginTop: 2 }}>${Math.round(takeHome).toLocaleString()}</div>
        </div>
        <div style={{ padding: "10px 14px", background: T.blueLight, borderRadius: 8, border: `1.5px solid ${T.blue}33` }}>
          <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: 1 }}>Effective</div>
          <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.blue, marginTop: 2 }}>{effective.toFixed(1)}%</div>
        </div>
        <div style={{ padding: "10px 14px", background: T.purpleLight, borderRadius: 8, border: `1.5px solid ${T.purple}33` }}>
          <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.purple, textTransform: "uppercase", letterSpacing: 1 }}>Marginal</div>
          <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.purple, marginTop: 2 }}>{marginal.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
//  MODULE 3: RATIOS & PROPORTIONS
// ════════════════════════════════════════════════════════════════

function TapeDiagram({ partsA, partsB, labelA, labelB, colorA = T.orange, colorB = T.accent, width = 420, revealStep = 4 }) {
  // 0: labels only, 1: first row of blocks, 2: second row, 3+: ratio label
  const h = 42; const gap = 12; const totalH = h * 2 + gap + 50;
  const maxP = Math.max(partsA, partsB);
  const pw = (width - 70) / maxP;
  const showA = revealStep >= 1;
  const showB = revealStep >= 2;
  const showRatioLabel = revealStep >= 3;
  return (
    <svg viewBox={`0 0 ${width} ${totalH}`} style={{ width: "100%", maxWidth: width }}>
      <text x={4} y={16 + h / 2} dominantBaseline="central" fill={colorA} fontSize={13} fontWeight={700} fontFamily={T.fontSans}>{labelA}</text>
      {showA && Array.from({ length: partsA }).map((_, i) => (
        <g key={`a${i}`}>
          <rect x={56 + i * pw} y={16} width={pw - 3} height={h} fill={colorA} opacity={0.25} stroke={colorA} strokeWidth={1.5} rx={4} />
          <text x={56 + i * pw + (pw - 3) / 2} y={16 + h / 2} textAnchor="middle" dominantBaseline="central" fill={colorA} fontSize={12} fontWeight={600} fontFamily={T.fontSans}>{i + 1}</text>
        </g>
      ))}
      <text x={4} y={16 + h + gap + h / 2} dominantBaseline="central" fill={colorB} fontSize={13} fontWeight={700} fontFamily={T.fontSans}>{labelB}</text>
      {showB && Array.from({ length: partsB }).map((_, i) => (
        <g key={`b${i}`}>
          <rect x={56 + i * pw} y={16 + h + gap} width={pw - 3} height={h} fill={colorB} opacity={0.25} stroke={colorB} strokeWidth={1.5} rx={4} />
          <text x={56 + i * pw + (pw - 3) / 2} y={16 + h + gap + h / 2} textAnchor="middle" dominantBaseline="central" fill={colorB} fontSize={12} fontWeight={600} fontFamily={T.fontSans}>{i + 1}</text>
        </g>
      ))}
      {showRatioLabel && (
        <text x={width / 2} y={totalH - 4} textAnchor="middle" fill={T.textMid} fontSize={13} fontWeight={600} fontFamily={T.fontSans}>
          Ratio: {partsA} : {partsB}
        </text>
      )}
    </svg>
  );
}

function DoubleNumberLine({ ratioA, ratioB, multipliers, labelA, labelB, colorA = T.orange, colorB = T.accent, width = 440, revealStep = 4 }) {
  // 0: just the two lines + labels, ticks appear progressively from step 1+
  const pad = { left: 46, right: 16 }; const lw = width - pad.left - pad.right;
  const maxM = Math.max(...multipliers);
  const h = 120; const yA = 30; const yB = 90;
  // Show ticks progressively: step 1 = first tick, step 2 = two ticks, etc.
  const ticksToShow = Math.min(revealStep, multipliers.length);
  return (
    <svg viewBox={`0 0 ${width} ${h}`} style={{ width: "100%", maxWidth: width }}>
      <line x1={pad.left} y1={yA} x2={pad.left + lw} y2={yA} stroke={colorA} strokeWidth={2} />
      <line x1={pad.left} y1={yB} x2={pad.left + lw} y2={yB} stroke={colorB} strokeWidth={2} />
      <text x={6} y={yA} dominantBaseline="central" fill={colorA} fontSize={11} fontWeight={700} fontFamily={T.fontSans}>{labelA}</text>
      <text x={6} y={yB} dominantBaseline="central" fill={colorB} fontSize={11} fontWeight={700} fontFamily={T.fontSans}>{labelB}</text>
      {multipliers.slice(0, ticksToShow).map((m, i) => {
        const x = pad.left + (m / maxM) * lw;
        return (
          <g key={i}>
            <line x1={x} y1={yA - 8} x2={x} y2={yA + 8} stroke={colorA} strokeWidth={2} />
            <text x={x} y={yA - 14} textAnchor="middle" fill={colorA} fontSize={12} fontWeight={700} fontFamily={T.fontSans}>{ratioA * m}</text>
            <line x1={x} y1={yB - 8} x2={x} y2={yB + 8} stroke={colorB} strokeWidth={2} />
            <text x={x} y={yB + 22} textAnchor="middle" fill={colorB} fontSize={12} fontWeight={700} fontFamily={T.fontSans}>{ratioB * m}</text>
            <line x1={x} y1={yA + 8} x2={x} y2={yB - 8} stroke={T.border} strokeWidth={1} strokeDasharray="3,3" />
          </g>
        );
      })}
    </svg>
  );
}

const ratioExamples = [
  { tab: "What is a ratio?", title: "Red to Blue = 3 : 2",
    steps: ["A ratio compares two quantities: 3 red parts for every 2 blue parts.", "The tape diagram shows equal-sized blocks — 3 red, 2 blue.", "The blocks are the same size — each represents the same amount.", "If each block is worth 4, then Red = 12, Blue = 8.", "Ratio stays 3:2 regardless of block size. That's proportional thinking!"] },
  { tab: "Equivalent ratios", title: "2 : 5 scaled up",
    steps: ["Start with ratio 2:5. Put both on a double number line.", "Multiply both by the same number → equivalent ratios.", "×2 → 4:10. ×3 → 6:15. ×4 → 8:20.", "On the number line, equivalent ratios always line up vertically.", "This is why cross-multiplication works — the ratios are proportional!"] },
  { tab: "Solving proportions", title: "3/4 = ?/20",
    steps: ["We need: what number over 20 equals 3/4?", "Look at denominators: 4 × ? = 20, so ? = 5.", "If bottom multiplied by 5, top must be too: 3 × 5 = 15.", "On the double number line: 3↔4 line up, 15↔20 line up.", "Answer: 3/4 = 15/20. The scale factor is 5."] },
];

function RatiosModule() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [tryMode, setTryMode] = useState(false);
  const [tryA, setTryA] = useState(3);
  const [tryB, setTryB] = useState(5);
  const [tryMult, setTryMult] = useState(4);
  const ex = ratioExamples[idx];

  const renderVisual = () => {
    if (idx === 0) return <TapeDiagram partsA={3} partsB={2} labelA="Red" labelB="Blue" revealStep={step} />;
    if (idx === 1) return <DoubleNumberLine ratioA={2} ratioB={5} multipliers={[1, 2, 3, 4]} labelA="A" labelB="B" revealStep={step} />;
    return <DoubleNumberLine ratioA={3} ratioB={4} multipliers={[1, 2, 3, 4, 5]} labelA="Num" labelB="Den" revealStep={step} />;
  };

  return (
    <ModuleShell tag="Ratios & Proportions" tagColor={T.orange} title="Tape Diagrams & Number Lines" subtitle="Ratios are everywhere — recipes, maps, speed. See how two quantities stay linked.">
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Chip active={!tryMode} onClick={() => setTryMode(false)} color={T.orange}>Guided Examples</Chip>
        <Chip active={tryMode} onClick={() => setTryMode(true)} color={T.purple}>Try It Yourself</Chip>
      </div>
      {!tryMode ? (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {ratioExamples.map((e, i) => <Chip key={i} active={idx === i} onClick={() => { setIdx(i); setStep(0); }} color={T.orange}>{e.tab}</Chip>)}
          </div>
          <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
            <h3 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, margin: "0 0 20px", color: T.text }}>{ex.title}</h3>
            <div style={{ background: T.bg, borderRadius: 10, padding: "18px 12px", border: `1px solid ${T.border}`, marginBottom: 20, display: "flex", justifyContent: "center" }}>
              {renderVisual()}
            </div>
            <StepWalkthrough steps={ex.steps} step={step} setStep={setStep} color={T.orange} />
          </div>
        </>
      ) : (
        <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
          <h3 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Build your own ratio</h3>
          <p style={{ fontFamily: T.fontSans, fontSize: 13.5, color: T.textMid, margin: "0 0 20px" }}>Set two quantities and see equivalent ratios on the tape diagram and number line.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", marginBottom: 24, padding: 16, background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <NumberInput label="A" value={tryA} onChange={setTryA} min={1} max={12} />
            <span style={{ fontSize: 20, color: T.textMuted, paddingTop: 24, fontFamily: T.font }}>:</span>
            <NumberInput label="B" value={tryB} onChange={setTryB} min={1} max={12} />
            <NumberInput label="Show up to ×" value={tryMult} onChange={setTryMult} min={2} max={8} />
          </div>
          <div style={{ background: T.bg, borderRadius: 10, padding: "18px 12px", border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <TapeDiagram partsA={tryA} partsB={tryB} labelA="A" labelB="B" />
            <DoubleNumberLine ratioA={tryA} ratioB={tryB} multipliers={Array.from({ length: tryMult }, (_, i) => i + 1)} labelA="A" labelB="B" />
          </div>
          <ResultBadge label={Array.from({ length: Math.min(tryMult, 4) }, (_, i) => `${tryA * (i + 1)}:${tryB * (i + 1)}`).join("  =  ")} color={T.orange} />
        </div>
      )}
    </ModuleShell>
  );
}


// ════════════════════════════════════════════════════════════════
//  MODULE 4: DILATIONS
// ════════════════════════════════════════════════════════════════

function DilationCanvas({ originalPoints, scale, center, width = 360, height = 360, revealStep = 4 }) {
  // revealStep controls progressive reveal:
  // 0 = original shape only
  // 1 = original + center of dilation
  // 2 = original + center (scale factor explanation step)
  // 3 = original + center + rays
  // 4 = original + center + rays + scaled shape (full result)
  const gs = 20; const ox = width / 2; const oy = height / 2;
  const toS = (pt) => ({ x: ox + pt[0] * gs, y: oy - pt[1] * gs });
  const cxPt = toS(center);

  const scaled = originalPoints.map(pt => [
    center[0] + (pt[0] - center[0]) * scale,
    center[1] + (pt[1] - center[1]) * scale,
  ]);

  const origS = originalPoints.map(toS);
  const scaledS = scaled.map(toS);
  const pathStr = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  const gr = 8;

  const showCenter = revealStep >= 1;
  const showRays = revealStep >= 3;
  const showScaled = revealStep >= 4;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: width }}>
      {Array.from({ length: gr * 2 + 1 }).map((_, i) => {
        const v = (i - gr) * gs + ox; const h2 = (i - gr) * gs + oy;
        return (
          <g key={i}>
            <line x1={v} y1={0} x2={v} y2={height} stroke={T.border} strokeWidth={i === gr ? 1.2 : 0.4} opacity={i === gr ? 0.6 : 0.35} />
            <line x1={0} y1={h2} x2={width} y2={h2} stroke={T.border} strokeWidth={i === gr ? 1.2 : 0.4} opacity={i === gr ? 0.6 : 0.35} />
          </g>
        );
      })}
      {[-6, -4, -2, 2, 4, 6].map(v => (
        <g key={v}>
          <text x={ox + v * gs} y={oy + 14} textAnchor="middle" fill={T.textMuted} fontSize={9} fontFamily={T.fontSans}>{v}</text>
          <text x={ox - 12} y={oy - v * gs + 3} textAnchor="end" fill={T.textMuted} fontSize={9} fontFamily={T.fontSans}>{v}</text>
        </g>
      ))}
      {/* Rays — step 3+ */}
      {showRays && scaledS.map((sp, i) => (
        <line key={i} x1={cxPt.x} y1={cxPt.y} x2={sp.x + (sp.x - cxPt.x) * 0.3} y2={sp.y + (sp.y - cxPt.y) * 0.3}
          stroke={T.coral} strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
      ))}
      {/* Original — always visible */}
      <path d={pathStr(origS)} fill={T.blue} fillOpacity={0.2} stroke={T.blue} strokeWidth={2} />
      {origS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={T.blue} />)}
      {/* Scaled — step 4+ */}
      {showScaled && (
        <>
          <path d={pathStr(scaledS)} fill={T.coral} fillOpacity={0.12} stroke={T.coral} strokeWidth={2} />
          {scaledS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={T.coral} />)}
        </>
      )}
      {/* Center — step 1+ */}
      {showCenter && (
        <>
          <circle cx={cxPt.x} cy={cxPt.y} r={6} fill="none" stroke={T.purple} strokeWidth={2} />
          <circle cx={cxPt.x} cy={cxPt.y} r={2.5} fill={T.purple} />
          <text x={cxPt.x + 10} y={cxPt.y - 10} fill={T.purple} fontSize={10} fontWeight={700} fontFamily={T.fontSans}>Center</text>
        </>
      )}
      {/* Legend */}
      <rect x={8} y={8} width={12} height={12} fill={T.blue} opacity={0.4} rx={2} />
      <text x={24} y={17} fill={T.blue} fontSize={10} fontWeight={600} fontFamily={T.fontSans}>Original</text>
      {showScaled && (
        <>
          <rect x={8} y={26} width={12} height={12} fill={T.coral} opacity={0.4} rx={2} />
          <text x={24} y={35} fill={T.coral} fontSize={10} fontWeight={600} fontFamily={T.fontSans}>×{scale}</text>
        </>
      )}
    </svg>
  );
}

const dilExamples = [
  { tab: "Scale factor > 1", title: "Enlarge by ×2",
    pts: [[1, 1], [3, 1], [3, 3], [1, 3]], scale: 2, center: [0, 0],
    steps: ["Start with a square at (1,1), (3,1), (3,3), (1,3).", "Center of dilation is the origin (0,0) — our anchor.", "Scale factor = 2: every point moves 2× as far from center.", "Draw rays from center through each corner. New corner is 2× along the ray.", "New corners: (2,2), (6,2), (6,6), (2,6). Same shape, double the size!"] },
  { tab: "Scale factor < 1", title: "Shrink by ×0.5",
    pts: [[2, 2], [6, 2], [6, 6], [2, 6]], scale: 0.5, center: [0, 0],
    steps: ["Start with a larger square at (2,2), (6,2), (6,6), (2,6).", "Scale factor = 0.5: image is half the distance from center.", "Each point moves halfway toward the origin.", "New corners: (1,1), (3,1), (3,3), (1,3). Shape shrinks!", "Factor < 1 = shrink. Factor > 1 = grow. Factor = 1 = unchanged."] },
  { tab: "Non-origin center", title: "×2 from (1,1)",
    pts: [[2, 1], [4, 1], [4, 3]], scale: 2, center: [1, 1],
    steps: ["Triangle at (2,1), (4,1), (4,3). Center of dilation = (1,1).", "Formula: new = center + scale × (point − center).", "Point (2,1): distance from center = (1,0). ×2 → (2,0). New: (3,1).", "Point (4,1): distance = (3,0). ×2 → (6,0). New: (7,1).", "Point (4,3): distance = (3,2). ×2 → (6,4). New: (7,5). Triangle doubles from (1,1)!"] },
];

function DilationsModule() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [tryMode, setTryMode] = useState(false);
  const [tryScale, setTryScale] = useState(15);
  const ex = dilExamples[idx];
  const actualScale = tryScale / 10;
  const tryPts = [[1, 1], [4, 1], [4, 3], [1, 3]];

  return (
    <ModuleShell tag="Dilations" tagColor={T.coral} title="Scaling Shapes" subtitle="Dilations resize shapes from a center point — like a projector zooming in and out.">
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Chip active={!tryMode} onClick={() => setTryMode(false)} color={T.coral}>Guided Examples</Chip>
        <Chip active={tryMode} onClick={() => setTryMode(true)} color={T.purple}>Try It Yourself</Chip>
      </div>
      {!tryMode ? (
        <>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {dilExamples.map((e, i) => <Chip key={i} active={idx === i} onClick={() => { setIdx(i); setStep(0); }} color={T.coral}>{e.tab}</Chip>)}
          </div>
          <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
            <h3 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, margin: "0 0 20px", color: T.text }}>{ex.title}</h3>
            <div style={{ background: T.bg, borderRadius: 10, padding: "12px", border: `1px solid ${T.border}`, marginBottom: 20, display: "flex", justifyContent: "center" }}>
              <DilationCanvas originalPoints={ex.pts} scale={ex.scale} center={ex.center} revealStep={step} />
            </div>
            <StepWalkthrough steps={ex.steps} step={step} setStep={setStep} color={T.coral} />
          </div>
        </>
      ) : (
        <div style={{ background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "28px 24px", boxShadow: T.shadow }}>
          <h3 style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Slide the scale factor</h3>
          <p style={{ fontFamily: T.fontSans, fontSize: 13.5, color: T.textMid, margin: "0 0 20px" }}>Watch the blue rectangle dilate from the origin as you change the scale.</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 24, padding: 16, background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", maxWidth: 360 }}>
              <span style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.coral, minWidth: 80 }}>Scale: {actualScale.toFixed(1)}×</span>
              <input type="range" min={2} max={30} value={tryScale} onChange={e => setTryScale(Number(e.target.value))}
                style={{ flex: 1, accentColor: T.coral }} />
            </div>
            <div style={{ display: "flex", gap: 32, fontFamily: T.fontSans, fontSize: 12, color: T.textMuted }}>
              <span>← shrink</span>
              <span>1.0× same</span>
              <span>enlarge →</span>
            </div>
          </div>
          <div style={{ background: T.bg, borderRadius: 10, padding: "12px", border: `1px solid ${T.border}`, display: "flex", justifyContent: "center" }}>
            <DilationCanvas originalPoints={tryPts} scale={actualScale} center={[0, 0]} />
          </div>
          <ResultBadge label={`${actualScale.toFixed(1)}× — ${actualScale > 1 ? "enlarged" : actualScale < 1 ? "reduced" : "same size"}`} color={T.coral} />
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <p style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textMid }}>
              Original: (1,1) (4,1) (4,3) (1,3) → Scaled: ({(1 * actualScale).toFixed(1)},{(1 * actualScale).toFixed(1)}) ({(4 * actualScale).toFixed(1)},{(1 * actualScale).toFixed(1)}) ({(4 * actualScale).toFixed(1)},{(3 * actualScale).toFixed(1)}) ({(1 * actualScale).toFixed(1)},{(3 * actualScale).toFixed(1)})
            </p>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}


// ════════════════════════════════════════════════════════════════
//  APP ROOT
// ════════════════════════════════════════════════════════════════

export default function SeeTheMath() {
  const [topic, setTopic] = useState(null);

  const renderTopic = () => {
    switch (topic) {
      case "fractions": return <FractionsModule />;
      case "decimals": return <DecimalsModule />;
      case "ratios": return <RatiosModule />;
      case "dilations": return <DilationsModule />;
      default: return <HomePage onSelect={setTopic} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <TopBar onHome={() => setTopic(null)} currentTopic={topic} />
      {renderTopic()}
    </div>
  );
}
