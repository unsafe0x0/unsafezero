export type ColorStop = {
    color: string;
    position: number;
};

export type GradientType = "linear" | "radial" | "conic";

export type MeshEffects = {
    noise: number;
    blur: number;
    noiseType: "grain" | "perlin" | "static";
};

export type GradientOptions = {
    type: GradientType;
    angle: number;
    stops: ColorStop[];
    radialShape: "circle" | "ellipse";
    radialPosition: { x: number; y: number };
    meshEffects: MeshEffects;
};

export const DEFAULT_MESH_EFFECTS: MeshEffects = {
    noise: 0,
    blur: 0,
    noiseType: "grain",
};

export const PRESET_GRADIENTS: Record<string, GradientOptions> = {
    sunset: {
        type: "linear",
        angle: 135,
        stops: [
            { color: "#ff6b6b", position: 0 },
            { color: "#feca57", position: 50 },
            { color: "#48dbfb", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    ocean: {
        type: "linear",
        angle: 180,
        stops: [
            { color: "#0f0c29", position: 0 },
            { color: "#302b63", position: 50 },
            { color: "#24243e", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    aurora: {
        type: "linear",
        angle: 45,
        stops: [
            { color: "#00c6ff", position: 0 },
            { color: "#0072ff", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    neon: {
        type: "linear",
        angle: 90,
        stops: [
            { color: "#ff00ff", position: 0 },
            { color: "#00ffff", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    fire: {
        type: "radial",
        angle: 0,
        stops: [
            { color: "#f12711", position: 0 },
            { color: "#f5af19", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    forest: {
        type: "linear",
        angle: 120,
        stops: [
            { color: "#134e5e", position: 0 },
            { color: "#71b280", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    cotton_candy: {
        type: "linear",
        angle: 135,
        stops: [
            { color: "#ffecd2", position: 0 },
            { color: "#fcb69f", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    midnight: {
        type: "linear",
        angle: 180,
        stops: [
            { color: "#232526", position: 0 },
            { color: "#414345", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    rainbow: {
        type: "conic",
        angle: 0,
        stops: [
            { color: "#ff0000", position: 0 },
            { color: "#ff8000", position: 17 },
            { color: "#ffff00", position: 33 },
            { color: "#00ff00", position: 50 },
            { color: "#0080ff", position: 67 },
            { color: "#8000ff", position: 83 },
            { color: "#ff0080", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    purple_haze: {
        type: "linear",
        angle: 135,
        stops: [
            { color: "#7f00ff", position: 0 },
            { color: "#e100ff", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    sunrise: {
        type: "linear",
        angle: 0,
        stops: [
            { color: "#ff512f", position: 0 },
            { color: "#f09819", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    cool_blues: {
        type: "linear",
        angle: 225,
        stops: [
            { color: "#2193b0", position: 0 },
            { color: "#6dd5ed", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    },
    mesh_dream: {
        type: "radial",
        angle: 0,
        stops: [
            { color: "#667eea", position: 0 },
            { color: "#764ba2", position: 50 },
            { color: "#f093fb", position: 100 },
        ],
        radialShape: "ellipse",
        radialPosition: { x: 30, y: 30 },
        meshEffects: { noise: 15, blur: 40, noiseType: "grain" },
    },
    soft_mesh: {
        type: "conic",
        angle: 45,
        stops: [
            { color: "#a8edea", position: 0 },
            { color: "#fed6e3", position: 50 },
            { color: "#d299c2", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { noise: 10, blur: 60, noiseType: "perlin" },
    },
};

export function generateGradientCSS(options: GradientOptions): string {
    const sortedStops = [...options.stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");

    switch (options.type) {
        case "linear":
            return `linear-gradient(${options.angle}deg, ${stopsStr})`;
        case "radial":
            return `radial-gradient(${options.radialShape} at ${options.radialPosition.x}% ${options.radialPosition.y}%, ${stopsStr})`;
        case "conic":
            return `conic-gradient(from ${options.angle}deg at ${options.radialPosition.x}% ${options.radialPosition.y}%, ${stopsStr})`;
    }
}

export function generateTailwindConfig(options: GradientOptions): string {
    const cssValue = generateGradientCSS(options);
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': '${cssValue}',
      },
    },
  },
}

// Usage:
// <div className="bg-custom-gradient" />`;
}

export function generateCSSVariables(options: GradientOptions): string {
    const sortedStops = [...options.stops].sort((a, b) => a.position - b.position);
    let cssVars = `:root {\n`;
    sortedStops.forEach((stop, index) => {
        cssVars += `  --gradient-color-${index + 1}: ${stop.color};\n`;
    });
    cssVars += `  --gradient: ${generateGradientCSS(options)};\n`;
    cssVars += `}\n\n/* Usage: */\n.element {\n  background: var(--gradient);\n}`;
    return cssVars;
}

export function renderGradientToCanvas(
    canvas: HTMLCanvasElement,
    options: GradientOptions
): void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;

    let gradient: CanvasGradient;

    switch (options.type) {
        case "linear": {
            const angleRad = (options.angle - 90) * (Math.PI / 180);
            const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
            const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
            const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
            const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;
            gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            break;
        }
        case "radial": {
            const cx = (options.radialPosition.x / 100) * width;
            const cy = (options.radialPosition.y / 100) * height;
            const radius = Math.max(width, height);
            gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            break;
        }
        case "conic": {
            const cx = (options.radialPosition.x / 100) * width;
            const cy = (options.radialPosition.y / 100) * height;
            gradient = ctx.createConicGradient((options.angle * Math.PI) / 180, cx, cy);
            break;
        }
    }

    const sortedStops = [...options.stops].sort((a, b) => a.position - b.position);
    sortedStops.forEach((stop) => {
        gradient.addColorStop(stop.position / 100, stop.color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (options.meshEffects.blur > 0) {
        applyBlur(ctx, width, height, options.meshEffects.blur);
    }

    if (options.meshEffects.noise > 0) {
        applyNoise(ctx, width, height, options.meshEffects.noise, options.meshEffects.noiseType);
    }
}

function applyBlur(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    amount: number
): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const radius = Math.floor(amount / 10);

    if (radius < 1) return;

    const tempData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0, count = 0;

            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = (ny * width + nx) * 4;
                        r += tempData[idx];
                        g += tempData[idx + 1];
                        b += tempData[idx + 2];
                        a += tempData[idx + 3];
                        count++;
                    }
                }
            }

            const idx = (y * width + x) * 4;
            data[idx] = r / count;
            data[idx + 1] = g / count;
            data[idx + 2] = b / count;
            data[idx + 3] = a / count;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function generatePerlinNoise(width: number, height: number, scale: number): number[][] {
    const noise: number[][] = [];

    const permutation = [];
    for (let i = 0; i < 256; i++) permutation[i] = i;
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    const perm = [...permutation, ...permutation];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number) => {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    for (let y = 0; y < height; y++) {
        noise[y] = [];
        for (let x = 0; x < width; x++) {
            const px = (x / scale) % 256;
            const py = (y / scale) % 256;

            const xi = Math.floor(px) & 255;
            const yi = Math.floor(py) & 255;
            const xf = px - Math.floor(px);
            const yf = py - Math.floor(py);

            const u = fade(xf);
            const v = fade(yf);

            const aa = perm[perm[xi] + yi];
            const ab = perm[perm[xi] + yi + 1];
            const ba = perm[perm[xi + 1] + yi];
            const bb = perm[perm[xi + 1] + yi + 1];

            const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
            const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);

            noise[y][x] = (lerp(x1, x2, v) + 1) / 2;
        }
    }

    return noise;
}

function applyNoise(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number,
    noiseType: "grain" | "perlin" | "static"
): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const noiseAmount = intensity / 100;

    let perlinNoise: number[][] | null = null;
    if (noiseType === "perlin") {
        perlinNoise = generatePerlinNoise(width, height, 50);
    }

    for (let i = 0; i < data.length; i += 4) {
        let noise: number;

        switch (noiseType) {
            case "grain":
                noise = (Math.random() - 0.5) * 2 * noiseAmount * 128;
                break;
            case "perlin": {
                const pixelIndex = i / 4;
                const x = pixelIndex % width;
                const y = Math.floor(pixelIndex / width);
                noise = ((perlinNoise![y][x] - 0.5) * 2) * noiseAmount * 128;
                break;
            }
            case "static":
                noise = Math.random() > 0.5 ? noiseAmount * 64 : -noiseAmount * 64;
                break;
        }

        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

export function rgbToHsl(
    r: number,
    g: number,
    b: number
): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

export function generateRandomColor(): string {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

export function generateHarmoniousColors(baseColor: string, count: number): string[] {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [baseColor];

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
        const newH = (hsl.h + (360 / count) * i) % 360;
        colors.push(`hsl(${newH}, ${hsl.s}%, ${hsl.l}%)`);
    }

    return colors;
}
