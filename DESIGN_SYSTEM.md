# InternIQ Design System

> Extracted from the live codebase (`client/src/`).
> Last updated: 2026-07-16

---

## 1. Color Palette

### Brand / Primary

| Token               | Hex         | Usage                                                                  |
| -------------------- | ----------- | ---------------------------------------------------------------------- |
| **Primary**          | `#0A66C2`   | Buttons, links, active nav highlights, logo accent, avatar fallback bg |
| **Primary Dark**     | `#004182`   | Button hover state, link hover                                         |
| **Secondary**        | `#1B1F23`   | Dark surface accent (defined but rarely referenced directly)            |

Defined in `index.css` via Tailwind `@theme`:

```css
@theme {
  --color-primary: #0A66C2;
  --color-primary-dark: #004182;
  --color-secondary: #1B1F23;
  --color-accent: #0A66C2;
}
```

Applied in components via arbitrary Tailwind values:

```
text-[#0A66C2]          /* primary text / icons */
bg-[#0A66C2]            /* primary button background */
hover:bg-[#004182]      /* primary button hover */
border-[#0A66C2]/30     /* outline button border (30% opacity) */
bg-[#0A66C2]/10         /* icon container tint, active nav bg (light) */
dark:bg-[#0A66C2]/10    /* icon container tint (dark) */
dark:bg-[#0A66C2]/15    /* icon container tint alt (dark) */
bg-[#0A66C2]/5          /* outline button hover bg (light) */
hover:border-[#0A66C2]/40   /* card hover accent border */
```

### Backgrounds

| Context              | Light Mode        | Dark Mode          |
| -------------------- | ----------------- | ------------------ |
| **Page / Root**      | `bg-gray-50`      | `dark:bg-gray-950` |
| **Card / Surface**   | `bg-white`        | `dark:bg-gray-900` |
| **Input field**      | `bg-white`        | `dark:bg-gray-800` |
| **Dropdown trigger** | `bg-gray-50`      | `dark:bg-gray-800` |
| **Chip / Tag**       | `bg-gray-100`     | `dark:bg-gray-800` |
| **PWA theme_color**  | `#0A66C2`         | —                  |
| **PWA background**   | `#0A0F1C`         | —                  |

### Text Colors

| Role                 | Light Mode             | Dark Mode                   |
| -------------------- | ---------------------- | --------------------------- |
| **Heading / Primary**| `text-gray-900`        | `dark:text-white`           |
| **Body / Secondary** | `text-gray-600`        | `dark:text-gray-400`        |
| **Muted / Caption**  | `text-gray-500`        | `dark:text-gray-400`        |
| **Disabled**         | `text-gray-400`        | `dark:text-gray-600`        |
| **Placeholder**      | `placeholder-gray-400` | `dark:placeholder-gray-500` |
| **Icon default**     | `text-gray-400`        | `dark:text-gray-500`        |
| **Nav link (default)**| `text-gray-600`       | `dark:text-gray-400`        |
| **Nav link (hover)** | `text-gray-900`        | `dark:text-white`           |
| **Nav link (active)**| `text-[#0A66C2]`       | `text-[#0A66C2]`            |

### Border Colors

| Context              | Light Mode             | Dark Mode                   |
| -------------------- | ---------------------- | --------------------------- |
| **Card / Container** | `border-gray-200`      | `dark:border-gray-800`      |
| **Input**            | `border-gray-300`      | `dark:border-gray-700`      |
| **Divider / Subtle** | `border-gray-200`      | `dark:border-gray-800`      |
| **Dashed upload**    | `border-gray-300`      | `dark:border-gray-700`      |
| **Dashed drag-over** | `border-[#0A66C2]`     | `border-[#0A66C2]`          |

### Semantic / Status Colors

