import { projects, statusLabels } from './projects.js';
import { icon } from './icons.js';

/* Fill every static [data-icon] hook (nav, home cards, social) with its SVG.
   Runs before anything reads the nav DOM, so sectionMeta picks up real icons. */
function hydrateIcons() {
    document.querySelectorAll('[data-icon]').forEach(el => {
        el.innerHTML = icon(el.dataset.icon);
    });
}
hydrateIcons();

/* Escape values before they reach innerHTML, so a description containing
   characters like < or & renders as text instead of breaking the markup. */
function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

/* Project Table */

const projectsTableBody = document.querySelector('.projects-table tbody');

/* The projects on screen right now — everything when unfiltered, or one type
   when a filter is picked in the nav pane. */
function visibleProjects() {
    const { filter } = currentLocation();
    return filter ? projects.filter(p => p.type === filter) : projects;
}

/* Distinct types with counts, derived from the data rather than maintained by
   hand — add a project with a new type and its filter appears on its own.
   Sorted alphabetically, the way a folder listing is. */
function projectTypes() {
    const counts = new Map();
    projects.forEach(p => counts.set(p.type, (counts.get(p.type) || 0) + 1));
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/* Sorting the details view. `date` is a display string ("Sep 2022") and
   `status` is ranked by how live the work is, so both need a sort key rather
   than raw string comparison. */
const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const STATUS_RANK = { 'in-progress': 0, 'completed': 1, 'planned': 2 };

function sortValue(project, key) {
    switch (key) {
        case 'name': return project.name.toLowerCase();
        case 'type': return project.type.toLowerCase();
        case 'date': {
            const [month, year] = project.date.split(' ');
            return Number(year) * 12 + (MONTHS[month] ?? 0);
        }
        case 'status': return STATUS_RANK[project.status] ?? 99;
        default: return 0;
    }
}

function sortProjects(list, sort) {
    if (!sort) return list;

    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
        const va = sortValue(a, sort.key);
        const vb = sortValue(b, sort.key);
        if (va < vb) return -factor;
        if (va > vb) return factor;
        return 0;
    });
}

function renderProjectRows() {
    const rows = sortProjects(visibleProjects(), activeTab().sort);
    projectsTableBody.innerHTML = rows.map(project => `
        <tr class="project-row" data-project="${project.id}">
            <td>
                <div class="project-name-cell">
                    <span class="project-icon">${icon(project.icon)}</span>
                    <span class="project-name">${escapeHtml(project.name)}</span>
                </div>
            </td>
            <td class="project-type">${escapeHtml(project.type)}</td>
            <td class="project-date">${escapeHtml(project.date)}</td>
            <td><span class="project-status status-${project.status}">${statusLabels[project.status]}</span></td>
        </tr>
    `).join('');
}

/* Project Preview Panel */

const projectPreviewPanel = document.getElementById('project-preview');
const projectPreviewContent = document.querySelector('.project-preview-content');

function renderLinkButtons(project) {
    const buttons = [];

    if (project.demo) {
        buttons.push(`<a href="${project.demo}" class="project-link-btn" target="_blank" rel="noopener">View Demo</a>`);
    }

    if (project.repo) {
        buttons.push(`<a href="${project.repo}" class="project-link-btn" target="_blank" rel="noopener">GitHub</a>`);
    } else if (project.repoStatus === 'private') {
        buttons.push(`<span class="project-link-btn is-disabled" title="Private repo">Private repo</span>`);
    }

    return buttons.join('');
}

function renderInfoGrid(project) {
    /* Date and Status are always known; Duration and Platform are optional
       and stay out of the grid entirely rather than showing as blank. */
    const items = [
        ['Date', project.date],
        ['Status', statusLabels[project.status]],
        ['Duration', project.duration],
        ['Platform', project.platform]
    ].filter(([, value]) => value);

    return items.map(([label, value]) => `
        <div class="project-info-item">
            <div class="project-info-label">${label}</div>
            <div class="project-info-value">${escapeHtml(value)}</div>
        </div>
    `).join('');
}

