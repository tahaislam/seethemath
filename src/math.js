// ─── Pure math helpers (framework-agnostic, shared by every topic) ───

export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function formatFrac(n, d) {
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

// 2026 tax brackets — Canada Federal & Ontario Provincial
// Source: CRA + Ontario Ministry of Finance, indexed Jan 1 2026
export const FED_BRACKETS_2026 = [
  { upTo: 58523, rate: 0.14 },
  { upTo: 117045, rate: 0.205 },
  { upTo: 181440, rate: 0.26 },
  { upTo: 258482, rate: 0.29 },
  { upTo: Infinity, rate: 0.33 },
];
export const ON_BRACKETS_2026 = [
  { upTo: 53891, rate: 0.0505 },
  { upTo: 107785, rate: 0.0915 },
  { upTo: 150000, rate: 0.1116 },
  { upTo: 220000, rate: 0.1216 },
  { upTo: Infinity, rate: 0.1316 },
];

export function computeBrackets(income, brackets) {
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