| Status      | Background (light)                   | Background (dark)                           | Text (light)         | Text (dark)                  | Border (light)        | Border (dark)                |
| ----------- | ------------------------------------ | ------------------------------------------- | -------------------- | ---------------------------- | --------------------- | ---------------------------- |
| **Error**   | `bg-red-50`                          | `dark:bg-red-900/20`                        | `text-red-700`       | `dark:text-red-400`          | `border-red-200`      | `dark:border-red-800`        |
| **Success** | `bg-emerald-50`                      | `dark:bg-emerald-900/15`                    | `text-emerald-800`   | `dark:text-emerald-300`      | `border-emerald-200`  | `dark:border-emerald-800/40` |
| **Warning** | `bg-amber-50`                        | `dark:bg-amber-900/20`                      | `text-amber-700`     | `dark:text-amber-400`        | `border-amber-200`    | `dark:border-amber-800/50`   |
| **Danger**  | `text-red-600` (actions like logout) | `dark:text-red-400`                         | —                    | —                            | —                     | —                            |

### Score Ring Colors (ResumeAnalyzer)

```js
// Used in SVG stroke and badge background
if (score >= 8) → { ring: '#22c55e', bg: 'rgba(34,197,94,0.10)',  label: 'Excellent' }
if (score >= 6) → { ring: '#0A66C2', bg: 'rgba(10,102,194,0.10)', label: 'Good'      }
if (score >= 4) → { ring: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'Needs Work' }
else            → { ring: '#ef4444', bg: 'rgba(239,68,68,0.10)',  label: 'Poor'       }
```

---

## 2. Typography

### Font Family

Loaded via Google Fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Applied globally in `index.css`:

```css
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### Heading Hierarchy

| Element         | Classes                                                                 | Usage                         |
| --------------- | ----------------------------------------------------------------------- | ----------------------------- |
| **Page title**  | `text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight` | Dashboard, module headers     |
| **Logo**        | `text-xl font-bold text-gray-900 dark:text-white tracking-tight`        | Navbar brand                  |
| **Auth logo**   | `text-3xl font-bold text-gray-900 dark:text-white tracking-tight`       | Login/Register page logos     |
| **Section h2**  | `text-xl font-bold text-gray-900 dark:text-white`                       | Score card title              |
| **Section h2**  | `text-lg font-bold text-gray-900 dark:text-white`                       | Card section headers          |
| **Card h3**     | `text-base font-semibold text-gray-900 dark:text-white`                 | Tool card names               |
| **Sub-heading** | `text-lg font-semibold text-gray-900 dark:text-white`                   | Upload area, loading states   |

### Body Text

| Role              | Classes                                                           |
| ----------------- | ----------------------------------------------------------------- |
| **Subtitle**      | `text-sm sm:text-base text-gray-500 dark:text-gray-400`           |
| **Body / Desc**   | `text-sm text-gray-500 dark:text-gray-400 leading-relaxed`        |
| **Body (result)**  | `text-sm text-gray-600 dark:text-gray-400 leading-relaxed`       |
| **Tiny label**    | `text-[10px] font-bold uppercase tracking-wider`                  |
| **Badge**         | `text-[9px] uppercase font-bold`                                  |
| **Tag / chip**    | `text-xs font-medium`                                             |
| **Score number**  | `text-5xl font-extrabold text-gray-900 dark:text-white`           |

### Font Weights Used

`400` (normal) · `500` (medium) · `600` (semibold) · `700` (bold) · `800` (extrabold)

---

## 3. Spacing & Layout

### Container Patterns

```
/* Page-level wrapper (used consistently across Dashboard, ResumeAnalyzer, SkillGap) */
px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto    /* Dashboard (wide) */
px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto     /* Tool pages (narrow) */

/* Navbar inner container */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Common Spacing Tokens

| Pattern               | Usage                                              |
| --------------------- | -------------------------------------------------- |
| `gap-1`               | Desktop nav link spacing                           |
| `gap-2`               | Button icon gaps, user menu items                  |
| `gap-3`               | Mobile nav items, header icon + title              |
| `gap-4 sm:gap-6`      | Grid card gaps                                     |
| `space-y-1`           | Mobile nav vertical spacing                        |
| `space-y-2`           | Stacked buttons (mobile drawer)                    |
| `space-y-3`           | Improvement cards list                             |
| `space-y-4`           | Form field groups                                  |
| `space-y-6`           | Major section spacing                              |
| `mb-1.5`              | Label → input gap                                  |
| `mb-2`                | Heading → subtitle gap                             |
| `mb-4`                | Section heading → content                          |
| `mb-6`                | Error banner → content, CTA → upload area          |
| `mb-8 sm:mb-10`       | Page header → content                              |
| `p-5 sm:p-6`          | Dashboard card inner padding                       |
| `p-6 sm:p-8`          | Skill gap cards, result cards                      |
| `p-8`                 | Auth form card padding                             |
| `p-8 sm:p-10`         | Score card padding                                 |
| `p-10 sm:p-14`        | Upload area / empty states                         |

