"use client";

import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const imgs = [
    "https://picsum.photos/id/10/400/400",
    "https://picsum.photos/id/20/400/400",
    "https://picsum.photos/id/30/400/400",
    "https://picsum.photos/id/40/400/400",
    "https://picsum.photos/id/50/400/400",
    "https://picsum.photos/id/60/400/400",
    "https://picsum.photos/id/70/400/400",
    "https://picsum.photos/id/80/400/400",
    "https://picsum.photos/id/90/400/400",
    "https://picsum.photos/id/100/400/400",
    "https://picsum.photos/id/110/400/400",
    "https://picsum.photos/id/120/400/400",
    "https://picsum.photos/id/130/400/400",
    "https://picsum.photos/id/140/400/400",
    "https://picsum.photos/id/160/400/400",
    "https://picsum.photos/id/170/400/400",
    "https://picsum.photos/id/180/400/400",
    "https://picsum.photos/id/190/400/400",
    "https://picsum.photos/id/200/400/400",
    "https://picsum.photos/id/210/400/400",
    "https://picsum.photos/id/220/400/400",
    "https://picsum.photos/id/230/400/400",
    "https://picsum.photos/id/240/400/400",
    "https://picsum.photos/id/250/400/400",
    "https://picsum.photos/id/260/400/400",
    "https://picsum.photos/id/270/400/400",
    "https://picsum.photos/id/280/400/400",
    "https://picsum.photos/id/290/400/400",
    "https://picsum.photos/id/300/400/400",
];


interface TrailImage {
    id: string;
    x: number;
    y: number;
    src: string;
    rotation: number;
    scale: number;
    zIndex: number;
}

type AnimationType = "pop" | "fade" | "slide" | "spin";

export default function ImageRevealPage() {
    const [images, setImages] = useState<TrailImage[]>([]);
    const [imageIndex, setImageIndex] = useState(0);
    const [animation, setAnimation] = useState<AnimationType>("pop");
    const lastPos = useRef({ x: 0, y: 0 });
    const zIndexRef = useRef(1);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);

        if (dist > 100) {
            const src = imgs[imageIndex % imgs.length];

            const newImage: TrailImage = {
                id: `${Date.now()}-${Math.random()}`,
                x: clientX,
                y: clientY,
                src,
                rotation: Math.random() * 20 - 10,
                scale: Math.random() * 0.4 + 0.8,
                zIndex: zIndexRef.current++,
            };

            setImages((prev) => {
                const next = [...prev, newImage];
                if (next.length > 25) return next.slice(next.length - 25);
                return next;
            });

            setImageIndex((prev) => prev + 1);
            lastPos.current = { x: clientX, y: clientY };
        }
    };

    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-background cursor-none transition-colors duration-300"
            onMouseMove={handleMouseMove}
        >
            <style jsx global>{`
        @keyframes pop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(var(--rot)); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rot)); }
        }
        @keyframes fade {
          from { opacity: 0; transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rot)); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rot)); }
        }
        @keyframes slide {
          from { opacity: 0; transform: translate(-50%, 0%) scale(var(--scale)) rotate(var(--rot)); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rot)); }
        }
        @keyframes spin {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(180deg); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(var(--scale)) rotate(var(--rot)); }
        }
      `}</style>

            {images.map((img) => (
                <img
                    key={img.id}
                    src={img.src}
                    alt="Reveal"
                    className="absolute object-cover"
                    style={{
                        left: img.x,
                        top: img.y,
                        width: "350px",
                        height: "350px",
                        zIndex: img.zIndex,
                        pointerEvents: "none",
                        "--rot": `${img.rotation}deg`,
                        "--scale": img.scale,
                        animation: `${animation} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                    } as React.CSSProperties}
                />
            ))}

            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[9999] cursor-auto"
                onMouseMove={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-black/50 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-2">
                    <span className="text-white/50 text-xs font-medium pl-3 pr-1 uppercase tracking-wider">Effect</span>
                    <Select value={animation} onValueChange={(v) => setAnimation(v as AnimationType)}>
                        <SelectTrigger className="w-[140px] h-8 bg-white/10 border-none text-white hover:bg-white/20 transition-colors rounded-full text-xs font-medium focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Select Effect" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl z-[99999]">
                            <SelectItem value="pop" className="focus:bg-white/20 focus:text-white cursor-pointer">Pop In</SelectItem>
                            <SelectItem value="fade" className="focus:bg-white/20 focus:text-white cursor-pointer">Fade In</SelectItem>
                            <SelectItem value="slide" className="focus:bg-white/20 focus:text-white cursor-pointer">Slide Up</SelectItem>
                            <SelectItem value="spin" className="focus:bg-white/20 focus:text-white cursor-pointer">Spin</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}

function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white border-none"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
