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

function bindProjectRows() {
    const projectRows = document.querySelectorAll('.project-row');

    projectRows.forEach(row => {
        row.addEventListener('click', function () {
            projectRows.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            showProjectPreview(this.dataset.project);
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

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        contentSections.forEach(content => {
            content.classList.remove('active');
            if (content.id === section) {
                content.classList.add('active');
            }
        });

        aboutPreviewPanel.classList.toggle('active', section === 'about');

        if (section !== 'projects') {
            projectPreviewPanel.classList.remove('active');
        }
    });
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
updateTime();
setInterval(updateTime, 1000);