### Border Radius

| Token          | Usage                                              |
| -------------- | -------------------------------------------------- |
| `rounded-lg`   | Buttons, inputs, nav links, chips, icon containers  |
| `rounded-xl`   | Cards, dropdowns, error banners, improvement cards  |
| `rounded-2xl`  | Primary content cards, upload area, score cards      |
| `rounded-full` | Avatars, badges, pills, progress rings              |

### Grid Layouts

```
/* Dashboard tool grid */
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6
```

---

## 4. Component Patterns

### Primary Button

```
/* Standard */
px-4 py-3 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg
hover:bg-[#004182] transition-colors min-h-[44px]

/* With disabled state */
disabled:opacity-60 disabled:cursor-not-allowed

/* Full-width variant (auth forms, tool cards) */
w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold
text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors min-h-[44px]

/* Pill / compact (navbar "Get Started", Install App) */
px-4 py-2 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg
hover:bg-[#004182] transition-colors

/* Action CTA with rounded-xl (inside tool pages) */
inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold
text-white bg-[#0A66C2] rounded-xl hover:bg-[#004182] transition-colors
```

### Secondary / Outline Button

```
/* Outline with primary accent */
inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold
text-[#0A66C2] border border-[#0A66C2]/30 rounded-xl
hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 transition-colors

/* Navbar template download (more compact) */
hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
text-[#0A66C2] border border-[#0A66C2]/30 rounded-lg
hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 transition-colors
```

### Disabled Button

```
inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium
text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg
cursor-not-allowed min-h-[44px]
```

### Ghost / Text Button (Sign In link)

```
px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
hover:text-gray-900 dark:hover:text-white transition-colors
```

### Google OAuth Button

```
w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium
text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
border border-gray-300 dark:border-gray-700 rounded-lg
hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors min-h-[44px]
```

### Card / Container

```
/* Standard card */
bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
rounded-xl shadow-sm

/* Feature card with hover (Dashboard tool cards) */
bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800
overflow-hidden transition-all duration-200
hover:shadow-md hover:border-[#0A66C2]/40 dark:hover:border-[#0A66C2]/40
hover:-translate-y-0.5

/* Large content card (score results, skill gap sections) */
bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl

/* Upload area */
bg-white dark:bg-gray-900 border-2 border-dashed rounded-2xl
border-gray-300 dark:border-gray-700
hover:border-[#0A66C2]/50 dark:hover:border-[#0A66C2]/50

/* Upload area — drag active */
border-[#0A66C2] bg-blue-50/50 dark:bg-[#0A66C2]/5
```

### Dropdown Menu

```
/* Trigger */
w-full flex items-center justify-between px-4 py-3
bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
rounded-xl text-sm text-left transition-colors
hover:border-[#0A66C2]/50 dark:hover:border-[#0A66C2]/50

/* Panel */
absolute z-40 mt-2 w-full bg-white dark:bg-gray-900
border border-gray-200 dark:border-gray-800
rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto

/* Selected item */
text-[#0A66C2] bg-blue-50 dark:bg-[#0A66C2]/10 font-medium

/* Unselected item */
text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800

/* Group header */
px-4 py-2 text-[10px] font-bold uppercase tracking-wider
text-gray-400 dark:text-gray-500 select-none
```

### User Menu Dropdown (Navbar)

```
/* Panel */
absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900
border border-gray-200 dark:border-gray-800
rounded-xl shadow-lg z-50 py-1

/* Logout item */
w-full flex items-center gap-2 px-4 py-2 text-sm
text-red-600 dark:text-red-400
hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
```

### Input Field

