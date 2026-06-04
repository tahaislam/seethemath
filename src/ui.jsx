import { View, Text, Pressable } from "react-native";
import Svg from "react-native-svg";
import { T, fontSerif, fontSans } from "./tokens";

// Responsive SVG wrapper — keeps the viewBox aspect ratio on web AND native.
export function Canvas({ w, h, maxW, children, style }) {
  return (
    <View style={[{ width: "100%", maxWidth: maxW ?? w, aspectRatio: w / h, alignSelf: "center" }, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
        {children}
      </Svg>
    </View>
  );
}

// White rounded card used to frame every module body.
export function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: T.card,
          borderWidth: 1.5,
          borderColor: T.border,
          borderRadius: 14,
          padding: 22,
          shadowColor: "#2a2520",
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Chip({ children, active, onPress, color = T.accent }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: active ? 2 : 1.5,
        borderColor: active ? color : T.border,
        backgroundColor: active ? color + "15" : T.card,
      }}
    >
      <Text style={{ fontFamily: fontSans(active ? 700 : 500), fontSize: 13.5, color: active ? color : T.textMid }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function StepWalkthrough({ steps, step, setStep, color = T.purple }) {
  return (
    <View>
      <View style={{ marginBottom: 18 }}>
        {steps.map((s, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start", paddingVertical: 8, opacity: i <= step ? 1 : 0.25 }}>
            <View
              style={{
                minWidth: 26, width: 26, height: 26, borderRadius: 13,
                backgroundColor: i <= step ? color : T.border,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ color: i <= step ? "#fff" : T.textMuted, fontSize: 12, fontFamily: fontSans(700) }}>{i + 1}</Text>
            </View>
            <Text style={{ flex: 1, fontFamily: fontSans(400), fontSize: 14, color: T.text, lineHeight: 21 }}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Pressable
          onPress={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          style={{ paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.card, opacity: step === 0 ? 0.5 : 1 }}
        >
          <Text style={{ fontFamily: fontSans(600), fontSize: 13, color: step === 0 ? T.textMuted : T.text }}>← Back</Text>
        </Pressable>
        <Pressable
          onPress={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          style={{ paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1.5, borderColor: color, backgroundColor: step === steps.length - 1 ? color + "18" : color }}
        >
          <Text style={{ fontFamily: fontSans(600), fontSize: 13, color: step === steps.length - 1 ? color : "#fff" }}>
            {step === steps.length - 1 ? "Done ✓" : "Next Step →"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function NumberInput({ label, value, onChange, min = 0, max = 12 }) {
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Text style={{ fontFamily: fontSans(600), fontSize: 11, color: T.textMuted }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          style={{ width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: T.border, backgroundColor: T.bg, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18, color: T.textMid }}>−</Text>
        </Pressable>
        <Text style={{ width: 34, textAlign: "center", fontFamily: fontSerif(700), fontSize: 18, color: T.text }}>{value}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          style={{ width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: T.border, backgroundColor: T.bg, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18, color: T.textMid }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ModuleShell({ tag, tagColor, title, subtitle, children }) {
  return (
    <View style={{ paddingVertical: 28, paddingHorizontal: 18, maxWidth: 660, width: "100%", alignSelf: "center" }}>
      <View style={{ marginBottom: 22 }}>
        <Text style={{ fontFamily: fontSans(700), fontSize: 12, letterSpacing: 1.5, color: tagColor, marginBottom: 6 }}>
          {tag.toUpperCase()}
        </Text>
        <Text style={{ fontFamily: fontSerif(700), fontSize: 25, color: T.text }}>{title}</Text>
        <Text style={{ fontFamily: fontSans(400), fontSize: 14.5, color: T.textMid, marginTop: 8, lineHeight: 22 }}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

export function ResultBadge({ label, color }) {
  return (
    <View
      style={{
        flexDirection: "row", alignItems: "center", gap: 12, justifyContent: "center",
        backgroundColor: color + "12", borderWidth: 1.5, borderColor: color + "33",
        borderRadius: 10, paddingVertical: 14, paddingHorizontal: 20, marginTop: 16,
      }}
    >
      <Text style={{ fontFamily: fontSans(700), fontSize: 12, letterSpacing: 1, color, opacity: 0.7 }}>RESULT</Text>
      <Text style={{ fontFamily: fontSerif(700), fontSize: 20, color }}>{label}</Text>
    </View>
  );
}

// A soft inset panel (the `T.bg` framed area that holds each visualization).
export function VizPanel({ children, style }) {
  return (
    <View style={[{ backgroundColor: T.bg, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: T.border, alignItems: "center" }, style]}>
      {children}
    </View>
  );
}
