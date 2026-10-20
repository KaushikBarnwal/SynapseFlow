---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 360
---

# 🎨 HTML5 & Modern CSS Architecture, Layout Engines & Performance

## 1. Semantic Web, DOM Architecture & Accessibility (a11y)
### Semantic Elements & Content Structure
- **Core Semantic Containers**:
  - `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
  - Avoid generic `<div>` soup: improves SEO indexing, machine readability, and screen reader parsing
- **`<article>` vs `<section>` (Key Interview Question)**:
  - `<article>`: Self-contained, independently distributable composition (blog post, product card, forum comment)
  - `<section>`: Thematic grouping of content, typically with a heading element (`<h2>`–`<h6>`)
- **Document Outline & Heading Hierarchy**:
  - Exactly one `<h1>` per page as the primary topic anchor
  - Strict nested hierarchy (`<h1>` → `<h2>` → `<h3>`); never skip heading levels for visual styling
- **Descriptive Figure & Text Elements**:
  - `<figure>` paired with `<figcaption>` for diagrams, code snippets, and illustrated media
  - `<time datetime="2026-10-20">`: Machine-readable timestamps for search crawler microdata
### Modern Form Architecture & Validations
- **Native Form Controls**:
  - Form elements: `<input>`, `<textarea>`, `<select>`, `<button>`, `<datalist>`, `<output>`, `<progress>`, `<meter>`
  - `<fieldset>` paired with `<legend>`: Groups conceptually related inputs (e.g. shipping address, payment method)
- **Accessible Label Associations**:
  - Explicit binding via `<label for="user-email">` matching `<input id="user-email">`
  - Implicit nesting wrapping the input inside `<label>`
  - Expands clickable hit-box target for mobile touchscreens and enables screen reader announcements
- **Client-Side HTML5 Form Validation**:
  - Attributes: `required`, `pattern` (regex constraints), `min` / `max`, `step`, `maxlength`
  - Mobile Virtual Keyboard optimization: `inputmode="numeric"`, `email`, `tel`, `decimal`, `search`
- **Security & User Experience**:
  - `autocomplete` tokens: `current-password`, `new-password`, `one-time-code`, `shipping street-address`
  - CSRF prevention via hidden token inputs; `enctype="multipart/form-data"` for binary file uploads
### Web Accessibility (WAI-ARIA & WCAG 2.1)
- **The First Rule of ARIA**:
  - "Do not use ARIA if a native HTML element or attribute already provides the required semantics"
  - Prefer native `<button>` over `<div role="button" tabindex="0">` (native buttons include keyboard `Enter`/`Space` events)
- **ARIA Attributes & Dynamic States**:
  - `aria-label` & `aria-labelledby`: Custom accessibility text calculation
  - `aria-hidden="true"`: Hides purely decorative icons/SVGs from assistive tech tree
  - Dynamic interactive states: `aria-expanded` (accordions/dropdowns), `aria-checked`, `aria-selected`
  - Live Regions: `aria-live="polite"` (background notifications) vs `aria-live="assertive"` (urgent alert dialogs)
- **Keyboard Navigation & Focus Management**:
  - `tabindex="0"`: Adds non-interactive element into natural tab order
  - `tabindex="-1"`: Removes from sequential navigation; allows programmatic `.focus()` invocation
  - `tabindex=">0"`: **Anti-pattern!** Breaks intuitive natural top-to-bottom tab order
  - Focus Ring styling: `:focus` vs `:focus-visible` (maintains visible focus for keyboard users while silencing mouse clicks)
- **Native Modal Dialogs (`<dialog>`)**:
  - Built-in `.showModal()` method creates top-layer backdrop, locks background scroll, traps focus, and closes on `Escape`

## 2. CSS Box Model, Flow Systems & Stacking Context
### Box Model Anatomy & Sizing Algorithms
- **The 4 Box Model Layers**: Content → Padding → Border → Margin
- **`content-box` vs `border-box` (The Universal Reset)**:
  - Default `box-sizing: content-box`: Declared `width` applies exclusively to content; padding and borders add to total footprint
  - Production standard `box-sizing: border-box`: Declared `width` encompasses content + padding + border
  - Universal inheritance reset: `*, *::before, *::after { box-sizing: border-box; }`
- **Margin Collapsing Mechanics (High-Frequency Interview Trap)**:
  - Vertical adjoining margins collapse into a single margin equal to the maximum margin value
  - **Horizontal margins NEVER collapse**
  - **The 3 Collapsing Scenarios**:
    - Adjacent sibling elements
    - Parent and first/last child when no border, padding, or inline content separates them
    - Empty blocks with zero height, padding, or border
  - **How to Prevent Margin Collapse**:
    - Add padding or border (`1px solid transparent`)
    - Establish a Block Formatting Context (`overflow: hidden` or `display: flow-root`)
    - Use Flexbox or CSS Grid parent containers
### Display Formatting Modes & Block Formatting Context (BFC)
- **Display Core Primitives**:
  - `block`: Starts on new line, occupies full container width, respects width, height, and margins
  - `inline`: Flows inline with text, ignores `width`/`height`, vertical padding/margins do not shift adjacent lines
  - `inline-block`: Flows inline with text, but respects `width`, `height`, and vertical box dimensions
  - `none`: Completely removes element and subtree from accessibility and render tree (triggers reflow)
  - `visibility: hidden`: Element is invisible but retains physical geometry and layout footprint (triggers repaint only)
- **Block Formatting Context (BFC)**:
  - An independent visual rendering region where internal child margins do not escape and floats do not overlap
  - **Triggers**: `overflow: hidden | auto | clip`, `display: flow-root`, `position: absolute | fixed`, Flex/Grid items
  - Primary uses: Containing internal child floats, clearing floats without clearfix hacks, preventing margin collapsing
### Position Schemes & Stacking Context (`z-index`)
- **CSS Position Modes**:
  - `static`: Default normal document flow; ignores `top`, `right`, `bottom`, `left`, and `z-index`
  - `relative`: Offsets element relative to its normal position without altering the document layout flow
  - `absolute`: Removed from normal flow; positioned relative to nearest positioned ancestor (`non-static`)
  - `fixed`: Positioned relative to the viewport window; remains pinned during page scrolling
  - `sticky`: Hybrid mode; flows normally until scroll threshold is reached, then sticks to defined offset
- **Stacking Context & `z-index` Rules**:
  - `z-index` only takes effect on positioned elements (`non-static`) or Flexbox/Grid children
  - **Root Cause of `z-index` Bugs**:
    - Elements with `z-index: 9999` rendering behind `z-index: 1` elements due to independent parent stacking contexts
    - Children cannot escape their parent's stacking context layer
  - **What Creates a New Stacking Context?**:
    - Root `<html>` element
    - Positioned element (`relative`, `absolute`, `fixed`, `sticky`) with `z-index` other than `auto`
    - `opacity` less than `1`
    - `transform`, `filter`, `perspective`, `clip-path` set to non-default values
    - `isolation: isolate` (the clean modern way to create a stacking context without side effects)

## 3. The Cascade, Specificity Math & Modern CSS Selectors
### Specificity Calculation & The 4-Weight Vector
- **The Specificity Hierarchy `(A, B, C, D)`**:
  - `A (Inline Styles)`: Style attribute directly on HTML tag `style="..."` → `(1, 0, 0, 0)`
  - `B (ID Selectors)`: Unique IDs like `#nav-header` → `(0, 1, 0, 0)`
  - `C (Classes, Attributes, Pseudo-classes)`: `.card`, `[type="checkbox"]`, `:hover`, `:focus` → `(0, 0, 1, 0)`
  - `D (Elements & Pseudo-elements)`: Type selectors `div`, `p`, `h1`, `::before`, `::after` → `(0, 0, 0, 1)`
  - Zero-specificity tokens: Universal selector `*`, combinators (`>`, `+`, `~`), and `:where()` carry `(0, 0, 0, 0)`!
