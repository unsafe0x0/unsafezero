# UnsafeZero

UnsafeZero is a lightweight playground for experimental, single‑page web modules. Each route mounts an isolated interface.

## Current Module

- `/dither` — Real‑time image quantization & dithering (Floyd–Steinberg, Atkinson, Stucki, Burkes, Sierra, Jarvis, pixelation) with palette filtering (bw, gameboy, cga variants, nord, gruvbox, etc.) and adjustable pixel sizing.

## Philosophy

Minimal surface area. Fast iteration. No promises of stability. Things may break, change, or disappear.

## Tech Stack

- Next.js App Router
- React + TypeScript
- Custom UI components + theming

## Getting Started

```bash
bun install
bun --filter web dev
```

Open http://localhost:3000 and pick a module.

## Contributing

Feel free to open issues or PRs with new module ideas. Keep modules self‑contained and one page.

## License

MIT License
