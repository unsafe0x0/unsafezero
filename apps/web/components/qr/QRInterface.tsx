"use client";

import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
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
import Link from "next/link";

export default function QRInterface() {
    const [text, setText] = useState("https://unsafezero.vercel.app");
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [ecl, setEcl] = useState<"L" | "M" | "Q" | "H">("M");
    const [margin, setMargin] = useState(4);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [logoSize, setLogoSize] = useState(20);
    const [showFrame, setShowFrame] = useState(false);
    const [frameText, setFrameText] = useState("SCAN ME");
    const [frameColor, setFrameColor] = useState("#000000");
    const [zoom, setZoom] = useState(0.5);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setLogoSrc(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const generateQR = async () => {
            if (!canvasRef.current) return;

            try {
                const tempCanvas = document.createElement("canvas");
                await QRCode.toCanvas(tempCanvas, text, {
                    width: 1000,
                    margin: margin,
                    color: {
                        dark: fgColor,
                        light: bgColor,
                    },
                    errorCorrectionLevel: ecl,
                });

                const ctx = canvasRef.current.getContext("2d");
                if (!ctx) return;

                let finalWidth = tempCanvas.width;
                let finalHeight = tempCanvas.height;
                const frameHeight = showFrame ? 150 : 0;

                canvasRef.current.width = finalWidth;
                canvasRef.current.height = finalHeight + frameHeight;

                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                ctx.drawImage(tempCanvas, 0, 0);

                if (showFrame) {
                    ctx.fillStyle = frameColor;
                    ctx.font = "bold 80px monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(frameText, finalWidth / 2, finalHeight + frameHeight / 2);

                    ctx.strokeStyle = frameColor;
                    ctx.lineWidth = 20;
                    ctx.strokeRect(10, 10, finalWidth - 20, finalHeight + frameHeight - 20);
                }

                if (logoSrc) {
                    const img = new Image();
                    img.src = logoSrc;
                    await new Promise((resolve) => {
                        img.onload = resolve;
                    });

                    const size = tempCanvas.width * (logoSize / 100);
                    const x = (tempCanvas.width - size) / 2;
                    const y = (tempCanvas.height - size) / 2;

                    ctx.drawImage(img, x, y, size, size);
                }
            } catch (err) {
                console.error(err);
            }
        };

        const timeout = setTimeout(generateQR, 100);
        return () => clearTimeout(timeout);
    }, [text, fgColor, bgColor, ecl, margin, logoSrc, logoSize, showFrame, frameText, frameColor]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <main className="min-h-screen p-6 font-mono md:p-12 selection:bg-foreground selection:text-background">
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
                <div className="flex items-center justify-between bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-3 md:px-6">
                    <Link
                        href="/qr"
                        className="text-lg font-bold tracking-tighter md:text-xl hover:opacity-80 transition-opacity"
                    >
                        QR<span className="text-muted-foreground">DESIGNER</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-5xl space-y-16 pt-20">
                <div className="flex flex-col gap-6">
                    <Card className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-card border-border shadow-none">
                        <div className="flex flex-col gap-3 lg:col-span-2">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Content
                            </Label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter URL or text"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Error Correction
                            </Label>
                            <Select
                                value={ecl}
                                onValueChange={(val: "L" | "M" | "Q" | "H") => setEcl(val)}
                            >
                                <SelectTrigger className="shadow-none">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent className="shadow-none">
                                    <SelectItem value="L">Low (7%)</SelectItem>
                                    <SelectItem value="M">Medium (15%)</SelectItem>
                                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                                    <SelectItem value="H">High (30%)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Margin: {margin}
                            </Label>
                            <div className="flex items-center h-10">
                                <Slider
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={[margin]}
                                    onValueChange={(vals) => setMargin(vals[0])}
                                    className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:col-span-2">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Foreground Color
                            </Label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="h-10 w-14 flex-shrink-0 cursor-pointer rounded border border-border bg-background p-1"
                                />
                                <input
                                    type="text"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
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

                        <div className="flex flex-col gap-3">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Logo
                            </Label>
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full justify-start truncate shadow-none"
                            >
                                {logoSrc ? "Change Logo" : "Upload Logo"}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Logo Size: {logoSize}%
                            </Label>
                            <div className="flex items-center h-10">
                                <Slider
                                    min={5}
                                    max={40}
                                    step={1}
                                    value={[logoSize]}
                                    onValueChange={(vals) => setLogoSize(vals[0])}
                                    disabled={!logoSrc}
                                    className="cursor-pointer **:data-[slot=slider-thumb]:shadow-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Frame
                            </Label>
                            <div className="flex items-center gap-2 h-10">
                                <Switch
                                    checked={showFrame}
                                    onCheckedChange={setShowFrame}
                                    className="shadow-none"
                                />
                                <Label className="text-sm font-normal">Enable Frame</Label>
                            </div>
                        </div>

                        {showFrame && (
                            <>
                                <div className="flex flex-col gap-3 lg:col-span-2">
                                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                        Frame Text
                                    </Label>
                                    <input
                                        type="text"
                                        value={frameText}
                                        onChange={(e) => setFrameText(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="flex flex-col gap-3 lg:col-span-2">
                                    <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                        Frame Color
                                    </Label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={frameColor}
                                            onChange={(e) => setFrameColor(e.target.value)}
                                            className="h-10 w-14 flex-shrink-0 cursor-pointer rounded border border-border bg-background p-1"
                                        />
                                        <input
                                            type="text"
                                            value={frameColor}
                                            onChange={(e) => setFrameColor(e.target.value)}
                                            className="flex-1 h-10 px-3 rounded border border-border bg-background font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={downloadImage}
                            className="shadow-none"
                            variant="default"
                        >
                            Download QR Code
                            <MdOutlineFileDownload className="ml-1 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 border border-border rounded-lg bg-muted flex items-center justify-center min-h-[60vh] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] opacity-10 pointer-events-none"></div>

                        <div
                            className="relative transition-transform duration-200 ease-out"
                            style={{ transform: `scale(${zoom})` }}
                        >
                            <canvas
                                ref={canvasRef}
                                className="max-w-full h-auto object-contain block rounded-sm"
                                style={{ imageRendering: "pixelated" }}
                            />
                        </div>

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
                                onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                                className="h-8 w-8 rounded-full border border-border shadow-none"
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
