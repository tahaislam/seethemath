import React, { useState } from "react";
import { View, Text } from "react-native";
import { Path, Polyline, Text as SvgText } from "react-native-svg";
import { T, fontSerif, fontSans } from "../tokens";
import { Canvas, Card, Chip, StepWalkthrough, NumberInput, ModuleShell, ResultBadge, VizPanel } from "../ui";

export const meta = {
  id: "pythagorean",
  icon: "◣",
  title: "Pythagorean Theorem",
  desc: "See why a² + b² = c² — the squares on the two legs exactly fill the square on the hypotenuse",
  strand: "spatial",
  grade: [8],
  color: T.coral,
  tag: "Pythagorean Theorem",
};

// Right triangle (right angle at A) with a square drawn on each side.
//   a = vertical leg, b = horizontal leg, c = hypotenuse = √(a²+b²)
function PythagSquares({ a, b, width = 380, height = 380, revealStep = 4 }) {
  const c = Math.sqrt(a * a + b * b);
  const pad = 46;
  // Figure bounds in leg-units: width (2a+b), height (a+2b). Scale to fit.
  const s = Math.min((width - pad * 2) / (2 * a + b), (height - pad * 2) / (a + 2 * b));
  const ax = pad + a * s; // right-angle corner x (room for the left a²-square)
  const ay = pad + (a + b) * s; // right-angle corner y (room for the top c²-square)

  const A = [ax, ay];
  const B = [ax + b * s, ay]; // end of horizontal leg
  const C = [ax, ay - a * s]; // end of vertical leg

  const poly = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") + " Z";

  // Square on horizontal leg AB (drawn below) -> area b²
  const sqB = [A, B, [B[0], B[1] + b * s], [A[0], A[1] + b * s]];
  // Square on vertical leg AC (drawn left) -> area a²
  const sqA = [A, C, [C[0] - a * s, C[1]], [A[0] - a * s, A[1]]];
  // Square on hypotenuse BC (drawn outward, away from A) -> area c²
  const sqC = [B, C, [C[0] + a * s, C[1] - b * s], [B[0] + a * s, B[1] - b * s]];

  const center = (pts) => [
    pts.reduce((s2, p) => s2 + p[0], 0) / pts.length,
    pts.reduce((s2, p) => s2 + p[1], 0) / pts.length,
  ];
  const cA = center(sqA), cB = center(sqB), cC = center(sqC);

  const showA = revealStep >= 1;
  const showB = revealStep >= 2;
  const showC = revealStep >= 3;
  const m = 12; // right-angle marker size

  const areaLabel = (pts, txt, color, leg) => {
    if (leg * s < 30) return null;
    const ctr = center(pts);
    const fs = Math.min(16, Math.max(9, (leg * s) / 3));
    return (
      <SvgText x={ctr[0]} y={ctr[1]} textAnchor="middle" alignmentBaseline="central" fill={color} fontSize={fs} fontWeight="700" fontFamily={fontSerif(700)}>
        {txt}
      </SvgText>
    );
  };

  return (
    <Canvas w={width} h={height}>
      {/* Squares on the legs */}
      {showA && <Path d={poly(sqA)} fill={T.blue} fillOpacity={0.18} stroke={T.blue} strokeWidth={1.5} />}
      {showB && <Path d={poly(sqB)} fill={T.accent} fillOpacity={0.18} stroke={T.accent} strokeWidth={1.5} />}
      {/* Square on the hypotenuse */}
      {showC && <Path d={poly(sqC)} fill={T.coral} fillOpacity={0.14} stroke={T.coral} strokeWidth={1.5} />}

      {/* The triangle itself (always visible, drawn on top) */}
      <Path d={poly([A, B, C])} fill="none" stroke={T.text} strokeWidth={2} />

      {/* Right-angle marker at A */}
      <Polyline points={`${ax + m},${ay} ${ax + m},${ay - m} ${ax},${ay - m}`} fill="none" stroke={T.textMid} strokeWidth={1.2} />

      {/* Leg + hypotenuse labels */}
      <SvgText x={ax - 10} y={(A[1] + C[1]) / 2} textAnchor="end" alignmentBaseline="central" fill={T.blue} fontSize={13} fontWeight="700" fontFamily={fontSans(700)}>a = {a}</SvgText>
      <SvgText x={(A[0] + B[0]) / 2} y={ay + 16} textAnchor="middle" fill={T.accent} fontSize={13} fontWeight="700" fontFamily={fontSans(700)}>b = {b}</SvgText>
      {showC && (
        <SvgText x={(B[0] + C[0]) / 2 + 6} y={(B[1] + C[1]) / 2 - 6} textAnchor="middle" alignmentBaseline="central" fill={T.coral} fontSize={13} fontWeight="700" fontFamily={fontSans(700)}>
          c = {Number.isInteger(c) ? c : c.toFixed(2)}
        </SvgText>
      )}

      {/* Area labels inside each square */}
      {showA && areaLabel(sqA, `a² = ${a * a}`, T.blue, a)}
      {showB && areaLabel(sqB, `b² = ${b * b}`, T.accent, b)}
      {showC && areaLabel(sqC, `c² = ${a * a + b * b}`, T.coral, c)}
    </Canvas>
  );
}