- **Cascade Resolution Order**:
  - Specificity only applies when origin and importance are identical
  - Tie-breaker: If specificity is equal, the rule declared **last** in CSS source order wins
- **The `!important` Mechanism**:
  - Bypasses normal cascade specificity
  - Overriding an `!important` rule requires another `!important` rule of equal or greater specificity
  - High specificity chains of `!important` are an architecture anti-pattern
### CSS Cascade Layers (`@layer`)
- **Eliminating Specificity Wars**:
  - Explicitly declare layer precedence: `@layer reset, base, components, utilities;`
  - Layer priority order: Rules declared in later layers always override earlier layers, regardless of internal selector specificity!
  - Unlayered CSS rules **always override** layered styles for smooth backward-compatibility
- **Third-Party Library Integration**:
  - Import external CSS into low-priority layers: `@import "library.css" layer(vendor);`
  - Allows easy application-level overrides using simple single-class selectors without `!important`
### Modern Functional Pseudo-Classes & Selectors
- **`:has()` (The Parent & Relational Selector)**:
  - `card:has(img)`: Styles `.card` containers that contain an image
  - `h2:has(+ p)`: Styles `<h2>` only when immediately followed by a `<p>` paragraph
  - `form:has(:invalid)`: Styles form wrapper when any child input fails validation
