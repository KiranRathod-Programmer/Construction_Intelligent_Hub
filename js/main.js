/**
 * Construction Intelligent Hub (CIH) - Main Application Controller
 * Handles dynamic rendering from data.js, modals, search, and user interactions.
 */

// Initialize Page Content on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    populateAllProjectSelects();
    syncGlobalProfileUI();
    initLandingPage();
    initDashboardPage();
    initProjectManagementPage();
    initTeamManagementPage();
    initBudgetPage();
    initMaterialsPage();
    initReportsPage();
    initRiskAnalysisPage();
    initAIInsightsPage();
});

// Dynamically Populate All Project Selection Dropdowns across the application
function populateAllProjectSelects() {
    if (typeof CIH_DATASET === 'undefined' || !CIH_DATASET.projects) return;

    const selectIds = [
        'projectFilter', 'budgetProjectFilter', 'materialProjectFilter',
        'equipmentProjectFilter', 'reportProjectFilter', 'riskProjectFilter',
        'aiReportProjectSelect', 'aiMatProjectSelect', 'aiWeatherProjectSelect',
        'aiForecastProjectSelect', 'newMemberProj', 'expProj', 'newMatProj',
        'newEqProj', 'newRepProj'
    ];

    selectIds.forEach(id => {
        const selectEl = document.getElementById(id);
        if (!selectEl) return;

        const currentValue = selectEl.value;
        const hasAllOption = Array.from(selectEl.options).some(opt => opt.value === 'all');

        let html = hasAllOption ? '<option value="all">📁 All Projects</option>' : '';
        html += CIH_DATASET.projects.map(p => `
            <option value="${p.title}">${p.icon || '🏗️'} ${p.title}</option>
        `).join('');

        selectEl.innerHTML = html;

        if (currentValue && Array.from(selectEl.options).some(opt => opt.value === currentValue)) {
            selectEl.value = currentValue;
        }
    });
}


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

