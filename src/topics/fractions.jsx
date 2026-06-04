import React, { useState, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { Rect, Line, Circle, Path, Polygon, Text as SvgText } from "react-native-svg";
import { T, fontSerif, fontSans } from "../tokens";
import { gcd, formatFrac } from "../math";
import { Canvas, Card, Chip, StepWalkthrough, NumberInput, ModuleShell, ResultBadge, VizPanel } from "../ui";

export const meta = {
  id: "fractions",
  icon: "◔",
  title: "Multiplying Fractions",
  desc: "Area models and number lines for multiplying fractions — two visual models, one concept",
  strand: "number",
  grade: [6, 7],
  color: T.accent,
  tag: "Fractions",
};

function SimpleAreaGrid({ rows, cols, shadeRows, shadeCols, labelTop, labelLeft, width = 340, height = 260, revealStep = 4 }) {
  const pad = { top: 44, left: 56, right: 16, bottom: 32 };
  const gw = width - pad.left - pad.right;
  const gh = height - pad.top - pad.bottom;
  const cw = gw / cols;
  const ch = gh / rows;
  const showGrid = revealStep >= 1;
  const showShading = revealStep >= 2;
  const showProductBorder = revealStep >= 3;

  const cells = [];
  if (showGrid) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isProduct = r < shadeRows && c < shadeCols;
        cells.push(
          <Rect key={`${r}-${c}`} x={pad.left + c * cw} y={pad.top + r * ch} width={cw} height={ch}
            fill={showShading && isProduct ? T.purple : "transparent"}
            opacity={showShading && isProduct ? 0.4 : 0.15}
            stroke={T.border} strokeWidth={1} rx={1} />
        );
      }
    }
  }

  return (
    <Canvas w={width} h={height}>
      <Rect x={pad.left} y={pad.top} width={gw} height={gh} fill={T.accentLight} rx={3} />
      {cells}
      {showProductBorder && (
        <Rect x={pad.left} y={pad.top} width={shadeCols * cw} height={shadeRows * ch} fill="none" stroke={T.purple} strokeWidth={2.5} rx={2} />
      )}
      <Rect x={pad.left} y={pad.top} width={gw} height={gh} fill="none" stroke={T.textMuted} strokeWidth={1} rx={3} />
      {showShading && (
        <SvgText x={pad.left + (shadeCols * cw) / 2} y={pad.top - 14} textAnchor="middle" fill={T.purple} fontSize={15} fontWeight="700" fontFamily={fontSerif(700)}>{labelTop}</SvgText>
      )}
      <SvgText x={pad.left - 14} y={pad.top + (shadeRows * ch) / 2} textAnchor="middle" alignmentBaseline="central" fill={T.purple} fontSize={15} fontWeight="700" fontFamily={fontSerif(700)}
        rotation={-90} originX={pad.left - 14} originY={pad.top + (shadeRows * ch) / 2}>{labelLeft}</SvgText>
      {showGrid && Array.from({ length: cols }).map((_, i) => (
        <SvgText key={i} x={pad.left + i * cw + cw / 2} y={height - 8} textAnchor="middle" fill={T.textMuted} fontSize={10} fontFamily={fontSans(400)}>1/{cols}</SvgText>
      ))}
    </Canvas>
  );
}

