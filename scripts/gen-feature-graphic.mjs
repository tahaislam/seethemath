// Generates the Google Play feature graphic (1024x500) from the brand.
// Run: node scripts/gen-feature-graphic.mjs
import sharp from "sharp";
import { writeFileSync } from "fs";

const GREEN = "#2d6a4f";
const GREEN_DK = "#235540";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/>
      <stop offset="1" stop-color="${GREEN_DK}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>

  <!-- sigma tile -->
  <rect x="96" y="150" width="200" height="200" rx="44" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>
  <text x="196" y="258" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-weight="700"
        fill="#ffffff" text-anchor="middle" dominant-baseline="central">&#8721;</text>

  <!-- wordmark + tagline -->
  <text x="360" y="214" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="700"
        fill="#ffffff">SeeTheMath</text>
  <text x="362" y="286" font-family="'Segoe UI', Arial, sans-serif" font-size="34" font-weight="600"
        fill="#ffffff" fill-opacity="0.92">See the math. Get the math.</text>
  <text x="362" y="338" font-family="'Segoe UI', Arial, sans-serif" font-size="25"
        fill="#ffffff" fill-opacity="0.78">Visual, interactive math for grades 6&#8211;9</text>
</svg>`;

const buf = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync("assets/feature-graphic.png", buf);
console.log("wrote assets/feature-graphic.png (1024x500)");
