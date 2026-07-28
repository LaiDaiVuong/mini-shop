---
name: frontend-design
description: Guidelines and standards for creating modern, luxury, high-impact web frontends with premium design aesthetics, responsive layouts, CSS design systems, micro-animations, and visual excellence.
---

# Frontend Design System & Aesthetic Excellence Skill

This skill provides comprehensive guidelines and best practices for creating stunning, modern, luxury frontend applications.

## 1. Core Visual Principles & Aesthetics
- **Harmonious Color Palettes**: Use curated, rich color systems (e.g. HSL tailored tokens, dark slate `#0f172a`, radiant gold `#c5a059`, emerald accents). Avoid default primary colors.
- **Typography & Scale**: Pair modern Google Fonts (e.g. serif headers like Playfair Display / Cormorant Garamond with sans-serif body like Inter / Montserrat). Enforce clear hierarchy and line-heights.
- **Glassmorphism & Layering**: Utilize subtle backdrop blur (`backdrop-filter: blur(12px)`), multi-layered soft box shadows, and translucent borders (`rgba(255, 255, 255, 0.15)`).
- **Smooth Micro-Animations**: Implement 60fps transitions (`transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`), hover scales (`transform: translateY(-4px)`), smooth fade-ins, and interactive state feedback.

## 2. Layout & Responsive Architecture
- **Fluid Layout Grid**: Build with CSS Grid and Flexbox for responsive, adaptive multi-column layouts across mobile, tablet, and desktop viewports.
- **Header & Navigation Overlay**: Implement fixed/sticky headers with transparent-to-solid scroll transitions, responsive mobile drawers, and accessible dropdown menus.
- **Card & Component System**: Standardize component cards with consistent aspect ratios (`padding-top: 100%` or `aspect-ratio`), hover states, badge overlays, and clean call-to-action buttons.

## 3. SEO & Frontend Performance
- **Semantic HTML5 Structure**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` appropriately.
- **Image & Media Handling**: Provide fallback poster images, lazy loading, responsive srcset/picture elements, and smooth media fade-ins (e.g., image-to-video transitions).
- **Accessibility & ARIA**: Ensure proper color contrast ratios, focus outlines, descriptive `alt` tags, and interactive ARIA attributes.
