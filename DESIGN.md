# GALILEA MUSIC EDUCATION — DESIGN.md

> Design system document for AI agents. Drop this into your project root and AI agents will generate consistent UI.

## Overview

Galilea Music Education is a premium music school website with a **dark cinematic aesthetic**. 
The design language combines deep blacks, pure white, and a vibrant fuschia accent that commands attention.

---

## Color Palette

| Role | Value | Usage |
|------|-------|-------|
| Background | `#111111` | Main background (void black) |
| Surface 1 | `#161616` | Slightly lighter background |
| Surface 2 | `#1A1A1A` | Cards, elevated surfaces |
| Surface 3 | `#222222` | Hover states, borders |
| Text Primary | `#FFFFFF` | Headlines, primary text |
| Text Secondary | `#A0A0A0` | Body text, descriptions |
| Text Muted | `#666666` | Labels, metadata |
| **Accent Fuschia** | `#FF00AA` | **THE signature color — CTAs, highlights, accents** |
| Accent Hover | `#CC0088` | Hover state for accent |
| Accent Dark | `#880055` | Darker accent variant |
| Accent Glow | `rgba(255,0,170,0.15)` | Glow effects, shadows |
| Border | `rgba(255,255,255,0.08)` | Subtle borders |

### CSS Variables
```css
--color-bg: #111111;
--color-bg-1: #161616;
--color-bg-2: #1a1a1a;
--color-accent: #ff00aa;
--color-accent-hover: #cc0088;
--color-accent-glow: rgba(255, 0, 170, 0.15);
--color-text-primary: #ffffff;
--color-text-secondary: #a0a0a0;
--color-border: rgba(255, 255, 255, 0.08);
```

---

## Typography

### Fonts
- **Display/Headings:** `Space Grotesk` — Bold, modern, geometric
- **Body:** `Inter` — Clean, readable, professional  
- **Monospace/Labels:** `Space Mono` — Technical, code-like labels

### Type Scale
```
Hero Title:    clamp(56px, 8vw, 112px) | font-weight: 700 | letter-spacing: -0.04em
H1:            clamp(40px, 5vw, 72px)  | font-weight: 700
H2:            clamp(32px, 4vw, 56px)  | font-weight: 700
H3:            clamp(24px, 3vw, 36px)  | font-weight: 600
Body Large:    clamp(18px, 2vw, 22px)  | line-height: 1.6
Body:          16px                    | line-height: 1.7
Small:         14px                    | line-height: 1.5
Micro/Labels:  12px                    | letter-spacing: 0.06em | UPPERCASE
```

### Section Labels (Monospace)
Small uppercase labels above section titles:
```
Font: Space Mono
Size: 11px
Weight: 700
Color: #FF00AA
Letter-spacing: 0.16em
Text-transform: UPPERCASE
With a 20px horizontal line before the text
```

---

## Component Library

### Buttons
```
Primary:  background #FF00AA | color white | box-shadow: 0 0 20px rgba(255,0,170,0.15)
Outline:  transparent bg | color #FF00AA | border 1.5px solid #FF00AA
Ghost:    transparent bg | color white | border 1.5px solid rgba(255,255,255,0.08)

Sizes:
  Large:  padding 18px 40px | font-size 17px
  Normal: padding 14px 28px | font-size 15px
  Small:  padding 10px 20px | font-size 13px

All buttons:
  border-radius: 4px (sharp corners)
  font-weight: 600
  transition: all 300ms ease
  
Primary hover: background #CC0088 | box-shadow 0 0 40px rgba(255,0,170,0.3) | translateY(-1px)
```

### Cards
```
background: rgba(255,255,255,0.03)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 12px
padding: 32px

Hover state:
  border-color: rgba(255,0,170,0.3)
  box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(255,0,170,0.15)
  transform: translateY(-4px)
  
Glass variant:
  background: rgba(255,255,255,0.03)
  backdrop-filter: blur(12px)
```

### Badges
```
Accent:       background rgba(255,0,170,0.08) | color #FF00AA | border rgba(255,0,170,0.2)
Outline:      transparent | color #A0A0A0 | border rgba(255,255,255,0.08)
Beginner:     background rgba(0,200,100,0.1) | color #00c864
Intermediate: background rgba(255,170,0,0.1) | color #ffaa00
Advanced:     background rgba(255,0,170,0.1) | color #FF00AA

All badges: border-radius 9999px | font-size 12px | font-weight 600 | UPPERCASE
```

### Forms
```
Input/Select:
  background: rgba(255,255,255,0.03)
  border: 1.5px solid rgba(255,255,255,0.08)
  border-radius: 4px
  color: white
  padding: 14px 18px
  font-size: 15px

Focus state:
  border-color: #FF00AA
  background: rgba(255,0,170,0.04)
  box-shadow: 0 0 0 4px rgba(255,0,170,0.1)
```

