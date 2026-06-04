import React, { useState } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { Rect, Line, G, Text as SvgText } from "react-native-svg";
import { T, fontSerif, fontSans } from "../tokens";
import { FED_BRACKETS_2026, ON_BRACKETS_2026, computeBrackets } from "../math";
import { Canvas, Card, Chip, StepWalkthrough, NumberInput, ModuleShell, ResultBadge, VizPanel } from "../ui";

export const meta = {
  id: "decimals",
  icon: "◒",
  title: "Decimals & Percents",
  desc: "From hundreds grids to real-world tax brackets — see percentages everywhere",
  strand: "number",
  grade: [6, 7],
  color: T.blue,
  tag: "Decimals & Percents",
};

const TAX_INCOME_BLUE = "#3066be";
const TAX_TAX_RED = "#c74d52";
const TAX_NET_GREEN = "#2d8659";

function HundredGrid({ shaded, color = T.blue, width = 240 }) {
  const pad = 4;
  const cellSize = (width - pad * 2) / 10;
  const cells = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10);
    const c = i % 10;
    cells.push(
      <Rect key={i} x={pad + c * cellSize + 1} y={pad + r * cellSize + 1} width={cellSize - 2} height={cellSize - 2}
        fill={i < shaded ? color : "#fff"} opacity={i < shaded ? 0.5 : 0.8} stroke={T.border} strokeWidth={0.5} rx={2} />
    );
  }
  return (
    <Canvas w={width} h={width + 18} maxW={width}>
      <Rect x={0} y={0} width={width} height={width} fill={T.bg} rx={6} />
      {cells}
      <Rect x={pad} y={pad} width={cellSize * 10} height={cellSize * 10} fill="none" stroke={T.textMuted} strokeWidth={1} rx={4} />
      <SvgText x={width / 2} y={width + 12} textAnchor="middle" fill={color} fontSize={13} fontWeight="700" fontFamily={fontSans(700)}>{shaded}/100 shaded</SvgText>
    </Canvas>
  );
}

function BarModel({ total, filled, label, subLabel, color = T.blue, width = 400 }) {
  const h = 44;
  const ratio = Math.min(filled / total, 1);
  return (
    <Canvas w={width} h={h + 40} maxW={width}>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <G key={i}>
          <Line x1={p * width} y1={12} x2={p * width} y2={16} stroke={T.textMuted} strokeWidth={1} />
          <SvgText x={p * width} y={9} textAnchor="middle" fill={T.textMuted} fontSize={9} fontFamily={fontSans(400)}>{Math.round(p * 100)}%</SvgText>
        </G>
      ))}
      <Rect x={0} y={18} width={width} height={h} fill="#fff" stroke={T.border} strokeWidth={1.5} rx={6} />
      <Rect x={0} y={18} width={width * ratio} height={h} fill={color} opacity={0.3} rx={6} />
      <Rect x={0} y={18} width={width * ratio} height={h} fill="none" stroke={color} strokeWidth={2} rx={6} />
      <SvgText x={(width * ratio) / 2} y={18 + h / 2} textAnchor="middle" alignmentBaseline="central" fill={color} fontSize={15} fontWeight="700" fontFamily={fontSerif(700)}>{label}</SvgText>
      <SvgText x={width / 2} y={h + 36} textAnchor="middle" fill={T.textMuted} fontSize={11} fontFamily={fontSans(400)}>{subLabel}</SvgText>
    </Canvas>
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