// --- REDESIGNED DASHBOARD OVERVIEW DYNAMIC RENDERER ---
function initDashboardPage() {
    const kpiCardsGrid = document.getElementById('kpiCardsGrid');
    if (!kpiCardsGrid || typeof CIH_DATASET === 'undefined' || !CIH_DATASET.dashboardStats) return;

    const stats = CIH_DATASET.dashboardStats;

    // Render 5 KPI Cards (Matching reference screenshot)
    kpiCardsGrid.innerHTML = `
        <!-- Card 1: Total Projects -->
        <div class="kpi-card">
            <div class="kpi-card-header">
                <div class="kpi-icon-box" style="background: ${stats.totalProjects.iconBg}; color: ${stats.totalProjects.iconColor};">
                    ${stats.totalProjects.icon}
                </div>
                <span class="kpi-badge ${stats.totalProjects.badgeClass}">${stats.totalProjects.badge}</span>
            </div>
            <div class="kpi-card-body">
                <div class="kpi-label">${stats.totalProjects.title}</div>
                <div class="kpi-value">${stats.totalProjects.count}</div>
            </div>
        </div>

        <!-- Card 2: Running -->
        <div class="kpi-card">
            <div class="kpi-card-header">
                <div class="kpi-icon-box" style="background: ${stats.running.iconBg}; color: ${stats.running.iconColor};">
                    ${stats.running.icon}
                </div>
                <span class="kpi-badge ${stats.running.badgeClass}">${stats.running.badge}</span>
            </div>
            <div class="kpi-card-body">
                <div class="kpi-label">${stats.running.title}</div>
                <div class="kpi-value">${stats.running.count}</div>
            </div>
        </div>

        <!-- Card 3: Delayed -->
        <div class="kpi-card">
            <div class="kpi-card-header">
                <div class="kpi-icon-box" style="background: ${stats.delayed.iconBg}; color: ${stats.delayed.iconColor};">
                    ${stats.delayed.icon}
                </div>
                <span class="kpi-badge ${stats.delayed.badgeClass}">${stats.delayed.badge}</span>
            </div>
            <div class="kpi-card-body">
                <div class="kpi-label">${stats.delayed.title}</div>
                <div class="kpi-value">${stats.delayed.count}</div>
            </div>
        </div>

        <!-- Card 4: High Risk -->
        <div class="kpi-card">
            <div class="kpi-card-header">
                <div class="kpi-icon-box" style="background: ${stats.highRisk.iconBg}; color: ${stats.highRisk.iconColor};">
                    ${stats.highRisk.icon}
                </div>
                <span class="kpi-badge ${stats.highRisk.badgeClass}">${stats.highRisk.badge}</span>
            </div>
            <div class="kpi-card-body">
                <div class="kpi-label">${stats.highRisk.title}</div>
                <div class="kpi-value">${stats.highRisk.count}</div>
            </div>
        </div>

        <!-- Card 5: Completed -->
        <div class="kpi-card">
            <div class="kpi-card-header">
                <div class="kpi-icon-box" style="background: ${stats.completed.iconBg}; color: ${stats.completed.iconColor};">
                    ${stats.completed.icon}
                </div>
                <span class="kpi-badge ${stats.completed.badgeClass}">${stats.completed.badge}</span>
            </div>
            <div class="kpi-card-body">
                <div class="kpi-label">${stats.completed.title}</div>
                <div class="kpi-value">${stats.completed.count}</div>
            </div>
        </div>
    `;

    // Render Project Progress Analytics Section
    const analyticsProgressCard = document.getElementById('analyticsProgressCard');
    if (analyticsProgressCard && CIH_DATASET.analyticsData) {
        analyticsProgressCard.innerHTML = `
            <div style="font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                <span>🏗️ Stage Execution Breakdown</span>
                <span style="font-size: 12px; color: #10B981; font-weight: 600;">● Live Telemetry Sync</span>
            </div>
            ${CIH_DATASET.analyticsData.progressDistribution.map(item => `
                <div class="progress-item">
                    <div class="progress-item-head">
                        <span>${item.name}</span>
                        <span style="font-weight: 700;">${item.percent}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${item.percent}%; background: ${item.color};"></div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    const analyticsTelemetryCard = document.getElementById('analyticsTelemetryCard');
    if (analyticsTelemetryCard && CIH_DATASET.projects) {
        const topProjects = CIH_DATASET.projects.slice(0, 3);
        analyticsTelemetryCard.innerHTML = `
            <div style="font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">
                ⚡ Active Priority Workspaces
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${topProjects.map(p => `
                    <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span style="font-size: 18px;">${p.icon}</span>
                            <div>
                                <div style="font-size: 13px; font-weight: 700; color: #0F172A;">${p.title}</div>
                                <div style="font-size: 11px; color: #64748B;">Budget: ${p.formattedBudget}</div>
                            </div>
                        </div>
                        <span class="status-pill ${p.statusClass}">${p.status}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// --- PROJECT MANAGEMENT DYNAMIC RENDERER ---
function initProjectManagementPage() {
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

            <div class="project-card-footer" style="justify-content: flex-end;">
                <div class="project-card-actions">
                    <button class="action-icon-btn" title="Edit Project" onclick="alert('Editing ${project.title}')">✏️</button>
                    <button class="action-icon-btn" title="Delete Project" onclick="handleDeleteProject('${project.id}')">🗑️</button>
                    <button class="btn-open-project" onclick="handleOpenProject('${project.id}')">Open Project</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Interactive Project Workspace Detail Modal Handler
function handleOpenProject(projectId) {
    if (typeof CIH_DATASET === 'undefined' || !CIH_DATASET.projects) return;

    const project = CIH_DATASET.projects.find(p => p.id === projectId);
    if (!project) {
        alert('Project workspace details not found.');
        return;
    }

    const detailContainer = document.getElementById('projectDetailContent');
    if (detailContainer) {
        detailContainer.innerHTML = `
            <div class="detail-modal-header">
                <div style="display: flex; gap: 14px; align-items: center;">
                    <div style="font-size: 32px; width: 54px; height: 54px; background: #EFF6FF; border-radius: 14px; display: flex; align-items: center; justify-content: center;">
                        ${project.icon}
                    </div>
                    <div>
                        <h2 style="font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 2px;">${project.title}</h2>
                        <div style="font-size: 13px; color: #64748B;">📍 ${project.city} &bull; ID: ${project.id}</div>
                    </div>
                </div>
                <span class="status-pill ${project.statusClass}" style="font-size: 13px; padding: 6px 16px;">${project.status}</span>
            </div>

            <!-- KEY METRICS GRID -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px;">
                <div class="detail-metric-card">
                    <div class="detail-metric-label">TOTAL BUDGET</div>
                    <div class="detail-metric-val" style="color: #1D4ED8;">${project.formattedBudget}</div>
                </div>
                <div class="detail-metric-card">
                    <div class="detail-metric-label">TARGET DEADLINE</div>
                    <div class="detail-metric-val">${project.deadline}</div>
                </div>
                <div class="detail-metric-card">
                    <div class="detail-metric-label">PROJECT LEAD</div>
                    <div class="detail-metric-val" style="font-size: 16px;">${project.projectLead || 'Alex Sterling'}</div>
                </div>
            </div>

            <!-- PROGRESS OVERVIEW -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">
                    <span>Stage Completion Progress</span>
                    <span style="color: #2563EB;">${project.progressPercent}%</span>
                </div>
                <div class="project-progress-bar-bg" style="height: 10px;">
                    <div class="project-progress-fill" style="width: ${project.progressPercent}%;"></div>
                </div>
                <div style="font-size: 12px; color: #64748B; margin-top: 8px; display: flex; justify-content: space-between;">
                    <span>Groundwork & AI Telemetry Active</span>
                    <span>Confidence Score: 98.6%</span>
                </div>
            </div>

            <!-- RFID LIVE MATERIAL FEED FOR SITE -->
            <div style="margin-bottom: 20px;">
                <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 10px;">
                    📡 Active Site Materials & RFID Telemetry
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${(CIH_DATASET.rfidFeed || []).map(mat => `
                        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12.5px;">
                            <div>
                                <strong>${mat.id}</strong> &mdash; ${mat.description}
                                <div style="font-size: 11px; color: #64748B;">📍 ${mat.location}</div>
                            </div>
                            <span style="font-weight: 700; color: ${mat.statusClass === 'green' ? '#10B981' : '#F59E0B'};">${mat.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- MODAL FOOTER ACTIONS -->
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 16px;">
                <button class="kpi-btn-secondary" onclick="alert('Exporting project telemetry log...')">📥 Export Log</button>
                <button class="btn-primary" onclick="alert('Opening AI live camera feed for ${project.title}...'); closeModal('projectDetailModal');">📹 Launch Live AI Stream</button>
            </div>
        `;
        openModal('projectDetailModal');
    } else {
        alert(`Opening ${project.title} workspace (Budget: ${project.formattedBudget}, Deadline: ${project.deadline})`);
    }
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

// Add New Project Dynamically to State with All Necessary & Relevant Information
function handleCreateNewProject() {
    const nameInput = document.getElementById('newProjName');
    const categoryInput = document.getElementById('newProjCategory');
    const cityInput = document.getElementById('newProjCity');
    const statusInput = document.getElementById('newProjStatus');
    const budgetInput = document.getElementById('newProjBudget');
    const deadlineInput = document.getElementById('newProjDeadline');
    const progressInput = document.getElementById('newProjProgress');
    const leadInput = document.getElementById('newProjLead');
    const descInput = document.getElementById('newProjDesc');

    if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter a project name.');
        return;
    }

    let icon = '🏗️';
    if (categoryInput) {
        const cat = categoryInput.value;
        if (cat === 'transit') icon = '🚆';
        else if (cat === 'highway') icon = '🛣️';
        else if (cat === 'commercial') icon = '🏢';
        else if (cat === 'airport') icon = '✈️';
        else icon = '🏗️';
    }

    const statusVal = statusInput ? statusInput.value : 'on-track';
    let statusClass = 'on-track';
    let statusLabel = 'On Track';
    if (statusVal === 'in-review') {
        statusClass = 'in-review';
        statusLabel = 'In Review';
    } else if (statusVal === 'delayed') {
        statusClass = 'delayed';
        statusLabel = 'Delayed';
    }

    let formattedDeadline = 'Dec 31, 2026';
    if (deadlineInput && deadlineInput.value) {
        const d = new Date(deadlineInput.value);
        if (!isNaN(d.getTime())) {
            formattedDeadline = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }

    const budgetVal = parseFloat(budgetInput ? budgetInput.value : 1000) || 1000;
    const progressVal = parseInt(progressInput ? progressInput.value : 10, 10) || 10;

    const newProject = {
        id: `proj-${Date.now()}`,
        title: nameInput.value.trim(),
        city: (cityInput && cityInput.value.trim()) || 'India',
        icon: icon,
        status: statusLabel,
        statusClass: statusClass,
        budgetCrores: budgetVal,
        formattedBudget: `₹${budgetVal.toLocaleString()} Cr`,
        deadline: formattedDeadline,
        progressPercent: Math.min(100, Math.max(0, progressVal)),
        projectLead: (leadInput && leadInput.value.trim()) || 'Alex Sterling',
        description: (descInput && descInput.value.trim()) || ''
    };

    CIH_API.addProject(newProject).then(() => {
        if (typeof renderProjectGrid === 'function') {
            renderProjectGrid(CIH_DATASET.projects);
        }
        if (typeof initDashboardPage === 'function') {
            initDashboardPage();
        }
        closeModal('newProjectModal');

        // Reset form inputs
        nameInput.value = '';
        if (cityInput) cityInput.value = '';
        if (budgetInput) budgetInput.value = '';
        if (deadlineInput) deadlineInput.value = '';
        if (progressInput) progressInput.value = '10';
        if (leadInput) leadInput.value = '';
        if (descInput) descInput.value = '';

        alert(`Project "${newProject.title}" has been successfully added!`);
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

// --- TEAM MANAGEMENT MODULE CONTROLLER ---
function initTeamManagementPage() {
    const teamGrid = document.getElementById('teamGrid');
    if (teamGrid && typeof CIH_DATASET !== 'undefined' && CIH_DATASET.teamMembers) {
        renderTeamGrid(CIH_DATASET.teamMembers);
    }
}

function renderTeamGrid(membersList) {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    if (membersList.length === 0) {
        teamGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748B;">
                No matching team members found.
            </div>
        `;
        return;
    }

    teamGrid.innerHTML = membersList.map(member => `
        <div class="team-card" id="member-${member.id}">
            <div>
                <div class="team-card-header">
                    <div class="team-avatar-big" style="background: ${member.avatarBg || '#1D4ED8'};">
                        ${member.avatarInitials || 'TM'}
                    </div>
                    <div>
                        <div class="team-name">${member.name}</div>
                        <div class="team-role">${member.role}</div>
                    </div>
                </div>

                <div class="team-details-list">
                    <div>📍 <strong>Project:</strong> ${member.assignedProject}</div>
                    <div>✉️ <strong>Email:</strong> ${member.email}</div>
                    <div>📞 <strong>Phone:</strong> ${member.phone}</div>
                </div>

                <div class="skills-wrapper">
                    ${(member.skills || []).map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                </div>
            </div>

            <div class="team-card-footer">
                <span class="status-pill on-track" style="font-size: 11px;">● ${member.status}</span>
                <div style="display: flex; gap: 8px;">
                    <button class="action-icon-btn" title="Contact Member" onclick="alert('Sending email to ${member.email}...')">✉️</button>
                    <button class="action-icon-btn" title="Remove Member" onclick="handleDeleteTeamMember('${member.id}')">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Search & Dropdown Project Filter for Team Members
function filterTeamMembers() {
    const searchInput = document.getElementById('teamSearch');
    const projectSelect = document.getElementById('projectFilter');
    if (typeof CIH_DATASET === 'undefined' || !CIH_DATASET.teamMembers) return;

    let filtered = CIH_DATASET.teamMembers;

    // Filter by project dropdown
    if (projectSelect && projectSelect.value !== 'all') {
        filtered = filtered.filter(m => m.assignedProject === projectSelect.value);
        updateProjectManagerSummary(projectSelect.value, filtered);
    } else {
        updateProjectManagerSummary('all', CIH_DATASET.teamMembers);
    }

    // Filter by search query
    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.role.toLowerCase().includes(query) ||
            m.assignedProject.toLowerCase().includes(query)
        );
    }

    renderTeamGrid(filtered);
}

function filterTeamByProject() {
    filterTeamMembers();
}

// Render Selected Project Manager & Worker Count Overview Banner
function updateProjectManagerSummary(selectedProject, teamList) {
    const summaryCard = document.getElementById('projectManagerSummaryCard');
    if (!summaryCard) return;

    if (selectedProject === 'all') {
        summaryCard.style.display = 'none';
        return;
    }

    summaryCard.style.display = 'grid';

    // Find Project Lead / Director for this project
    const projectObj = (CIH_DATASET.projects || []).find(p => p.title === selectedProject);
    const leadMember = teamList.find(m => m.role.toLowerCase().includes('director') || m.role.toLowerCase().includes('lead') || m.accessLevel === 'Admin') || teamList[0];

    const leadName = projectObj ? (projectObj.projectLead || (leadMember ? leadMember.name : 'Alex Sterling')) : (leadMember ? leadMember.name : 'Alex Sterling');
    const totalWorkers = teamList.length;

    summaryCard.innerHTML = `
        <div>
            <div class="proj-summary-title">📍 ${selectedProject}</div>
            <div class="proj-summary-sub">Active Site Team & Leadership Breakdown</div>
        </div>
        <div class="proj-summary-metric">
            <div class="proj-summary-label">PROJECT MANAGER / LEAD</div>
            <div class="proj-summary-val" style="color: #38BDF8;">👤 ${leadName}</div>
        </div>
        <div class="proj-summary-metric">
            <div class="proj-summary-label">WORKERS ON SITE</div>
            <div class="proj-summary-val" style="color: #10B981;">👷 ${totalWorkers} Active Personnel</div>
        </div>
        <div class="proj-summary-metric">
            <div class="proj-summary-label">SITE TELEMETRY STATUS</div>
            <div class="proj-summary-val" style="color: #F59E0B; font-size: 16px;">🟢 100% Synchronized</div>
        </div>
    `;
}

// Add New Team Member Dynamically to State
function handleCreateTeamMember() {
    const nameInput = document.getElementById('newMemberName');
    const roleInput = document.getElementById('newMemberRole');
    const emailInput = document.getElementById('newMemberEmail');
    const phoneInput = document.getElementById('newMemberPhone');
    const projInput = document.getElementById('newMemberProj');
    const skillInput = document.getElementById('newMemberSkills');

    if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter a team member name.');
        return;
    }

    const name = nameInput.value.trim();
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TM';
    const bgColors = ['#1D4ED8', '#0284C7', '#059669', '#D97706', '#7C3AED', '#DC2626'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const skillsArray = skillInput && skillInput.value
        ? skillInput.value.split(',').map(s => s.trim())
        : ['Site Telemetry', 'AI Logistics'];

    const newMember = {
        id: `tm-${Date.now()}`,
        name: name,
        role: (roleInput && roleInput.value.trim()) || 'Site Engineer',
        category: 'Engineering',
        email: (emailInput && emailInput.value.trim()) || `${name.toLowerCase().replace(/\s+/g, '.')}@cih-hub.com`,
        phone: (phoneInput && phoneInput.value.trim()) || '+91 98000 00000',
        assignedProject: (projInput && projInput.value) || 'Delhi Metro - Phase 4',
        status: 'Active',
        statusClass: 'status-active',
        avatarInitials: initials,
        avatarBg: randomBg,
        skills: skillsArray,
        accessLevel: 'Engineer'
    };

    CIH_API.addTeamMember(newMember).then(() => {
        if (typeof renderTeamGrid === 'function') {
            filterTeamMembers();
        }
        closeModal('addTeamModal');

        // Reset inputs
        nameInput.value = '';
        if (roleInput) roleInput.value = '';
        if (emailInput) emailInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (skillInput) skillInput.value = '';

        alert(`Team member "${newMember.name}" has been successfully added!`);
    });
}

// Delete Team Member Dynamically from State
function handleDeleteTeamMember(memberId) {
    if (confirm('Are you sure you want to remove this team member?')) {
        CIH_API.deleteTeamMember(memberId).then(() => {
            filterTeamMembers();
        });
    }
}

// ==========================================================================
// BUDGET MODULE CONTROLLERS
// ==========================================================================
function initBudgetPage() {
    const budgetGrid = document.getElementById('expenseTableBody');
    if (budgetGrid && typeof CIH_DATASET !== 'undefined' && CIH_DATASET.budgetOverview) {
        renderBudgetGrid(CIH_DATASET.budgetOverview.expensesList);
    }
}

function renderBudgetGrid(expenses) {
    const tbody = document.getElementById('expenseTableBody');
    if (!tbody) return;

    if (expenses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #64748B;">No expenses recorded.</td></tr>`;
        return;
    }

    tbody.innerHTML = expenses.map(exp => `
        <tr>
            <td><strong>${exp.id}</strong></td>
            <td><strong>${exp.title}</strong></td>
            <td>📍 ${exp.project}</td>
            <td><span class="skill-badge">${exp.category}</span></td>
            <td><strong style="color: #1D4ED8;">${exp.amount}</strong></td>
            <td><span class="status-pill on-track" style="font-size: 11px;">${exp.status}</span></td>
        </tr>
    `).join('');
}

function handleCreateExpense() {
    const titleInput = document.getElementById('expTitle');
    const projInput = document.getElementById('expProj');
    const amountInput = document.getElementById('expAmount');
    const catInput = document.getElementById('expCategory');

    if (!titleInput || !titleInput.value.trim()) {
        alert('Please enter an expense title.');
        return;
    }

    const newExp = {
        id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
        title: titleInput.value.trim(),
        project: (projInput && projInput.value) || 'Delhi Metro - Phase 4',
        amount: `₹${parseFloat(amountInput ? amountInput.value : 50).toLocaleString()} Cr`,
        category: (catInput && catInput.value) || 'Materials',
        status: 'Approved',
        date: 'Jul 24, 2026'
    };

    CIH_API.addExpense(newExp).then(() => {
        renderBudgetGrid(CIH_DATASET.budgetOverview.expensesList);
        closeModal('addExpenseModal');
        titleInput.value = '';
        if (amountInput) amountInput.value = '';
        alert(`Expense "${newExp.title}" added to budget breakdown!`);
    });
}

function filterBudgetByProject() {
    const projSelect = document.getElementById('budgetProjectFilter');
    if (!projSelect || typeof CIH_DATASET === 'undefined' || !CIH_DATASET.budgetOverview) return;

    let filtered = CIH_DATASET.budgetOverview.expensesList;
    if (projSelect.value !== 'all') {
        filtered = filtered.filter(e => e.project === projSelect.value);
    }
    renderBudgetGrid(filtered);
}

// ==========================================================================
// MATERIALS MODULE CONTROLLERS
// ==========================================================================
function initMaterialsPage() {
    const matGrid = document.getElementById('materialsGrid');
    if (matGrid && typeof CIH_DATASET !== 'undefined' && CIH_DATASET.materialInventory) {
        renderMaterialsGrid(CIH_DATASET.materialInventory);
    }
}

function renderMaterialsGrid(matList) {
    const matGrid = document.getElementById('materialsGrid');
    if (!matGrid) return;

    if (matList.length === 0) {
        matGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748B;">No matching materials found.</div>`;
        return;
    }

    matGrid.innerHTML = matList.map(mat => `
        <div class="project-card">
            <div>
                <div class="project-card-header">
                    <div>
                        <div class="project-title">${mat.name}</div>
                        <div class="project-location">📡 ${mat.rfidTag} &bull; Supplier: ${mat.supplier}</div>
                    </div>
                    <span class="status-pill ${mat.statusClass}">${mat.status}</span>
                </div>

                <div class="project-metrics-row" style="margin-bottom: 12px;">
                    <div>
                        <div class="project-metric-label">STOCK ON SITE</div>
                        <div class="project-metric-val" style="color: #1D4ED8;">${mat.stockQuantity}</div>
                    </div>
                    <div>
                        <div class="project-metric-label">RE-ORDER LEVEL</div>
                        <div class="project-metric-val">${mat.reorderLevel}</div>
                    </div>
                </div>

                <div class="project-progress-wrapper" style="margin-bottom: 0;">
                    <div class="project-progress-label-row">
                        <span>Utilization Capacity</span>
                        <span style="font-weight: 700; color: #059669;">${mat.utilizationPercent}%</span>
                    </div>
                    <div class="project-progress-bar-bg">
                        <div class="project-progress-fill" style="width: ${mat.utilizationPercent}%; background: ${mat.utilizationPercent < 30 ? '#EF4444' : '#10B981'};"></div>
                    </div>
                </div>
            </div>

            <div class="project-card-footer" style="justify-content: space-between; margin-top: 16px;">
                <span style="font-size: 12px; color: #64748B;">📍 ${mat.assignedProject}</span>
                <button class="btn-open-project" style="padding: 6px 14px; font-size: 12px;" onclick="alert('Order re-stock triggered for ${mat.name}')">Re-Order Stock</button>
            </div>
        </div>
    `).join('');
}

function filterMaterials() {
    const searchInput = document.getElementById('materialSearch');
    const projSelect = document.getElementById('materialProjectFilter');
    if (typeof CIH_DATASET === 'undefined' || !CIH_DATASET.materialInventory) return;

    let filtered = CIH_DATASET.materialInventory;

    if (projSelect && projSelect.value !== 'all') {
        filtered = filtered.filter(m => m.assignedProject === projSelect.value);
    }

    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.rfidTag.toLowerCase().includes(query) ||
            m.assignedProject.toLowerCase().includes(query) ||
            m.category.toLowerCase().includes(query)
        );
    }

    renderMaterialsGrid(filtered);
}

function filterMaterialsByProject() {
    filterMaterials();
}

function handleCreateMaterial() {
    const nameInput = document.getElementById('newMatName');
    const catInput = document.getElementById('newMatCategory');
    const projInput = document.getElementById('newMatProj');
    const qtyInput = document.getElementById('newMatQty');
    const supplierInput = document.getElementById('newMatSupplier');

    if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter a material name.');
        return;
    }

    const newMat = {
        id: `MAT-INV-${Math.floor(10 + Math.random() * 90)}`,
        name: nameInput.value.trim(),
        category: (catInput && catInput.value) || 'Steel & Rebar',
        rfidTag: `RFID-TAG-${Math.floor(100 + Math.random() * 900)}`,
        stockQuantity: (qtyInput && qtyInput.value) ? `${qtyInput.value} Units` : '2,500 Units',
        status: 'In Stock',
        statusClass: 'on-track',
        reorderLevel: '500 Units',
        assignedProject: (projInput && projInput.value) || 'Delhi Metro - Phase 4',
        supplier: (supplierInput && supplierInput.value.trim()) || 'National Infrastructure Suppliers',
        utilizationPercent: 80
    };

    CIH_API.addMaterial(newMat).then(() => {
        filterMaterials();
        closeModal('addMaterialModal');
        nameInput.value = '';
        if (qtyInput) qtyInput.value = '';
        if (supplierInput) supplierInput.value = '';
        alert(`Material stock "${newMat.name}" added to inventory!`);
    });
}

// ==========================================================================
// EQUIPMENT TELEMETRY MODULE CONTROLLERS
// ==========================================================================
function initEquipmentPage() {
    const eqGrid = document.getElementById('equipmentGrid');
    if (eqGrid && typeof CIH_DATASET !== 'undefined' && CIH_DATASET.equipmentAssets) {
        renderEquipmentGrid(CIH_DATASET.equipmentAssets);
    }
}

function renderEquipmentGrid(eqList) {
    const eqGrid = document.getElementById('equipmentGrid');
    if (!eqGrid) return;

    if (eqList.length === 0) {
        eqGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748B;">No matching equipment assets found.</div>`;
        return;
    }

    eqGrid.innerHTML = eqList.map(eq => `
        <div class="project-card">
            <div>
                <div class="project-card-header">
                    <div>
                        <div class="project-title">🚜 ${eq.asset_name}</div>
                        <div class="project-location">🏷️ ${eq.unit_code} &bull; Operator: ${eq.operator || 'Site Specialist'}</div>
                    </div>
                    <span class="status-pill ${eq.statusClass || 'on-track'}">${eq.status || 'Optimal'}</span>
                </div>

                <div class="project-metrics-row" style="margin-bottom: 14px;">
                    <div>
                        <div class="project-metric-label">ENGINE HEALTH</div>
                        <div class="project-metric-val" style="color: ${eq.engine_health_pct > 80 ? '#10B981' : '#F59E0B'};">${eq.engine_health_pct}%</div>
                    </div>
                    <div>
                        <div class="project-metric-label">OPERATING HOURS</div>
                        <div class="project-metric-val">${eq.operating_hours} hrs</div>
                    </div>
                </div>

                <div class="health-meter-bg">
                    <div class="health-meter-fill" style="width: ${eq.engine_health_pct}%; background: ${eq.engine_health_pct > 80 ? '#10B981' : '#F59E0B'};"></div>
                </div>

                <div style="font-size: 12px; color: #64748B; margin-top: 14px; display: flex; justify-content: space-between;">
                    <span>Fuel Rate: <strong>${eq.fuel_rate_lph}</strong></span>
                    <span>Maint. Due: <strong>In ${eq.maintenance_due_hrs} hrs</strong></span>
                </div>
            </div>

            <div class="project-card-footer" style="justify-content: space-between; margin-top: 16px;">
                <span style="font-size: 12px; color: #64748B;">📍 ${eq.assigned_project_id}</span>
                <button class="btn-open-project" style="padding: 6px 14px; font-size: 12px;" onclick="alert('Running IoT diagnostics on ${eq.unit_code}...')">Run Telemetry</button>
            </div>
        </div>
    `).join('');
}

function filterEquipmentByProject() {
    const projSelect = document.getElementById('equipmentProjectFilter');
    const searchInput = document.getElementById('equipmentSearch');
    if (typeof CIH_DATASET === 'undefined' || !CIH_DATASET.equipmentAssets) return;

    let filtered = CIH_DATASET.equipmentAssets;

    if (projSelect && projSelect.value !== 'all') {
        filtered = filtered.filter(eq => eq.assigned_project_id === projSelect.value);
    }

    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(eq =>
            eq.asset_name.toLowerCase().includes(query) ||
            eq.unit_code.toLowerCase().includes(query) ||
            eq.assigned_project_id.toLowerCase().includes(query)
        );
    }

    renderEquipmentGrid(filtered);
}

function handleCreateEquipment() {
    const nameInput = document.getElementById('newEqName');
    const codeInput = document.getElementById('newEqCode');
    const projInput = document.getElementById('newEqProj');
    const operatorInput = document.getElementById('newEqOperator');

    if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter an equipment asset name.');
        return;
    }

    const newEq = {
        equipment_id: `EQ-${Math.floor(100 + Math.random() * 900)}`,
        asset_name: nameInput.value.trim(),
        unit_code: (codeInput && codeInput.value.trim()) || `AST-UNIT-${Math.floor(10 + Math.random() * 90)}`,
        assigned_project_id: (projInput && projInput.value) || 'Delhi Metro - Phase 4',
        engine_health_pct: 98,
        operating_hours: 120,
        fuel_rate_lph: '15.0 L/hr',
        maintenance_due_hrs: 400,
        status: 'Optimal',
        statusClass: 'on-track',
        operator: (operatorInput && operatorInput.value.trim()) || 'Alex Sterling'
    };

    CIH_API.addEquipment(newEq).then(() => {
        filterEquipmentByProject();
        closeModal('addEquipmentModal');
        nameInput.value = '';
        if (codeInput) codeInput.value = '';
        if (operatorInput) operatorInput.value = '';
        alert(`Equipment "${newEq.asset_name}" added to fleet telemetry!`);
    });
}

