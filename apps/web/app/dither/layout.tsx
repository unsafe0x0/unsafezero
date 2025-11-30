import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dither - Image Dithering Tool",
  description:
    "Convert images using classic dithering algorithms directly in your browser.",
};

export default function DitherLayout({ children }: { children: ReactNode }) {
  return children;
}
