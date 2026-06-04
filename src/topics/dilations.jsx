import React, { useState } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { Rect, Line, Circle, Path, Text as SvgText } from "react-native-svg";
import { T, fontSerif, fontSans } from "../tokens";
import { Canvas, Card, Chip, StepWalkthrough, ModuleShell, ResultBadge, VizPanel } from "../ui";

export const meta = {
  id: "dilations",
  icon: "◇",
  title: "Dilations",
  desc: "Watch shapes grow and shrink around a center point with scale factors",
  strand: "spatial",
  grade: [7, 8],
  color: T.coral,
  tag: "Dilations",
};

function DilationCanvas({ originalPoints, scale, center, width = 360, height = 360, revealStep = 4 }) {
  const gs = 20;
  const ox = width / 2;
  const oy = height / 2;
  const toS = (pt) => ({ x: ox + pt[0] * gs, y: oy - pt[1] * gs });
  const cxPt = toS(center);
  const scaled = originalPoints.map((pt) => [
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
    <Canvas w={width} h={height}>
      {Array.from({ length: gr * 2 + 1 }).map((_, i) => {
        const v = (i - gr) * gs + ox;
        const h2 = (i - gr) * gs + oy;
        return (
          <React.Fragment key={i}>
            <Line x1={v} y1={0} x2={v} y2={height} stroke={T.border} strokeWidth={i === gr ? 1.2 : 0.4} opacity={i === gr ? 0.6 : 0.35} />
            <Line x1={0} y1={h2} x2={width} y2={h2} stroke={T.border} strokeWidth={i === gr ? 1.2 : 0.4} opacity={i === gr ? 0.6 : 0.35} />
          </React.Fragment>
        );
      })}
      {[-6, -4, -2, 2, 4, 6].map((v) => (
        <React.Fragment key={v}>
          <SvgText x={ox + v * gs} y={oy + 14} textAnchor="middle" fill={T.textMuted} fontSize={9} fontFamily={fontSans(400)}>{v}</SvgText>
          <SvgText x={ox - 12} y={oy - v * gs + 3} textAnchor="end" fill={T.textMuted} fontSize={9} fontFamily={fontSans(400)}>{v}</SvgText>
        </React.Fragment>
      ))}
      {showRays && scaledS.map((sp, i) => (
        <Line key={`ray${i}`} x1={cxPt.x} y1={cxPt.y} x2={sp.x + (sp.x - cxPt.x) * 0.3} y2={sp.y + (sp.y - cxPt.y) * 0.3} stroke={T.coral} strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
      ))}
      <Path d={pathStr(origS)} fill={T.blue} fillOpacity={0.2} stroke={T.blue} strokeWidth={2} />
      {origS.map((p, i) => <Circle key={`o${i}`} cx={p.x} cy={p.y} r={4} fill={T.blue} />)}
      {showScaled && (
        <>
          <Path d={pathStr(scaledS)} fill={T.coral} fillOpacity={0.12} stroke={T.coral} strokeWidth={2} />
          {scaledS.map((p, i) => <Circle key={`s${i}`} cx={p.x} cy={p.y} r={4} fill={T.coral} />)}
        </>
      )}
      {showCenter && (
        <>
          <Circle cx={cxPt.x} cy={cxPt.y} r={6} fill="none" stroke={T.purple} strokeWidth={2} />
          <Circle cx={cxPt.x} cy={cxPt.y} r={2.5} fill={T.purple} />
          <SvgText x={cxPt.x + 10} y={cxPt.y - 10} fill={T.purple} fontSize={10} fontWeight="700" fontFamily={fontSans(700)}>Center</SvgText>
        </>
      )}
      <Rect x={8} y={8} width={12} height={12} fill={T.blue} opacity={0.4} rx={2} />
      <SvgText x={24} y={17} fill={T.blue} fontSize={10} fontWeight="600" fontFamily={fontSans(600)}>Original</SvgText>
      {showScaled && (
        <>
          <Rect x={8} y={26} width={12} height={12} fill={T.coral} opacity={0.4} rx={2} />
          <SvgText x={24} y={35} fill={T.coral} fontSize={10} fontWeight="600" fontFamily={fontSans(600)}>×{scale}</SvgText>
        </>
      )}
    </Canvas>
  );
}

const dilExamples = [
  { tab: "Scale factor > 1", title: "Enlarge by ×2", pts: [[1, 1], [3, 1], [3, 3], [1, 3]], scale: 2, center: [0, 0],
    steps: ["Start with a square at (1,1), (3,1), (3,3), (1,3).", "Center of dilation is the origin (0,0) — our anchor.", "Scale factor = 2: every point moves 2× as far from center.", "Draw rays from center through each corner. New corner is 2× along the ray.", "New corners: (2,2), (6,2), (6,6), (2,6). Same shape, double the size!"] },
  { tab: "Scale factor < 1", title: "Shrink by ×0.5", pts: [[2, 2], [6, 2], [6, 6], [2, 6]], scale: 0.5, center: [0, 0],
    steps: ["Start with a larger square at (2,2), (6,2), (6,6), (2,6).", "Scale factor = 0.5: image is half the distance from center.", "Each point moves halfway toward the origin.", "New corners: (1,1), (3,1), (3,3), (1,3). Shape shrinks!", "Factor < 1 = shrink. Factor > 1 = grow. Factor = 1 = unchanged."] },
  { tab: "Non-origin center", title: "×2 from (1,1)", pts: [[2, 1], [4, 1], [4, 3]], scale: 2, center: [1, 1],
    steps: ["Triangle at (2,1), (4,1), (4,3). Center of dilation = (1,1).", "Formula: new = center + scale × (point − center).", "Point (2,1): distance from center = (1,0). ×2 → (2,0). New: (3,1).", "Point (4,1): distance = (3,0). ×2 → (6,0). New: (7,1).", "Point (4,3): distance = (3,2). ×2 → (6,4). New: (7,5). Triangle doubles from (1,1)!"] },
];

export function Module() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [tryMode, setTryMode] = useState(false);
  const [tryScale, setTryScale] = useState(15);
  const ex = dilExamples[idx];
  const actualScale = tryScale / 10;
  const tryPts = [[1, 1], [4, 1], [4, 3], [1, 3]];
  const f = (n) => (n * actualScale).toFixed(1);

  return (
    <ModuleShell tag={meta.tag} tagColor={T.coral} title="Scaling Shapes" subtitle="Dilations resize shapes from a center point — like a projector zooming in and out.">
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        <Chip active={!tryMode} onPress={() => setTryMode(false)} color={T.coral}>Guided Examples</Chip>
        <Chip active={tryMode} onPress={() => setTryMode(true)} color={T.purple}>Try It Yourself</Chip>
      </View>
      {!tryMode ? (
        <>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            {dilExamples.map((e, i) => <Chip key={i} active={idx === i} onPress={() => { setIdx(i); setStep(0); }} color={T.coral}>{e.tab}</Chip>)}
          </View>
          <Card>
            <Text style={{ fontFamily: fontSerif(700), fontSize: 22, color: T.text, marginBottom: 20 }}>{ex.title}</Text>
            <VizPanel style={{ marginBottom: 20, padding: 12 }}>
              <DilationCanvas originalPoints={ex.pts} scale={ex.scale} center={ex.center} revealStep={step} />
            </VizPanel>
            <StepWalkthrough steps={ex.steps} step={step} setStep={setStep} color={T.coral} />
          </Card>
        </>
      ) : (
        <Card>
          <Text style={{ fontFamily: fontSerif(700), fontSize: 18, marginBottom: 6 }}>Slide the scale factor</Text>
          <Text style={{ fontFamily: fontSans(400), fontSize: 13.5, color: T.textMid, marginBottom: 20 }}>Watch the blue rectangle dilate from the origin as you change the scale.</Text>
          <View style={{ alignItems: "center", gap: 14, marginBottom: 24, padding: 16, backgroundColor: T.bg, borderRadius: 10, borderWidth: 1, borderColor: T.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16, width: "100%", maxWidth: 360 }}>
              <Text style={{ fontFamily: fontSans(700), fontSize: 13, color: T.coral, minWidth: 80 }}>Scale: {actualScale.toFixed(1)}×</Text>
              <Slider style={{ flex: 1 }} minimumValue={2} maximumValue={30} step={1} value={tryScale} onValueChange={(v) => setTryScale(Math.round(v))} minimumTrackTintColor={T.coral} maximumTrackTintColor={T.border} thumbTintColor={T.coral} />
            </View>
            <View style={{ flexDirection: "row", gap: 32 }}>
              <Text style={{ fontFamily: fontSans(400), fontSize: 12, color: T.textMuted }}>← shrink</Text>
              <Text style={{ fontFamily: fontSans(400), fontSize: 12, color: T.textMuted }}>1.0× same</Text>
              <Text style={{ fontFamily: fontSans(400), fontSize: 12, color: T.textMuted }}>enlarge →</Text>
            </View>
          </View>
          <VizPanel style={{ padding: 12 }}>
            <DilationCanvas originalPoints={tryPts} scale={actualScale} center={[0, 0]} />
          </VizPanel>
          <ResultBadge label={`${actualScale.toFixed(1)}× — ${actualScale > 1 ? "enlarged" : actualScale < 1 ? "reduced" : "same size"}`} color={T.coral} />
          <Text style={{ fontFamily: fontSans(400), fontSize: 12, color: T.textMid, textAlign: "center", marginTop: 12 }}>
            Original: (1,1) (4,1) (4,3) (1,3) → Scaled: ({f(1)},{f(1)}) ({f(4)},{f(1)}) ({f(4)},{f(3)}) ({f(1)},{f(3)})
          </Text>
        </Card>
      )}
    </ModuleShell>
  );
}