- **`:is()` vs `:where()`**:
  - `:is(.card, .modal) button`: Specificity takes the maximum weight of its argument list
  - `:where(.card, .modal) button`: Zero specificity! Easily overridden anywhere downstream
- **Targeting Pseudo-Classes**:
  - `:not(.active)`: Negation selector
  - `:nth-child(an + b)`: Formulaic selection (e.g., `2n+1` for odd, `3n` for every third child)
  - `:empty`: Selects elements containing zero child nodes or whitespace
  - `:focus-within`: Triggers when element or any of its descendants receive focus
### CSS Custom Properties (Variables)
- **Runtime Dynamic Evaluation**:
  - Declared on `:root` or local scopes: `--primary-color: #38bdf8;`
  - Consumed with optional fallbacks: `color: var(--primary-color, #ffffff);`
  - Inherited dynamically down the DOM tree; unlike SASS/SCSS variables, CSS variables can be modified at runtime
- **Dynamic Theming & Dark Mode**:
  - Swap themes by updating root variables under `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)`
  - JavaScript bridge: Read via `getComputedStyle(el).getPropertyValue('--var')`, write via `el.style.setProperty('--var', value)`

## 4. Modern Layout Engines: Flexbox, CSS Grid & Container Queries
### Flexbox Deep Dive (1-Dimensional Layout Engine)
- **Axis Terminology**:
  - **Main Axis**: Direction items flow, controlled by `flex-direction: row | column`
  - **Cross Axis**: Perpendicular to the main axis
- **Alignment Matrix**:
  - Main Axis: `justify-content` (`flex-start`, `center`, `space-between`, `space-around`, `space-evenly`)
  - Cross Axis (Items): `align-items` (`stretch`, `center`, `flex-start`, `flex-end`, `baseline`)
  - Cross Axis (Individual): `align-self` overrides parent alignment for a specific child
  - Cross Axis (Multi-line): `align-content` distributes lines when `flex-wrap: wrap` is active
- **The Sizing Algorithm (`flex: grow shrink basis`)**:
  - `flex-grow`: Proportion of remaining positive free space allocated to the item (default `0`)
  - `flex-shrink`: Rate at which item contracts when container space is constrained (default `1`)
  - `flex-basis`: Default size before free space distribution (`auto`, `0`, or explicit size `px/%`)
  - **Interview Classic**: `flex: 1` (`1 1 0%`) vs `flex: auto` (`1 1 auto`)
    - `flex: 1`: All items start from base 0 and receive identical space regardless of initial content length
    - `flex: auto`: Considers natural content size before distributing remaining space
- **Modern Flex Gap**: `gap`, `row-gap`, `column-gap` replaces legacy negative margin hacks
### CSS Grid Deep Dive (2-Dimensional Layout Engine)
- **Grid Architecture Fundamentals**:
  - Containers, Tracks (columns/rows), Lines (numbered from 1), Cells, and Areas