// ─── Tax Flow Visualization ───
function TaxFlowView() {
  const INCOME = 75000;
  const fed = computeBrackets(INCOME, FED_BRACKETS_2026);
  const on = computeBrackets(INCOME, ON_BRACKETS_2026);
  const fedCount = fed.segments.length;
  const onCount = on.segments.length;
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
    `Final view: combine everything back. Total tax (red) = $${Math.round(fed.totalTax + on.totalTax).toLocaleString()}. Take-home (green) = $${Math.round(INCOME - fed.totalTax - on.totalTax).toLocaleString()}. Effective rate: ${(((fed.totalTax + on.totalTax) / INCOME) * 100).toFixed(1)}%.`,
  ];

  const W = 460;
  const padX = 20;
  const barW = W - padX * 2;
  const barH = 38;
  const rowGap = 18;

  const isIntro = step === 0;
  const isFedPhase = step >= 1 && step <= fedCount;
  const isFedDone = step === fedCount + 1;
  const isOnPhase = step >= fedCount + 2 && step <= fedCount + 1 + onCount;
  const isFinal = step === fedCount + 2 + onCount;
  const fedSegsProcessed = isIntro ? 0 : isFedPhase ? step : fedCount;
  const onSegsProcessed = isOnPhase ? step - (fedCount + 1) : step > fedCount + 1 + onCount ? onCount : 0;

  const rows = [];
  if (!isFinal) {
    const processedSoFar = fedSegsProcessed > 0 ? fed.segments.slice(0, fedSegsProcessed).reduce((s, x) => s + x.amount, 0) : 0;
    rows.push({ type: "income-active", processedSoFar, currentBracketIdx: isFedPhase ? step - 1 : null });
  }
  for (let i = 0; i < fedSegsProcessed; i++) {
    rows.push({ type: "processed", side: "fed", segIdx: i, seg: fed.segments[i], isCurrent: isFedPhase && i === step - 1 });
  }
  if ((isFedDone || isOnPhase || isFinal) && !isFinal) {
    rows.push({ type: "phase-label", text: `Federal subtotal: $${Math.round(fed.totalTax).toLocaleString()} tax`, color: T.blue });
  }
  for (let i = 0; i < onSegsProcessed; i++) {
    rows.push({ type: "processed", side: "on", segIdx: i, seg: on.segments[i], isCurrent: isOnPhase && i === step - (fedCount + 2) });
  }
  if (isFinal) {
    rows.push({ type: "ontario-subtotal", text: `Ontario subtotal: $${Math.round(on.totalTax).toLocaleString()} tax`, color: T.orange });
    rows.push({ type: "final-summary" });
  }

  const incomeBarH = 50;
  const processedRowH = barH + 24;
  const labelRowH = 22;
  const finalH = 90;
  let H = 20;
  rows.forEach((r) => {
    if (r.type === "income-active") H += incomeBarH + rowGap;
    else if (r.type === "processed") H += processedRowH + 6;
    else if (r.type === "phase-label" || r.type === "ontario-subtotal") H += labelRowH + 4;
    else if (r.type === "final-summary") H += finalH + 10;
  });
  H += 20;

  const buildElements = () => {
    const elements = [];
    let y = 20;
    rows.forEach((r, idx) => {
      if (r.type === "income-active") {
        elements.push(<SvgText key={`il-${idx}`} x={padX} y={y - 4} fill={T.textMid} fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>Sara's income</SvgText>);
        elements.push(<SvgText key={`ir-${idx}`} x={padX + barW} y={y - 4} textAnchor="end" fill={T.text} fontSize={12} fontWeight="700" fontFamily={fontSerif(700)}>${INCOME.toLocaleString()}</SvgText>);
        const procPx = (r.processedSoFar / INCOME) * barW;
        const remainPx = barW - procPx;
        if (procPx > 0) elements.push(<Rect key={`pf-${idx}`} x={padX} y={y} width={procPx} height={barH} fill={TAX_INCOME_BLUE} opacity={0.18} />);
        if (remainPx > 0) elements.push(<Rect key={`pr-${idx}`} x={padX + procPx} y={y} width={remainPx} height={barH} fill={TAX_INCOME_BLUE} opacity={0.85} rx={3} />);
        if (r.currentBracketIdx !== null && isFedPhase) {
          const seg = fed.segments[r.currentBracketIdx];
          const sx = padX + (seg.start / INCOME) * barW;
          const sw = (seg.amount / INCOME) * barW;
          elements.push(<Rect key={`gl-${idx}`} x={sx} y={y - 3} width={sw} height={barH + 6} fill="none" stroke={TAX_TAX_RED} strokeWidth={2.5} rx={4} />);
          elements.push(<SvgText key={`gll-${idx}`} x={sx + sw / 2} y={y + barH + 14} textAnchor="middle" fill={TAX_TAX_RED} fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>↓ processing this slice</SvgText>);
        }
        elements.push(<Rect key={`ob-${idx}`} x={padX} y={y} width={barW} height={barH} fill="none" stroke={T.textMid} strokeWidth={1} rx={3} />);
        y += incomeBarH + rowGap;
      } else if (r.type === "processed") {
        const seg = r.seg;
        const ratePct = (seg.rate * 100).toFixed(seg.rate < 0.1 ? 2 : 1);
        const slicePx = (seg.amount / INCOME) * barW;
        const taxPx = slicePx * seg.rate;
        const netPx = slicePx - taxPx;
        const startX = padX + (seg.start / INCOME) * barW;
        const opacity = r.isCurrent ? 1 : 0.65;
        const labelText = `${r.side === "fed" ? "Fed" : "ON"} bracket ${r.segIdx + 1}: ${ratePct}%`;
        elements.push(<SvgText key={`lbl-${idx}`} x={padX} y={y - 4} fill={r.side === "fed" ? T.blue : T.orange} fontSize={10} fontWeight="700" fontFamily={fontSans(700)} opacity={opacity}>{labelText}</SvgText>);
        elements.push(<SvgText key={`lblr-${idx}`} x={padX + barW} y={y - 4} textAnchor="end" fill={T.textMid} fontSize={10} fontFamily={fontSans(400)} opacity={opacity}>${Math.round(seg.start).toLocaleString()}–${Math.round(seg.end).toLocaleString()}</SvgText>);
        elements.push(<Rect key={`tx-${idx}`} x={startX} y={y} width={taxPx} height={barH} fill={TAX_TAX_RED} opacity={0.85 * opacity} rx={taxPx > 8 ? 3 : 0} />);
        elements.push(<Rect key={`nt-${idx}`} x={startX + taxPx} y={y} width={netPx} height={barH} fill={TAX_NET_GREEN} opacity={0.85 * opacity} rx={3} />);
        if (taxPx > 40) elements.push(<SvgText key={`txl-${idx}`} x={startX + taxPx / 2} y={y + barH / 2} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)} opacity={opacity}>${Math.round(seg.tax).toLocaleString()}</SvgText>);
        if (netPx > 50) elements.push(<SvgText key={`ntl-${idx}`} x={startX + taxPx + netPx / 2} y={y + barH / 2} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)} opacity={opacity}>${Math.round(seg.amount - seg.tax).toLocaleString()}</SvgText>);
        elements.push(<Rect key={`pob-${idx}`} x={startX} y={y} width={slicePx} height={barH} fill="none" stroke={r.side === "fed" ? T.blue : T.orange} strokeWidth={r.isCurrent ? 2 : 1} opacity={opacity} rx={3} />);
        y += processedRowH + 6;
      } else if (r.type === "phase-label" || r.type === "ontario-subtotal") {
        elements.push(<SvgText key={`pl-${idx}`} x={padX} y={y + 14} fill={r.color} fontSize={12} fontWeight="700" fontFamily={fontSans(700)}>✓ {r.text}</SvgText>);
        y += labelRowH + 4;
      } else if (r.type === "final-summary") {
        const totalTax = fed.totalTax + on.totalTax;
        const taxPx = (totalTax / INCOME) * barW;
        const netPx = barW - taxPx;
        const fedTaxPx = (fed.totalTax / INCOME) * barW;
        const onTaxPx = (on.totalTax / INCOME) * barW;
        elements.push(<SvgText key={`fl-${idx}`} x={padX} y={y - 4} fill={T.text} fontSize={12} fontWeight="700" fontFamily={fontSerif(700)}>Final: ${INCOME.toLocaleString()} split into tax + take-home</SvgText>);
        elements.push(<Rect key={`fft-${idx}`} x={padX} y={y} width={fedTaxPx} height={barH + 12} fill={TAX_TAX_RED} opacity={0.85} rx={4} />);
        elements.push(<Rect key={`fot-${idx}`} x={padX + fedTaxPx} y={y} width={onTaxPx} height={barH + 12} fill={TAX_TAX_RED} opacity={0.6} />);
        elements.push(<Rect key={`fnt-${idx}`} x={padX + taxPx} y={y} width={netPx} height={barH + 12} fill={TAX_NET_GREEN} opacity={0.85} rx={4} />);
        if (fedTaxPx > 50) {
          elements.push(<SvgText key={`fftl1-${idx}`} x={padX + fedTaxPx / 2} y={y + (barH + 12) / 2 - 5} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>Fed</SvgText>);
          elements.push(<SvgText key={`fftl2-${idx}`} x={padX + fedTaxPx / 2} y={y + (barH + 12) / 2 + 8} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>${Math.round(fed.totalTax).toLocaleString()}</SvgText>);
        }
        if (onTaxPx > 50) {
          elements.push(<SvgText key={`fotl1-${idx}`} x={padX + fedTaxPx + onTaxPx / 2} y={y + (barH + 12) / 2 - 5} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>ON</SvgText>);
          elements.push(<SvgText key={`fotl2-${idx}`} x={padX + fedTaxPx + onTaxPx / 2} y={y + (barH + 12) / 2 + 8} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>${Math.round(on.totalTax).toLocaleString()}</SvgText>);
        }
        if (netPx > 80) {
          elements.push(<SvgText key={`fntl1-${idx}`} x={padX + taxPx + netPx / 2} y={y + (barH + 12) / 2 - 5} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>Take-home</SvgText>);
          elements.push(<SvgText key={`fntl2-${idx}`} x={padX + taxPx + netPx / 2} y={y + (barH + 12) / 2 + 9} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>${Math.round(INCOME - totalTax).toLocaleString()}</SvgText>);
        }
        elements.push(<Rect key={`fb-${idx}`} x={padX} y={y} width={barW} height={barH + 12} fill="none" stroke={T.textMid} strokeWidth={1.5} rx={4} />);
        y += finalH + 10;
      }
    });
    return elements;
  };

  return (
    <Card>
      <View style={{ alignSelf: "flex-start", paddingVertical: 3, paddingHorizontal: 10, backgroundColor: T.orangeLight, borderWidth: 1, borderColor: T.orange + "33", borderRadius: 6, marginBottom: 12 }}>
        <Text style={{ fontFamily: fontSans(700), fontSize: 11, color: T.orange, letterSpacing: 1 }}>REAL WORLD</Text>
      </View>
      <Text style={{ fontFamily: fontSerif(700), fontSize: 22, color: T.text, marginBottom: 8 }}>Income through tax brackets</Text>
      <Text style={{ fontFamily: fontSans(400), fontSize: 14, color: T.textMid, lineHeight: 22, marginBottom: 20 }}>
        Watch how Sara's $75,000 flows through Canadian and Ontario tax brackets — one slice at a time.
      </Text>
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {[["Income", TAX_INCOME_BLUE], ["Tax", TAX_TAX_RED], ["Take-home", TAX_NET_GREEN]].map(([lbl, c]) => (
          <View key={lbl} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: c, opacity: 0.85 }} />
            <Text style={{ fontFamily: fontSans(400), fontSize: 12, color: T.textMid }}>{lbl}</Text>
          </View>
        ))}
      </View>
      <VizPanel style={{ paddingVertical: 16, paddingHorizontal: 8, marginBottom: 18 }}>
        <Canvas w={W} h={H}>{buildElements()}</Canvas>
      </VizPanel>
      <StepWalkthrough steps={stepLabels} step={step} setStep={setStep} color={T.orange} />

      <View style={{ marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: T.border }}>
        <Text style={{ fontFamily: fontSerif(700), fontSize: 16, color: T.text, marginBottom: 4 }}>Try any income</Text>
        <Text style={{ fontFamily: fontSans(400), fontSize: 13, color: T.textMid, marginBottom: 16 }}>See the final split for any income level.</Text>
        <TaxTrySlider />
      </View>

      <View style={{ marginTop: 24, padding: 14, backgroundColor: "#fff8e8", borderWidth: 1, borderColor: "#e8d5a8", borderRadius: 8 }}>
        <Text style={{ fontFamily: fontSans(400), fontSize: 11.5, color: "#6b5417", lineHeight: 18 }}>
          <Text style={{ fontFamily: fontSans(700) }}>Educational only.</Text> Simplified for learning — does not include CPP, EI, basic personal amount, tax credits, Ontario surtax, or deductions. Real tax filings are more complex. For actual tax filing in Canada, use CRA-approved software or consult a tax professional. Brackets shown are for tax year 2026.
        </Text>
      </View>
    </Card>
  );
}

