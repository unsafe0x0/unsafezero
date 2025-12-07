
export type GlitchOptions = {
    amount: number;
    seed: number;
    iterations: number;
    quality: number;
};

export function glitchImage(
    imageData: ImageData,
    options: GlitchOptions,
    mode: "channel_shift" | "pixel_sort" | "noise" | "scanlines" | "block_scramble" | "wave_distortion" | "vhs_jitter"
): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = new Uint8ClampedArray(imageData.data);
    const { amount, seed, iterations } = options;

    let currentSeed = seed;
    const random = () => {
        const x = Math.sin(currentSeed++) * 10000;
        return x - Math.floor(x);
    };

    const getPixelIndex = (x: number, y: number) => (y * width + x) * 4;

    if (mode === "channel_shift") {
        const shift = Math.floor(amount * 50);
        for (let i = 0; i < data.length; i += 4) {
            if (i + shift * 4 < data.length) {
                data[i] = data[i + shift * 4];
            }
            if (i - shift * 4 >= 0) {
                data[i + 2] = data[i - shift * 4 + 2];
            }
        }
    } else if (mode === "noise") {
        for (let i = 0; i < data.length; i += 4) {
            if (random() < amount * 0.5) {
                const noise = (random() - 0.5) * 255 * amount;
                data[i] = Math.min(255, Math.max(0, data[i] + noise));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
            }
        }
    } else if (mode === "scanlines") {
        const lineSize = Math.max(1, Math.floor(4 * (1.1 - amount)));
        for (let y = 0; y < height; y++) {
            if (y % lineSize === 0) {
                for (let x = 0; x < width; x++) {
                    const idx = getPixelIndex(x, y);
                    data[idx] = Math.max(0, data[idx] - 50);
                    data[idx + 1] = Math.max(0, data[idx + 1] - 50);
                    data[idx + 2] = Math.max(0, data[idx + 2] - 50);
                }
            }
        }
    } else if (mode === "pixel_sort") {
        const threshold = 255 * (1 - amount);

        for (let y = 0; y < height; y++) {
            let startX = -1;
            for (let x = 0; x < width; x++) {
                const idx = getPixelIndex(x, y);
                const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

                if (brightness > threshold) {
                    if (startX === -1) startX = x;
                } else {
                    if (startX !== -1) {
                        const rangeWidth = x - startX;
                        if (rangeWidth > 1) {
                            const pixels = [];
                            for (let k = 0; k < rangeWidth; k++) {
                                const pIdx = getPixelIndex(startX + k, y);
                                pixels.push({
                                    r: data[pIdx],
                                    g: data[pIdx + 1],
                                    b: data[pIdx + 2],
                                    a: data[pIdx + 3],
                                    bght: (data[pIdx] + data[pIdx + 1] + data[pIdx + 2]) / 3
                                });
                            }

                            pixels.sort((a, b) => a.bght - b.bght);

                            for (let k = 0; k < rangeWidth; k++) {
                                const pIdx = getPixelIndex(startX + k, y);
                                data[pIdx] = pixels[k].r;
                                data[pIdx + 1] = pixels[k].g;
                                data[pIdx + 2] = pixels[k].b;
                                data[pIdx + 3] = pixels[k].a;
                            }
                        }
                        startX = -1;
                    }
                }
            }
        }
    } else if (mode === "block_scramble") {
        const blockSize = Math.max(10, Math.floor(100 * (1 - amount) + 10));
        const blocksX = Math.ceil(width / blockSize);
        const blocksY = Math.ceil(height / blockSize);

        for (let i = 0; i < amount * 20; i++) {
            const srcBX = Math.floor(random() * blocksX);
            const srcBY = Math.floor(random() * blocksY);
            const dstBX = Math.floor(random() * blocksX);
            const dstBY = Math.floor(random() * blocksY);

            const w = Math.min(blockSize, width - srcBX * blockSize);
            const h = Math.min(blockSize, height - srcBY * blockSize);

            const blockData = new Uint8ClampedArray(w * h * 4);
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const srcIdx = getPixelIndex(srcBX * blockSize + x, srcBY * blockSize + y);
                    const bIdx = (y * w + x) * 4;
                    blockData[bIdx] = data[srcIdx];
                    blockData[bIdx + 1] = data[srcIdx + 1];
                    blockData[bIdx + 2] = data[srcIdx + 2];
                    blockData[bIdx + 3] = data[srcIdx + 3];
                }
            }

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    if (dstBX * blockSize + x >= width || dstBY * blockSize + y >= height) continue;
                    const dstIdx = getPixelIndex(dstBX * blockSize + x, dstBY * blockSize + y);
                    const bIdx = (y * w + x) * 4;
                    data[dstIdx] = blockData[bIdx];
                    data[dstIdx + 1] = blockData[bIdx + 1];
                    data[dstIdx + 2] = blockData[bIdx + 2];
                    data[dstIdx + 3] = blockData[bIdx + 3];
                }
            }
        }
    } else if (mode === "wave_distortion") {
        const amplitude = amount * 50;
        const frequency = 0.1;
        const phase = seed;

        const tempData = new Uint8ClampedArray(data);

        for (let y = 0; y < height; y++) {
            const shift = Math.floor(Math.sin(y * frequency + phase) * amplitude);
            for (let x = 0; x < width; x++) {
                let srcX = x + shift;
                if (srcX < 0) srcX += width;
                if (srcX >= width) srcX -= width;

                const srcIdx = getPixelIndex(srcX, y);
                const dstIdx = getPixelIndex(x, y);

                data[dstIdx] = tempData[srcIdx];
                data[dstIdx + 1] = tempData[srcIdx + 1];
                data[dstIdx + 2] = tempData[srcIdx + 2];
                data[dstIdx + 3] = tempData[srcIdx + 3];
            }
        }
    } else if (mode === "vhs_jitter") {
        const jitterAmount = amount * 20;
        const tempData = new Uint8ClampedArray(data);

        for (let y = 0; y < height; y++) {
            const jitter = Math.floor((random() - 0.5) * jitterAmount);
            if (random() > 0.9) {
                const tear = Math.floor((random() - 0.5) * jitterAmount * 5);
                for (let x = 0; x < width; x++) {
                    let srcX = x + tear;
                    if (srcX >= 0 && srcX < width) {
                        const srcIdx = getPixelIndex(srcX, y);
                        const dstIdx = getPixelIndex(x, y);
                        data[dstIdx] = tempData[srcIdx];
                        data[dstIdx + 1] = tempData[srcIdx + 1];
                        data[dstIdx + 2] = tempData[srcIdx + 2];
                    }
                }
            } else {
                for (let x = 0; x < width; x++) {
                    let srcX = x + jitter;
                    if (srcX >= 0 && srcX < width) {
                        const srcIdx = getPixelIndex(srcX, y);
                        const dstIdx = getPixelIndex(x, y);
                        data[dstIdx] = tempData[srcIdx];

                        let gX = x + jitter + 2;
                        if (gX >= 0 && gX < width) {
                            data[dstIdx + 1] = tempData[getPixelIndex(gX, y) + 1];
                        }

                        let bX = x + jitter - 2;
                        if (bX >= 0 && bX < width) {
                            data[dstIdx + 2] = tempData[getPixelIndex(bX, y) + 2];
                        }
                    }
                }
            }
        }
    }

    return new ImageData(data, width, height);
}
