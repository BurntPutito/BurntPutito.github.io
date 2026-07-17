# BurntPutito.github.io

Personal portfolio for Mark Jaspher P. Caitan. Live at <https://burntputito.github.io>.

## Stack

Static HTML/CSS/JS. **No build step, no framework, no package manager, no dependencies.** The only external resource is a Google Fonts link.

GitHub Pages serves `main` branch root directly — `index.html` must stay at the repository root. There is no CI. **Pushing to `main` deploys immediately**, so verify locally before pushing.

## Structure

```
index.html          Single page. All five sections live here; JS toggles which is visible.
css/styles.css      All styling. One file.
js/projects.js      Project data — the single source of truth.
js/main.js          Rendering, navigation, clock, form.
js/icons.js         Fluent-style inline-SVG icon registry.
assets/images/      Images.
```

## Previewing locally

**Use VS Code's Live Preview extension** (already configured in `.vscode/settings.json`). Do not open `index.html` by double-clicking it.

`js/main.js` is an ES module, and browsers block module imports over the `file://` protocol for security reasons. Live Preview runs a local web server, so imports resolve. Opening the file directly gives a blank page and a CORS error in the console.

## Adding a project

Append one object to the `projects` array in `js/projects.js`. That is the entire process.

The table rows, the detail panel, and every project count on the site are rendered from this array. Nothing else needs editing — and nothing else *should* be edited, because the site previously kept project data in two places and they drifted apart, leaving six of seven projects publicly showing another project's information.

```js
{
    id: 'my-project',              // stable kebab-case key; don't rename casually
    name: 'My Project',
    icon: '🎮',                     // shown in the row, and in the preview when image is null
    type: 'Game',                  // short label for the Type column
    date: 'Jan 2026',
    status: 'in-progress',         // 'completed' | 'in-progress' | 'planned'
    tech: ['Unity', 'C#'],
    description: 'What it is and what you did.',
    duration: null,                // optional — omitted from the info grid when null
    platform: null,                // optional — omitted from the info grid when null
    repo: null,                    // ← paste the URL when the repo goes public
    repoStatus: 'private',         // 'public' | 'private'
    demo: null,
    image: null                    // optional screenshot path
}
```

### Field behaviour worth knowing

- **`status`** must be one of the three values above — it becomes the `.status-{status}` CSS class. A typo means unstyled output.
- **`repo: null` + `repoStatus: 'private'`** renders a disabled "Private repo" button. Fill in `repo` and the button goes live automatically; no other change needed.
- **`repo: null` + `repoStatus: 'public'`** renders no button at all.
- **`demo: null`** renders no demo button.
- **Empty `tech: []` or `description: ''`** omits that section from the preview rather than rendering an empty heading.
- **`icon`** is a Fluent icon *name* from `js/icons.js` (e.g. `'game'`, `'phone'`), not an emoji. Add a project with a new kind of icon and you add one entry to that registry.

## Icons

`js/icons.js` is a registry of Fluent-style inline-SVG line icons — no CDN, no icon font, keeping the no-build constraint. Every icon shares one 24×24 grid, a 1.6 stroke, and round caps, and inherits `currentColor`, so the same markup works muted in a nav row or dark on the preview panel's bright gradient.

Static markup references an icon with `data-icon="name"`; `hydrateIcons()` in `main.js` fills those at startup, before `sectionMeta` reads the nav DOM. Rendered markup (rows, tabs, breadcrumb) calls `icon(name)`. Never paste raw emoji back into the UI — add an icon to the registry and reference it by name.

## Content accuracy rules

- **Never invent project details.** The original `projectsData` shipped with template boilerplate (React/MongoDB/Stripe, TensorFlow, D3.js) describing projects that were never built, and it went live. A thin true description beats a rich invented one.
- Several entries currently carry `// TODO: confirm` or `// TODO: expand` comments where data was inferred from GitHub repo metadata rather than confirmed by Mark. Don't silently remove these — either get the real value or leave the marker.
- `minecraft-hud` has an empty `tech` array on purpose. GitHub reports the repo as ReScript, which is Linguist misreading file extensions, not the truth.
- `l4d2-healthbar` is a Left 4 Dead 2 addon styled to look like Minecraft — **not** a Minecraft mod. It was mislabelled on the site for a long time.

## Conventions

