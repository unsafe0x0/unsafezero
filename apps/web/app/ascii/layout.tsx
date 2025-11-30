import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ASCII - Image to ASCII Art Converter",
  description:
    "Convert images to ASCII art directly in your browser.",
};

export default function ASCIILayout({ children }: { children: ReactNode }) {
  return children;
}