function TaxTrySlider() {
  const [income, setIncome] = useState(75000);
  const fed = computeBrackets(income, FED_BRACKETS_2026);
  const on = computeBrackets(income, ON_BRACKETS_2026);
  const totalTax = fed.totalTax + on.totalTax;
  const takeHome = income - totalTax;
  const effective = (totalTax / income) * 100;
  const fedMarg = FED_BRACKETS_2026.find((b) => income < b.upTo).rate;
  const onMarg = ON_BRACKETS_2026.find((b) => income < b.upTo).rate;
  const marginal = (fedMarg + onMarg) * 100;

  const W = 460;
  const padX = 20;
  const barW = W - padX * 2;
  const barH = 50;
  const taxPx = (totalTax / income) * barW;
  const netPx = barW - taxPx;
  const fedTaxPx = (fed.totalTax / income) * barW;
  const onTaxPx = (on.totalTax / income) * barW;

  const stats = [
    ["TOTAL TAX", `$${Math.round(totalTax).toLocaleString()}`, T.coral, T.coralLight],
    ["TAKE-HOME", `$${Math.round(takeHome).toLocaleString()}`, T.accent, T.accentLight],
    ["EFFECTIVE", `${effective.toFixed(1)}%`, T.blue, T.blueLight],
    ["MARGINAL", `${marginal.toFixed(2)}%`, T.purple, T.purpleLight],
  ];

  return (
    <View>
      <View style={{ alignItems: "center", gap: 10, marginBottom: 16, padding: 14, backgroundColor: T.bg, borderRadius: 10, borderWidth: 1, borderColor: T.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, width: "100%", maxWidth: 400 }}>
          <Text style={{ fontFamily: fontSans(700), fontSize: 13, color: T.orange, minWidth: 86 }}>${income.toLocaleString()}</Text>
          <Slider style={{ flex: 1 }} minimumValue={20000} maximumValue={300000} step={1000} value={income} onValueChange={setIncome} minimumTrackTintColor={T.orange} maximumTrackTintColor={T.border} thumbTintColor={T.orange} />
        </View>
      </View>

      <VizPanel style={{ paddingVertical: 16, paddingHorizontal: 8, marginBottom: 16 }}>
        <Canvas w={W} h={barH + 28}>
          <SvgText x={padX} y={14} fill={T.text} fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>Income split</SvgText>
          <SvgText x={padX + barW} y={14} textAnchor="end" fill={T.text} fontSize={12} fontWeight="700" fontFamily={fontSerif(700)}>${income.toLocaleString()}</SvgText>
          {fedTaxPx > 0 && <Rect x={padX} y={20} width={fedTaxPx} height={barH} fill={TAX_TAX_RED} opacity={0.85} rx={4} />}
          {onTaxPx > 0 && <Rect x={padX + fedTaxPx} y={20} width={onTaxPx} height={barH} fill={TAX_TAX_RED} opacity={0.6} />}
          {netPx > 0 && <Rect x={padX + taxPx} y={20} width={netPx} height={barH} fill={TAX_NET_GREEN} opacity={0.85} rx={4} />}
          {fedTaxPx > 50 && (
            <G>
              <SvgText x={padX + fedTaxPx / 2} y={20 + barH / 2 - 4} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>Fed</SvgText>
              <SvgText x={padX + fedTaxPx / 2} y={20 + barH / 2 + 9} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>${Math.round(fed.totalTax).toLocaleString()}</SvgText>
            </G>
          )}
          {onTaxPx > 50 && (
            <G>
              <SvgText x={padX + fedTaxPx + onTaxPx / 2} y={20 + barH / 2 - 4} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>ON</SvgText>
              <SvgText x={padX + fedTaxPx + onTaxPx / 2} y={20 + barH / 2 + 9} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>${Math.round(on.totalTax).toLocaleString()}</SvgText>
            </G>
          )}
          {netPx > 90 && (
            <G>
              <SvgText x={padX + taxPx + netPx / 2} y={20 + barH / 2 - 4} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>Take-home</SvgText>
              <SvgText x={padX + taxPx + netPx / 2} y={20 + barH / 2 + 10} textAnchor="middle" alignmentBaseline="central" fill="#fff" fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>${Math.round(takeHome).toLocaleString()}</SvgText>
            </G>
          )}
          <Rect x={padX} y={20} width={barW} height={barH} fill="none" stroke={T.textMid} strokeWidth={1} rx={4} />
        </Canvas>
      </VizPanel>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {stats.map(([label, val, color, light]) => (
          <View key={label} style={{ flexGrow: 1, minWidth: 130, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: light, borderRadius: 8, borderWidth: 1.5, borderColor: color + "33" }}>
            <Text style={{ fontFamily: fontSans(700), fontSize: 10, color, letterSpacing: 1 }}>{label}</Text>
            <Text style={{ fontFamily: fontSerif(700), fontSize: 16, color, marginTop: 2 }}>{val}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function Module() {
  const [mode, setMode] = useState("guided");
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
  const tryResult = Math.round((tryPct / 100) * tryNum * 100) / 100;

  return (
    <ModuleShell tag={meta.tag} tagColor={T.blue} title="Hundreds Grid & Bar Models" subtitle="Every decimal, fraction, and percentage is just a different way to say the same number.">
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <Chip active={mode === "guided"} onPress={() => setMode("guided")} color={T.blue}>Guided Examples</Chip>
        <Chip active={mode === "tryit"} onPress={() => setMode("tryit")} color={T.purple}>Try It Yourself</Chip>
        <Chip active={mode === "tax"} onPress={() => setMode("tax")} color={T.orange}>Real World: Tax Brackets</Chip>
      </View>

      {mode === "guided" && (
        <>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {decExamples.map((e, i) => <Chip key={i} active={idx === i} onPress={() => { setIdx(i); setStep(0); }} color={T.blue}>{e.tab}</Chip>)}
          </View>
          <Card>
            <Text style={{ fontFamily: fontSerif(700), fontSize: 22, color: T.text, marginBottom: 20 }}>{ex.title}</Text>
            <VizPanel style={{ marginBottom: 20, paddingVertical: 18, gap: 20 }}>
              <HundredGrid shaded={progressiveShade(ex.shaded)} color={T.blue} />
              {idx === 2 && step >= 2 && <BarModel total={60} filled={24} label="24" subLabel="Full bar = 60" />}
            </VizPanel>
            <StepWalkthrough steps={ex.steps} step={step} setStep={setStep} color={T.blue} />
          </Card>
        </>
      )}

      {mode === "tryit" && (
        <Card>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 18, marginBottom: 6 }}>Explore percentages</Text>
          <Text style={{ fontFamily: fontSans(400), fontSize: 13.5, color: T.textMid, marginBottom: 20 }}>Pick a percentage and a number. See both the grid and bar update.</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", marginBottom: 24, padding: 16, backgroundColor: T.bg, borderRadius: 10, borderWidth: 1, borderColor: T.border }}>
            <NumberInput label="Percent %" value={tryPct} onChange={setTryPct} min={0} max={100} />
            <NumberInput label="Of what number?" value={tryNum} onChange={setTryNum} min={1} max={999} />
          </View>
          <VizPanel style={{ paddingVertical: 18, gap: 20 }}>
            <HundredGrid shaded={tryPct} color={T.blue} />
            <BarModel total={tryNum} filled={tryResult} label={`${tryResult}`} subLabel={`Full bar = ${tryNum}`} />
          </VizPanel>
          <ResultBadge label={`${tryPct}% of ${tryNum} = ${tryResult}`} color={T.blue} />
          <Text style={{ fontFamily: fontSans(400), fontSize: 13, color: T.textMid, textAlign: "center", marginTop: 12 }}>
            {tryPct}/100 = {(tryPct / 100).toFixed(2)} → {(tryPct / 100).toFixed(2)} × {tryNum} = {tryResult}
          </Text>
        </Card>
      )}

      {mode === "tax" && <TaxFlowView />}
    </ModuleShell>
  );
}