---

## Layout System

### Container
- Max width: `1280px` (main) / `1440px` (wide)
- Horizontal padding: `24px` (desktop) / `16px` (mobile)
- Navigation height: `72px`

### Grid
- 4 columns on desktop
- 2 columns on tablet (768px-1024px)  
- 1 column on mobile (<768px)
- Gap: `24px` standard / `32px` large

### Section Spacing
- Standard section: `128px` vertical padding
- Reduced (mobile): `64-80px`

---

## Animations & Motion

### Philosophy
Animations should feel **premium and purposeful**. Never decorative for its own sake.

### Scroll Reveal
```css
Initial state:
  opacity: 0
  transform: translateY(24-30px)
  
Revealed state (when IntersectionObserver triggers):
  opacity: 1
  transform: translateY(0)
  transition: opacity 0.7-0.8s ease, transform 0.7-0.8s ease

Stagger: 0.1-0.15s between sibling elements
```

### 3D Hero (Three.js)
- Central distorted sphere with fuschia emissive glow
- Three concentric wireframe rings rotating at different speeds
- 120+ particle field rotating slowly  
- Floating torus "music notes"
- Mouse parallax effect on central orb

### Micro-interactions
```
Buttons:      translateY(-1px) on hover + box-shadow increase
Cards:        translateY(-4px) on hover + border glow
Nav links:    Underline slides in from left on hover
Logo:         opacity 0.85 on hover
Social icons: translateY(-2px) + border-color accent on hover
Images:       scale(1.05) on parent hover
Instrument icons: scale(1.1) rotate(-5deg) on card hover
```

### Counter Animation
- Duration: 1800ms
- Easing: Ease-out quart (1 - (1-t)^4)
- Triggers on IntersectionObserver

---

## Page Structure

### Navigation
```
Fixed position at top
Height: 72px
On scroll > 20px:
  background: rgba(17,17,17,0.92)
  backdrop-filter: blur(20px)
  border-bottom: 1px solid rgba(255,255,255,0.08)
  
Logo: ♪ icon (fuschia glow) + "GALILEA" bold + "MUSIC EDUCATION" mono small
Nav links: 14px, weight 500, color #A0A0A0 → white on hover
CTA Button: Primary button (Inscríbete)
Mobile: Hamburger → full-screen slide-in menu
```

### Hero Section
```
Full viewport height
3D Canvas: right side, 55% width, z-index 1
Content: left side, max-width 680px, z-index 2

Title structure:
  Line 1: "GALILEA" (white)
  Line 2: "MUSIC" (fuschia outline text via -webkit-text-stroke)
  Line 3: "EDUCATION" (white)
  
Font: Space Grotesk, bold
Size: clamp(56px, 8vw, 112px)
Letter-spacing: -0.04em

Background:
  - Dark radial gradient with fuschia tint at 70% right
  - Subtle grid pattern (60x60px, rgba(255,255,255,0.02))
```

### Sections Pattern
Each section follows:
1. Small monospace label (fuschia, UPPERCASE)
2. Large heading with one fuschia word
3. Descriptive paragraph (muted)
4. Content grid

Alternating backgrounds: `#111111` ↔ `#161616`

---

## Music School Specific Elements

### Instrument Cards
```
- Full image background (cinematic photo)
- Gradient overlay (transparent → dark bottom)
- Emoji icon (top-right, 40px, fuschia glow filter)
- Level badge
- Teacher name (with person icon)
- Price (stat-number style in fuschia)
- Hover: image scale(1.05), card translate(-6px), glow border
```

### Schedule Display
```
Chip/pill style items
Dot indicator (fuschia, 6px)
Time range text
Available badge (green #00c864)
```

### Price Display
```
$40.000 COP in fuschia accent
"/ mes" in muted text
Often in accent-subtle background box
```

### Teacher Cards
```
Avatar: 70x70px box with instrument emoji
Name: 18px bold
Specialty: fuschia accent, 14px
Bio: muted, 14px, line-height 1.6-1.7
Quote: left border (3px fuschia) + accent-subtle bg
```

---

## SEO & Accessibility

- All images have descriptive alt text
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<nav>`, `<article>`, `<footer>`
- ARIA labels on interactive elements
- Schema.org: `EducationalOrganization` + `Course` JSON-LD
- Skip to content link
- Color contrast ratio > 4.5:1 for all text

---

## Performance

- Three.js loaded with `dynamic()` and `ssr: false`
- Images: Next.js Image with WebP/AVIF formats
- Fonts: Preconnect to Google Fonts
- ISR: 60s for courses, 3600s for course pages
- Code splitting: automatic per route
- CSS: Inline `<style>` tags in components (Next.js inlines automatically)
