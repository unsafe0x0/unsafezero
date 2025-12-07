import React from "react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { AiOutlineGithub } from "react-icons/ai";

const tools = [
  {
    id: "001",
    name: "dither_engine",
    label: "Dither",
    description:
      "Algorithmic image processing. Floyd-Steinberg, Atkinson, Ordered.",
    href: "/dither",
    status: "READY",
  },

  {
    id: "002",
    name: "ascii_art",
    label: "ASCII Art",
    description:
      "Convert images to ASCII art. Multiple character sets and color modes.",
    href: "/ascii",
    status: "READY",
  },
  {
    id: "003",
    name: "glitch_studio",
    label: "Glitch Studio",
    description:
      "Experimental image manipulation. Channel shift, pixel sort, noise.",
    href: "/glitch",
    status: "READY",
  },
  {
    id: "004",
    name: "qr_designer",
    label: "QR Designer",
    description:
      "Custom QR code generator. Logos, colors, templates.",
    href: "/qr",
    status: "READY",
  },
  {
    id: "005",
    name: "gradient_forge",
    label: "Gradient Forge",
    description:
      "Create beautiful CSS gradients. Linear, radial, conic with export.",
    href: "/gradient",
    status: "READY",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-6 font-mono md:p-12 bg-background text-foreground">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <div className="flex items-center justify-between bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-3 md:px-6">
          <h1 className="text-lg font-bold tracking-tighter md:text-xl">
            UNSAFE<span className="text-muted-foreground">ZERO</span>
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="https://github.com/unsafe0x0/unsafezero"
              target="_blank"
            >
              <Button
                variant="default"
                size="sm"
                className="shadow-none hidden sm:flex"
              >
                <AiOutlineGithub />
                GitHub
              </Button>
              <Button
                variant="default"
                size="icon"
                className="shadow-none sm:hidden"
              >
                <AiOutlineGithub />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-16 pt-20">
        <header className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-4xl font-bold tracking-tighter md:text-6xl">
              UNSAFE<span className="text-muted-foreground">ZERO</span>
            </h1>
          </div>
          <p className="max-w-lg text-muted-foreground">
            Experimental interfaces and digital tools.
            <br />
            Select a module to initialize.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <HoverCard key={tool.name} openDelay={0} closeDelay={0}>
              <HoverCardTrigger asChild>
                <Link
                  href={tool.href}
                  className="group relative flex h-48 flex-col justify-between bg-background p-6 hover:bg-card transition-colors border border-border rounded-md"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      /{tool.id}
                    </span>
                    <span className="text-xs uppercase tracking-wider border border-border px-1.5 py-0.5 rounded-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {tool.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                      {tool.name}
                    </h2>
                    <div className="h-px w-0 bg-foreground group-hover:w-full transition-all duration-500 ease-out" />
                  </div>
                </Link>
              </HoverCardTrigger>

              <HoverCardContent
                className="w-(--radix-hover-card-trigger-width) rounded-md border-border bg-background p-0 font-mono overflow-hidden shadow-none"
                sideOffset={10}
                align="start"
              >
                <div className="border-b border-border bg-muted p-3">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Module Info
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Function
                    </div>
                    <div className="text-sm font-medium">
                      {tool.description}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Path
                    </div>
                    <code className="text-xs bg-muted px-1 py-0.5">
                      {tool.href}
                    </code>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </section>
      </div>
    </main>
  );
}
