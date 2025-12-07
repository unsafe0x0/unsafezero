import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Glitch Studio - Experimental Image Manipulation",
    description:
        "Create glitch art using channel shifting, pixel sorting, and noise algorithms directly in your browser.",
};

export default function GlitchLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