function MixedGrid({ wholeR, fracR_n, fracR_d, wholeC, fracC_n, fracC_d, width = 420, height = 300, revealStep = 4 }) {
  const pad = { top: 52, left: 64, right: 20, bottom: 24 };
  const gw = width - pad.left - pad.right;
  const gh = height - pad.top - pad.bottom;
  const totalRU = wholeR + fracR_n / fracR_d;
  const totalCU = wholeC + fracC_n / fracC_d;
  const pxR = gh / totalRU;
  const pxC = gw / totalCU;
  const rowSegs = [];
  const colSegs = [];
  if (wholeR > 0) rowSegs.push({ val: wholeR, label: `${wholeR}`, n: wholeR, d: 1 });
  if (fracR_n > 0) rowSegs.push({ val: fracR_n / fracR_d, label: `${fracR_n}/${fracR_d}`, n: fracR_n, d: fracR_d });
  if (wholeC > 0) colSegs.push({ val: wholeC, label: `${wholeC}`, n: wholeC, d: 1 });
  if (fracC_n > 0) colSegs.push({ val: fracC_n / fracC_d, label: `${fracC_n}/${fracC_d}`, n: fracC_n, d: fracC_d });
  let ry = 0;
  const rr = rowSegs.map((s) => { const h2 = s.val * pxR; const o = { ...s, y: ry, h: h2 }; ry += h2; return o; });
  let cx = 0;
  const cr = colSegs.map((s) => { const w2 = s.val * pxC; const o = { ...s, x: cx, w: w2 }; cx += w2; return o; });
  const colors = [[T.accent, T.blue], [T.orange, T.purple]];
  const partials = [];
  const totalSections = rr.length * cr.length;
  const showBorders = revealStep >= 1;
  const sectionsToShow = revealStep <= 1 ? 0 : revealStep === 2 ? Math.ceil(totalSections / 2) : totalSections;
  const showEquation = revealStep >= 3;

  let sectionIdx = 0;
  const sections = [];
  rr.forEach((r, ri) =>
    cr.forEach((c, ci) => {
      const color = colors[ri % 2][ci % 2];
      const num = r.n * c.n;
      const den = r.d * c.d;
      const label = den === 1 ? `${num}` : `${num}/${den}`;
      partials.push({ label, color });
      const idx = sectionIdx++;
      const showThisSection = idx < sectionsToShow;
      sections.push(
        <React.Fragment key={`${ri}-${ci}`}>
          {showThisSection && <Rect x={pad.left + c.x} y={pad.top + r.y} width={c.w} height={r.h} fill={color} opacity={0.25} rx={2} />}
          {showBorders && <Rect x={pad.left + c.x} y={pad.top + r.y} width={c.w} height={r.h} fill="none" stroke={showThisSection ? color : T.border} strokeWidth={showThisSection ? 2 : 1} strokeDasharray={showThisSection ? undefined : "4,4"} rx={2} />}
          {showThisSection && (
            <SvgText x={pad.left + c.x + c.w / 2} y={pad.top + r.y + r.h / 2} textAnchor="middle" alignmentBaseline="central"
              fill={color} fontSize={r.h > 40 && c.w > 55 ? 16 : 12} fontWeight="700" fontFamily={fontSerif(700)}>{label}</SvgText>
          )}
        </React.Fragment>
      );
    })
  );

  return (
    <View style={{ width: "100%", maxWidth: width, alignSelf: "center" }}>
      <Canvas w={width} h={height} maxW={width}>
        <Rect x={pad.left} y={pad.top} width={gw} height={gh} fill={T.accentLight} rx={3} />
        {sections}
        <Rect x={pad.left} y={pad.top} width={gw} height={gh} fill="none" stroke={T.textMuted} strokeWidth={1} rx={3} />
        {rr.map((r, i) => (
          <SvgText key={`r${i}`} x={pad.left - 12} y={pad.top + r.y + r.h / 2} textAnchor="end" alignmentBaseline="central" fill={T.text} fontSize={14} fontWeight="600" fontFamily={fontSerif(700)}>{r.label}</SvgText>
        ))}
        {cr.map((c, i) => (
          <SvgText key={`c${i}`} x={pad.left + c.x + c.w / 2} y={pad.top - 16} textAnchor="middle" fill={T.text} fontSize={14} fontWeight="600" fontFamily={fontSerif(700)}>{c.label}</SvgText>
        ))}
      </Canvas>
      {showEquation && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center", marginTop: 8 }}>
          {partials.map((p, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              {i > 0 && <Text style={{ color: T.textMuted, fontFamily: fontSerif(400), fontSize: 14 }}>+</Text>}
              <View style={{ backgroundColor: p.color + "18", borderWidth: 1.5, borderColor: p.color + "44", borderRadius: 6, paddingVertical: 3, paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: fontSerif(700), fontSize: 14, color: p.color }}>{p.label}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function NumberLineFrac({ factorA, factorB, width = 480, height = 160, revealStep = 4 }) {
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
      addTick(v, (bN * i) / g === bD / g ? `${(bN * i) / g}` : `${(bN * i) / g}/${bD / g}`);
    }
    addTick(1, "1");
  } else if (isFracTimeFrac) {
    addTick(bVal, `${bN}/${bD}`);
    addTick(prodVal, formatFrac(prodN, prodD));
    addTick(1, "1");
    for (let i = 1; i < aD; i++) addTick((bVal / aD) * i, "");
  } else {
    addTick(bVal, factorB.w > 0 ? (factorB.n > 0 ? `${factorB.w} ${factorB.n}/${factorB.d}` : `${factorB.w}`) : `${bN}/${bD}`);
    addTick(prodVal, formatFrac(prodN, prodD));
    addTick(1, "1");
    if (factorB.w > 0 && factorB.n > 0) addTick(factorB.w, `${factorB.w}`);
    if (factorA.w > 0) {
      for (let i = 1; i <= factorA.w; i++) {
        const v = bVal * i; const vn = bN * i; const vd = bD;
        const g2 = gcd(Math.abs(vn), vd);
        addTick(v, vn / g2 >= vd / g2 ? `${Math.floor(vn / vd)}${vn % vd ? ` ${(vn % vd) / g2}/${vd / g2}` : ""}` : `${vn / g2}/${vd / g2}`);
      }
    }
  }

  const sortedTicks = [...ticks.entries()].sort((a, b) => a[0] - b[0]);
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

  const arcsToShow = Math.min(revealStep, arcs.length);
  const showProductDot = revealStep >= 4;
  const maxLandVal = arcsToShow > 0 ? arcs[arcsToShow - 1].landVal : 0;

  return (
    <Canvas w={width} h={height}>
      <Line x1={pad.left - 10} y1={lineY} x2={width - pad.right} y2={lineY} stroke={T.textMid} strokeWidth={2} />
      <Polygon points={`${width - pad.right},${lineY} ${width - pad.right - 8},${lineY - 4} ${width - pad.right - 8},${lineY + 4}`} fill={T.textMid} />
      {sortedTicks.map(([val, label], i) => {
        const x = toX(val);
        const isProduct = Math.abs(val - prodVal) < 0.001 && val > 0;
        const isReached = val === 0 || val === 1 || val <= maxLandVal + 0.001;
        if (!isReached && !showProductDot) return null;
        return (
          <React.Fragment key={i}>
            <Line x1={x} y1={lineY - 8} x2={x} y2={lineY + 8} stroke={isProduct && showProductDot ? T.purple : T.textMid} strokeWidth={isProduct && showProductDot ? 2.5 : 1.5} />
            {label ? (
              <SvgText x={x} y={lineY + 24} textAnchor="middle" fill={isProduct && showProductDot ? T.purple : T.text} fontSize={isProduct && showProductDot ? 13 : 11} fontWeight={isProduct && showProductDot ? "700" : "500"} fontFamily={fontSans(isProduct && showProductDot ? 700 : 500)}>{label}</SvgText>
            ) : null}
            {isProduct && showProductDot && <Circle cx={x} cy={lineY} r={5} fill={T.purple} opacity={0.8} />}
          </React.Fragment>
        );
      })}
      {arcs.slice(0, arcsToShow).map((arc, i) => {
        const dy = arc.isSecond ? arcH + 14 : arc.isFracPart ? arcH + 4 : arcH;
        const cp1x = arc.x1 + (arc.x2 - arc.x1) * 0.25;
        const cp2x = arc.x1 + (arc.x2 - arc.x1) * 0.75;
        const pathD = `M ${arc.x1} ${lineY} C ${cp1x} ${lineY - dy}, ${cp2x} ${lineY - dy}, ${arc.x2} ${lineY}`;
        return (
          <React.Fragment key={i}>
            <Path d={pathD} fill="none" stroke={arc.color} strokeWidth={2} strokeDasharray={arc.isFirst ? "6,3" : undefined} opacity={arc.isFirst ? 0.5 : 0.8} />
            <Circle cx={arc.x2} cy={lineY} r={3} fill={arc.color} />
            {arc.label ? (
              <SvgText x={arc.mid} y={lineY - dy - 4} textAnchor="middle" fill={arc.color} fontSize={10} fontWeight="600" fontFamily={fontSans(600)}>{arc.label}</SvgText>
            ) : null}
          </React.Fragment>
        );
      })}
      <Circle cx={toX(0)} cy={lineY} r={4} fill={T.text} />
      {showProductDot && prodVal > 0 && (
        <SvgText x={toX(prodVal)} y={lineY + 40} textAnchor="middle" fill={T.purple} fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>▲ product</SvgText>
      )}
    </Canvas>
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

function renderGrid(a, b, rs) {
  if (a.w > 0 && a.n === 0 && b.w === 0) return <SimpleAreaGrid rows={a.w} cols={b.d} shadeRows={a.w} shadeCols={b.n} labelTop={`${b.n}/${b.d}`} labelLeft={`${a.w}`} revealStep={rs} />;
  if (a.w === 0 && b.w === 0) return <SimpleAreaGrid rows={a.d} cols={b.d} shadeRows={a.n} shadeCols={b.n} labelTop={`${b.n}/${b.d}`} labelLeft={`${a.n}/${a.d}`} revealStep={rs} />;
  return <MixedGrid wholeR={a.w} fracR_n={a.n} fracR_d={a.d} wholeC={b.w} fracC_n={b.n} fracC_d={b.d} revealStep={rs} />;
}

export function Module() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [tryMode, setTryMode] = useState(false);
  const [vizMode, setVizMode] = useState("area");
  const [tw, setTw] = useState(1); const [tn, setTn] = useState(2); const [td, setTd] = useState(3);
  const [tw2, setTw2] = useState(0); const [tn2, setTn2] = useState(3); const [td2, setTd2] = useState(4);
  const ex = fracExamples[idx];
  const tryRes = useMemo(() => formatFrac((tw * td + tn) * (tw2 * td2 + tn2), td * td2), [tw, tn, td, tw2, tn2, td2]);
  const currentSteps = vizMode === "numberline" ? ex.nlSteps : ex.steps;
  const bothPositive = !((tw === 0 && tn === 0) || (tw2 === 0 && tn2 === 0));
  const wholeOnly = tw > 0 && tn === 0 && tw2 > 0 && tn2 === 0;

  return (
    <ModuleShell tag={meta.tag} tagColor={T.accent} title={meta.title} subtitle="Two ways to see it: area models (2D) and number lines (1D). Switch between them!">
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        <Chip active={!tryMode} onPress={() => { setTryMode(false); setStep(0); }} color={T.accent}>Guided Examples</Chip>
        <Chip active={tryMode} onPress={() => setTryMode(true)} color={T.purple}>Try It Yourself</Chip>
      </View>

      {!tryMode ? (
        <>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {fracExamples.map((e, i) => <Chip key={i} active={idx === i} onPress={() => { setIdx(i); setStep(0); }} color={T.purple}>{e.tab}</Chip>)}
          </View>
          <View style={{ flexDirection: "row", gap: 4, marginBottom: 20, backgroundColor: T.bg, borderRadius: 10, padding: 4, borderWidth: 1, borderColor: T.border, alignSelf: "flex-start" }}>
            {[["area", "◔ Area Model"], ["numberline", "― Number Line"]].map(([m, lbl]) => (
              <Pressable key={m} onPress={() => { setVizMode(m); setStep(0); }} style={{ paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8, backgroundColor: vizMode === m ? T.accent : "transparent" }}>
                <Text style={{ fontFamily: fontSans(600), fontSize: 12.5, color: vizMode === m ? "#fff" : T.textMid }}>{lbl}</Text>
              </Pressable>
            ))}
          </View>
          <Card>
            <Text style={{ fontFamily: fontSerif(700), fontSize: 22, color: T.text, marginBottom: 20 }}>{ex.title}</Text>
            <VizPanel style={{ marginBottom: 20, paddingVertical: 18 }}>
              {vizMode === "area" ? renderGrid(ex.a, ex.b, step) : <NumberLineFrac factorA={ex.a} factorB={ex.b} revealStep={step} />}
            </VizPanel>
            <StepWalkthrough steps={currentSteps} step={step} setStep={setStep} color={T.accent} />
          </Card>
        </>
      ) : (
        <Card>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 18, marginBottom: 6 }}>Build your own multiplication</Text>
          <Text style={{ fontFamily: fontSans(400), fontSize: 13.5, color: T.textMid, marginBottom: 20 }}>Adjust the numbers and see both visualizations update live.</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18, justifyContent: "center", alignItems: "flex-end", marginBottom: 24, padding: 16, backgroundColor: T.bg, borderRadius: 10, borderWidth: 1, borderColor: T.border }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: fontSans(700), fontSize: 12, color: T.purple, marginBottom: 10 }}>First Factor</Text>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }}>
                <NumberInput label="Whole" value={tw} onChange={setTw} min={0} max={6} />
                <NumberInput label="Num" value={tn} onChange={setTn} min={0} max={9} />
                <Text style={{ fontSize: 20, color: T.textMuted, paddingBottom: 4 }}>/</Text>
                <NumberInput label="Den" value={td} onChange={setTd} min={1} max={12} />
              </View>
            </View>
            <Text style={{ fontSize: 24, fontFamily: fontSerif(400), color: T.textMuted, paddingBottom: 6 }}>×</Text>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: fontSans(700), fontSize: 12, color: T.purple, marginBottom: 10 }}>Second Factor</Text>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }}>
                <NumberInput label="Whole" value={tw2} onChange={setTw2} min={0} max={6} />
                <NumberInput label="Num" value={tn2} onChange={setTn2} min={0} max={9} />
                <Text style={{ fontSize: 20, color: T.textMuted, paddingBottom: 4 }}>/</Text>
                <NumberInput label="Den" value={td2} onChange={setTd2} min={1} max={12} />
              </View>
            </View>
          </View>
          {!bothPositive ? (
            <VizPanel style={{ padding: 30 }}>
              <Text style={{ fontFamily: fontSans(400), fontSize: 14, color: T.textMuted }}>Set both factors above zero to see the models.</Text>
            </VizPanel>
          ) : wholeOnly ? (
            <VizPanel style={{ padding: 20 }}>
              <Text style={{ fontFamily: fontSerif(700), fontSize: 20, color: T.purple }}>{tw} × {tw2} = {tw * tw2}</Text>
              <Text style={{ fontFamily: fontSans(400), fontSize: 13, color: T.textMid, marginTop: 8 }}>Whole × whole — try adding a fractional part!</Text>
            </VizPanel>
          ) : (
            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ fontFamily: fontSans(700), fontSize: 11, color: T.accent, letterSpacing: 1, marginBottom: 8 }}>◔ AREA MODEL</Text>
                <VizPanel style={{ paddingVertical: 18 }}>{renderGrid({ w: tw, n: tn, d: td }, { w: tw2, n: tn2, d: td2 }, 4)}</VizPanel>
              </View>
              <View>
                <Text style={{ fontFamily: fontSans(700), fontSize: 11, color: T.accent, letterSpacing: 1, marginBottom: 8 }}>― NUMBER LINE</Text>
                <VizPanel style={{ paddingVertical: 18 }}><NumberLineFrac factorA={{ w: tw, n: tn, d: td }} factorB={{ w: tw2, n: tn2, d: td2 }} /></VizPanel>
              </View>
            </View>
          )}
          {bothPositive && <ResultBadge label={tryRes} color={T.purple} />}
        </Card>
      )}
    </ModuleShell>
  );
}