const pyExamples = [
  { tab: "3-4-5 triangle", title: "The 3-4-5 right triangle", a: 3, b: 4,
    steps: [
      "This right triangle has legs of 3 and 4, meeting at the square (right) angle.",
      "Build a square on the short leg (3). Its area is 3 × 3 = 9.",
      "Build a square on the other leg (4). Its area is 4 × 4 = 16.",
      "Build a square on the hypotenuse (the slanted side). Its area is 9 + 16 = 25.",
      "Since 25 = 5 × 5, the hypotenuse is 5. That's the theorem: a² + b² = c².",
    ] },
  { tab: "Find the hypotenuse", title: "Legs 6 and 8", a: 6, b: 8,
    steps: [
      "We know both legs, 6 and 8, and we want the hypotenuse c.",
      "Square the first leg: 6² = 36.",
      "Square the second leg: 8² = 64.",
      "Add the two leg-squares: 36 + 64 = 100. That total is c².",
      "c = √100 = 10. The big square's area equals the two smaller squares combined.",
    ] },
  { tab: "5-12-13 triangle", title: "Legs 5 and 12", a: 5, b: 12,
    steps: [
      "Legs of 5 and 12 — another famous right triangle.",
      "The square on leg 5 has area 25.",
      "The square on leg 12 has area 144.",
      "Together: 25 + 144 = 169 — the area of the square on the hypotenuse.",
      "√169 = 13, so the hypotenuse is 13. a² + b² = c² once more!",
    ] },
];

function EquationBadge({ a, b }) {
  const c2 = a * a + b * b;
  const c = Math.sqrt(c2);
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 16 }}>
      <Text style={{ fontFamily: fontSerif(700), fontSize: 17, color: T.blue }}>{a}²</Text>
      <Text style={{ fontFamily: fontSerif(400), fontSize: 16, color: T.textMuted }}>+</Text>
      <Text style={{ fontFamily: fontSerif(700), fontSize: 17, color: T.accent }}>{b}²</Text>
      <Text style={{ fontFamily: fontSerif(400), fontSize: 16, color: T.textMuted }}>=</Text>
      <Text style={{ fontFamily: fontSerif(700), fontSize: 17, color: T.coral }}>{c2}</Text>
      <Text style={{ fontFamily: fontSerif(400), fontSize: 16, color: T.textMuted }}>, so c = √{c2} = {Number.isInteger(c) ? c : c.toFixed(2)}</Text>
    </View>
  );
}

export function Module() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [tryMode, setTryMode] = useState(false);
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const ex = pyExamples[idx];
  const c = Math.sqrt(a * a + b * b);
  const isPerfect = Number.isInteger(c);

  return (
    <ModuleShell tag={meta.tag} tagColor={T.coral} title="Squares on the Sides" subtitle="In a right triangle, the squares built on the two legs hold exactly the same area as the square on the longest side.">
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        <Chip active={!tryMode} onPress={() => { setTryMode(false); setStep(0); }} color={T.coral}>Guided Examples</Chip>
        <Chip active={tryMode} onPress={() => setTryMode(true)} color={T.purple}>Try It Yourself</Chip>
      </View>

      {!tryMode ? (
        <>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {pyExamples.map((e, i) => <Chip key={i} active={idx === i} onPress={() => { setIdx(i); setStep(0); }} color={T.coral}>{e.tab}</Chip>)}
          </View>
          <Card>
            <Text style={{ fontFamily: fontSerif(700), fontSize: 22, color: T.text, marginBottom: 20 }}>{ex.title}</Text>
            <VizPanel style={{ marginBottom: 20, padding: 12 }}>
              <PythagSquares a={ex.a} b={ex.b} revealStep={step} />
            </VizPanel>
            <StepWalkthrough steps={ex.steps} step={step} setStep={setStep} color={T.coral} />
          </Card>
        </>
      ) : (
        <Card>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 18, marginBottom: 6 }}>Pick your own legs</Text>
          <Text style={{ fontFamily: fontSans(400), fontSize: 13.5, color: T.textMid, marginBottom: 20 }}>Change the two legs and watch the squares — and the hypotenuse — update live.</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center", marginBottom: 24, padding: 16, backgroundColor: T.bg, borderRadius: 10, borderWidth: 1, borderColor: T.border }}>
            <NumberInput label="Leg a" value={a} onChange={setA} min={1} max={12} />
            <NumberInput label="Leg b" value={b} onChange={setB} min={1} max={12} />
          </View>
          <VizPanel style={{ padding: 12 }}>
            <PythagSquares a={a} b={b} revealStep={4} />
          </VizPanel>
          <EquationBadge a={a} b={b} />
          <ResultBadge label={`c = ${isPerfect ? c : c.toFixed(3)}${isPerfect ? "  (whole number!)" : ""}`} color={T.coral} />
        </Card>
      )}
    </ModuleShell>
  );
}
