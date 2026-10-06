import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/custom/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex — Gen 1 Pokémon & Capture Tracker",
  description:
    "A modern Gen 1 Pokédex built with Next.js, shadcn/ui, and TanStack Query. Features client-side search, grid/list view toggles, and local capture logging.",
  keywords: [
    "Pokedex",
    "Pokemon",
    "Gen 1",
    "Kanto",
    "Next.js",
    "shadcn/ui",
    "PokeAPI",
  ],
  openGraph: {
    title: "Pokédex — Gen 1 Pokémon & Capture Tracker",
    description:
      "Explore the original 151 Pokémon with instant search, detailed stats, and custom capture tracking.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