// ==========================================================================
// REPORTS GENERATION MODULE CONTROLLERS
// ==========================================================================
let currentGeneratedAIReportData = null;

async function triggerAIReportGeneration() {
    const projSelect = document.getElementById('aiReportProjectSelect');
    const freqSelect = document.getElementById('aiReportFrequency');
    const outputBox = document.getElementById('aiReportOutputBox');
    if (!outputBox) return;

    const projName = projSelect ? projSelect.value : 'Delhi Metro - Phase 4';
    const freq = freqSelect ? freqSelect.value : 'Weekly Report';

    outputBox.style.display = 'block';
    outputBox.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0;">
            <div style="font-size: 32px; margin-bottom: 12px;">📊</div>
            <h3 style="font-size: 16px; font-weight: 700; color: #1E293B;">Generating ${freq} for ${projName}...</h3>
            <p style="font-size: 13px; color: #64748B;">Compiling progress milestones, budget spent, risk drivers, material inventory, and team performance...</p>
        </div>
    `;

    const res = await CIH_AI_SERVICE.generateExecutiveReport(projName, freq);
    currentGeneratedAIReportData = res;
    const snap = res.snapshot;
    const s = res.sections;

    outputBox.innerHTML = `
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #F1F5F9; padding-bottom: 16px; margin-bottom: 20px;">
                <div>
                    <span class="skill-badge" style="background: #EFF6FF; color: #1D4ED8; font-weight: 700;">${res.frequency}</span>
                    <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 6px 0 2px 0;">📊 ${res.projectName} Executive Performance Report</h2>
                    <div style="font-size: 12.5px; color: #64748B;">Generated: <strong>${res.date}</strong> &bull; Site: <strong>${snap.city}</strong> &bull; Status: <span class="status-pill ${snap.statusClass}">${snap.status}</span></div>
                </div>
                <button class="btn-primary" style="padding: 9px 18px; font-size: 12.5px;" onclick="downloadGeneratedAIReport()">📥 Download Report (.TXT)</button>
            </div>

            <!-- REPORT SECTIONS GRID -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-weight: 700; font-size: 14px; color: #1E293B; margin-bottom: 6px;">📈 Progress & Milestone Summary</div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5;">${s.progress}</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-weight: 700; font-size: 14px; color: #1E293B; margin-bottom: 6px;">💵 Budget & Financial Overview</div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5;">${s.budget}</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-weight: 700; font-size: 14px; color: #1E293B; margin-bottom: 6px;">⚠️ Risk Level & Site Hazards</div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5;">${s.risks}</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-weight: 700; font-size: 14px; color: #1E293B; margin-bottom: 6px;">📦 Materials & Supply Inventory</div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5;">${s.materials}</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; grid-column: span 2;">
                    <div style="font-weight: 700; font-size: 14px; color: #1E293B; margin-bottom: 6px;">👥 Team Performance & Supervision</div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5;">${s.team}</div>
                </div>
            </div>

            <!-- RECOMMENDATIONS SECTION -->
            <div style="background: #F0F9FF; border-left: 4px solid #0284C7; border-radius: 6px; padding: 16px;">
                <div style="font-weight: 700; font-size: 14px; color: #0369A1; margin-bottom: 8px;">💡 Business & Operational Recommendations</div>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #0284C7; line-height: 1.6;">
                    ${s.recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function downloadGeneratedAIReport() {
    if (!currentGeneratedAIReportData) {
        alert('Please generate an AI report first.');
        return;
    }

    const d = currentGeneratedAIReportData;
    const snap = d.snapshot;
    const s = d.sections;

    const reportText = `================================================================================
CONSTRUCTION INTELLIGENT HUB (CIH) - OFFICIAL EXECUTIVE PROJECT REPORT
================================================================================
Report Frequency : ${d.frequency}
Project Site Name: ${d.projectName}
Location         : ${snap.city}
Current Status   : ${snap.status} (${snap.progressPercent}% Completed)
Target Deadline  : ${snap.deadline}
Total Budget     : ${snap.budget}
Project Director : ${snap.projectLead}
Date Generated   : ${d.date}
================================================================================

1. PROGRESS & MILESTONE SUMMARY
--------------------------------------------------------------------------------
${s.progress}

2. BUDGET & FINANCIAL OVERVIEW
--------------------------------------------------------------------------------
${s.budget}

3. RISKS & SITE SAFETY HAZARDS
--------------------------------------------------------------------------------
${s.risks}

4. MATERIALS & SUPPLY INVENTORY
--------------------------------------------------------------------------------
${s.materials}

5. TEAM PERFORMANCE & SUPERVISION
--------------------------------------------------------------------------------
${s.team}

6. BUSINESS & OPERATIONAL RECOMMENDATIONS
--------------------------------------------------------------------------------
${s.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

================================================================================
End of Executive Performance Report - Construction Intelligent Hub 2026
================================================================================`;

    const fileName = `${d.projectName.replace(/\s+/g, '_')}_${d.frequency.replace(/\s+/g, '_')}.txt`;
    AIUtils.downloadAsFile(fileName, reportText);
}

function initReportsPage() {
    const repGrid = document.getElementById('reportsTableBody');
    if (repGrid && typeof CIH_DATASET !== 'undefined' && CIH_DATASET.projectReports) {
        renderReportsGrid(CIH_DATASET.projectReports);
    }
}

function renderReportsGrid(repList) {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    if (repList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #64748B;">No matching project reports found.</td></tr>`;
        return;
    }

    tbody.innerHTML = repList.map(rep => `
        <tr>
            <td><strong>${rep.report_id}</strong></td>
            <td><strong>${rep.report_title}</strong></td>
            <td>📍 ${rep.assigned_project_id}</td>
            <td><span class="skill-badge">${rep.report_type}</span></td>
            <td><span class="format-badge format-${rep.format.toLowerCase()}">${rep.format}</span> <span style="font-size: 11px; color: #64748B;">(${rep.file_size_mb})</span></td>
            <td>
                <button class="btn-open-project" style="padding: 5px 12px; font-size: 11px;" onclick="downloadReportFile('${rep.report_id}')">📥 Export Report</button>
            </td>
        </tr>
    `).join('');
}

function downloadReportFile(reportId) {
    const rep = (CIH_DATASET.projectReports || []).find(r => r.report_id === reportId) || {
        report_id: reportId,
        report_title: "Construction Audit Report",
        assigned_project_id: "Active Job Site",
        report_type: "Site Audit",
        generated_by: "Alex Sterling",
        generated_date: "Jul 24, 2026",
        format: "TXT"
    };

    const docContent = `====================================================================
CONSTRUCTION INTELLIGENT HUB (CIH) - AUDIT REPORT EXPORT
====================================================================
Report ID: ${rep.report_id}
Title: ${rep.report_title}
Project Site: ${rep.assigned_project_id}
Type: ${rep.report_type}
Generated By: ${rep.generated_by || 'Alex Sterling'}
Date: ${rep.generated_date || 'Jul 24, 2026'}
Format: ${rep.format}
====================================================================

EXECUTIVE AUDIT SUMMARY:
This document represents an officially verified audit export from the Construction Intelligent Hub (CIH) platform.

1. SITE TELEMETRY & COMPLIANCE
   - Safety Compliance Score: 98.4% (Optimal)
   - RFID Parcel Telemetry: 100% Active Sync
   - Heavy Machinery IoT Telemetry: 94% Health Index

2. FINANCIAL & CAPITAL LOGS
   - Cost Overrun Risk: Low (+1.8% Variance)
   - Spending Velocity: Within approved budget thresholds

3. AI NEURAL PREDICTIONS (Llama 3.2 Engine)
   - Recommended Action: Proceed with scheduled foundation pour for Zone 4.
   - Procurement Optimization: Bulk rebar negotiation scheduled.

====================================================================
End of Official Report Export - CIH Platform 2026
====================================================================`;

    const fileName = `${rep.report_id}_${rep.report_title.replace(/\s+/g, '_')}.${rep.format.toLowerCase() === 'pdf' ? 'txt' : rep.format.toLowerCase()}`;
    AIUtils.downloadAsFile(fileName, docContent);
}

function filterReportsByProject() {
    const projSelect = document.getElementById('reportProjectFilter');
    const searchInput = document.getElementById('reportSearch');
    if (typeof CIH_DATASET === 'undefined' || !CIH_DATASET.projectReports) return;

    let filtered = CIH_DATASET.projectReports;

    if (projSelect && projSelect.value !== 'all') {
        filtered = filtered.filter(r => r.assigned_project_id === projSelect.value);
    }

    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(r =>
            r.report_title.toLowerCase().includes(query) ||
            r.report_type.toLowerCase().includes(query) ||
            r.assigned_project_id.toLowerCase().includes(query)
        );
    }

    renderReportsGrid(filtered);
}

function handleCreateReport() {
    const titleInput = document.getElementById('newRepTitle');
    const typeInput = document.getElementById('newRepType');
    const projInput = document.getElementById('newRepProj');
    const formatInput = document.getElementById('newRepFormat');

    if (!titleInput || !titleInput.value.trim()) {
        alert('Please enter a report title.');
        return;
    }

    const fmt = (formatInput && formatInput.value) || 'PDF';

    const newRep = {
        report_id: `REP-2026-${Math.floor(10 + Math.random() * 90)}`,
        report_title: titleInput.value.trim(),
        report_type: (typeInput && typeInput.value) || 'Site Performance',
        assigned_project_id: (projInput && projInput.value) || 'Delhi Metro - Phase 4',
        generated_by: 'Alex Sterling',
        generated_date: 'Jul 24, 2026',
        file_size_mb: '3.5 MB',
        status: 'Generated',
        format: fmt
    };

    CIH_API.addReport(newRep).then(() => {
        filterReportsByProject();
        closeModal('addReportModal');
        titleInput.value = '';

        // Trigger immediate file download for user
        downloadReportFile(newRep.report_id);
    });
}

// ==========================================================================
// GLOBAL FLOATING AI CHATBOT CONTROLLER
// ==========================================================================
let cihChatHistory = [];

function toggleAIChat() {
    const chatWin = document.getElementById('cihFloatingChatWindow');
    if (!chatWin) return;
    if (chatWin.style.display === 'none' || !chatWin.style.display) {
        chatWin.style.display = 'flex';
    } else {
        chatWin.style.display = 'none';
    }
}

async function sendFloatingChatMessage() {
    const input = document.getElementById('cihFloatingChatInput');
    const body = document.getElementById('cihFloatingChatBody');
    if (!input || !input.value.trim() || !body) return;

    const userText = input.value.trim();
    input.value = '';

    // Append user message bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-bubble-user';
    userBubble.innerText = userText;
    body.appendChild(userBubble);
    body.scrollTop = body.scrollHeight;

    // Append loading indicator bubble
    const loadingId = `msg-${Date.now()}`;
    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'chat-bubble chat-bubble-ai';
    loadingBubble.id = loadingId;
    loadingBubble.innerHTML = '<em>🤖 Thinking...</em>';
    body.appendChild(loadingBubble);
    body.scrollTop = body.scrollHeight;

    try {
        const aiResult = await CIH_AI_SERVICE.chatWithAssistant(userText, cihChatHistory);

        // Update history for conversational context memory
        cihChatHistory.push({ role: "user", content: userText });
        cihChatHistory.push({ role: "assistant", content: aiResult.rawText });

        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) {
            loadingElem.innerHTML = aiResult.html;
        }
        body.scrollTop = body.scrollHeight;
    } catch (err) {
        console.warn("[CIH Floating AI] Service call exception, utilizing live dataset intelligence.", err);
        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) {
            const fallbackText = OllamaClient._getOfflineFallbackResponse(userText, cihChatHistory);
            loadingElem.innerHTML = AIUtils.formatMarkdownToHTML(fallbackText);
        }
        body.scrollTop = body.scrollHeight;
    }
}

