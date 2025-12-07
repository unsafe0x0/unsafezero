"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    generateGradientCSS,
    generateTailwindConfig,
    generateCSSVariables,
    renderGradientToCanvas,
    PRESET_GRADIENTS,
    DEFAULT_MESH_EFFECTS,
    generateRandomColor,
    type GradientOptions,
    type ColorStop,
    type GradientType,
    type MeshEffects,
} from "@/utils/gradient";
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
import { MdOutlineFileDownload, MdContentCopy, MdAdd, MdClose, MdShuffle } from "react-icons/md";
import Link from "next/link";

type ExportFormat = "css" | "tailwind" | "variables";

export default function GradientInterface() {
    const [options, setOptions] = useState<GradientOptions>({
        type: "linear",
        angle: 135,
        stops: [
            { color: "#667eea", position: 0 },
            { color: "#764ba2", position: 100 },
        ],
        radialShape: "circle",
        radialPosition: { x: 50, y: 50 },
        meshEffects: { ...DEFAULT_MESH_EFFECTS },
    });
    const [exportFormat, setExportFormat] = useState<ExportFormat>("css");
    const [copied, setCopied] = useState(false);
    const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0);
    const [isRendering, setIsRendering] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const downloadCanvasRef = useRef<HTMLCanvasElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hasMeshEffects = options.meshEffects.noise > 0 || options.meshEffects.blur > 0;

    const renderGradient = useCallback(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = 640;
        canvas.height = 360;
        renderGradientToCanvas(canvas, options);
    }, [options]);

    useEffect(() => {
        if (renderTimeoutRef.current) {
            clearTimeout(renderTimeoutRef.current);
        }

        if (hasMeshEffects) {
            setIsRendering(true);
            renderTimeoutRef.current = setTimeout(() => {
                renderGradient();
                setIsRendering(false);
            }, 150);
        } else {
            renderGradient();
        }

        return () => {
            if (renderTimeoutRef.current) {
                clearTimeout(renderTimeoutRef.current);
            }
        };
    }, [renderGradient, hasMeshEffects]);

    const gradientCSS = generateGradientCSS(options);

    const getExportCode = () => {
        switch (exportFormat) {
            case "css":
                return `background: ${gradientCSS};`;
            case "tailwind":
                return generateTailwindConfig(options);
            case "variables":
                return generateCSSVariables(options);
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(getExportCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadImage = () => {
        const downloadCanvas = document.createElement("canvas");
        downloadCanvas.width = 1920;
        downloadCanvas.height = 1080;
        renderGradientToCanvas(downloadCanvas, options);
        const link = document.createElement("a");
        link.download = "gradient.png";
        link.href = downloadCanvas.toDataURL("image/png");
        link.click();
    };

    const updateStop = (index: number, updates: Partial<ColorStop>) => {
        setOptions((prev) => ({
            ...prev,
            stops: prev.stops.map((stop, i) =>
                i === index ? { ...stop, ...updates } : stop
            ),
        }));
    };

    const addStop = () => {
        if (options.stops.length >= 8) return;
        const newPosition = 50;
        const newColor = generateRandomColor();
        setOptions((prev) => ({
            ...prev,
            stops: [...prev.stops, { color: newColor, position: newPosition }].sort(
                (a, b) => a.position - b.position
            ),
        }));
    };

    const removeStop = (index: number) => {
        if (options.stops.length <= 2) return;
        setOptions((prev) => ({
            ...prev,
            stops: prev.stops.filter((_, i) => i !== index),
        }));
        if (selectedStopIndex >= options.stops.length - 1) {
            setSelectedStopIndex(Math.max(0, options.stops.length - 2));
        }
    };

    const loadPreset = (presetName: string) => {
        const preset = PRESET_GRADIENTS[presetName];
        if (preset) {
            setOptions(preset);
            setSelectedStopIndex(0);
        }
    };

    const randomizeGradient = () => {
        const types: GradientType[] = ["linear", "radial", "conic"];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const stopCount = Math.floor(Math.random() * 3) + 2;
        const stops: ColorStop[] = [];

        for (let i = 0; i < stopCount; i++) {
            stops.push({
                color: generateRandomColor(),
                position: Math.round((i / (stopCount - 1)) * 100),
            });
        }

        setOptions({
            type: randomType,
            angle: Math.floor(Math.random() * 360),
            stops,
            radialShape: Math.random() > 0.5 ? "circle" : "ellipse",
            radialPosition: {
                x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100),
            },
            meshEffects: {
                noise: Math.floor(Math.random() * 30),
                blur: Math.floor(Math.random() * 50),
                noiseType: ["grain", "perlin", "static"][Math.floor(Math.random() * 3)] as MeshEffects["noiseType"],
            },
        });
        setSelectedStopIndex(0);
    };

    return (
        <main className="min-h-screen p-6 font-mono md:p-12 selection:bg-foreground selection:text-background">
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
                <div className="flex items-center justify-between bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-3 md:px-6">
                    <Link
                        href="/gradient"
                        className="text-lg font-bold tracking-tighter md:text-xl hover:opacity-80 transition-opacity"
                    >
                        GRADIENT<span className="text-muted-foreground">FORGE</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-5xl space-y-6 pt-20">
                <div className="flex flex-col gap-6">
                    <Card className="p-6 bg-card border-border shadow-none space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-3">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    Preset
                                </Label>
                                <Select onValueChange={loadPreset}>
                                    <SelectTrigger className="shadow-none">
                                        <SelectValue placeholder="Load preset" />
                                    </SelectTrigger>
                                    <SelectContent className="shadow-none">
                                        {Object.keys(PRESET_GRADIENTS).map((name) => (
                                            <SelectItem key={name} value={name}>
                                                {name.replace(/_/g, " ").toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    Type
                                </Label>
                                <Select
                                    value={options.type}
                                    onValueChange={(val: GradientType) =>
                                        setOptions((prev) => ({ ...prev, type: val }))
                                    }
                                >
                                    <SelectTrigger className="shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="shadow-none">
                                        <SelectItem value="linear">Linear</SelectItem>
                                        <SelectItem value="radial">Radial</SelectItem>
                                        <SelectItem value="conic">Conic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    {options.type === "linear" ? "Angle" : "Rotation"}: {options.angle}°
                                </Label>
                                <div className="flex items-center h-10">
                                    <Slider
                                        min={0}
                                        max={360}
                                        step={1}
                                        value={[options.angle]}
                                        onValueChange={(vals) =>
                                            setOptions((prev) => ({ ...prev, angle: vals[0] }))
                                        }
                                        className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    Actions
                                </Label>
                                <Button
                                    variant="outline"
                                    onClick={randomizeGradient}
                                    className="shadow-none w-full"
                                >
                                    <MdShuffle className="mr-2 h-4 w-4" />
                                    Randomize
                                </Button>
                            </div>
                        </div>

                        {(options.type === "radial" || options.type === "conic") && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
                                {options.type === "radial" && (
                                    <div className="flex flex-col gap-3">
                                        <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                            Shape
                                        </Label>
                                        <Select
                                            value={options.radialShape}
                                            onValueChange={(val: "circle" | "ellipse") =>
                                                setOptions((prev) => ({ ...prev, radialShape: val }))
                                            }
                                        >
                                            <SelectTrigger className="shadow-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="shadow-none">
                                                <SelectItem value="circle">Circle</SelectItem>
                                                <SelectItem value="ellipse">Ellipse</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                        Position X: {options.radialPosition.x}%
                                    </Label>
                                    <div className="flex items-center h-10">
                                        <Slider
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={[options.radialPosition.x]}
                                            onValueChange={(vals) =>
                                                setOptions((prev) => ({
                                                    ...prev,
                                                    radialPosition: { ...prev.radialPosition, x: vals[0] },
                                                }))
                                            }
                                            className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                        Position Y: {options.radialPosition.y}%
                                    </Label>
                                    <div className="flex items-center h-10">
                                        <Slider
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={[options.radialPosition.y]}
                                            onValueChange={(vals) =>
                                                setOptions((prev) => ({
                                                    ...prev,
                                                    radialPosition: { ...prev.radialPosition, y: vals[0] },
                                                }))
                                            }
                                            className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
                            <div className="flex flex-col gap-3">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    Noise: {options.meshEffects.noise}%
                                </Label>
                                <div className="flex items-center h-10">
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[options.meshEffects.noise]}
                                        onValueChange={(vals) =>
                                            setOptions((prev) => ({
                                                ...prev,
                                                meshEffects: { ...prev.meshEffects, noise: vals[0] },
                                            }))
                                        }
                                        className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    Blur: {options.meshEffects.blur}%
                                </Label>
                                <div className="flex items-center h-10">
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[options.meshEffects.blur]}
                                        onValueChange={(vals) =>
                                            setOptions((prev) => ({
                                                ...prev,
                                                meshEffects: { ...prev.meshEffects, blur: vals[0] },
                                            }))
                                        }
                                        className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    Noise Type
                                </Label>
                                <Select
                                    value={options.meshEffects.noiseType}
                                    onValueChange={(val: MeshEffects["noiseType"]) =>
                                        setOptions((prev) => ({
                                            ...prev,
                                            meshEffects: { ...prev.meshEffects, noiseType: val },
                                        }))
                                    }
                                >
                                    <SelectTrigger className="shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="shadow-none">
                                        <SelectItem value="grain">Grain</SelectItem>
                                        <SelectItem value="perlin">Perlin</SelectItem>
                                        <SelectItem value="static">Static</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-card border-border shadow-none">
                        <div className="flex items-center justify-between mb-4">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Color Stops ({options.stops.length}/8)
                            </Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addStop}
                                disabled={options.stops.length >= 8}
                                className="shadow-none"
                            >
                                <MdAdd className="mr-1 h-4 w-4" />
                                Add Stop
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="relative h-8 rounded border border-border cursor-pointer"
                                style={{ background: gradientCSS }}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    const clickPosition = (clickX / rect.width) * 100;
                                    let closestIndex = 0;
                                    let closestDistance = Infinity;
                                    options.stops.forEach((stop, index) => {
                                        const distance = Math.abs(stop.position - clickPosition);
                                        if (distance < closestDistance) {
                                            closestDistance = distance;
                                            closestIndex = index;
                                        }
                                    });
                                    setSelectedStopIndex(closestIndex);
                                }}
                            >
                                {options.stops.map((stop, index) => (
                                    <div
                                        key={index}
                                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer transition-transform ${selectedStopIndex === index
                                            ? "border-foreground scale-125"
                                            : "border-background"
                                            }`}
                                        style={{
                                            left: `calc(${stop.position}% - 8px)`,
                                            backgroundColor: stop.color,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedStopIndex(index);
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {options.stops.map((stop, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-2 p-3 rounded border transition-colors ${selectedStopIndex === index
                                            ? "border-foreground bg-muted"
                                            : "border-border"
                                            }`}
                                        onClick={() => setSelectedStopIndex(index)}
                                    >
                                        <input
                                            type="color"
                                            value={stop.color}
                                            onChange={(e) => updateStop(index, { color: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                        />
                                        <div className="flex-1 space-y-1">
                                            <input
                                                type="text"
                                                value={stop.color}
                                                onChange={(e) => updateStop(index, { color: e.target.value })}
                                                className="w-full bg-transparent text-xs font-mono uppercase border-none outline-none"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Slider
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    value={[stop.position]}
                                                    onValueChange={(vals) =>
                                                        updateStop(index, { position: vals[0] })
                                                    }
                                                    className="cursor-pointer flex-1 **:data-[slot=slider-thumb]:shadow-none"
                                                />
                                                <span className="text-xs text-muted-foreground w-8">
                                                    {stop.position}%
                                                </span>
                                            </div>
                                        </div>
                                        {options.stops.length > 2 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeStop(index);
                                                }}
                                                className="h-6 w-6 text-muted-foreground hover:text-foreground shadow-none"
                                            >
                                                <MdClose className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="flex-1 border border-border rounded-lg bg-muted flex items-center justify-center min-h-[40vh] relative overflow-hidden">
                        {hasMeshEffects ? (
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <div
                                    ref={previewRef}
                                    className="absolute inset-0"
                                    style={{ background: gradientCSS }}
                                />
                                <canvas ref={canvasRef} className="hidden" />
                            </>
                        )}
                        {hasMeshEffects && (
                            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded border border-border text-xs">
                                {isRendering ? "RENDERING..." : "MESH MODE"}
                            </div>
                        )}
                        {isRendering && (
                            <div className="absolute inset-0 bg-background/30 flex items-center justify-center pointer-events-none">
                                <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    <Card className="p-6 bg-card border-border shadow-none">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                    Export
                                </Label>
                                <Select
                                    value={exportFormat}
                                    onValueChange={(val: ExportFormat) => setExportFormat(val)}
                                >
                                    <SelectTrigger className="w-40 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="shadow-none">
                                        <SelectItem value="css">CSS</SelectItem>
                                        <SelectItem value="tailwind">Tailwind Config</SelectItem>
                                        <SelectItem value="variables">CSS Variables</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={copyToClipboard}
                                    className="shadow-none"
                                >
                                    <MdContentCopy className="mr-2 h-4 w-4" />
                                    {copied ? "Copied!" : "Copy"}
                                </Button>
                                <Button onClick={downloadImage} className="shadow-none">
                                    <MdOutlineFileDownload className="mr-2 h-4 w-4" />
                                    Download PNG
                                </Button>
                            </div>
                        </div>
                        <pre className="bg-muted p-4 rounded border border-border overflow-x-auto text-sm">
                            <code>{getExportCode()}</code>
                        </pre>
                    </Card>
                </div>
            </div>
        </main>
    );
}
