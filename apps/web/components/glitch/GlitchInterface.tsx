"use client";

import React, { useState, useRef, useEffect } from "react";
import { glitchImage, type GlitchOptions } from "@/utils/glitch";
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { MdOutlineFileDownload } from "react-icons/md";
import Link from "next/link";

export default function GlitchInterface() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [mode, setMode] = useState<"channel_shift" | "pixel_sort" | "noise" | "scanlines" | "block_scramble" | "wave_distortion" | "vhs_jitter">("channel_shift");
    const [options, setOptions] = useState<GlitchOptions>({
        amount: 0.5,
        seed: 1,
        iterations: 1,
        quality: 1,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [zoom, setZoom] = useState<number>(1);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (!imageSrc || !canvasRef.current) return;

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
            const glitched = glitchImage(imageData, options, mode);

            if (cancelled) return;

            ctx.putImageData(glitched, 0, 0);
            setIsProcessing(false);
        };

        processImage();

        return () => {
            cancelled = true;
        };
    }, [imageSrc, options, mode]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.download = "glitch-art.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    const updateOption = <K extends keyof GlitchOptions>(
        key: K,
        value: GlitchOptions[K],
    ) => {
        setOptions((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <main className="min-h-screen p-6 font-mono md:p-12 selection:bg-foreground selection:text-background">
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
                <div className="flex items-center justify-between bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-3 md:px-6">
                    <Link
                        href="/glitch"
                        className="text-lg font-bold tracking-tighter md:text-xl hover:opacity-80 transition-opacity"
                    >
                        GLITCH<span className="text-muted-foreground">STUDIO</span>
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
                                Mode
                            </Label>
                            <Select
                                value={mode}
                                onValueChange={(val: any) => setMode(val)}
                            >
                                <SelectTrigger className="shadow-none">
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent className="shadow-none">
                                    <SelectItem value="channel_shift">Channel Shift</SelectItem>
                                    <SelectItem value="pixel_sort">Pixel Sort</SelectItem>
                                    <SelectItem value="noise">Noise</SelectItem>
                                    <SelectItem value="scanlines">Scanlines</SelectItem>
                                    <SelectItem value="block_scramble">Block Scramble</SelectItem>
                                    <SelectItem value="wave_distortion">Wave Distortion</SelectItem>
                                    <SelectItem value="vhs_jitter">VHS Jitter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Amount: {Math.round(options.amount * 100)}%
                            </Label>
                            <div className="flex items-center h-10">
                                <Slider
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={[options.amount]}
                                    onValueChange={(vals) => updateOption("amount", vals[0])}
                                    className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Seed: {options.seed}
                            </Label>
                            <div className="flex items-center h-10">
                                <Slider
                                    min={1}
                                    max={100}
                                    step={1}
                                    value={[options.seed]}
                                    onValueChange={(vals) => updateOption("seed", vals[0])}
                                    className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                />
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-2">
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
                                ref={canvasRef}
                                className="max-w-full h-80 object-contain block rounded-sm"
                                style={{ imageRendering: "pixelated" }}
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
