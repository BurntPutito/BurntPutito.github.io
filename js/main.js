import { projects, statusLabels } from './projects.js';

/* Escape values before they reach innerHTML, so a description containing
   characters like < or & renders as text instead of breaking the markup. */
function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

/* Project Table */

const projectsTableBody = document.querySelector('.projects-table tbody');

function renderProjectRows() {
    projectsTableBody.innerHTML = projects.map(project => `
        <tr class="project-row" data-project="${project.id}">
            <td>
                <div class="project-name-cell">
                    <span class="project-icon">${project.icon}</span>
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
                    : project.icon}
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

function bindProjectRows() {
    document.querySelectorAll('.project-row').forEach(row => {
        row.addEventListener('click', () => {
            activeTab().selected = row.dataset.project;
            renderProjectSelection();
        });
    });
}

/* Counts */

function renderProjectCounts() {
    document.querySelectorAll('[data-project-count]').forEach(el => {
        el.textContent = el.dataset.projectCount === 'items'
            ? `${projects.length} items`
            : projects.length;
    });
}

/* Navigation */

const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const aboutPreviewPanel = document.getElementById('about-preview');

/* The sidebar is the source of truth for each section's icon and label, so the
   tabs and breadcrumb stay in step with it automatically. */
const sectionMeta = {};
navItems.forEach(item => {
    sectionMeta[item.dataset.section] = {
        icon: item.querySelector('.nav-icon').textContent,
        label: item.querySelector('.nav-label').textContent
    };
});

const HOME = 'home';

function showSection(section) {
    navItems.forEach(nav => nav.classList.toggle('active', nav.dataset.section === section));
    contentSections.forEach(content => content.classList.toggle('active', content.id === section));

    aboutPreviewPanel.classList.toggle('active', section === 'about');

    if (section === 'projects') {
        renderProjectSelection();
    } else {
        projectPreviewPanel.classList.remove('active');
    }
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

function createTab(section = HOME) {
    return { id: nextTabId++, history: [section], index: 0, selected: null };
}

function activeTab() {
    return tabs.find(t => t.id === activeTabId);
}

function currentSection(tab = activeTab()) {
    return tab.history[tab.index];
}

function renderTabs() {
    const tabsHtml = tabs.map(tab => {
        const meta = sectionMeta[currentSection(tab)];
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

function renderAddressBar() {
    const tab = activeTab();
    const section = currentSection(tab);

    /* Every section is a direct child of ~, so the trail is at most two deep. */
    const crumbs = section === HOME
        ? [{ section: HOME, current: true }]
        : [{ section: HOME, current: false }, { section, current: true }];

    addressPath.innerHTML = crumbs.map(({ section: s, current }, i) => {
        const meta = sectionMeta[s];
        const label = s === HOME ? '~' : meta.label;
        return `
            ${i > 0 ? '<span class="address-separator">›</span>' : ''}
            <button class="address-crumb${current ? ' is-current' : ''}" data-section="${s}"${current ? ' disabled' : ''}>
                <span>${meta.icon}</span>
                <span>${escapeHtml(label)}</span>
            </button>
        `;
    }).join('');

    backBtn.disabled = tab.index === 0;
    forwardBtn.disabled = tab.index === tab.history.length - 1;
    upBtn.disabled = section === HOME;
}

function render() {
    renderTabs();
    renderAddressBar();
    showSection(currentSection());
}

/* Navigating pushes onto the active tab's history, dropping any forward
   entries — the same way a browser or File Explorer behaves. */
function navigate(section) {
    const tab = activeTab();
    if (currentSection(tab) === section) return;

    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push(section);
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
    if (crumb && !crumb.disabled) navigate(crumb.dataset.section);
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

upBtn.addEventListener('click', () => navigate(HOME));

navItems.forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.section));
});

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

renderProjectRows();
bindProjectRows();
renderProjectCounts();

tabs = [createTab(HOME)];
activeTabId = tabs[0].id;
render();

updateTime();
setInterval(updateTime, 1000);