- **Track Sizing & Responsive Patterns**:
  - `fr` (Fractional Unit): Represents a fraction of the free available container space
  - The Holy-Grail Auto-Layout: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`
  - `auto-fit` (collapses empty tracks to 0) vs `auto-fill` (preserves empty tracks with declared width)
- **Template Areas & Grid Positioning**:
  - Visual layout design: `grid-template-areas: "header header" "sidebar content" "footer footer";`
  - Track spanning: `grid-column: 1 / -1` (spans full width from first to last grid line)
- **CSS Subgrid (`grid-template-columns: subgrid`)**:
  - Child grid items participate directly in the parent grid's tracks
  - Ensures nested elements (e.g. card headers, card bodies) align perfectly across sibling cards
### Responsive Design & Container Queries
- **Media Queries vs Container Queries**:
  - **Media Queries (`@media`)**: Evaluates global viewport window width; rigid for modular component libraries
  - **Container Queries (`@container`)**: Evaluates parent container width; true modular responsive components
- **Container Query Implementation**:
  - Mark parent: `container-type: inline-size; container-name: card-wrapper;`
  - Style child: `@container card-wrapper (min-width: 450px) { .card { flex-direction: row; } }`
- **Fluid Typography & Clamp Calculations**:
  - `font-size: clamp(min, preferred, max)`: e.g., `clamp(1rem, 2.5vw + 0.5rem, 2.25rem)`
  - Fluid sizing without stepped media query breakpoints
- **Modern Viewport Units**:
  - `dvh` (Dynamic Viewport Height): Adapts dynamically to mobile address bar collapse/expansion
  - `svh` (Small Viewport Height) & `lvh` (Large Viewport Height) resolve mobile 100vh scrolling cut-off bugs

## 5. Browser Rendering Performance, CRP & CSS Architecture
### Critical Rendering Path (CRP) & Frame Pipeline
- **The 6-Step Browser Rendering Pipeline**:
  - 1. **HTML Parsing** → Constructs Document Object Model (DOM) Tree
  - 2. **CSS Parsing** → Constructs CSS Object Model (CSSOM) Tree (Render-blocking)
  - 3. **Render Tree Construction** → Combines DOM + CSSOM (excludes `display: none` and `<head>`)
  - 4. **Layout (Reflow)** → Computes exact pixel positions and geometry of each node
  - 5. **Paint (Repaint)** → Fills in visual pixels, colors, text, images, and shadows into bitmap layers
  - 6. **Compositing** → Layers are drawn to the screen via GPU processing
- **Reflow vs Repaint vs Compositing Performance Hierarchy**:
  - **Reflow (Most Expensive)**: Triggered by geometry shifts (`width`, `height`, `margin`, `padding`, `font-size`, `display`)
  - **Repaint**: Triggered by visual shifts without geometry alterations (`color`, `background-color`, `border-radius`, `box-shadow`)
  - **Compositing Only (60/120 FPS GPU Accelerated)**: `transform` (`translate3d`, `scale`) and `opacity`
- **Layout Thrashing / Forced Synchronous Layout**:
  - Interleaving DOM writes followed immediately by geometry reads in JS:
    - `element.style.width = '100px'; const h = element.offsetHeight;`
  - Forces browser to execute early synchronous layout; solve by batching reads first, writes second
### Modern CSS Optimization Strategies
- **GPU Layer Promotion & `will-change`**:
  - `will-change: transform, opacity`: Informs browser ahead of time to allocate dedicated GPU memory layer
  - Rule: Must be used sparingly and removed after animation completes to avoid VRAM exhaustion
- **Rendering Virtualization with `content-visibility`**:
  - `content-visibility: auto`: Skips rendering and layout of off-screen elements until user scrolls near them
  - `contain-intrinsic-size`: Sets fallback placeholder height preventing scrollbar jumping during lazy layout
- **Web Font Optimization & Core Web Vitals**:
  - Mitigate CLS (Cumulative Layout Shift): `font-display: swap` (uses fallback font then swaps when loaded)
  - Preload key fonts: `<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>`
  - Image layout shift mitigation: Always declare explicit `width` and `height` or `aspect-ratio: 16 / 9`
### CSS Architecture & Scalability Methodologies
- **BEM (Block Element Modifier)**:
  - `.block__element--modifier` (e.g. `.card__title--featured`)
  - Guarantees flat single-class specificity, eliminates unintended cascade bleed
- **CSS-in-JS vs Utility-First vs Zero-Runtime CSS**:
  - **CSS-in-JS (Styled-Components / Emotion)**: Dynamic props, scoped styles, but adds JS runtime parsing overhead
  - **Utility-First (Tailwind)**: Rapid development, purged CSS bundle, but clutters HTML markup
  - **Zero-Runtime CSS (Vanilla Extract, PandaCSS)**: Type-safe CSS-in-TS compiled to static CSS at build time
  - **CSS Modules**: Locally scoped class names generated at compile-time with zero JS runtime overhead
