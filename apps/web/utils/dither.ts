export type RGB = [number, number, number];

export const FILTERS: Record<string, RGB[]> = {
  bw: [
    [0, 0, 0],
    [255, 255, 255],
  ],
  gameboy: [
    [15, 56, 15],
    [48, 98, 48],
    [139, 172, 15],
    [155, 188, 15],
  ],
  cga: [
    [0, 0, 0],
    [85, 255, 255],
    [255, 85, 255],
    [255, 255, 255],
  ],
  cga_warm: [
    [0, 0, 0],
    [85, 255, 85],
    [255, 85, 85],
    [255, 255, 85],
  ],
  ega: [
    [0, 0, 0],
    [0, 0, 170],
    [0, 170, 0],
    [0, 170, 170],
    [170, 0, 0],
    [170, 0, 170],
    [170, 85, 0],
    [170, 170, 170],
    [85, 85, 85],
    [85, 85, 255],
    [85, 255, 85],
    [85, 255, 255],
    [255, 85, 85],
    [255, 85, 255],
    [255, 255, 85],
    [255, 255, 255],
  ],
  mac: [
    [255, 255, 255],
    [0, 0, 0],
  ],
  sepia: [
    [94, 75, 53],
    [166, 142, 116],
    [217, 202, 184],
    [255, 255, 255],
  ],
  vaporwave: [
    [255, 113, 206],
    [1, 205, 254],
    [5, 255, 161],
    [185, 103, 255],
    [255, 251, 150],
    [20, 20, 40],
  ],
  cyberpunk: [
    [252, 227, 0],
    [0, 255, 241],
    [255, 0, 60],
    [10, 10, 15],
  ],
  nord: [
    [46, 52, 64],
    [59, 66, 82],
    [67, 76, 94],
    [76, 86, 106],
    [216, 222, 233],
    [229, 233, 240],
    [236, 239, 244],
    [143, 188, 187],
    [136, 192, 208],
    [129, 161, 193],
    [94, 129, 172],
    [191, 97, 106],
    [208, 135, 112],
    [235, 203, 139],
    [163, 190, 140],
    [180, 142, 173],
  ],
  gruvbox: [
    [40, 40, 40],
    [204, 36, 29],
    [152, 151, 26],
    [215, 153, 33],
    [69, 133, 136],
    [177, 98, 134],
    [104, 157, 106],
    [168, 153, 132],
    [251, 241, 199],
    [251, 73, 52],
    [184, 187, 38],
    [250, 189, 47],
    [131, 165, 152],
    [211, 134, 155],
    [142, 192, 124],
    [235, 219, 178],
  ],
};

function getClosestColor(r: number, g: number, b: number, palette: RGB[]): RGB {
  let minDist = Infinity;
  let closest = palette[0];

  for (const color of palette) {
    const dr = r - color[0];
    const dg = g - color[1];
    const db = b - color[2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < minDist) {
      minDist = dist;
      closest = color;
    }
  }
  return closest;
}

