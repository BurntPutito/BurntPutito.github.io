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

**A Windows 11 File Explorer, colored in gruvbox.** Win11's layout and structure, Mark's own palette and typography — a deliberate stylization, not a copy. Fonts are JetBrains Mono + Syne (kept on purpose rather than switching to Segoe UI).

Gruvbox dark palette. Win11 surface roles map onto the gruvbox ramp: `bg0_h #1d2021` for window/nav, `bg0 #282828` for content, `bg1 #3c3836` for hover, `bg2 #504945` for selection, `--accent-primary #fabd2f` for accents.

## Known issues, not yet fixed

Don't rediscover these as new findings:

- **Half-finished accent migration.** The palette moved from green to gruvbox yellow, but dead `rgba(0, 255, 136, ...)` values survive in `.nav-item.active`, `.skill-tag` background and border, and `.form-button:hover`. Two accent colors are fighting.
- **The mobile preview-panel hide doesn't work.** `@media (max-width: 768px) { .preview-panel { display: none } }` (specificity 0,1,0) loses to `.preview-panel.active { display: block }` (0,2,0). Media queries add no specificity.
- **Barely responsive.** One `@media (max-width: 768px)` block. No mobile nav pattern; `.project-preview-panel` has a 400px min-width and is never hidden, so `#projects` overflows on phones.
- **Dead CSS**: `.projects-container` and `.status-planned` are defined but never used.
- **No SEO.** No description, Open Graph, Twitter card, canonical, or favicon. Title is the generic "Portfolio - File System". Content only renders after JS runs, so crawlers see one section.
- **Nav items are `<div>`, not links.** No keyboard focus, no href, no URL per section, no deep-linking. Sections are `<div>`, not `<section>`. Form labels lack `for`/`id` association.
- **Contact form is a demo.** `alert()`s and resets; no backend.
- **Window chrome buttons are decorative.** Minimize/maximize/close have no handlers.

## Planned next

**Pass 2 — Windows 11 File Explorer redesign in gruvbox.** Purely visual, iterative, reviewed on sight. In order: window chrome + tabs, nav pane (Win11 structure, and Collections return as real filters over the `type` field), command bar + breadcrumb address bar, details view with sortable columns. The green→yellow accent cleanup happens here, since these rules get rewritten anyway. Open question: emoji icons vs. Fluent line icons (inline SVG — no CDN, keep the no-build constraint).

Blocked on Mark, not on code: Resume section (needs a resume PDF), Blog section (needs posts).
