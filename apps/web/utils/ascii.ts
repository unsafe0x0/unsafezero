export type CharacterSet = {
  name: string;
  chars: string;
};

export const CHARACTER_SETS: Record<string, CharacterSet> = {
  standard: {
    name: "Standard",
    chars: " .:-=+*#%@",
  },
  detailed: {
    name: "Detailed",
    chars: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  },
  blocks: {
    name: "Blocks",
    chars: " ░▒▓█",
  },
  binary: {
    name: "Binary",
    chars: " 01",
  },
  minimal: {
    name: "Minimal",
    chars: " .+@",
  },
  matrix: {
    name: "Matrix",
    chars: " ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789",
  },
  braille: {
    name: "Braille",
    chars: " ⠁⠃⠇⠏⠟⠿⣿",
  },
  numbers: {
    name: "Numbers",
    chars: " 0123456789",
  },
  ascii_art: {
    name: "ASCII Art",
    chars: " .-:=+*#@",
  },
  hatching: {
    name: "Hatching",
    chars: " /|\\X#",
  },
};

export type AsciiOptions = {
  characterSet: string;
  width: number;
  invert: boolean;
  contrast: number;
  brightness: number;
  fontSizeMultiplier: number;
};

function getBrightness(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function imageToAscii(
  imageData: ImageData,
  options: AsciiOptions
): { ascii: string; lines: string[] } {
  const { characterSet, width, invert, contrast, brightness } = options;
  const chars = CHARACTER_SETS[characterSet]?.chars || CHARACTER_SETS.standard.chars;

  const imgWidth = imageData.width;
  const imgHeight = imageData.height;

  const aspectRatio = 0.5;
  const height = Math.floor((width * imgHeight * aspectRatio) / imgWidth);

  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const srcX = Math.floor((x / width) * imgWidth);
      const srcY = Math.floor((y / height) * imgHeight);
      const idx = (srcY * imgWidth + srcX) * 4;

      const r = imageData.data[idx];
      const g = imageData.data[idx + 1];
      const b = imageData.data[idx + 2];

      let bright = getBrightness(r, g, b);

      bright = bright + brightness;

      bright = ((bright / 255 - 0.5) * contrast + 0.5) * 255;

      bright = Math.max(0, Math.min(255, bright));

      let normalized = bright / 255;

      if (invert) {
        normalized = 1 - normalized;
      }

      const charIndex = Math.floor(normalized * (chars.length - 1));
      line += chars[charIndex];
    }
    lines.push(line);
  }

  return {
    ascii: lines.join("\n"),
    lines,
  };
}

export function renderAsciiToCanvas(
  lines: string[],
  canvas: HTMLCanvasElement,
  options: AsciiOptions,
  colorMode: "mono" | "color",
  imageData?: ImageData,
  textColor?: string,
  bgColor?: string
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const fontSize = 10 * options.fontSizeMultiplier;
  const lineHeight = fontSize * 1.2;
  const charWidth = fontSize * 0.6;

  canvas.width = Math.ceil(options.width * charWidth);
  canvas.height = Math.ceil(lines.length * lineHeight);

  ctx.fillStyle = bgColor || "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "top";

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];

      if (colorMode === "color" && imageData) {
        const srcX = Math.floor((x / options.width) * imageData.width);
        const srcY = Math.floor((y / lines.length) * imageData.height);
        const idx = (srcY * imageData.width + srcX) * 4;

        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else {
        ctx.fillStyle = textColor || "#00ff00";
      }

      ctx.fillText(char, x * charWidth, y * lineHeight);
    }
  }
}