```
w-full pl-10 pr-4 py-3 text-base rounded-lg
border border-gray-300 dark:border-gray-700
bg-white dark:bg-gray-800
text-gray-900 dark:text-gray-100
placeholder-gray-400 dark:placeholder-gray-500
focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent
transition-colors min-h-[44px]
```

### Form Label

```
block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5
```

### Error Banner

```
/* Compact (auth pages) */
mb-4 flex items-center gap-2 p-3
bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
rounded-lg text-sm text-red-700 dark:text-red-400

/* Wide (tool pages) */
mb-6 flex items-start gap-3 p-4
bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
rounded-xl text-sm text-red-700 dark:text-red-400
```

### Suggestion Box (Improvement Card)

```
bg-emerald-50 dark:bg-emerald-900/15
border border-emerald-200 dark:border-emerald-800/40
rounded-lg p-3
```

### Skill Chip / Tag

```
/* Neutral */
inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border
bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
border-gray-200 dark:border-gray-700

/* Matched (emerald) */
bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400
border-emerald-200 dark:border-emerald-800/50

/* Missing (amber) */
bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400
border-amber-200 dark:border-amber-800/50
```

### Count Badge (pill)

```
text-xs font-medium text-gray-400 dark:text-gray-500
bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full
```

### "Coming Soon" Badge

```
/* Navbar */
ml-1.5 text-[9px] uppercase font-bold
bg-gray-100 dark:bg-gray-800 text-gray-400
py-0.5 px-1.5 rounded-full align-middle

/* Dashboard card */
inline-flex items-center px-2 py-0.5 rounded-full
text-[10px] font-semibold uppercase tracking-wider
bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
```

### Icon Container

```
/* Standard (11×11, rounded-lg) */
inline-flex items-center justify-center w-11 h-11 rounded-lg
bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15

/* Page header (10×10, rounded-lg) */
inline-flex items-center justify-center w-10 h-10 rounded-lg
bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15

/* Large empty state (16×16, rounded-2xl) */
inline-flex items-center justify-center w-16 h-16 rounded-2xl
bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15
```

### Avatar

```
w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center
text-white text-xs font-semibold flex-shrink-0     /* Navbar desktop */

w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center
text-white text-sm font-semibold flex-shrink-0     /* Mobile drawer */
```

### Navbar Structure

```jsx
// Sticky top bar with border-bottom
<header className="sticky top-0 z-40 bg-white dark:bg-gray-900
  border-b border-gray-200 dark:border-gray-800 transition-colors">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Left: hamburger (md:hidden) + logo */}
      {/* Center: desktop nav (hidden md:flex) */}
      {/* Right: template link, PWA install, theme toggle, user menu */}
    </div>
  </div>
</header>
```

**Nav link — default:**
```
px-3 py-2 text-sm font-medium rounded-lg transition-colors
text-gray-600 dark:text-gray-400
hover:text-gray-900 dark:hover:text-white
hover:bg-gray-100 dark:hover:bg-gray-800
```

**Nav link — active:**
```
px-3 py-2 text-sm font-medium rounded-lg transition-colors
text-[#0A66C2] bg-blue-50 dark:bg-[#0A66C2]/10
```

**Nav link — disabled:**
```
px-3 py-2 text-sm font-medium rounded-lg
text-gray-400 dark:text-gray-600 cursor-not-allowed
```

### Mobile Drawer

```
/* Overlay */
fixed inset-0 z-50 md:hidden

/* Backdrop */
absolute inset-0 bg-black/40

/* Panel — glassmorphism */
absolute top-0 left-0 h-full w-4/5 max-w-sm
bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl
border-r border-white/20 dark:border-gray-700/50
shadow-2xl flex flex-col
transition-transform duration-300 ease-in-out

/* Slide animation */
Open:   translate-x-0
Closed: -translate-x-full
```

### OR Divider (Auth Pages)

```jsx
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200 dark:border-gray-800" />
  </div>
  <div className="relative flex justify-center text-xs">
    <span className="bg-white dark:bg-gray-900 px-3
      text-gray-400 dark:text-gray-500 uppercase tracking-wider">
      or
    </span>
  </div>
</div>
```

### Skeleton Loading

```
h-3 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse
```

---

## 5. Dark Mode

### Implementation