function showProjectPreview(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const linkButtons = renderLinkButtons(project);

    projectPreviewContent.innerHTML = `
        <div class="project-preview-header">
            <div class="project-preview-icon">
                ${project.image
                    ? `<img src="${project.image}" alt="${escapeHtml(project.name)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`
                    : icon(project.icon)}
            </div>
            <h3 class="project-preview-title">${escapeHtml(project.name)}</h3>
            <p class="project-preview-type">${escapeHtml(project.type)}</p>
        </div>

        ${project.description
            ? `<p class="project-preview-description">${escapeHtml(project.description)}</p>`
            : ''}

        ${project.tech.length ? `
            <div class="preview-divider"></div>

            <div class="project-preview-section">
                <div class="project-preview-section-title">Technologies</div>
                <div class="project-tech-list">
                    ${project.tech.map(tech => `<span class="project-tech-tag">${escapeHtml(tech)}</span>`).join('')}
                </div>
            </div>
        ` : ''}

        <div class="preview-divider"></div>

        <div class="project-preview-section">
            <div class="project-preview-section-title">Project Info</div>
            <div class="project-info-grid">
                ${renderInfoGrid(project)}
            </div>
        </div>

        ${linkButtons ? `
            <div class="preview-divider"></div>

            <div class="project-preview-section">
                <div class="project-preview-section-title">Links</div>
                <div class="project-links">
                    ${linkButtons}
                </div>
            </div>
        ` : ''}
    `;

    projectPreviewPanel.classList.add('active');
}

/* Which project is selected belongs to the tab, not to the page — so two tabs
   both open on Projects can hold different selections, and switching away and
   back restores what you had. */
function renderProjectSelection() {
    const selected = activeTab().selected;

    document.querySelectorAll('.project-row').forEach(row => {
        row.classList.toggle('selected', row.dataset.project === selected);
    });

    if (selected) {
        showProjectPreview(selected);
    } else {
        projectPreviewPanel.classList.remove('active');
    }
}

/* Delegated, because the rows are re-rendered whenever the filter changes. */
projectsTableBody.addEventListener('click', event => {
    const row = event.target.closest('.project-row');
    if (!row) return;

    activeTab().selected = row.dataset.project;
    renderProjectSelection();
});

/* Counts */

/* Totals — the sidebar folder, the home card, the About stat. */
function renderProjectCounts() {
    document.querySelectorAll('[data-project-count]').forEach(el => {
        el.textContent = el.dataset.projectCount === 'items'
            ? `${projects.length} items`
            : projects.length;
    });
}

/* The status bar counts what's in the current view, like File Explorer. */
function renderViewCount() {
    const count = visibleProjects().length;
    document.querySelector('[data-view-count]').textContent =
        `${count} item${count === 1 ? '' : 's'}`;
}

/* Navigation */

const navPane = document.getElementById('nav-pane');
const projectFilters = document.getElementById('project-filters');
const projectsTitle = document.getElementById('projects-title');
const projectsSubtitle = document.getElementById('projects-subtitle');
const contentSections = document.querySelectorAll('.content-section');
const aboutPreviewPanel = document.getElementById('about-preview');

/* The nav pane is the source of truth for each section's icon and label, so the
   tabs and breadcrumb stay in step with it automatically. */
const sectionMeta = {};
navPane.querySelectorAll('.nav-item[data-section]').forEach(item => {
    sectionMeta[item.dataset.section] = {
        icon: item.querySelector('.nav-icon').innerHTML,
        label: item.querySelector('.nav-label').textContent
    };
});

const HOME = 'home';
const FOLDER_ICON = icon('folder');

function renderProjectFilters() {
    projectFilters.innerHTML = projectTypes().map(([type, count]) => `
        <div class="nav-item" data-filter="${escapeHtml(type)}">
            <span class="nav-icon">${FOLDER_ICON}</span>
            <span class="nav-label">${escapeHtml(type)}</span>
            <span class="nav-count">${count}</span>
        </div>
    `).join('');
}

function showLocation({ section, filter }) {
    /* A filter selects its own folder, not the parent — same as File Explorer,
       where opening a subfolder deselects the one above it. */
    navPane.querySelectorAll('.nav-item').forEach(item => {
        const isSection = item.dataset.section === section && !filter;
        const isFilter = Boolean(filter) && item.dataset.filter === filter;
        item.classList.toggle('active', isSection || isFilter);
    });

    contentSections.forEach(content => content.classList.toggle('active', content.id === section));
    aboutPreviewPanel.classList.toggle('active', section === 'about');

    if (section === 'projects') {
        renderProjectRows();
        renderSortHeaders();
        renderProjectsHeading(filter);

        /* A selection that the current filter hides is no longer a selection. */
        const tab = activeTab();
        if (tab.selected && !visibleProjects().some(p => p.id === tab.selected)) {
            tab.selected = null;
        }
        renderProjectSelection();
    } else {
        projectPreviewPanel.classList.remove('active');
    }

    renderViewCount();
}

/* Details View: sortable columns */

const sortHeaders = document.querySelectorAll('.projects-table th[data-sort-key]');

function renderSortHeaders() {
    const sort = activeTab().sort;
    sortHeaders.forEach(th => {
        const active = sort && sort.key === th.dataset.sortKey;
        th.setAttribute('aria-sort', active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
}

document.querySelector('.projects-table thead').addEventListener('click', event => {
    const th = event.target.closest('th[data-sort-key]');
    if (!th) return;

    const key = th.dataset.sortKey;
    const sort = activeTab().sort;

    /* First click sorts ascending; clicking the active column flips direction. */
    activeTab().sort = (sort && sort.key === key)
        ? { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' };

    renderProjectRows();
    renderSortHeaders();
    renderProjectSelection();
});

/* The heading follows the filter, so a short list reads as "you are in Game
   Mod" rather than "Projects, apparently missing most of its projects". */
function renderProjectsHeading(filter) {
    const count = visibleProjects().length;

    projectsTitle.textContent = filter || 'Projects';
    projectsSubtitle.textContent = filter
        ? `${count} ${count === 1 ? 'project' : 'projects'}`
        : 'A collection of my work';
}

/* Tabs

   One tab is open by default and renames itself as you navigate — like File
   Explorer with a single folder open. Extra tabs only appear when the visitor
   clicks "+", and each carries its own section and its own back/forward
   history. */

const tabStrip = document.getElementById('tab-strip');
const addressPath = document.getElementById('address-path');
const backBtn = document.getElementById('nav-back');
const forwardBtn = document.getElementById('nav-forward');
const upBtn = document.getElementById('nav-up');

let nextTabId = 1;
let tabs = [];
let activeTabId = null;

/* A location is a section plus an optional project-type filter. Tab history is
   a list of these, so Back/Forward step through filters too. `selected` and
   `sort` are the tab's own view state, so two tabs on Projects stay
   independent. */
function createTab(section = HOME) {
    return { id: nextTabId++, history: [{ section, filter: null }], index: 0, selected: null, sort: null };
}

function activeTab() {
    return tabs.find(t => t.id === activeTabId);
}

function currentLocation(tab = activeTab()) {
    return tab.history[tab.index];
}

/* A tab is named after the folder it's showing — the filter when there is one. */
function locationMeta({ section, filter }) {
    return filter
        ? { icon: FOLDER_ICON, label: filter }
        : sectionMeta[section];
}

function renderTabs() {
    const tabsHtml = tabs.map(tab => {
        const meta = locationMeta(currentLocation(tab));
        return `
            <button class="tab${tab.id === activeTabId ? ' active' : ''}" data-tab-id="${tab.id}">
                <span class="tab-icon">${meta.icon}</span>
                <span class="tab-label">${escapeHtml(meta.label)}</span>
                ${tabs.length > 1 ? `
                    <span class="tab-close" role="button" tabindex="0" title="Close tab" aria-label="Close tab">
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2">
                            <line x1="1" y1="1" x2="9" y2="9"/>
                            <line x1="9" y1="1" x2="1" y2="9"/>
                        </svg>
                    </span>` : ''}
            </button>
        `;
    }).join('');

    /* The new-tab button sits inside the strip so it follows the last tab
       rather than being pushed against the window controls. */
    tabStrip.innerHTML = tabsHtml + `
        <button class="tab-new" title="New tab" aria-label="New tab">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2">
                <line x1="6" y1="2" x2="6" y2="10"/>
                <line x1="2" y1="6" x2="10" y2="6"/>
            </svg>
        </button>
    `;
}

/* The trail to a location: ~ › Projects › Game Mod at its deepest. */
function crumbsFor({ section, filter }) {
    const crumbs = [{ icon: sectionMeta[HOME].icon, label: '~', section: HOME, filter: null }];

    if (section !== HOME) {
        crumbs.push({ ...sectionMeta[section], section, filter: null });
    }
    if (filter) {
        crumbs.push({ icon: FOLDER_ICON, label: filter, section, filter });
    }
    return crumbs;
}

function renderAddressBar() {
    const tab = activeTab();
    const location = currentLocation(tab);
    const crumbs = crumbsFor(location);

    addressPath.innerHTML = crumbs.map((crumb, i) => {
        const current = i === crumbs.length - 1;
        return `
            ${i > 0 ? '<span class="address-separator">›</span>' : ''}
            <button class="address-crumb${current ? ' is-current' : ''}"
                    data-section="${crumb.section}"
                    data-filter="${crumb.filter ? escapeHtml(crumb.filter) : ''}"
                    ${current ? 'disabled' : ''}>
                <span>${crumb.icon}</span>
                <span>${escapeHtml(crumb.label)}</span>
            </button>
        `;
    }).join('');

    backBtn.disabled = tab.index === 0;
    forwardBtn.disabled = tab.index === tab.history.length - 1;
    upBtn.disabled = location.section === HOME;
}

function render() {
    renderTabs();
    renderAddressBar();
    showLocation(currentLocation());
}

/* Navigating pushes onto the active tab's history, dropping any forward
   entries — the same way a browser or File Explorer behaves. */
function navigate(section, filter = null) {
    const tab = activeTab();
    const location = currentLocation(tab);
    if (location.section === section && location.filter === filter) return;

    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push({ section, filter });
    tab.index = tab.history.length - 1;
    render();
}

function openTab() {
    const tab = createTab(HOME);
    tabs.push(tab);
    activeTabId = tab.id;
    render();
}

function closeTab(id) {
    if (tabs.length === 1) return;

    const i = tabs.findIndex(t => t.id === id);
    tabs.splice(i, 1);

    if (activeTabId === id) {
        activeTabId = tabs[Math.min(i, tabs.length - 1)].id;
    }
    render();
}

tabStrip.addEventListener('click', event => {
    if (event.target.closest('.tab-new')) {
        openTab();
        return;
    }

    const closeBtn = event.target.closest('.tab-close');
    if (closeBtn) {
        event.stopPropagation();
        closeTab(Number(closeBtn.closest('.tab').dataset.tabId));
        return;
    }

    const tab = event.target.closest('.tab');
    if (tab) {
        activeTabId = Number(tab.dataset.tabId);
        render();
    }
});

addressPath.addEventListener('click', event => {
    const crumb = event.target.closest('.address-crumb');
    if (crumb && !crumb.disabled) {
        navigate(crumb.dataset.section, crumb.dataset.filter || null);
    }
});

backBtn.addEventListener('click', () => {
    const tab = activeTab();
    if (tab.index > 0) {
        tab.index--;
        render();
    }
});

forwardBtn.addEventListener('click', () => {
    const tab = activeTab();
    if (tab.index < tab.history.length - 1) {
        tab.index++;
        render();
    }
});

/* Up goes to the parent folder: a type filter sits inside Projects, and every
   section sits inside ~. */
upBtn.addEventListener('click', () => {
    const { section, filter } = currentLocation();
    if (filter) navigate(section, null);
    else navigate(HOME);
});

navPane.addEventListener('click', event => {
    const chevron = event.target.closest('.nav-chevron');
    if (chevron) {
        toggleGroup(chevron.closest('.nav-group'));
        return;
    }

    const item = event.target.closest('.nav-item');
    if (!item) return;

    if (item.dataset.section) {
        navigate(item.dataset.section, null);
    } else if (item.dataset.filter) {
        navigate('projects', item.dataset.filter);
    } else {
        /* A group header (Quick access) is a label, so clicking it just folds
           the group rather than going nowhere. */
        toggleGroup(item.closest('.nav-group'));
    }
});

function toggleGroup(group) {
    if (!group) return;

    const collapsed = group.hasAttribute('data-collapsed');
    group.toggleAttribute('data-collapsed', !collapsed);

    const chevron = group.querySelector('.nav-chevron');
    const name = group.querySelector('.nav-label').textContent;
    chevron.setAttribute('aria-expanded', String(collapsed));
    chevron.setAttribute('aria-label', `${collapsed ? 'Collapse' : 'Expand'} ${name}`);
}

/* Clock */

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

/* Contact Form */

document.querySelector('.contact-form').addEventListener('submit', event => {
    event.preventDefault();
    alert('Message sent! (This is a demo - connect your backend to make it functional)');
    event.target.reset();
});

/* Init */

renderProjectFilters();
renderProjectCounts();

tabs = [createTab(HOME)];
activeTabId = tabs[0].id;
render();

updateTime();
setInterval(updateTime, 1000);
