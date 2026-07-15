# BurntPutito.github.io

My personal portfolio — a file-explorer-styled single page, themed in gruvbox.

**Live:** <https://burntputito.github.io>

## Stack

Static HTML, CSS, and JavaScript. No build step, no framework, no dependencies. Deployed by GitHub Pages straight from the `main` branch — pushing deploys.

## Structure

```
index.html          Single page; JS toggles between sections
css/styles.css      All styling
js/projects.js      Project data — the single source of truth
js/main.js          Rendering, navigation, clock, form
assets/images/      Images
```

## Running locally

Open the project in VS Code and start the **Live Preview** extension.

A local server is required — `js/main.js` is an ES module, and browsers block module imports over `file://`. Opening `index.html` directly will show a blank page.

Any static server works if you prefer:

```bash
python -m http.server 8000
```

## Adding a project

Append one object to the `projects` array in `js/projects.js`. The table, the detail panel, and all project counts render from that array, so there is nothing else to update. See `CLAUDE.md` for the field reference.