Dark mode uses the **class strategy** via Tailwind CSS v4's `@custom-variant`:

```css
/* index.css */
@custom-variant dark (&:where(.dark, .dark *));
```

### Toggle Mechanism

The `ThemeProvider` context (`contexts/ThemeContext.jsx`):

1. **Reads** initial theme from `localStorage('theme')`, falling back to `prefers-color-scheme: dark`.
2. **Toggles** by adding/removing the `dark` class on `<html>`.
3. **Persists** the choice in `localStorage`.

```jsx
// ThemeContext.jsx (simplified)
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
});

useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}, [theme]);

const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
```

### Toggle Button

In the Navbar:

```jsx
<button
  onClick={toggleTheme}
  className="p-2 text-gray-500 dark:text-gray-400
    hover:text-gray-700 dark:hover:text-gray-200
    hover:bg-gray-100 dark:hover:bg-gray-800
    rounded-lg transition-colors"
>
  {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

### Convention

Every component pairs light and dark classes inline:

```
bg-white dark:bg-gray-900
text-gray-900 dark:text-white
border-gray-200 dark:border-gray-800
```

There are **no separate dark theme files** — all dark styles are co-located with the `dark:` variant on each element.

---

## 6. Animations & Transitions

| Animation                  | Classes / Style                                                           |
| -------------------------- | ------------------------------------------------------------------------- |
| **Color transitions**      | `transition-colors` (ubiquitous)                                          |
| **Card hover lift**        | `transition-all duration-200 hover:-translate-y-0.5`                      |
| **Arrow nudge on hover**   | `transition-transform group-hover:translate-x-0.5`                        |
| **Mobile drawer slide**    | `transition-transform duration-300 ease-in-out`                           |
| **Backdrop fade**          | `transition-opacity duration-300`                                         |
| **Chevron rotate**         | `transition-transform` + `rotate-180` when open                           |
| **Spinner**                | `animate-spin` on `<Loader2>` icon                                        |
| **Skeleton pulse**         | `animate-pulse` on placeholder bars                                       |
| **Score ring fill**        | `style={{ transition: 'stroke-dashoffset 1s ease-out' }}`                 |
| **Progress ring fill**     | `style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}`              |

---

## 7. Icon Library

**Lucide React** (`lucide-react`) — used for all UI icons.

Common icons: `LayoutDashboard`, `FileSearch`, `FileSignature`, `Map`, `Target`,
`BrainCircuit`, `Sun`, `Moon`, `Menu`, `X`, `LogOut`, `ChevronDown`, `ChevronUp`,
`Upload`, `FileText`, `Loader2`, `AlertCircle`, `CheckCircle2`, `XCircle`,
`ArrowRight`, `RotateCcw`, `Sparkles`, `Download`, `FileDown`, `Lock`, `Mail`,
`Eye`, `EyeOff`, `User`.

Additional: `FcGoogle` and `FaLinkedin` from `react-icons`.

Standard icon sizes:
- **Navbar / inline:** `h-5 w-5`
- **Button inline:** `h-4 w-4`
- **Large feature:** `h-6 w-6` to `h-8 w-8`

---

## 8. Accessibility Patterns

| Pattern                  | Implementation                                    |
| ------------------------ | ------------------------------------------------- |
| **Touch targets**        | `min-h-[44px]` on all buttons and nav links       |
| **Text rendering**       | `antialiased` on `<body>`                          |
| **aria-labels**          | On icon-only buttons (theme toggle, menu, install) |
| **Unique input IDs**     | `login-email`, `login-password`, `register-*`      |
| **Label → input link**   | `<label htmlFor="...">` on all form fields         |
| **Focus ring**           | `focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent` |
| **Body scroll lock**     | `overflow-hidden` on `<body>` when mobile drawer is open |

---

## 9. Tech Stack Reference

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Framework      | React 18 + Vite                                               |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)                         |
| Routing        | React Router v6                                               |
| Icons          | Lucide React + React Icons                                    |
| State          | React Context (`ThemeContext`, `AuthContext`)                  |
| PWA            | `vite-plugin-pwa` (Workbox / `autoUpdate`)                    |
| Font           | Inter (Google Fonts, weights 400–800)                         |
