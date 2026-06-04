import React, { useState } from "react";
import { View, Text } from "react-native";
import { Rect, Line, Text as SvgText } from "react-native-svg";
import { T, fontSerif, fontSans } from "../tokens";
import { Canvas, Card, Chip, StepWalkthrough, NumberInput, ModuleShell, ResultBadge, VizPanel } from "../ui";

export const meta = {
  id: "ratios",
  icon: "⇌",
  title: "Ratios & Proportions",
  desc: "Tape diagrams and double number lines to see proportional relationships",
  strand: "number",
  grade: [6, 7],
  color: T.orange,
  tag: "Ratios & Proportions",
};

function TapeDiagram({ partsA, partsB, labelA, labelB, colorA = T.orange, colorB = T.accent, width = 420, revealStep = 4 }) {
  const h = 42;
  const gap = 12;
  const totalH = h * 2 + gap + 50;
  const maxP = Math.max(partsA, partsB);
  const pw = (width - 70) / maxP;
  const showA = revealStep >= 1;
  const showB = revealStep >= 2;
  const showRatioLabel = revealStep >= 3;
  return (
    <Canvas w={width} h={totalH}>
      <SvgText x={4} y={16 + h / 2} alignmentBaseline="central" fill={colorA} fontSize={13} fontWeight="700" fontFamily={fontSans(700)}>{labelA}</SvgText>
      {showA && Array.from({ length: partsA }).map((_, i) => (
        <React.Fragment key={`a${i}`}>
          <Rect x={56 + i * pw} y={16} width={pw - 3} height={h} fill={colorA} opacity={0.25} stroke={colorA} strokeWidth={1.5} rx={4} />
          <SvgText x={56 + i * pw + (pw - 3) / 2} y={16 + h / 2} textAnchor="middle" alignmentBaseline="central" fill={colorA} fontSize={12} fontWeight="600" fontFamily={fontSans(600)}>{i + 1}</SvgText>
        </React.Fragment>
      ))}
      <SvgText x={4} y={16 + h + gap + h / 2} alignmentBaseline="central" fill={colorB} fontSize={13} fontWeight="700" fontFamily={fontSans(700)}>{labelB}</SvgText>
      {showB && Array.from({ length: partsB }).map((_, i) => (
        <React.Fragment key={`b${i}`}>
          <Rect x={56 + i * pw} y={16 + h + gap} width={pw - 3} height={h} fill={colorB} opacity={0.25} stroke={colorB} strokeWidth={1.5} rx={4} />
          <SvgText x={56 + i * pw + (pw - 3) / 2} y={16 + h + gap + h / 2} textAnchor="middle" alignmentBaseline="central" fill={colorB} fontSize={12} fontWeight="600" fontFamily={fontSans(600)}>{i + 1}</SvgText>
        </React.Fragment>
      ))}
      {showRatioLabel && (
        <SvgText x={width / 2} y={totalH - 4} textAnchor="middle" fill={T.textMid} fontSize={13} fontWeight="600" fontFamily={fontSans(600)}>Ratio: {partsA} : {partsB}</SvgText>
      )}
    </Canvas>
  );
}

