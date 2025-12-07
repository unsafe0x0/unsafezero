import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Gradient Forge - CSS Gradient Generator",
    description:
        "Create beautiful linear, radial, and conic gradients. Export as CSS, Tailwind config, or PNG.",
};

export default function GradientLayout({ children }: { children: ReactNode }) {
    return children;
}
