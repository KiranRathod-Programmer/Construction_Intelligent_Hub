/**
 * Construction Intelligent Hub (CIH) - Main Application Controller
 * Handles dynamic rendering from data.js, modals, search, and user interactions.
 */

// Initialize Page Content on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initLandingPage();
    initDashboardPage();
});

// --- LANDING PAGE DYNAMIC RENDERER ---
function initLandingPage() {
    const statsContainer = document.getElementById('landingStatsBar');
    if (statsContainer && typeof CIH_DATASET !== 'undefined') {
        statsContainer.innerHTML = CIH_DATASET.metrics.map(metric => `
            <div>
                <div class="stat-number">${metric.value}</div>
                <div class="stat-desc-label">${metric.label}</div>
            </div>
        `).join('');
    }
}

// --- LOGGED-IN DASHBOARD DYNAMIC RENDERER ---
function initDashboardPage() {
    const projectGrid = document.getElementById('projectGrid');
    if (projectGrid && typeof CIH_DATASET !== 'undefined') {
        renderProjectGrid(CIH_DATASET.projects);
    }
}

function renderProjectGrid(projectsList) {
    const projectGrid = document.getElementById('projectGrid');
    if (!projectGrid) return;

    if (projectsList.length === 0) {
        projectGrid.innerHTML = `
            <div style="grid-column: span 2; text-align: center; padding: 40px; color: #64748B;">
                No matching projects found.
            </div>
        `;
        return;
    }

    projectGrid.innerHTML = projectsList.map(project => `
        <div class="project-card" id="card-${project.id}" data-title="${project.title}" data-city="${project.city}">
            <div>
                <div class="project-card-header">
                    <div style="display: flex; gap: 14px; align-items: center;">
                        <div class="project-icon-box">${project.icon}</div>
                        <div>
                            <div class="project-title">${project.title}</div>
                            <div class="project-location">📍 ${project.city}</div>
                        </div>
                    </div>
                    <span class="status-pill ${project.statusClass}">${project.status}</span>
                </div>

                <div class="project-metrics-row">
                    <div>
                        <div class="project-metric-label">BUDGET</div>
                        <div class="project-metric-val">${project.formattedBudget}</div>
                    </div>
                    <div>
                        <div class="project-metric-label">DEADLINE</div>
                        <div class="project-metric-val">${project.deadline}</div>
                    </div>
                </div>

                <div class="project-progress-wrapper">
                    <div class="project-progress-label-row">
                        <span>Progress</span>
                        <span style="font-weight: 700; color: #1D4ED8;">${project.progressPercent}%</span>
                    </div>
                    <div class="project-progress-bar-bg">
                        <div class="project-progress-fill" style="width: ${project.progressPercent}%; ${project.statusClass === 'delayed' ? 'background: #0D9488;' : ''}"></div>
                    </div>
                </div>
            </div>

            <div class="project-card-footer">
                <div class="avatar-group">
                    ${project.teamAvatars.map(av => `<div class="avatar-circle">${av}</div>`).join('')}
                    <div class="avatar-circle more-count">+${project.totalTeamCount - project.teamAvatars.length}</div>
                </div>
                <div class="project-card-actions">
                    <button class="action-icon-btn" title="Edit Project" onclick="alert('Editing ${project.title}')">✏️</button>
                    <button class="action-icon-btn" title="Delete Project" onclick="handleDeleteProject('${project.id}')">🗑️</button>
                    <button class="btn-open-project" onclick="alert('Opening ${project.title} workspace...')">Open Project</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Client-Side Realtime Search Filter
function filterProjects() {
    const searchInput = document.getElementById('projectSearch');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const filtered = CIH_DATASET.projects.filter(p => 
        p.title.toLowerCase().includes(query) || p.city.toLowerCase().includes(query)
    );
    renderProjectGrid(filtered);
}

// Add New Project Dynamically to State
function handleCreateNewProject() {
    const nameInput = document.getElementById('newProjName');
    const cityInput = document.getElementById('newProjCity');
    const budgetInput = document.getElementById('newProjBudget');

    if (!nameInput || !nameInput.value) {
        alert('Please enter a project name.');
        return;
    }

    const newProject = {
        id: `proj-${Date.now()}`,
        title: nameInput.value,
        city: cityInput.value || 'India',
        icon: '🏗️',
        status: 'On Track',
        statusClass: 'on-track',
        budgetCrores: parseFloat(budgetInput.value) || 1000,
        formattedBudget: `₹${parseFloat(budgetInput.value || 1000).toLocaleString()} Cr`,
        deadline: 'Dec 31, 2026',
        progressPercent: 10,
        teamAvatars: ['AS'],
        totalTeamCount: 4
    };

    CIH_API.addProject(newProject).then(() => {
        renderProjectGrid(CIH_DATASET.projects);
        closeModal('newProjectModal');
        nameInput.value = '';
        if (cityInput) cityInput.value = '';
        if (budgetInput) budgetInput.value = '';
        alert(`Project "${newProject.title}" successfully added to your portfolio!`);
    });
}

// Delete Project Dynamically from State
function handleDeleteProject(projectId) {
    if (confirm('Are you sure you want to delete this infrastructure project?')) {
        CIH_API.deleteProject(projectId).then(() => {
            renderProjectGrid(CIH_DATASET.projects);
        });
    }
}

// --- INTERACTIVE MODAL CONTROLLERS ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close Modal on Overlay Click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// AI Cost Estimation Forecast Recalculator
function recalculateCost() {
    const budgetInput = document.getElementById('budgetInput');
    const volatilityInput = document.getElementById('volatilityInput');
    const overrunOutput = document.getElementById('overrunOutput');

    if (budgetInput && volatilityInput && overrunOutput) {
        const budget = parseFloat(budgetInput.value) || 0;
        const volatility = parseFloat(volatilityInput.value) || 0;
        const overrun = budget * (volatility * 0.0075);

        overrunOutput.innerText = `+$${overrun.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
}
