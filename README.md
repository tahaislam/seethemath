# ∑ SeeTheMath

**See the math. Get the math.**

Interactive visual walkthroughs for the math concepts that trip up middle schoolers. Built for students, parents, and teachers.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## What is this?

SeeTheMath is a free, open-source web app that teaches math visually through step-by-step interactive diagrams. Each concept has:

- **Guided examples** that progressively reveal the solution — one step at a time
- **Try It Yourself** mode where learners adjust inputs and watch the visualization update in real time

## Topics

| Module | What it covers | Visual model |
|---|---|---|
| **Fractions** | Integer × fraction through mixed × mixed | Area model + Number line |
| **Decimals & Percents** | Place value, fraction↔decimal, percentage of a number | Hundreds grid + Bar model |
| **Ratios & Proportions** | What ratios are, equivalence, solving proportions | Tape diagrams + Double number line |
| **Dilations** | Scale factor >1, <1, non-origin center | Coordinate grid with rays |

## Run locally

```bash
git clone https://github.com/YOUR_USERNAME/seethemath.git
cd seethemath
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deploy

This is a static site — no server needed. Deploy for free on:

- **Vercel**: Connect your GitHub repo → automatic deploys on every push
- **GitHub Pages**: Run `npm run build` and deploy the `dist/` folder
- **Cloudflare Pages**: Connect repo, set build command to `npm run build`, output to `dist`

## Tech stack

- React 18 + Vite
- Pure SVG visualizations (no charting libraries)
- Zero backend, zero database — runs entirely in the browser
- Google Fonts: Libre Baskerville + Source Sans 3

## Contributing

Contributions welcome! Some ideas:

- Add more examples to existing modules
- Build new modules (negative numbers, basic algebra, coordinate geometry)
- Improve mobile responsiveness
- Add accessibility features (keyboard navigation, screen reader support)
- Translations

## License

MIT — use it however you want.
