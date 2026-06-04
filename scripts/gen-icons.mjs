// Generates all PNG app assets from the brand SVGs using sharp.
// Run: node scripts/gen-icons.mjs
import sharp from "sharp";
import { writeFileSync, readFileSync } from "fs";

// Full app icon: the canonical brand mark (green rounded square + white sigma).
// This is the single source of truth — the variants below are derived from it.
const iconSvg = readFileSync(new URL("../assets/icon.svg", import.meta.url), "utf8");

// Adaptive-icon foreground: transparent bg, white sigma inset within the safe zone.
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <text x="512" y="520" font-family="Georgia, 'Times New Roman', serif" font-size="440" font-weight="700"
        fill="#ffffff" text-anchor="middle" dominant-baseline="central">&#8721;</text>
</svg>`;

// Monochrome (Android 13+ themed icon): single-color sigma on transparent.
const monoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <text x="512" y="520" font-family="Georgia, 'Times New Roman', serif" font-size="440" font-weight="700"
        fill="#000000" text-anchor="middle" dominant-baseline="central">&#8721;</text>
</svg>`;

// Splash image: white sigma, centered (the screen background color comes from app.json).
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <text x="200" y="205" font-family="Georgia, 'Times New Roman', serif" font-size="260" font-weight="700"
        fill="#ffffff" text-anchor="middle" dominant-baseline="central">&#8721;</text>
</svg>`;

async function png(svg, size, out, background) {
  let img = sharp(Buffer.from(svg)).resize(size, size);
  if (background) img = img.flatten({ background });
  const buf = await img.png().toBuffer();
  writeFileSync(out, buf);
  console.log("wrote", out, `(${size}px)`);
}

await png(iconSvg, 1024, "assets/icon.png");
await png(fgSvg, 1024, "assets/android-icon-foreground.png");
await png(monoSvg, 1024, "assets/android-icon-monochrome.png");
await png(splashSvg, 400, "assets/splash-icon.png");
await png(iconSvg, 196, "assets/favicon.png");
// Play Store listing icon (512x512, no transparency).
await png(iconSvg, 512, "assets/play-store-icon.png");
console.log("done");
