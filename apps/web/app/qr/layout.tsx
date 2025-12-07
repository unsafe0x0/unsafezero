import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "QR Designer - Custom QR Code Generator",
    description:
        "Generate custom QR codes with logos, colors, and adjustable error correction levels.",
};

export default function QRLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
