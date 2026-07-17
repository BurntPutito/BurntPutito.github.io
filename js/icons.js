/**
 * Fluent-style line icons as inline SVG — no CDN, no icon font, no build step.
 *
 * Every icon shares one 24×24 grid, a 1.6 stroke, and round caps so they read
 * as one set at small sizes. Colour and size come from CSS (they inherit
 * `currentColor` and are sized by their container), so the same markup works
 * in a muted nav row, a selected pill, or a tab.
 *
 * Reference an icon by name — in the nav via `data-icon`, in rendered markup
 * via `icon(name)`. The project `icon` field in projects.js is one of these
 * names.
 */

const stroke = inner =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

const filled = inner =>
    `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${inner}</svg>`;

export const icons = {
    /* Sections and nav */
    home: stroke('<path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>'),
    pin: stroke('<path d="M9 3h6M10 3l-.5 6-2 2.5v1.5h9V11l-2-2.5L14 3"/><path d="M12 14.5V21"/>'),
    person: stroke('<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/>'),
    bolt: stroke('<path d="M13 3 6 13h5l-1 8 8-11h-5l1-7z"/>'),
    chat: stroke('<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>'),
    folder: stroke('<path d="M4 6h4.5l2 2H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/>'),

    /* Home cards */
    rocket: stroke('<path d="M12 3c2.8 2 4 5 4 8l-1.5 3.5h-5L8 11c0-3 1.2-6 4-8z"/><circle cx="12" cy="9.5" r="1.4"/><path d="M9 15l-2.5 2.5M15 15l2.5 2.5M10.5 18l-1.5 2M13.5 18l1.5 2"/>'),
    bulb: stroke('<path d="M9 15.5a5 5 0 1 1 6 0c-.7.5-1 1.2-1 2h-4c0-.8-.3-1.5-1-2z"/><path d="M9.5 21h5"/>'),
    mail: stroke('<rect x="3.5" y="6" width="17" height="12" rx="1.5"/><path d="m4.5 7.5 7.5 5.5 7.5-5.5"/>'),

    /* Project kinds (map from the old emoji) */
    palette: stroke('<path d="M12 4a8 8 0 1 0 0 16c1.3 0 1.7-1 1-1.9-.6-.9 0-2.1 1.2-2.1H16a4 4 0 0 0 4-4c0-4.4-3.6-8-8-8z"/><circle cx="8.5" cy="10.5" r="1"/><circle cx="12" cy="8.5" r="1"/><circle cx="15.5" cy="10.5" r="1"/>'),
    phone: stroke('<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>'),
    game: stroke('<path d="M8.5 8h7a4 4 0 0 1 4 4v.5a2.8 2.8 0 0 1-5.1 1.6l-.6-.9h-3.6l-.6.9A2.8 2.8 0 0 1 4.5 12.5V12a4 4 0 0 1 4-4z"/><path d="M8 11v2M7 12h2"/><circle cx="15.5" cy="11" r=".9"/><circle cx="17" cy="13" r=".9"/>'),
    server: stroke('<rect x="4" y="5" width="16" height="6" rx="1.5"/><rect x="4" y="13" width="16" height="6" rx="1.5"/><path d="M7.5 8h.01M7.5 16h.01"/>'),
    wrench: stroke('<path d="M14.7 6.3a3.5 3.5 0 0 0-4.5 4.5l-5.1 5.1a1.6 1.6 0 0 0 2.3 2.3l5.1-5.1a3.5 3.5 0 0 0 4.5-4.5l-2.2 2.2-2-.3-.3-2 2.2-2.2z"/>'),

    /* Social */
    github: filled('<path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.3-3.3-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.6-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.6 1 1.5 1 2.6 0 3.8-2.3 4.6-4.5 4.9.3.3.7 1 .7 2v2.9c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2z"/>'),
    linkedin: filled('<path d="M4.5 3.5A1.7 1.7 0 1 0 4.5 7a1.7 1.7 0 0 0 0-3.4zM3 8.5h3V21H3zM9 8.5h2.9v1.7h.04c.4-.75 1.4-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.9V21h-3v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/>'),
    x: filled('<path d="M17.5 3h3l-6.6 7.5L21.5 21h-6l-4.3-5.7L6.3 21H3.3l7-8L2.8 3h6.1l3.9 5.2zm-1 16h1.7L7.6 4.7H5.8z"/>')
};

export function icon(name) {
    return icons[name] ?? '';
}
