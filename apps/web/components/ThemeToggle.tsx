"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { LuSun } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";
import { IoIosLaptop } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-32 justify-start shadow-none">
          {mounted && theme === "light" && <LuSun className="mr-2 h-4 w-4" />}
          {mounted && theme === "dark" && <LuMoon className="mr-2 h-4 w-4" />}
          {mounted && theme === "system" && (
            <IoIosLaptop className="mr-2 h-4 w-4" />
          )}
          <span className="capitalize">
            {mounted && theme ? theme : "Theme"}
          </span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="shadow-none">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <LuSun className="mr-1 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <LuMoon className="mr-1 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <IoIosLaptop className="mr-1 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
