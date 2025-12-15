import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Token Specter - JWT Decoder & Inspector",
  description:
    "Decode JSON Web Tokens instantly client-side. Inspect headers, payloads, and timestamps without sending data to a server.",
};

export default function JWTLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