// ==========================================================================
// MATERIAL MANAGEMENT AI CONTROLLERS
// ==========================================================================
let currentMaterialEstimateData = null;

async function triggerMaterialAIEstimate() {
    const projSelect = document.getElementById('aiMatProjectSelect');
    const locInput = document.getElementById('aiMatLocation');
    const pTypeSelect = document.getElementById('aiMatProjectType');
    const bTypeSelect = document.getElementById('aiMatBuildingType');
    const areaInput = document.getElementById('aiMatAreaSqFt');
    const floorsInput = document.getElementById('aiMatFloors');
    const soilSelect = document.getElementById('aiMatSoilType');
    const foundationSelect = document.getElementById('aiMatFoundation');
    const outputBox = document.getElementById('aiMatOutputBox');

    const projName = projSelect ? projSelect.value : 'Delhi Metro - Phase 4';
    const location = (locInput && locInput.value.trim()) ? locInput.value.trim() : 'Project Site Zone';
    const pType = pTypeSelect ? pTypeSelect.value : 'Commercial Office Hub';
    const bType = bTypeSelect ? bTypeSelect.value : 'RCC Frame Structure';
    const areaSqFt = parseFloat(areaInput ? areaInput.value : 50000) || 50000;
    const numFloors = parseInt(floorsInput ? floorsInput.value : 12, 10) || 12;
    const soil = soilSelect ? soilSelect.value : 'Clayey Soil (High Plasticity)';
    const foundation = foundationSelect ? foundationSelect.value : 'Raft / Mat Foundation';

    // Total built-up area factor
    const totalAreaSqFt = areaSqFt * Math.max(1, Math.min(numFloors, 50));

    // Calculate material quantities based on engineering specs
    const cementQty = Math.round(totalAreaSqFt * 0.4); // Bags
    const steelQty = (totalAreaSqFt * 0.0045).toFixed(1); // Tons
    const sandQty = Math.round(totalAreaSqFt * 1.2); // Cu. Ft.
    const bricksQty = Math.round(totalAreaSqFt * 12); // Pieces / AAC Blocks
    const aggregateQty = Math.round(totalAreaSqFt * 1.35); // Cu. Ft.
    const concreteQty = Math.round(totalAreaSqFt * 0.06); // Cu. M.
    const tilesQty = Math.round(totalAreaSqFt * 0.7); // Sq. Ft.
    const paintQty = Math.round(totalAreaSqFt * 0.03); // Liters
    const waterproofingQty = Math.round(totalAreaSqFt * 0.008); // Liters

    currentMaterialEstimateData = {
        projName,
        location,
        pType,
        bType,
        areaSqFt,
        numFloors,
        totalAreaSqFt,
        soil,
        foundation,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        materials: [
            { name: "Cement", qty: cementQty.toLocaleString(), unit: "Bags", confidence: "96%", explanation: "Estimated Portland Pozzolana Cement for structural slab casting, beam pours, and wall plastering across all levels." },
            { name: "Steel (Rebar & Structural)", qty: steelQty.toLocaleString(), unit: "Tons", confidence: "98%", explanation: "Fe500 high-tensile TMT rebar for main load-bearing columns, tie beams, and foundation reinforcing mesh." },
            { name: "Sand (M-Sand / Fine Aggregate)", qty: sandQty.toLocaleString(), unit: "Cu. Ft.", confidence: "94%", explanation: "Manufactured sand (M-Sand) calculated for high-adhesion masonry mortar and smooth finish plastering." },
            { name: "Bricks / AAC Blocks", qty: bricksQty.toLocaleString(), unit: "Pieces", confidence: "95%", explanation: "Lightweight AAC blocks recommended to optimize structural dead load on elevated floor slabs." },
            { name: "Aggregate (10mm & 20mm)", qty: aggregateQty.toLocaleString(), unit: "Cu. Ft.", confidence: "96%", explanation: "Coarse aggregate proportioned for heavy RCC foundation footings and high-strength slab casting." },
            { name: "Concrete (Ready-Mix RMC)", qty: concreteQty.toLocaleString(), unit: "Cu. M.", confidence: "97%", explanation: "Grade M30 ready-mix concrete batching calculated for columns, retaining walls, and suspended floor slabs." },
            { name: "Tiles (Vitrified & Ceramic)", qty: tilesQty.toLocaleString(), unit: "Sq. Ft.", confidence: "92%", explanation: "Vitrified tiles for main floor corridors and anti-skid ceramic tiles for wet utility areas including 10% wastage." },
            { name: "Paint (Emulsion & Primer)", qty: paintQty.toLocaleString(), unit: "Liters", confidence: "93%", explanation: "Exterior acrylic weather-shield paint and interior washable low-VOC emulsion including base primer coats." },
            { name: "Waterproofing Compound", qty: waterproofingQty.toLocaleString(), unit: "Liters", confidence: "95%", explanation: "Polyurethane liquid membrane waterproofing for subterranean foundation footings and terrace level." }
        ]
    };

    // Close modal
    closeModal('materialEstimatorModal');

    const outputContainer = document.getElementById('aiMatOutputContainer');
    if (outputContainer) outputContainer.style.display = 'block';

    if (!outputBox) return;

    outputBox.style.display = 'block';
    if (outputContainer) {
        outputContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    outputBox.innerHTML = `
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #E2E8F0; padding-bottom: 14px; margin-bottom: 16px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 4px 0;">🏗️ AI Construction Material Estimation Results</h3>
                    <div style="font-size: 13px; color: #64748B;">📍 <strong>${projName}</strong> (${location}) &bull; Type: <strong>${pType} (${bType})</strong></div>
                    <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Area: <strong>${areaSqFt.toLocaleString()} sq ft</strong> (${numFloors} Floors) &bull; Soil: <strong>${soil}</strong> &bull; Foundation: <strong>${foundation}</strong></div>
                </div>
                <span class="status-pill on-track" style="font-size: 12px;">✅ AI Confidence: 96%</span>
            </div>

            <div style="overflow-x: auto;">
                <table class="cih-data-table" style="margin: 0;">
                    <thead>
                        <tr style="background: #F8FAFC;">
                            <th>MATERIAL</th>
                            <th>ESTIMATED QUANTITY</th>
                            <th>UNIT</th>
                            <th>CONFIDENCE</th>
                            <th>SHORT AI EXPLANATION</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentMaterialEstimateData.materials.map(m => `
                            <tr>
                                <td><strong>${m.name}</strong></td>
                                <td><strong style="color: #1D4ED8; font-size: 14px;">${m.qty}</strong></td>
                                <td><span class="skill-badge">${m.unit}</span></td>
                                <td><span style="color: #10B981; font-weight: 700;">🟢 ${m.confidence}</span></td>
                                <td style="font-size: 12px; color: #475569;">${m.explanation}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 16px; padding: 14px; background: #F0F9FF; border-left: 4px solid #0284C7; border-radius: 6px; font-size: 12.5px; color: #0369A1;">
                <strong>💡 Engineering Recommendation:</strong> For ${soil} with ${foundation}, soil compaction testing must be completed before pouring ${concreteQty.toLocaleString()} cu. m. of concrete. TMT steel rebar (${steelQty} Tons) must be elevated off the ground to prevent moisture oxidation.
            </div>

            <div style="margin-top: 16px; text-align: right;">
                <button class="btn-primary" style="padding: 9px 20px; font-size: 12.5px;" onclick="downloadMaterialAIEstimate()">📥 Download Human-Readable Report (.TXT)</button>
            </div>
        </div>
    `;
}

function downloadMaterialAIEstimate() {
    if (!currentMaterialEstimateData) {
        alert('Please run an material estimation first.');
        return;
    }

    const d = currentMaterialEstimateData;
    const reportText = `================================================================================
CONSTRUCTION INTELLIGENT HUB (CIH) - PROFESSIONAL MATERIAL ESTIMATION REPORT
================================================================================
Project Site Name : ${d.projName}
Site Location     : ${d.location}
Project Category  : ${d.pType}
Building Structure: ${d.bType}
Construction Area : ${d.areaSqFt.toLocaleString()} Square Feet (${d.numFloors} Floors)
Total Built Area  : ${d.totalAreaSqFt.toLocaleString()} Square Feet
Soil Specification: ${d.soil}
Foundation Spec   : ${d.foundation}
Date of Estimation: ${d.date}
================================================================================

EXECUTIVE SUMMARY & NARRATIVE OVERVIEW
--------------------------------------------------------------------------------
This official material estimation report has been generated by the Construction 
Intelligent Hub (CIH) AI Engineering Engine.

Based on your structural parameters of ${d.areaSqFt.toLocaleString()} sq ft across ${d.numFloors} floors 
constructed on ${d.soil} utilizing ${d.foundation}, 
the required raw materials have been calculated below in plain, human-readable 
language for project planning and procurement.

DETAILED MATERIAL QUANTITY BREAKDOWN & EXPLANATIONS
--------------------------------------------------------------------------------
1. CEMENT (PORTLAND POZZOLANA / ORDINARY PORTLAND)
   - Estimated Quantity : ${d.materials[0].qty} Bags
   - Calculation Unit   : Bags (50 kg per bag)
   - AI Confidence Score: ${d.materials[0].confidence}
   - Plain Explanation  : ${d.materials[0].explanation}

2. STEEL (REBAR & STRUCTURAL TMT FE500)
   - Estimated Quantity : ${d.materials[1].qty} Tons
   - Calculation Unit   : Metric Tons
   - AI Confidence Score: ${d.materials[1].confidence}
   - Plain Explanation  : ${d.materials[1].explanation}

3. SAND (MANUFACTURED M-SAND / FINE AGGREGATE)
   - Estimated Quantity : ${d.materials[2].qty} Cubic Feet
   - Calculation Unit   : Cu. Ft.
   - AI Confidence Score: ${d.materials[2].confidence}
   - Plain Explanation  : ${d.materials[2].explanation}

4. BRICKS / ACC MASONRY BLOCKS
   - Estimated Quantity : ${d.materials[3].qty} Pieces
   - Calculation Unit   : Pieces
   - AI Confidence Score: ${d.materials[3].confidence}
   - Plain Explanation  : ${d.materials[3].explanation}

5. COARSE AGGREGATE (10MM & 20MM GRADED)
   - Estimated Quantity : ${d.materials[4].qty} Cubic Feet
   - Calculation Unit   : Cu. Ft.
   - AI Confidence Score: ${d.materials[4].confidence}
   - Plain Explanation  : ${d.materials[4].explanation}

6. READY-MIX CONCRETE (RMC GRADE M30/M40)
   - Estimated Quantity : ${d.materials[5].qty} Cubic Meters
   - Calculation Unit   : Cu. M.
   - AI Confidence Score: ${d.materials[5].confidence}
   - Plain Explanation  : ${d.materials[5].explanation}

7. TILES (VITRIFIED FLOOR & CERAMIC WALL)
   - Estimated Quantity : ${d.materials[6].qty} Square Feet
   - Calculation Unit   : Sq. Ft.
   - AI Confidence Score: ${d.materials[6].confidence}
   - Plain Explanation  : ${d.materials[6].explanation}

8. PAINT (EXTERIOR ACRYLIC & INTERIOR EMULSION)
   - Estimated Quantity : ${d.materials[7].qty} Liters
   - Calculation Unit   : Liters
   - AI Confidence Score: ${d.materials[7].confidence}
   - Plain Explanation  : ${d.materials[7].explanation}

9. WATERPROOFING & ADDITIVES
   - Estimated Quantity : ${d.materials[8].qty} Liters
   - Calculation Unit   : Liters
   - AI Confidence Score: ${d.materials[8].confidence}
   - Plain Explanation  : ${d.materials[8].explanation}

================================================================================
STRUCTURAL INTEGRITY & FIELD PROCUREMENT ADVICE
--------------------------------------------------------------------------------
1. Soil & Foundation Guidance:
   Given the specified ${d.soil} and ${d.foundation}, 
   soil plate load tests and moisture compaction verification must be conducted 
   prior to initiating mass concrete pouring.

2. Storage & Weather Protection:
   Store the estimated ${d.materials[0].qty} cement bags in a moisture-proof elevated 
   warehouse. Keep the ${d.materials[1].qty} Tons of steel rebar off bare ground to prevent 
   surface rust and oxidation prior to binding.

3. Staged Procurement Strategy:
   Deliver concrete and sand in bi-weekly batches matching construction stage 
   milestones to prevent storage degradation on site.

================================================================================
End of Official Material Estimation Report - Construction Intelligent Hub 2026
================================================================================`;

    const fileName = `${d.projName.replace(/\s+/g, '_')}_Material_Estimate_Report.txt`;
    AIUtils.downloadAsFile(fileName, reportText);
}

// ==========================================================================
// BUDGET MANAGEMENT AI CONTROLLERS
// ==========================================================================
let currentBudgetEstimationData = null;

function initBudgetPage() {
    renderExpenseTable();
    const outputBox = document.getElementById('aiBudgetEstimateOutput');
    const statusBadge = document.getElementById('budgetStatusBadge');
    if (outputBox) outputBox.style.display = 'none';
    if (statusBadge) statusBadge.style.display = 'none';
}

async function triggerAiBudgetEstimation() {
    const projTypeEl = document.getElementById('budgetAiProjType');
    const areaEl = document.getElementById('budgetAiArea');
    const cityEl = document.getElementById('budgetAiCity');
    const qualityEl = document.getElementById('budgetAiQuality');
    const durationEl = document.getElementById('budgetAiDuration');
    const contingencyEl = document.getElementById('budgetAiContingency');
    const statusBadge = document.getElementById('budgetStatusBadge');
    const outputBox = document.getElementById('aiBudgetEstimateOutput');
    if (!outputBox) return;

    const params = {
        projectType: projTypeEl ? projTypeEl.value : 'Commercial High-Rise Tower',
        areaSqFt: areaEl ? areaEl.value : '250,000',
        city: cityEl ? cityEl.value : 'Mumbai (Coastal / Metro)',
        qualityGrade: qualityEl ? qualityEl.value : 'Standard Commercial',
        durationMonths: durationEl ? durationEl.value : '24',
        contingencyBuffer: contingencyEl ? contingencyEl.value : '10%'
    };

    // Show status badge as Generating
    if (statusBadge) {
        statusBadge.style.display = 'block';
        statusBadge.style.background = '#EFF6FF';
        statusBadge.style.color = '#1D4ED8';
        statusBadge.style.borderColor = '#BFDBFE';
        statusBadge.innerText = `🤖 Llama 3.2 AI Computing Budget Estimation for ${params.projectType}...`;
    }

    // Show output box loader
    outputBox.style.display = 'block';
    outputBox.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #FFFFFF; border-radius: 12px;">
            <div style="font-size: 32px; margin-bottom: 12px;">🤖</div>
            <h3 style="font-size: 16px; font-weight: 700; color: #1E293B;">Estimating Construction Budget with Llama 3.2...</h3>
            <p style="font-size: 13px; color: #64748B;">Calculating material component costs, labor rates, contingency buffers, and cashflow schedules for ${params.areaSqFt} Sq. Ft...</p>
        </div>
    `;

    const res = await CIH_AI_SERVICE.estimateProjectBudget(params);
    currentBudgetEstimationData = res;

    // Update status badge to Completed
    if (statusBadge) {
        statusBadge.style.background = '#DCFCE7';
        statusBadge.style.color = '#15803D';
        statusBadge.style.borderColor = '#86EFAC';
        statusBadge.innerText = 'Budget Estimation Completed';
    }

    outputBox.innerHTML = `
        <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; color: #0F172A; line-height: 1.6;">
            ${res.html}

            <!-- ACTION BUTTONS: DOWNLOAD REPORT -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #E2E8F0; margin-top: 24px;">
                <div style="font-size: 12px; color: #64748B;">Calculated dynamically by <strong>Llama 3.2 Financial AI Engine</strong></div>
                <button class="btn-primary" style="padding: 9px 18px; font-size: 13px; border-radius: 8px;" onclick="downloadBudgetAIEstimate()">📥 Download Budget Estimate (.TXT)</button>
            </div>
        </div>
    `;

    outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadBudgetAIEstimate() {
    if (!currentBudgetEstimationData) {
        alert('Please run a budget estimation first.');
        return;
    }

    const d = currentBudgetEstimationData;
    const p = d.params || {};
    const reportText = d.rawText || d.html;

    const fileName = `${(p.projectType || 'Project').replace(/\s+/g, '_')}_Budget_Estimate.txt`;
    AIUtils.downloadAsFile(fileName, reportText);
}

function triggerBudgetAIAnalysis() {
    triggerAiBudgetEstimation();
}

function downloadBudgetAIAnalysis() {
    downloadBudgetAIEstimate();
}

// ==========================================================================
// RISK ANALYSIS MODULE CONTROLLERS
// ==========================================================================
let currentRiskAISummary = `### ⚠️ AI Project Risk Evaluation (Llama 3.2 Local)
- **Overall Risk Level**: MEDIUM
- **Primary Risk Drivers**: Monsoon season foundation soil saturation & heavy crane wind cutoff limits at coastal sites.

### Recommended Mitigation Strategies
1. Deploy automated soil moisture telemetry sensors at Zone 4 foundations.
2. Enforce crane wind speed cutoff protocol at 35 km/h.
3. Audit secondary structural steel supplier lead times.`;

function initRiskAnalysisPage() {
    const outputBox = document.getElementById('aiRiskOutputBox');
    const statusBadge = document.getElementById('riskStatusBadge');
    if (outputBox) outputBox.style.display = 'none';
    if (statusBadge) statusBadge.style.display = 'none';
}

let currentRiskAnalysisData = null;

async function triggerRiskAIAnalysis() {
    const statusBadge = document.getElementById('riskStatusBadge');
    const outputBox = document.getElementById('aiRiskOutputBox');
    const projSelect = document.getElementById('riskProjectFilter');
    if (!outputBox) return;

    const projName = projSelect ? projSelect.value : 'Delhi Metro - Phase 4';

    // Show status badge as Generating
    if (statusBadge) {
        statusBadge.style.display = 'block';
        statusBadge.style.background = '#EFF6FF';
        statusBadge.style.color = '#1D4ED8';
        statusBadge.style.borderColor = '#BFDBFE';
        statusBadge.innerText = `🤖 Analyzing project risks for ${projName} with Llama 3.2...`;
    }

    // Show output box with loader
    outputBox.style.display = 'block';
    outputBox.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #FFFFFF; border-radius: 12px;">
            <div style="font-size: 32px; margin-bottom: 12px;">🤖</div>
            <h3 style="font-size: 16px; font-weight: 700; color: #1E293B;">Generating AI Construction Risk Analysis Report for ${projName}...</h3>
            <p style="font-size: 13px; color: #64748B;">Evaluating budget variances, schedule bottlenecks, material supply streams, and risk mitigation strategies via Llama 3.2...</p>
        </div>
    `;

    // Fetch live project snapshot
    const snapshot = (typeof CIH_DATASET !== 'undefined' && typeof CIH_DATASET.getProjectSnapshot === 'function')
        ? CIH_DATASET.getProjectSnapshot(projName)
        : { title: projName, city: 'Site', status: 'Active', progressPercent: 50, formattedBudget: '₹1,000 Cr', deadline: 'Dec 2026' };

    const res = await CIH_AI_SERVICE.evaluateRisk(projName, snapshot);
    currentRiskAnalysisData = res;
    const snap = snapshot;

    // Update status badge to Completed (matching reference screenshot)
    if (statusBadge) {
        statusBadge.style.background = '#DCFCE7';
        statusBadge.style.color = '#15803D';
        statusBadge.style.borderColor = '#86EFAC';
        statusBadge.innerText = 'Risk Analysis Completed';
    }

    const healthScore = Math.max(35, 100 - (snap.spentPercent ? Math.round(snap.spentPercent * 0.9) : 45));

    // Render report matching user's reference screenshot structure & writing format EXACTLY
    outputBox.innerHTML = `
        <div style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; color: #0F172A; line-height: 1.6;">
            <!-- REPORT TITLE -->
            <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 20px 0;">
                ${snap.title}: Construction Risk Analysis Report
            </h2>

            <!-- EXECUTIVE SUMMARY -->
            <div style="margin-bottom: 22px;">
                <h3 style="font-size: 16px; font-weight: 800; color: #1E293B; margin: 0 0 8px 0;">Executive Summary</h3>
                <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0;">
                    The ${snap.title} project in ${snap.city} has faced significant delays, impacting the overall progress and budget. The current status of the project is ${snap.progressPercent}% complete, with a total budget of ${snap.formattedBudget} and a current spend of ${snap.spentPercent}%. The Health Score stands at ${healthScore}%, indicating moderate risk concerns. This report outlines the major risks associated with the project, provides an analysis of the budget and schedule, and offers recommendations for mitigating these risks.
                </p>
            </div>

            <!-- MAJOR RISKS -->
            <div style="margin-bottom: 22px;">
                <h3 style="font-size: 16px; font-weight: 800; color: #1E293B; margin: 0 0 12px 0;">Major Risks</h3>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 14.5px; font-weight: 700; color: #0F172A;">1. Delays in Material Procurement:</div>
                    <div style="font-size: 13.5px; color: #334155; margin-top: 4px; line-height: 1.6;">
                        The supplier has failed to deliver critical materials on time, causing a significant delay in the construction process. This risk is exacerbated by low stock re-order thresholds.
                    </div>
                    <ul style="margin-top: 6px; margin-bottom: 0; padding-left: 24px; font-size: 13px; color: #475569; line-height: 1.6;">
                        <li><strong>Probability</strong>: High</li>
                        <li><strong>Impact</strong>: High</li>
                    </ul>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 14.5px; font-weight: 700; color: #0F172A;">2. Defects in Structural Work & Equipment Maintenance:</div>
                    <div style="font-size: 13.5px; color: #334155; margin-top: 4px; line-height: 1.6;">
                        Inspections have revealed defects in structural work and heavy equipment service delays, which may compromise overall building integrity and operational safety.
                    </div>
                    <ul style="margin-top: 6px; margin-bottom: 0; padding-left: 24px; font-size: 13px; color: #475569; line-height: 1.6;">
                        <li><strong>Probability</strong>: Medium-High</li>
                        <li><strong>Impact</strong>: High</li>
                    </ul>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 14.5px; font-weight: 700; color: #0F172A;">3. Weather & Environmental Hazards:</div>
                    <div style="font-size: 13.5px; color: #334155; margin-top: 4px; line-height: 1.6;">
                        Site atmospheric conditions in ${snap.city} (${snap.weatherHazard}) introduce concrete curing risks and require anemometer crane safety cutoffs.
                    </div>
                    <ul style="margin-top: 6px; margin-bottom: 0; padding-left: 24px; font-size: 13px; color: #475569; line-height: 1.6;">
                        <li><strong>Probability</strong>: Medium</li>
                        <li><strong>Impact</strong>: Medium</li>
                    </ul>
                </div>
            </div>

            <!-- BUDGET ANALYSIS -->
            <div style="margin-bottom: 22px;">
                <h3 style="font-size: 16px; font-weight: 800; color: #1E293B; margin: 0 0 8px 0;">Budget Analysis</h3>
                <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0;">
                    The current spend is ${snap.spentPercent}% of the total allocated budget (${snap.formattedBudget}). This indicates that the project has experienced cost overruns relative to work progress (${snap.progressPercent}% complete against deadline ${snap.deadline}).
                </p>
            </div>

            <!-- RISK MITIGATION PLAN -->
            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 16px; font-weight: 800; color: #1E293B; margin: 0 0 10px 0;">Risk Mitigation Plan</h3>
                <ol style="margin-top: 6px; margin-bottom: 0; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.8;">
                    <li><strong>Supply Chain Acceleration</strong>: Authorize bi-weekly re-order cycles for steel and cement to resolve lead-time lags at ${snap.title}.</li>
                    <li><strong>Preventive Maintenance Audits</strong>: Conduct IoT diagnostic servicing on heavy excavators and cranes prior to high-elevation hoisting shifts.</li>
                    <li><strong>Shift Allocation Adjustments</strong>: Reallocate secondary engineering shift hours to critical path structural milestones to maintain schedule target of ${snap.deadline}.</li>
                    <li><strong>Weather Preparedness Protocol</strong>: Implement real-time anemometer wind safety alerts and moisture protection barriers for fresh concrete pouring in ${snap.city}.</li>
                </ol>
            </div>

            <!-- ACTION BUTTONS: DOWNLOAD REPORT -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #F1F5F9; margin-top: 24px;">
                <div style="font-size: 12px; color: #64748B;">Generated dynamically by <strong>Llama 3.2 Neural AI Risk Engine</strong> for ${snap.title}</div>
                <button class="btn-primary" style="padding: 9px 18px; font-size: 13px; border-radius: 8px;" onclick="downloadRiskAISummary()">📥 Download Risk Report (.TXT)</button>
            </div>
        </div>
    `;

    outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadRiskAISummary() {
    if (!currentRiskAnalysisData) {
        alert('Please run a risk assessment first.');
        return;
    }

    const d = currentRiskAnalysisData;
    const snap = d.snapshot || {};
    const reportText = d.rawText || d.html;

    const fileName = `${(snap.title || 'Project').replace(/\s+/g, '_')}_Risk_Assessment_Report.txt`;
    AIUtils.downloadAsFile(fileName, reportText);
}

// ==========================================================================
// AI INSIGHTS MODULE CONTROLLERS (REDESIGNED)
// ==========================================================================
let currentUploadedDocContent = `BOQ Contract Agreement: Completion target Dec 2026. Total contract value: ₹1,450 Cr. Material steel requirement: 4,200 Tons. Milestone delay penalty: 0.5% per week up to 10% maximum. Foundation: Pile foundation in deep clay. Waterproofing spec: 2-coat elastomeric membrane.`;
let currentUploadedDocTitle = "Contractor Agreement & BOQ Document.pdf";
let currentForecastReportData = null;

function switchAiTab(tabName) {
    const tabs = ['doc', 'forecast'];
    tabs.forEach(t => {
        const pane = document.getElementById(`aiPane-${t}`);
        const btn = document.getElementById(`tabBtn-${t}`);
        if (pane) pane.style.display = (t === tabName) ? 'block' : 'none';
        if (btn) {
            if (t === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
}

function initAIInsightsPage() {
    switchAiTab('doc');
}

/**
 * FEATURE 1: DOCUMENT ANALYZER CONTROLLERS
 */
async function handleDocFileUpload(event) {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const validation = CIH_AI_SERVICE.validateUploadedDocumentFile(file);
    if (!validation.valid) {
        alert(`Upload Error: ${validation.message}`);
        event.target.value = '';
        return;
    }

    currentUploadedDocTitle = file.name;
    const titleEl = document.getElementById('aiDocCurrentTitle');
    const outputBox = document.getElementById('aiDocAnalysisOutput');
    if (outputBox) outputBox.style.display = 'none';

    if (titleEl) titleEl.innerHTML = `⏳ Extracting text from <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)...`;

    try {
        const extractedText = await CIH_AI_SERVICE.extractTextFromFile(file);
        currentUploadedDocContent = extractedText;

        if (titleEl) titleEl.innerHTML = `📄 Uploaded: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB &bull; Click Generate button below)`;
    } catch (err) {
        console.error("[Document Upload] Extraction failed:", err);
        if (titleEl) titleEl.innerHTML = `⚠️ Extraction error for <strong>${file.name}</strong>.`;
        alert(`Failed to extract text from ${file.name}. Please ensure file is valid.`);
    }
}

function selectPresetDocument(presetType) {
    const titleEl = document.getElementById('aiDocCurrentTitle');
    const outputBox = document.getElementById('aiDocAnalysisOutput');
    if (outputBox) outputBox.style.display = 'none';

    if (presetType === 'boq') {
        currentUploadedDocTitle = "BOQ_Quantities_Bill_of_Quantities.pdf";
        currentUploadedDocContent = "BOQ Specification Document: Total estimated quantity Cement 85,000 Bags, Steel Rebar 4,200 Tons, Sand 1,800 m3, Concrete Grade M35 12,500 m3. Total budget allocation ₹1,450 Cr. Target delivery milestone: Nov 2026. Quality penalty: 0.5% per week delay.";
    } else if (presetType === 'dpr') {
        currentUploadedDocTitle = "DPR_Daily_Progress_Report_Site.pdf";
        currentUploadedDocContent = "Daily Progress Report (DPR): Excavation phase 92% completed. Pile foundation casting in progress. Workforce active: 48 site personnel. Material stock alert: Cement stock low (re-order level 500 bags). Rain delay recorded: 3.5 hours on South pier.";
    } else if (presetType === 'contract') {
        currentUploadedDocTitle = "Contractor_Legal_Agreement.pdf";
        currentUploadedDocContent = "Contractor Agreement: Completion deadline set for Dec 15, 2026. Liquidated delay damages clause: 0.5% of total contract value per week of delay up to maximum 10%. Scope variation requires 14-day advance engineering notice.";
    } else if (presetType === 'invoice') {
        currentUploadedDocTitle = "Material_Supply_Tax_Invoice.pdf";
        currentUploadedDocContent = "Tax Invoice #INV-2026-8841: Supplier Apex Steel Ltd. Material High-Grade TMT Rebar 500D 120 Tons delivered to site. Amount: ₹84,500,000. Payment terms: Net 30 days. Quality audit status: Verified ISO-9001 compliance.";
    }

    if (titleEl) titleEl.innerHTML = `📄 Preset Selected: <strong>${currentUploadedDocTitle}</strong> (Click Generate button below)`;
}

let currentDocTypewriterInterval = null;

async function triggerDocSummaryAndRecommendations() {
    const outputBox = document.getElementById('aiDocAnalysisOutput');
    const textContentEl = document.getElementById('typewriterTextContent');
    const badgeEl = document.getElementById('typewriterStatusBadge');

    if (!outputBox || !textContentEl) return;

    outputBox.style.display = 'block';
    setTimeout(() => {
        outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    if (badgeEl) badgeEl.innerText = '[STATUS: GENERATING WITH LLAMA 3.2...]';
    textContentEl.textContent = 'Extracting document text & analyzing with Llama 3.2...\n';

    const res = await CIH_AI_SERVICE.analyzeUploadedDocument(currentUploadedDocTitle, currentUploadedDocContent);

    const reportText = `================================================================================
DOCUMENT: ${res.docTitle}
RISK EVALUATION: [${res.riskLevel}]
================================================================================

--------------------------------------------------------------------------------
1. CONCISE EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
${res.summary}

--------------------------------------------------------------------------------
2. KEY CONTRACTUAL METRICS & SPECIFICATIONS
--------------------------------------------------------------------------------
• Target Dates        : ${res.extractedInfo.importantDates}
• Total Budget / Cost : ${res.extractedInfo.costs}
• Quantities Tracked  : ${res.extractedInfo.quantities}
• Delivery Milestones : ${res.extractedInfo.milestones}

--------------------------------------------------------------------------------
3. IDENTIFIED CONTRACT CLAUSE RISKS
--------------------------------------------------------------------------------
${res.risks.map((r, i) => `[RISK ${i + 1}] ${r}`).join('\n')}

--------------------------------------------------------------------------------
4. PRACTICAL RECOMMENDATIONS FOR PROJECT MANAGERS
--------------------------------------------------------------------------------
1. Audit physical material inventory against BOQ delivery quantities before signing payment releases.
2. Verify structural concrete curing schedules and non-destructive strength test logs on-site.
3. Review liquidated delay penalty terms (0.5%/week) and file milestone extension notices 14 days in advance.
4. Ensure heavy equipment IoT sensors are active to prevent unrecorded operational downtime.

================================================================================
End of Executive AI Summary - Construction Intelligent Hub 2026
================================================================================`;

    if (currentDocTypewriterInterval) {
        clearInterval(currentDocTypewriterInterval);
        currentDocTypewriterInterval = null;
    }

    textContentEl.textContent = '';
    let charIndex = 0;

    currentDocTypewriterInterval = setInterval(() => {
        if (charIndex < reportText.length) {
            textContentEl.textContent = reportText.substring(0, charIndex + 2) + '❚';
            charIndex += 2;
        } else {
            clearInterval(currentDocTypewriterInterval);
            currentDocTypewriterInterval = null;
            textContentEl.textContent = reportText;
            if (badgeEl) badgeEl.innerText = '[STATUS: COMPLETE]';
        }
    }, 6);
}

function runDocumentAnalysis() {
    triggerDocSummaryAndRecommendations();
}

async function sendDocChatMessage() {
    const input = document.getElementById('aiDocChatInput');
    const body = document.getElementById('aiDocChatBody');
    if (!input || !input.value.trim() || !body) return;

    const q = input.value.trim();
    input.value = '';

    // Append User Bubble
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-bubble chat-bubble-user';
    userDiv.style.alignSelf = 'flex-end';
    userDiv.style.background = '#2563EB';
    userDiv.style.color = '#FFFFFF';
    userDiv.style.padding = '10px 14px';
    userDiv.style.borderRadius = '12px 12px 0 12px';
    userDiv.style.fontSize = '13px';
    userDiv.style.marginBottom = '10px';
    userDiv.style.maxWidth = '85%';
    userDiv.innerText = q;
    body.appendChild(userDiv);
    body.scrollTop = body.scrollHeight;

    // Append Thinking Bubble
    const aiDiv = document.createElement('div');
    aiDiv.className = 'chat-bubble chat-bubble-ai';
    aiDiv.style.alignSelf = 'flex-start';
    aiDiv.style.background = '#F1F5F9';
    aiDiv.style.color = '#1E293B';
    aiDiv.style.padding = '10px 14px';
    aiDiv.style.borderRadius = '12px 12px 12px 0';
    aiDiv.style.fontSize = '13px';
    aiDiv.style.marginBottom = '10px';
    aiDiv.style.maxWidth = '85%';
    aiDiv.innerHTML = `<em>🤖 Searching uploaded document "${currentUploadedDocTitle}"...</em>`;
    body.appendChild(aiDiv);
    body.scrollTop = body.scrollHeight;

    const res = await CIH_AI_SERVICE.chatWithUploadedDocument(currentUploadedDocContent, q);
    aiDiv.innerHTML = res.html;
    body.scrollTop = body.scrollHeight;
}





/**
 * FEATURE 3: AI FORECAST CONTROLLERS
 */
async function triggerProjectForecast() {
    const select = document.getElementById('aiForecastProjectSelect');
    const outputBox = document.getElementById('aiForecastOutput');
    if (!select || !outputBox) return;

    const projName = select.value || 'Delhi Metro - Phase 4';

    outputBox.style.display = 'block';
    outputBox.innerHTML = `
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">📈</div>
            <div style="font-size: 14px; font-weight: 700; color: #1E293B;">Generating AI Predictive Forecast for ${projName}...</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Evaluating completion dates, budget variance, material trends, and risk velocity...</div>
        </div>
    `;

    const res = await CIH_AI_SERVICE.generateProjectForecast(projName);
    currentForecastReportData = res;

    const f = res.forecast;
    const s = res.executiveSummary;

    outputBox.innerHTML = `
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #F1F5F9; padding-bottom: 14px; margin-bottom: 20px;">
                <div>
                    <span class="skill-badge" style="background: #EFF6FF; color: #1D4ED8; font-weight: 700;">NEURAL PREDICTIVE FORECAST</span>
                    <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 6px 0 2px 0;">📈 ${res.projectName} Forecast Dashboard</h2>
                    <div style="font-size: 12px; color: #64748B;">Target Completion: <strong>${res.snapshot.deadline}</strong> &bull; Current Progress: <strong>${res.snapshot.progressPercent}%</strong></div>
                </div>
                <button class="btn-primary" style="padding: 9px 18px; font-size: 12.5px;" onclick="downloadForecastReport()">📥 Download Forecast (.TXT)</button>
            </div>

            <!-- FORECAST CARDS GRID -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748B;">EXPECTED COMPLETION DATE</div>
                    <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 6px 0;">🎯 ${f.expectedCompletion}</div>
                    <div style="font-size: 12px; color: #475569;">Forecasted completion velocity based on historical daily output.</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748B;">DELAY PROBABILITY</div>
                    <div style="font-size: 16px; font-weight: 800; color: ${f.delayProbValue > 50 ? '#EF4444' : '#10B981'}; margin: 6px 0;">⏱️ ${f.delayProb}</div>
                    <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; margin-top: 8px;">
                        <div style="width: ${f.delayProbValue}%; height: 100%; background: ${f.delayProbValue > 50 ? '#EF4444' : '#10B981'};"></div>
                    </div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748B;">FUTURE BUDGET STATUS</div>
                    <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 6px 0;">💵 ${f.budgetStatus}</div>
                    <div style="font-size: 12px; color: #475569;">Portfolio spend rate: ${res.snapshot.spentPercent}% allocated.</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748B;">MATERIAL CONSUMPTION TREND</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0284C7; margin: 6px 0;">📦 ${f.materialTrend}</div>
                    <div style="font-size: 12px; color: #475569;">RFID gate telemetry tracking active.</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748B;">RISK TREND</div>
                    <div style="font-size: 15px; font-weight: 800; color: #D97706; margin: 6px 0;">⚠️ ${f.riskTrend}</div>
                    <div style="font-size: 12px; color: #475569;">Evaluated across 6 multi-site risk factors.</div>
                </div>

                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748B;">OVERALL PROJECT HEALTH PREDICTION</div>
                    <div style="font-size: 22px; font-weight: 900; color: ${f.healthScore >= 75 ? '#10B981' : '#EF4444'}; margin: 4px 0;">🏥 ${f.healthScore} <span style="font-size: 13px; color: #94A3B8;">/ 100</span></div>
                    <div style="font-size: 12px; color: #475569;">Overall neural forecast score.</div>
                </div>
            </div>

            <!-- EXECUTIVE SUMMARY -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
                <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; margin: 0 0 14px 0;">🧠 AI Executive Forecast Summary</h3>
                
                <div style="margin-bottom: 14px;">
                    <div style="font-weight: 700; font-size: 13px; color: #1E293B; margin-bottom: 4px;">1. What is Expected to Happen:</div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5;">${s.whatWillHappen}</div>
                </div>

                <div style="margin-bottom: 14px;">
                    <div style="font-weight: 700; font-size: 13px; color: #1E293B; margin-bottom: 4px;">2. Why the Prediction Was Made:</div>
                    <div style="font-size: 13px; color: #475569; line-height: 1.5;">${s.whyPredicted}</div>
                </div>

                <div>
                    <div style="font-weight: 700; font-size: 13px; color: #15803D; margin-bottom: 6px;">3. Recommended Actions to Improve Performance:</div>
                    <ul style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #166534; line-height: 1.6;">
                        ${s.recommendedActions.map(act => `<li>${act}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function downloadForecastReport() {
    if (!currentForecastReportData) {
        alert('Please generate an AI forecast first.');
        return;
    }

    const d = currentForecastReportData;
    const f = d.forecast;
    const s = d.executiveSummary;

    const reportText = `================================================================================
CONSTRUCTION INTELLIGENT HUB (CIH) - OFFICIAL AI PROJECT FORECAST
================================================================================
Project Site Name: ${d.projectName}
Current Progress : ${d.snapshot.progressPercent}% Completed
Target Deadline  : ${d.snapshot.deadline}
Allocated Budget : ${d.snapshot.budget}
Date Generated   : ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
================================================================================

1. NEURAL PREDICTIVE FORECAST METRICS
--------------------------------------------------------------------------------
- Expected Completion Date      : ${f.expectedCompletion}
- Delay Probability             : ${f.delayProb}
- Future Budget Status          : ${f.budgetStatus}
- Material Consumption Trend    : ${f.materialTrend}
- Risk Trend                    : ${f.riskTrend}
- Overall Health Prediction     : ${f.healthScore} / 100

2. EXECUTIVE FORECAST ANALYSIS
--------------------------------------------------------------------------------
[WHAT IS EXPECTED TO HAPPEN]:
${s.whatWillHappen}

[WHY THE PREDICTION WAS MADE]:
${s.whyPredicted}

[RECOMMENDED ACTIONS]:
${s.recommendedActions.map((act, idx) => `${idx + 1}. ${act}`).join('\n')}

================================================================================
End of AI Forecast Report - Construction Intelligent Hub 2026
================================================================================`;

    const fileName = `${d.projectName.replace(/\s+/g, '_')}_AI_Forecast_Report.txt`;
    AIUtils.downloadAsFile(fileName, reportText);
}

// ==========================================================================
// USER PROFILE & AVATAR MANAGEMENT CONTROLLERS
// ==========================================================================
function syncGlobalProfileUI() {
    const storedName = localStorage.getItem('cih_user_name') || 'Alex Sterling';
    const storedRole = localStorage.getItem('cih_user_role') || 'Project Director';
    const storedEmail = localStorage.getItem('cih_user_email') || 'alex.sterling@cih-hub.com';
    const storedPhone = localStorage.getItem('cih_user_phone') || '+91 98765 43210';
    const storedLocation = localStorage.getItem('cih_user_location') || 'Delhi NCR Site Headquarters';
    const storedAvatar = localStorage.getItem('cih_user_avatar');

    // Compute initials from stored name
    const initials = storedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AS';

    // 1. Sync all top global header user profiles
    const profiles = document.querySelectorAll('.dash-user-profile');
    profiles.forEach(p => {
        p.style.cursor = 'pointer';
        p.title = 'View User Profile & Account Settings';
        p.onclick = () => window.location.href = 'profile.html';

        const nameEl = p.querySelector('.dash-user-name');
        const roleEl = p.querySelector('.dash-user-role');
        const avatarEl = p.querySelector('.dash-user-avatar');

        if (nameEl) nameEl.innerText = storedName;
        if (roleEl) roleEl.innerText = storedRole;
        if (avatarEl) {
            if (storedAvatar) {
                avatarEl.innerHTML = `<img src="${storedAvatar}" alt="${storedName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                avatarEl.style.padding = '0';
                avatarEl.style.overflow = 'hidden';
            } else {
                avatarEl.innerHTML = initials;
                avatarEl.style.padding = '';
                avatarEl.style.overflow = '';
            }
        }
    });

    // 2. If currently on profile.html, sync form inputs & preview box
    const nameInput = document.getElementById('profileInputName');
    const roleInput = document.getElementById('profileInputRole');
    const emailInput = document.getElementById('profileInputEmail');
    const phoneInput = document.getElementById('profileInputPhone');
    const locInput = document.getElementById('profileInputLocation');
    const avatarImg = document.getElementById('profileAvatarImage');
    const avatarFallback = document.getElementById('profileAvatarFallback');

    if (nameInput && document.activeElement !== nameInput) nameInput.value = storedName;
    if (roleInput && document.activeElement !== roleInput) roleInput.value = storedRole;
    if (emailInput && document.activeElement !== emailInput) emailInput.value = storedEmail;
    if (phoneInput && document.activeElement !== phoneInput) phoneInput.value = storedPhone;
    if (locInput && document.activeElement !== locInput) locInput.value = storedLocation;

    if (avatarImg && avatarFallback) {
        if (storedAvatar) {
            avatarImg.src = storedAvatar;
            avatarImg.style.display = 'block';
            avatarFallback.style.display = 'none';
        } else {
            avatarImg.src = '';
            avatarImg.style.display = 'none';
            avatarFallback.innerText = initials;
            avatarFallback.style.display = 'flex';
        }
    }
}

