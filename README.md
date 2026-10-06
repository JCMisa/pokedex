# 🔴 Gen 1 Pokédex (Kanto Region)

A modern, high-performance, and feature-rich Pokédex web application dedicated to the canonical **151 Generation 1 Pokémon** from the Kanto region. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **shadcn/ui**, and **TanStack Query v5**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack & Packages](#-tech-stack--packages)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [API Integration & Key Architectural Decisions](#-api-integration--key-architectural-decisions)
- [Getting Started & Installation](#-getting-started--installation)
- [How to Use the App](#-how-to-use-the-app)
- [Available Scripts](#-available-scripts)

---

## ✨ Features

### 1. Complete Gen 1 Pokédex (#001 – #151)
- Accurately tracks all 151 canonical Generation 1 Pokémon (from `#001 Bulbasaur` to `#151 Mew`).
- Pulls live data, high-resolution official artworks, and elemental typing from [PokeAPI](https://pokeapi.co/).

### 2. Dual View Modes (Grid & List)
- **Trading Card Grid View**: Premium trading-card aesthetic featuring subtle ambient elemental artwork glow, badges with elemental icons, ID markers, and mini base stat bars (HP, ATK, DEF).
- **Compact List View**: Sleek horizontal card view displaying avatar thumbnail, dual type badges, base stat indicators, and mobile-optimized secondary row layouts.
- Preserves view preference seamlessly across tabs.

### 3. Instant Zero-Latency Search
- Fast client-side searching by **Pokémon Name** (e.g. `pikachu`) or **National Pokédex ID** (e.g. `25` or `#025`).
- Pre-indexes all 151 entries in the background while keeping paginated scrolling active during standard browsing.

### 4. Infinite Scrolling with Paginated Fetching
- Automatically loads batches of Pokémon as you scroll to the bottom using an Intersection Observer sentinel.
- Powered by `@tanstack/react-query`'s `useInfiniteQuery` with limit and offset query parameters.

### 5. Detailed Pokémon Inspector Modal
- **High-Resolution Official Artwork** with type-based ambient backdrops.
- **Official Pokémon Audio Cries**: Listen to authentic legacy cries using PokeAPI's high-quality sound asset stream.
- **Physical Attributes**: Height (`m` / `ft`) and Weight (`kg` / `lbs`).
- **Base Stats Visualizer**: Color-coded progress bars for HP, Attack, Defense, Special Attack, Special Defense, and Speed.

### 6. "Tag as Captured" Tracking System
- Tag any Pokémon as captured with a custom **Nickname** and **Capture Date** (`MM/DD/YYYY`).
- **Shadcn Calendar Date Picker**: Interactive calendar popover for selecting exact capture dates.
- **Confetti Celebration Effect**: Triggered on capture to celebrate your newly caught companion.
- **Persistent Storage**: Saved in browser `localStorage` using React 19 `useSyncExternalStore` to prevent hydration mismatch and cascading renders.
- **Release Confirmation Dialog**: Destructive actions are guarded by a confirmation `AlertDialog` modal before removing Pokémon from your collection.

### 7. Dedicated "Captured" Collection Tab
- Switch between **"All Pokémon"** and **"Captured"** at the top level.
- Real-time captured counter in the navigation bar (e.g., `5 / 151`).
- Captured cards display custom nicknames, capture date stamps, and a quick-release trigger.

### 8. Dark & Light Mode Support
- Smooth theme toggling with `next-themes` (Light, Dark, and System modes).
- Curated color scheme utilizing OKLCH ember accents, glassmorphic card containers, and elemental type colors.

---

## 🛠️ Tech Stack & Packages

### Core Framework & Runtime
| Package | Version | Description |
| :--- | :--- | :--- |
| **Next.js** | `16.3.8` | React framework using App Router architecture |
| **React** | `19.2.8` | Latest React version with optimized rendering primitives |
| **React DOM** | `19.2.8` | DOM renderer for React |
| **TypeScript** | `^5` | Strict static typing across all data layers and components |

### Styling & Design System
| Package | Version | Description |
| :--- | :--- | :--- |
| **Tailwind CSS** | `^4` | Next-generation utility-first styling engine |
| **@tailwindcss/postcss** | `^4` | PostCSS plugin for Tailwind CSS v4 |
| **tw-animate-css** | `^1.4.0` | Animation utility extensions for Tailwind |
| **class-variance-authority** | `^0.7.1` | Type-safe component variant orchestrator |
| **cn** / `clsx` + `tailwind-merge` | `^0.4.0` | Conditional className merging |
| **next-themes** | `^0.4.6` | Theme switching engine with dark/light class toggles |

### UI Components (shadcn/ui & Radix UI)
| Component | Primitive / Package | Purpose |
| :--- | :--- | :--- |
| **Alert Dialog** | `@radix-ui/react-alert-dialog` | Modal confirmation before releasing Pokémon |
| **Dialog** | `@radix-ui/react-dialog` | Pokémon Detail Inspector modal |
| **Popover** | `@radix-ui/react-popover` | Container for the capture calendar date picker |
| **Calendar** | `react-day-picker` + `date-fns` | Date selection calendar (`MM/DD/YYYY`) |
| **Tabs** | `@radix-ui/react-tabs` | Navigation between "All" and "Captured" views |
| **Tooltip** | `@radix-ui/react-tooltip` | Hover tooltips for controls and actions |
| **Dropdown Menu**| `@radix-ui/react-dropdown-menu` | Theme switcher selection dropdown |
| **Button, Badge, Card, Input, Skeleton** | shadcn/ui components | Core UI building blocks |
| **Sonner** | `sonner` | Toast feedback notifications |

### State Management, Data Fetching & Utilities
| Package | Version | Description |
| :--- | :--- | :--- |
| **@tanstack/react-query** | `^5.104.1` | Server-state caching, infinite query pagination, and stale data control |
| **lucide-react** | `^1.52.0` | Modern SVG icons |
| **date-fns** | `^4.4.0` | Date parsing and formatting utilities (`MM/dd/yyyy`) |
| **canvas-confetti** | `^1.9.4` | Particle explosion animation for capture celebrations |

---

## 📂 Architecture & Directory Structure

```
pokedex/
├── app/
│   ├── favicon.ico
│   ├── globals.css              # Global styles, OKLCH theme tokens, and typography
│   ├── layout.tsx               # Root layout (Theme, QueryClient, Toaster providers)
│   └── page.tsx                 # Main application page (view state, search, list rendering)
├── components/
│   ├── custom/
│   │   ├── CapturedPokemonCard.tsx  # Grid & list representation of captured Pokémon
│   │   ├── Navbar.tsx               # App header with logo, counter, and theme toggle
│   │   ├── PokemonDetailModal.tsx   # Detailed modal with stats, audio cries & capture form
│   │   ├── PokemonGridCard.tsx      # Trading card view for Pokémon
│   │   ├── PokemonListCard.tsx      # Horizontal compact list item
│   │   ├── SearchBar.tsx            # Real-time search input with clear trigger
│   │   ├── StatBar.tsx              # Colored base stats visualization bar
│   │   ├── ThemeProvider.tsx        # Next-themes wrapper
│   │   ├── ThemeToggler.tsx         # Dark / Light / System mode selector
│   │   └── ViewModeToggle.tsx       # Grid / List switch button group
│   └── ui/                          # shadcn/ui headless Radix components
│       ├── alert-dialog.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── popover.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
├── hooks/
│   ├── useCapturedStorage.ts    # useSyncExternalStore hook for localStorage persistence
│   ├── usePokemonDetail.ts      # TanStack query hook for single Pokémon details
│   └── usePokemonList.ts        # Infinite scroll & full Gen 1 catalogue query hooks
├── lib/
│   ├── api.ts                   # PokeAPI fetchers, URL helpers, and response parsers
│   ├── pokemonColors.ts         # Elemental type color maps, badge styling & stat rules
│   ├── types.ts                 # TypeScript types and interfaces for PokeAPI models
│   └── utils.ts                 # cn helper and canvas-confetti trigger function
├── providers/
│   └── QueryProvider.tsx        # TanStack QueryClient configuration (1h stale, 24h gc)
├── public/
│   └── logo.svg                 # Pokéball brand icon
├── package.json
└── tsconfig.json
```

---

## 🧠 API Integration & Key Architectural Decisions

### 1. Canonical Generation 1 Limit (151 Pokémon)
- PokeAPI's database contains over 1,000 Pokémon across multiple generations. To strictly satisfy the **Generation 1 (Kanto Region)** specification, all pagination and list endpoints are capped at ID `151` (`Mew`).
- The pagination calculation automatically computes `effectiveLimit` so offsets never spill over into Generation 2 (`#152 Chikorita`).

### 2. Zero-Latency Search Caching
- When searching, waiting for multiple paginated network requests creates sluggish UX.
- The app uses `fetchAllGen1Pokemon()` (`limit=151&offset=0`) through TanStack Query with a `1-hour` stale time.
- Searches execute instantaneously in-memory across the complete Gen 1 roster by both **name** and **ID**, while regular browsing leverages incremental paginated infinite scrolling.

### 3. Hydration-Safe LocalStorage Sync (`useSyncExternalStore`)
- Instead of using naive `useEffect` initialization patterns that cause cascading renders or React 19 compiler warnings, captured Pokémon are synchronized using `useSyncExternalStore`.
- This ensures server-side rendering renders consistently and the client immediately synchronizes with `localStorage` without layout shifts or hydration errors.

### 4. Interactive Date Picker with `Popover` & `Calendar`
- Capture dates are formatted strictly as `MM/DD/YYYY`.
- Using shadcn's `Popover` and `Calendar` powered by `react-day-picker` provides a reliable, accessible date-picking experience on both desktop and mobile devices.

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Node.js `v20+` recommended)
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`

### 1. Clone or Navigate to the Repository
```bash
cd pokedex
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to view the application.

---

## 📖 How to Use the App

1. **Browsing Pokémon**:
   - Scroll down on the **"All Pokémon"** tab to trigger infinite loading batches.
   - Use the view toggle in the navigation/toolbar to switch between **Grid View** and **List View**.

2. **Searching**:
   - Enter a Pokémon name (e.g., `charizard`, `gengar`) or national ID number (e.g., `6`, `#094`) in the search bar.
   - Click the **X** button to instantly clear the search filter.

3. **Inspecting Details & Audio**:
   - Click any Pokémon card to open the **Detail Modal**.
   - Press the **Play Cry** button to hear the official Pokémon audio cry.
   - View base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed), height, and weight.

4. **Capturing a Pokémon**:
   - In the Detail Modal, fill in the **Nickname** (optional) and select a **Date** using the calendar picker (defaults to today in `MM/DD/YYYY`).
   - Click **Tag as Captured** to save your capture and trigger the confetti celebration.
   - A green **✓ Captured** badge will now appear on the Pokémon's card.

5. **Managing Captured Pokémon**:
   - Click the **"Captured"** tab to view your personal collection.
   - Inspect captured dates and nicknames in both Grid and List modes.
   - Click the **Trash / Release** icon to open the release confirmation dialog.
   - Confirming release returns the Pokémon to the wild and removes it from `localStorage`.

6. **Toggling Themes**:
   - Click the sun/moon icon in the upper right header to switch between **Light**, **Dark**, and **System** color themes.

---

## 📜 Available Scripts

- `npm run dev`: Runs Next.js development server at `http://localhost:3000` with hot-module replacement.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint to verify code quality.