- 4-space indentation, HTML and CSS and JS
- Double quotes in HTML attributes, single quotes in JS
- kebab-case for classes and filenames; `data-*` attributes as JS hooks (`data-section`, `data-project`, `data-project-count`)
- `.active` / `.selected` are the universal state classes
- CSS custom properties live in one `:root` block at the top of `styles.css`
- `addEventListener`, never inline `onclick`/`onsubmit` handlers
- Values are escaped via `escapeHtml()` before reaching `innerHTML`

## Design intent

**A Windows 11 File Explorer, colored in gruvbox.** Win11's layout and structure, Mark's own palette and typography — a deliberate stylization, not a copy. Fonts are JetBrains Mono + Syne (kept on purpose rather than switching to Segoe UI); icons are Fluent-style line icons (chosen over the original emoji for accuracy).

Gruvbox dark palette. Win11 surface roles map onto the gruvbox ramp: `bg0_h #1d2021` for window/nav, `bg0 #282828` for content, `bg1 #3c3836` for hover, `bg2 #504945` for selection, `--accent-primary #fabd2f` for accents.

## Known issues, not yet fixed

Don't rediscover these as new findings:

- **The mobile preview-panel hide doesn't work.** `@media (max-width: 768px) { .preview-panel { display: none } }` (specificity 0,1,0) loses to `.preview-panel.active { display: block }` (0,2,0). Media queries add no specificity.
- **Barely responsive.** No mobile nav pattern; `.project-preview-panel` has a 400px min-width and is never hidden, so `#projects` overflows on phones. The window does go fullscreen under 768px.
- **Dead CSS**: `.projects-container` is defined but never used. (`.status-planned` is *not* dead — it's waiting for a project with `status: 'planned'`.)
- **No SEO.** No description, Open Graph, Twitter card, canonical, or favicon — the missing favicon is the one 404 in the console. Title is the generic "Portfolio - File System". Content only renders after JS runs, so crawlers see one section.
- **Nav items are `<div>`, not links.** No keyboard focus, no href, no URL per section, no deep-linking. Sections are `<div>`, not `<section>`. Form labels lack `for`/`id` association.
- **Contact form is a demo.** `alert()`s and resets; no backend.
- **Window chrome buttons are decorative.** Minimize/maximize/close have no handlers. (Tabs, `+`, close-tab, back/forward/up and the breadcrumb all genuinely work.)

Fixed in Pass 2, no longer issues: the green→yellow accent migration is complete (no `rgba(0, 255, 136, ...)` remains anywhere); the status bar no longer overlaps content since it left `position: fixed`.

## Navigation model

Worth understanding before touching `js/main.js`, because it's the spine of the UI.

A **location** is `{ section, filter }` — a section id, plus an optional project *type* to filter by. A **tab** owns a history of locations, an index into it, its own selected project, and its own column sort. So Back/Forward step through filters as well as sections, and two tabs open on Projects can show different types, selections, and sort orders.

Tab behaviour deliberately mirrors File Explorer: one tab is open by default and **renames itself** as you navigate; new tabs appear **only** via `+`; the close button is only rendered when more than one tab exists. `Up` walks the real hierarchy — a filter's parent is Projects, a section's parent is `~`.

The nav pane's type filters are **derived from the data**: `projectTypes()` reads distinct `type` values off `projects` with counts. Add a project with a new type and its filter appears on its own, correctly counted. Never hardcode the category list.

When a filter is active the Projects heading becomes the filter's name and the subtitle becomes its count, so a short list reads as "you are in Game Mod" rather than "Projects, apparently missing most of its projects".

`sectionMeta` is read out of the nav pane DOM at startup, so a section's icon and label are defined once in `index.html` and reused by the tabs and breadcrumb.

## Planned next

**Pass 2 — Windows 11 File Explorer redesign in gruvbox.** Iterative, reviewed on sight.

- ✅ **2.1 Window chrome** — tabs, address bar, floating window. Shipped together because the active tab needs the address bar beneath it to read as a tab.
- ✅ **2.2 Nav pane** — chevron groups, Quick access, Projects as an expandable folder, type filters, selection pill. Green migration finished here.
- ✅ **2.3 Details view** — sortable column headers (click to sort, click again to flip), Win11 hover/selection. Sort lives on the tab; `date` sorts chronologically via a `MMM YYYY` parse, `status` by a liveness rank.

- ✅ **2.4 Fluent icons** — the emoji were replaced with an inline-SVG line-icon set (`js/icons.js`). Nav, tabs, breadcrumb, rows, home cards, and social links all draw from it.

Pass 2 is complete. The remaining known issues below (mobile, SEO, real anchors) were always scoped as a later pass.

Blocked on Mark, not on code: Resume section (needs a resume PDF), Blog section (needs posts).
