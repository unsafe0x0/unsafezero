"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { MdLockOutline, MdLockOpen } from "react-icons/md";

const formatValue = (key: string, value: any) => {
  if (
    (key === "exp" || key === "iat" || key === "nbf") &&
    typeof value === "number"
  ) {
    const date = new Date(value * 1000).toLocaleString();
    return (
      <span>
        <span className="text-orange-500">{value}</span>
        <span className="text-muted-foreground ml-2 text-xs">// {date}</span>
      </span>
    );
  }
  return <span>{JSON.stringify(value)}</span>;
};

const decodeJWT = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const decode = (str: string) => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    };
    return { header: decode(parts[0]), payload: decode(parts[1]) };
  } catch (e) {
    return null;
  }
};

export default function JwtInterface() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<{ header: any; payload: any } | null>(null);

  useEffect(() => {
    const result = decodeJWT(token);
    setData(result);
  }, [token]);

  return (
    <main className="min-h-screen p-6 font-mono md:p-12 selection:bg-foreground selection:text-background">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <div className="flex items-center justify-between bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-3 md:px-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tighter md:text-xl hover:opacity-80 transition-opacity"
          >
            TOKEN<span className="text-muted-foreground">SPECTER</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-6 pt-20">
        <Card className="p-6 bg-card border-border shadow-none space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Encoded Token
            </Label>
            {data ? (
              <MdLockOpen className="text-green-500" />
            ) : (
              <MdLockOutline className="text-muted-foreground" />
            )}
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste JWT here (eyJh...)"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <Label className="text-xs uppercase tracking-wider font-semibold text-red-500">
              Header
            </Label>
            <Card className="p-4 bg-muted/30 border-border shadow-none h-full min-h-[200px] overflow-auto">
              {data?.header ? (
                <pre className="text-sm text-foreground whitespace-pre-wrap break-all">
                  {"{\n"}
                  {Object.entries(data.header).map(([key, value], i, arr) => (
                    <div key={key} className="pl-4">
                      <span className="text-red-400">"{key}"</span>:{" "}
                      {formatValue(key, value)}
                      {i < arr.length - 1 && ","}
                    </div>
                  ))}
                  {"}"}
                </pre>
              ) : (
                <span className="text-muted-foreground italic text-xs">
                  // Waiting for input...
                </span>
              )}
            </Card>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="text-xs uppercase tracking-wider font-semibold text-purple-500">
              Payload
            </Label>
            <Card className="p-4 bg-muted/30 border-border shadow-none h-full min-h-[200px] overflow-auto">
              {data?.payload ? (
                <pre className="text-sm text-foreground whitespace-pre-wrap break-all">
                  {"{\n"}
                  {Object.entries(data.payload).map(([key, value], i, arr) => (
                    <div key={key} className="pl-4">
                      <span className="text-purple-400">"{key}"</span>:{" "}
                      {formatValue(key, value)}
                      {i < arr.length - 1 && ","}
                    </div>
                  ))}
                  {"}"}
                </pre>
              ) : (
                <span className="text-muted-foreground italic text-xs">
                  // Waiting for input...
                </span>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
