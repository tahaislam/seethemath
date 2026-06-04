// ─── Design Tokens ───
// Ported from the original web app. Colors/sizes are identical; fonts are
// resolved to concrete RN family names (custom fonts don't synthesize weights).

export const T = {
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
  radius: 12,
};

// Concrete font family names (loaded in app/_layout.jsx). On native, the weight
// is baked into the family; on web these families also carry the right weight.
export const fontSerif = (weight) =>
  Number(weight) >= 700 ? "LibreBaskerville_700Bold" : "LibreBaskerville_400Regular";

export const fontSans = (weight) => {
  const n = Number(weight) || 400;
  if (n >= 700) return "SourceSans3_700Bold";
  if (n >= 600) return "SourceSans3_600SemiBold";
  if (n >= 500) return "SourceSans3_500Medium";
  return "SourceSans3_400Regular";
};

// Ontario curriculum strands (used to group the home page)
export const STRANDS = [
  { id: "number", label: "Number", color: T.accent, light: T.accentLight },
  { id: "algebra", label: "Algebra", color: T.purple, light: T.purpleLight },
  { id: "data", label: "Data", color: T.blue, light: T.blueLight },
  { id: "spatial", label: "Spatial Reasoning", color: T.coral, light: T.coralLight },
  { id: "financial", label: "Financial Literacy", color: T.orange, light: T.orangeLight },
];