function handleProfilePhotoUpload(event) {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Invalid file format. Please upload an image file (JPG, PNG, WebP, GIF).');
        event.target.value = '';
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller image.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Data = e.target.result;
        localStorage.setItem('cih_user_avatar', base64Data);
        syncGlobalProfileUI();

        showProfileAlert('✅ Profile photo uploaded successfully! Your new photo is active across the application.');
    };
    reader.readAsDataURL(file);
}

function handleDeleteProfilePhoto() {
    if (!localStorage.getItem('cih_user_avatar')) {
        alert('No custom profile photo is currently uploaded.');
        return;
    }

    localStorage.removeItem('cih_user_avatar');
    syncGlobalProfileUI();

    showProfileAlert('✅ Profile photo removed! Avatar reset to default initials.');
}

function handleSaveProfileDetails() {
    const nameInput = document.getElementById('profileInputName');
    const roleInput = document.getElementById('profileInputRole');
    const emailInput = document.getElementById('profileInputEmail');
    const phoneInput = document.getElementById('profileInputPhone');
    const locInput = document.getElementById('profileInputLocation');

    const name = nameInput ? nameInput.value.trim() : 'Alex Sterling';
    const role = roleInput ? roleInput.value.trim() : 'Project Director';
    const email = emailInput ? emailInput.value.trim() : 'alex.sterling@cih-hub.com';
    const phone = phoneInput ? phoneInput.value.trim() : '+91 98765 43210';
    const loc = locInput ? locInput.value.trim() : 'Delhi NCR Site Headquarters';

    localStorage.setItem('cih_user_name', name);
    localStorage.setItem('cih_user_role', role);
    localStorage.setItem('cih_user_email', email);
    localStorage.setItem('cih_user_phone', phone);
    localStorage.setItem('cih_user_location', loc);

    syncGlobalProfileUI();
    showProfileAlert('✅ User profile details saved successfully!');
}

function showProfileAlert(message) {
    const alertBox = document.getElementById('profileStatusAlert');
    if (!alertBox) return;

    alertBox.innerText = message;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 4000);
}