function DoubleNumberLine({ ratioA, ratioB, multipliers, labelA, labelB, colorA = T.orange, colorB = T.accent, width = 440, revealStep = 4 }) {
  const pad = { left: 46, right: 16 };
  const lw = width - pad.left - pad.right;
  const maxM = Math.max(...multipliers);
  const h = 120;
  const yA = 30;
  const yB = 90;
  const ticksToShow = Math.min(revealStep, multipliers.length);
  return (
    <Canvas w={width} h={h}>
      <Line x1={pad.left} y1={yA} x2={pad.left + lw} y2={yA} stroke={colorA} strokeWidth={2} />
      <Line x1={pad.left} y1={yB} x2={pad.left + lw} y2={yB} stroke={colorB} strokeWidth={2} />
      <SvgText x={6} y={yA} alignmentBaseline="central" fill={colorA} fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>{labelA}</SvgText>
      <SvgText x={6} y={yB} alignmentBaseline="central" fill={colorB} fontSize={11} fontWeight="700" fontFamily={fontSans(700)}>{labelB}</SvgText>
      {multipliers.slice(0, ticksToShow).map((m, i) => {
        const x = pad.left + (m / maxM) * lw;
        return (
          <React.Fragment key={i}>
            <Line x1={x} y1={yA - 8} x2={x} y2={yA + 8} stroke={colorA} strokeWidth={2} />
            <SvgText x={x} y={yA - 14} textAnchor="middle" fill={colorA} fontSize={12} fontWeight="700" fontFamily={fontSans(700)}>{ratioA * m}</SvgText>
            <Line x1={x} y1={yB - 8} x2={x} y2={yB + 8} stroke={colorB} strokeWidth={2} />
            <SvgText x={x} y={yB + 22} textAnchor="middle" fill={colorB} fontSize={12} fontWeight="700" fontFamily={fontSans(700)}>{ratioB * m}</SvgText>
            <Line x1={x} y1={yA + 8} x2={x} y2={yB - 8} stroke={T.border} strokeWidth={1} strokeDasharray="3,3" />
          </React.Fragment>
        );
      })}
    </Canvas>
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

export function Module() {
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
    <ModuleShell tag={meta.tag} tagColor={T.orange} title="Tape Diagrams & Number Lines" subtitle="Ratios are everywhere — recipes, maps, speed. See how two quantities stay linked.">
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        <Chip active={!tryMode} onPress={() => setTryMode(false)} color={T.orange}>Guided Examples</Chip>
        <Chip active={tryMode} onPress={() => setTryMode(true)} color={T.purple}>Try It Yourself</Chip>
      </View>
      {!tryMode ? (
        <>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {ratioExamples.map((e, i) => <Chip key={i} active={idx === i} onPress={() => { setIdx(i); setStep(0); }} color={T.orange}>{e.tab}</Chip>)}
          </View>
          <Card>
            <Text style={{ fontFamily: fontSerif(700), fontSize: 22, color: T.text, marginBottom: 20 }}>{ex.title}</Text>
            <VizPanel style={{ marginBottom: 20, paddingVertical: 18 }}>{renderVisual()}</VizPanel>
            <StepWalkthrough steps={ex.steps} step={step} setStep={setStep} color={T.orange} />
          </Card>
        </>
      ) : (
        <Card>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 18, marginBottom: 6 }}>Build your own ratio</Text>
          <Text style={{ fontFamily: fontSans(400), fontSize: 13.5, color: T.textMid, marginBottom: 20 }}>Set two quantities and see equivalent ratios on the tape diagram and number line.</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "flex-end", marginBottom: 24, padding: 16, backgroundColor: T.bg, borderRadius: 10, borderWidth: 1, borderColor: T.border }}>
            <NumberInput label="A" value={tryA} onChange={setTryA} min={1} max={12} />
            <Text style={{ fontSize: 20, color: T.textMuted, paddingBottom: 6, fontFamily: fontSerif(400) }}>:</Text>
            <NumberInput label="B" value={tryB} onChange={setTryB} min={1} max={12} />
            <NumberInput label="Show up to ×" value={tryMult} onChange={setTryMult} min={2} max={8} />
          </View>
          <VizPanel style={{ paddingVertical: 18, gap: 16 }}>
            <TapeDiagram partsA={tryA} partsB={tryB} labelA="A" labelB="B" />
            <DoubleNumberLine ratioA={tryA} ratioB={tryB} multipliers={Array.from({ length: tryMult }, (_, i) => i + 1)} labelA="A" labelB="B" />
          </VizPanel>
          <ResultBadge label={Array.from({ length: Math.min(tryMult, 4) }, (_, i) => `${tryA * (i + 1)}:${tryB * (i + 1)}`).join("  =  ")} color={T.orange} />
        </Card>
      )}
    </ModuleShell>
  );
}
