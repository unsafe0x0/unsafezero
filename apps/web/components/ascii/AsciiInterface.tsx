"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  imageToAscii,
  renderAsciiToCanvas,
  CHARACTER_SETS,
  type AsciiOptions,
} from "@/utils/ascii";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MdOutlineFileDownload } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import Link from "next/link";

export default function AsciiInterface() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [asciiText, setAsciiText] = useState<string>("");
  const [options, setOptions] = useState<AsciiOptions>({
    characterSet: "standard",
    width: 100,
    invert: false,
    contrast: 1,
    brightness: 0,
    fontSizeMultiplier: 1,
  });
  const [colorMode, setColorMode] = useState<"mono" | "color">("mono");
  const [textColor, setTextColor] = useState<string>("#00ff00");
  const [bgColor, setBgColor] = useState<string>("#000000");
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc || !canvasRef.current || !textCanvasRef.current) return;

    let cancelled = false;

    const processImage = async () => {
      setIsProcessing(true);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      if (cancelled) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      imageDataRef.current = imageData;

      const { ascii, lines } = imageToAscii(imageData, options);

      if (cancelled) return;

      setAsciiText(ascii);

      if (textCanvasRef.current) {
        renderAsciiToCanvas(
          lines,
          textCanvasRef.current,
          options,
          colorMode,
          colorMode === "color" ? imageData : undefined,
          textColor,
          bgColor,
        );
      }

      setIsProcessing(false);
    };

    processImage();

    return () => {
      cancelled = true;
    };
  }, [imageSrc, options, colorMode, textColor, bgColor]);

  const downloadImage = () => {
    if (!textCanvasRef.current) return;
    const link = document.createElement("a");
    link.download = "ascii-art.png";
    link.href = textCanvasRef.current.toDataURL();
    link.click();
  };

  const downloadText = () => {
    const blob = new Blob([asciiText], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "ascii-art.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiText);
  };

  const updateOption = <K extends keyof AsciiOptions>(
    key: K,
    value: AsciiOptions[K],
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="min-h-screen p-6 font-mono md:p-12 selection:bg-foreground selection:text-background">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <div className="flex items-center justify-between bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-3 md:px-6">
          <Link
            href="/ascii"
            className="text-lg font-bold tracking-tighter md:text-xl hover:opacity-80 transition-opacity"
          >
            ASCII<span className="text-muted-foreground">ART</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-16 pt-20">
        <div className="flex flex-col gap-6">
          <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-card border-border shadow-none">
            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Source
              </Label>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start truncate shadow-none"
              >
                {imageSrc ? "Change Image" : "Upload Image"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Character Set
              </Label>
              <Select
                value={options.characterSet}
                onValueChange={(val) => updateOption("characterSet", val)}
              >
                <SelectTrigger className="shadow-none">
                  <SelectValue placeholder="Select character set" />
                </SelectTrigger>
                <SelectContent className="shadow-none">
                  {Object.entries(CHARACTER_SETS).map(([key, set]) => (
                    <SelectItem key={key} value={key}>
                      {set.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Color Mode
              </Label>
              <Select
                value={colorMode}
                onValueChange={(val: "mono" | "color") => setColorMode(val)}
              >
                <SelectTrigger className="shadow-none">
                  <SelectValue placeholder="Select color mode" />
                </SelectTrigger>
                <SelectContent className="shadow-none">
                  <SelectItem value="mono">Monochrome</SelectItem>
                  <SelectItem value="color">Color</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Invert
              </Label>
              <div className="flex items-center h-10">
                <Switch
                  checked={options.invert}
                  onCheckedChange={(val) => updateOption("invert", val)}
                  className="shadow-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Width: {options.width} chars
              </Label>
              <div className="flex items-center h-10">
                <Slider
                  min={20}
                  max={200}
                  step={5}
                  value={[options.width]}
                  onValueChange={(vals) => updateOption("width", vals[0])}
                  className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Contrast: {options.contrast.toFixed(2)}
              </Label>
              <div className="flex items-center h-10">
                <Slider
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={[options.contrast]}
                  onValueChange={(vals) => updateOption("contrast", vals[0])}
                  className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Brightness: {options.brightness}
              </Label>
              <div className="flex items-center h-10">
                <Slider
                  min={-100}
                  max={100}
                  step={5}
                  value={[options.brightness]}
                  onValueChange={(vals) => updateOption("brightness", vals[0])}
                  className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Font Size: {options.fontSizeMultiplier.toFixed(1)}x
              </Label>
              <div className="flex items-center h-10">
                <Slider
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[options.fontSizeMultiplier]}
                  onValueChange={(vals) =>
                    updateOption("fontSizeMultiplier", vals[0])
                  }
                  className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                />
              </div>
            </div>

            {colorMode === "mono" && (
              <>
                <div className="flex flex-col gap-3 lg:col-span-2">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    Text Color
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-14 flex-shrink-0 cursor-pointer rounded border border-border bg-background p-1"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 h-10 px-3 rounded border border-border bg-background font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:col-span-2">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    Background Color
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-14 flex-shrink-0 cursor-pointer rounded border border-border bg-background p-1"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 h-10 px-3 rounded border border-border bg-background font-mono text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              onClick={copyToClipboard}
              disabled={!imageSrc}
              className="shadow-none"
              variant="outline"
            >
              Copy Text
            </Button>
            <Button
              onClick={downloadText}
              disabled={!imageSrc}
              className="shadow-none"
              variant="outline"
            >
              Download Text
              <HiOutlineDocumentText className="ml-1 h-4 w-4" />
            </Button>
            <Button
              onClick={downloadImage}
              disabled={!imageSrc}
              className="shadow-none"
              variant="default"
            >
              Download Image
              <MdOutlineFileDownload className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 border border-border rounded-lg bg-muted flex items-center justify-center min-h-[60vh] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] opacity-10 pointer-events-none"></div>

            <canvas
              ref={canvasRef}
              className="hidden"
              style={{ imageRendering: "auto" }}
            />

            {!imageSrc && (
              <div className="text-muted-foreground text-sm uppercase tracking-widest border border-dashed border-border p-8 rounded-lg">
                No Image Loaded
              </div>
            )}

            <div
              className={`relative max-w-full max-h-full transition-transform duration-200 ease-out ${!imageSrc ? "hidden" : ""}`}
              style={{ transform: `scale(${zoom})` }}
            >
              <canvas
                ref={textCanvasRef}
                className="max-w-full h-80 object-contain block rounded-sm"
                style={{ imageRendering: "auto" }}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm rounded-sm">
                  <span className="font-mono text-sm animate-pulse bg-background px-3 py-1 rounded border border-border">
                    PROCESSING...
                  </span>
                </div>
              )}
            </div>

            {imageSrc && (
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
                  className="h-8 w-8 rounded-full border border-border shadow-none"
                >
                  -
                </Button>
                <span className="px-2 py-1 bg-background text-sm font-mono flex items-center rounded border border-border min-w-12 justify-center shadow-none">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
                  className="h-8 w-8 rounded-full border border-border shadow-none"
                >
                  +
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
