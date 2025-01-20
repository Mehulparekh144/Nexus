"use client";

import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} size={"icon"}>
					<Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all  dark:-scale-100" />
					{/* Only available to screen readers */}
					<span className="sr-only">Toggle Theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					disabled={theme === "light"}
					onClick={() => setTheme("light")}
				>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={theme === "dark"}
					onClick={() => setTheme("dark")}
				>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