export function ditherImage(
  imageData: ImageData,
  algorithm:
    | "floyd"
    | "atkinson"
    | "stucki"
    | "burkes"
    | "sierra"
    | "jarvis"
    | "none",
  filterName: string,
  pixelSize: number,
): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = new Uint8ClampedArray(imageData.data);
  const palette = FILTERS[filterName] || FILTERS.bw;

  const getPixel = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const setPixel = (x: number, y: number, r: number, g: number, b: number) => {
    const i = (y * width + x) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  };

  const addError = (
    x: number,
    y: number,
    er: number,
    eg: number,
    eb: number,
    factor: number,
  ) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = (y * width + x) * 4;
    data[i] = Math.min(255, Math.max(0, data[i] + er * factor));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + eg * factor));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + eb * factor));
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [oldR, oldG, oldB] = getPixel(x, y);
      const [newR, newG, newB] = getClosestColor(oldR, oldG, oldB, palette);

      setPixel(x, y, newR, newG, newB);

      if (algorithm === "none") continue;

      const errR = oldR - newR;
      const errG = oldG - newG;
      const errB = oldB - newB;

      if (algorithm === "floyd") {
        addError(x + 1, y, errR, errG, errB, 7 / 16);
        addError(x - 1, y + 1, errR, errG, errB, 3 / 16);
        addError(x, y + 1, errR, errG, errB, 5 / 16);
        addError(x + 1, y + 1, errR, errG, errB, 1 / 16);
      } else if (algorithm === "atkinson") {
        addError(x + 1, y, errR, errG, errB, 1 / 8);
        addError(x + 2, y, errR, errG, errB, 1 / 8);
        addError(x - 1, y + 1, errR, errG, errB, 1 / 8);
        addError(x, y + 1, errR, errG, errB, 1 / 8);
        addError(x + 1, y + 1, errR, errG, errB, 1 / 8);
        addError(x, y + 2, errR, errG, errB, 1 / 8);
      } else if (algorithm === "stucki") {
        addError(x + 1, y, errR, errG, errB, 8 / 42);
        addError(x + 2, y, errR, errG, errB, 4 / 42);
        addError(x - 2, y + 1, errR, errG, errB, 2 / 42);
        addError(x - 1, y + 1, errR, errG, errB, 4 / 42);
        addError(x, y + 1, errR, errG, errB, 8 / 42);
        addError(x + 1, y + 1, errR, errG, errB, 4 / 42);
        addError(x + 2, y + 1, errR, errG, errB, 2 / 42);
        addError(x - 2, y + 2, errR, errG, errB, 1 / 42);
        addError(x - 1, y + 2, errR, errG, errB, 2 / 42);
        addError(x, y + 2, errR, errG, errB, 4 / 42);
        addError(x + 1, y + 2, errR, errG, errB, 2 / 42);
        addError(x + 2, y + 2, errR, errG, errB, 1 / 42);
      } else if (algorithm === "burkes") {
        addError(x + 1, y, errR, errG, errB, 8 / 32);
        addError(x + 2, y, errR, errG, errB, 4 / 32);
        addError(x - 2, y + 1, errR, errG, errB, 2 / 32);
        addError(x - 1, y + 1, errR, errG, errB, 4 / 32);
        addError(x, y + 1, errR, errG, errB, 8 / 32);
        addError(x + 1, y + 1, errR, errG, errB, 4 / 32);
        addError(x + 2, y + 1, errR, errG, errB, 2 / 32);
      } else if (algorithm === "sierra") {
        addError(x + 1, y, errR, errG, errB, 5 / 32);
        addError(x + 2, y, errR, errG, errB, 3 / 32);
        addError(x - 2, y + 1, errR, errG, errB, 2 / 32);
        addError(x - 1, y + 1, errR, errG, errB, 4 / 32);
        addError(x, y + 1, errR, errG, errB, 5 / 32);
        addError(x + 1, y + 1, errR, errG, errB, 4 / 32);
        addError(x + 2, y + 1, errR, errG, errB, 2 / 32);
        addError(x - 1, y + 2, errR, errG, errB, 2 / 32);
        addError(x, y + 2, errR, errG, errB, 3 / 32);
        addError(x + 1, y + 2, errR, errG, errB, 2 / 32);
      } else if (algorithm === "jarvis") {
        addError(x + 1, y, errR, errG, errB, 7 / 48);
        addError(x + 2, y, errR, errG, errB, 5 / 48);
        addError(x - 2, y + 1, errR, errG, errB, 3 / 48);
        addError(x - 1, y + 1, errR, errG, errB, 5 / 48);
        addError(x, y + 1, errR, errG, errB, 7 / 48);
        addError(x + 1, y + 1, errR, errG, errB, 5 / 48);
        addError(x + 2, y + 1, errR, errG, errB, 3 / 48);
        addError(x - 2, y + 2, errR, errG, errB, 1 / 48);
        addError(x - 1, y + 2, errR, errG, errB, 3 / 48);
        addError(x, y + 2, errR, errG, errB, 5 / 48);
        addError(x + 1, y + 2, errR, errG, errB, 3 / 48);
        addError(x + 2, y + 2, errR, errG, errB, 1 / 48);
      }
    }
  }

  return new ImageData(data, width, height);
}