/**
 * Construction Intelligent Hub (CIH) - Reusable AI Prompt Templates
 * 
 * Centralized registry of system & user prompt templates.
 * Supports ChatGPT-style natural conversation, general civil engineering explanations,
 * project-specific data reasoning, and dynamic context injection.
 */

const CIH_PROMPTS = {
    /**
     * Dynamic Live Web App Context Generator
     */
    getLiveWebappContext: () => {
        if (typeof CIH_DATASET === 'undefined') return '';

        const projects = (CIH_DATASET.projects || []).map(p => 
            `- Project: "${p.title}" (ID: ${p.id}) | Location: ${p.city} | Status: ${p.status} | Budget: ${p.formattedBudget} (₹${p.budgetCrores} Cr) | Deadline: ${p.deadline} | Progress: ${p.progressPercent}% | Risk Level: ${p.riskLevel || 'Low'} | Team Size: ${p.totalTeamCount}`
        ).join('\n');

        const stats = CIH_DATASET.dashboardStats || {};
        const statsSummary = `Portfolio Summary: ${stats.totalProjects?.count || 10} Total Active Projects (${stats.running?.count || 6} Running, ${stats.delayed?.count || 2} Delayed, ${stats.highRisk?.count || 2} High Risk, ${stats.completed?.count || 118} Historical Completed). Total Portfolio Budget: ₹94,830 Cr. Total Spent: ₹47,215 Cr.`;

        const materials = (CIH_DATASET.materialInventory || []).map(m => 
            `- Material: "${m.name}" | Stock: ${m.stockQuantity} | Reorder Threshold: ${m.reorderLevel} | Status: ${m.status} | Assigned Project: "${m.assignedProject}" | Supplier: ${m.supplier} | RFID Tag: ${m.rfidTag} | Utilization: ${m.utilizationPercent}%`
        ).join('\n');

        const budget = CIH_DATASET.budgetOverview || {};
        const expenses = (budget.expensesList || []).map(e => 
            `- Expense: "${e.title}" | Project: "${e.project}" | Category: ${e.category} | Amount: ${e.amount} | Status: ${e.status} | Date: ${e.date}`
        ).join('\n');
        const budgetSummary = `Financial State: Total Allocated Portfolio Budget = ${budget.totalPortfolioBudget || '₹94,830 Cr'} | Total Spent = ${budget.totalSpent || '₹47,215 Cr'} | Remaining Budget = ${budget.remainingBudget || '₹47,615 Cr'} | Variance: ${budget.variancePercent || '+1.2%'}\nLogged Expense Transactions:\n${expenses}`;

        const equipment = (CIH_DATASET.equipmentAssets || []).map(e => 
            `- Heavy Machine: "${e.asset_name}" (${e.unit_code}) | Project: "${e.assigned_project_id}" | Health: ${e.engine_health_pct}% | Operating Hours: ${e.operating_hours} hrs | Fuel Rate: ${e.fuel_rate_lph} | Maintenance Due: ${e.maintenance_due_hrs} hrs | Status: ${e.status} | Operator: ${e.operator}`
        ).join('\n');

        const team = (CIH_DATASET.teamMembers || []).map(t => 
            `- Team Member: "${t.name}" | Role: ${t.role} (${t.category}) | Project: "${t.assignedProject}" | Email: ${t.email} | Phone: ${t.phone} | Access Level: ${t.accessLevel}`
        ).join('\n');

        const reports = (CIH_DATASET.projectReports || []).map(r =>
            `- Report: "${r.report_title}" (${r.report_id}) | Type: ${r.report_type} | Project: "${r.assigned_project_id}" | Author: ${r.generated_by} | Date: ${r.generated_date} | Format: ${r.format}`
        ).join('\n');

        const risks = (CIH_DATASET.riskIncidents || []).map(r =>
            `- Risk Incident (${r.incident_id}): Project "${r.project_name}" | Category: ${r.risk_category} | Level: ${r.risk_level} | Impact: ${r.predicted_delay_days} days delay & ₹${r.impact_cost_crores} Cr cost | Mitigation: ${r.mitigation_status} | Description: ${r.description}`
        ).join('\n');

        return `REAL-TIME APPLICATION CONTEXT DATASET:
${statsSummary}

ACTIVE INFRASTRUCTURE PROJECTS (${(CIH_DATASET.projects || []).length}):
${projects}

RISK INCIDENTS & DELAY ALERTS (${(CIH_DATASET.riskIncidents || []).length}):
${risks}

MATERIAL INVENTORY (${(CIH_DATASET.materialInventory || []).length}):
${materials}

BUDGET & EXPENSE BREAKDOWN:
${budgetSummary}

HEAVY EQUIPMENT FLEET (${(CIH_DATASET.equipmentAssets || []).length}):
${equipment}

TEAM DIRECTORY (${(CIH_DATASET.teamMembers || []).length}):
${team}

PROJECT AUDIT REPORTS (${(CIH_DATASET.projectReports || []).length}):
${reports}`;
    },

    /**
     * ChatGPT-Style Conversational Assistant System Prompt
     */
    get systemPrompt() {
        return `You are CIH Assistant, a highly intelligent conversational AI for the Construction Intelligent Hub platform (similar to ChatGPT).

BEHAVIORAL GUIDELINES:
1. NATURAL CONVERSATION: Be helpful, articulate, and natural. Explain civil engineering, construction management, financial, and structural concepts clearly and thoroughly.
2. GENERAL KNOWLEDGE: If the user asks a general construction question (e.g. "What is reinforced concrete?", "How can I reduce construction cost?", "Explain budget utilization", "What is an RFID sensor?"), provide a comprehensive, practical, expert explanation.
3. PROJECT ANALYSIS: If the user asks about specific projects in the system (e.g. "Why is my project delayed?", "What is the budget for Delhi Metro?", "Which equipment needs maintenance?"), analyze the real-time project dataset below and explain the exact reasons clearly.
4. ACCURACY & INTEGRITY: If the user asks about a project or data point that is NOT present in the dataset below, clearly state that the information is unavailable in the active workspace instead of inventing fake data.
5. FOLLOW-UP CONTEXT: Maintain continuity with previous conversation turns so follow-up questions feel smooth and intuitive.
6. FORMATTING: Use clean markdown headers, bullet points, and bold text for readability.

${CIH_PROMPTS.getLiveWebappContext()}`;
    },

    materialEstimation: (projectName, specs) => {
        return `Project: ${projectName || "Active Job Site"}
Specifications: ${specs || "Standard civil infrastructure building specifications"}

Tasks:
1. Estimate construction material quantities (Steel, Concrete, Rebar, Cement).
2. Recommend suitable material grades and specs.
3. Explain clearly why those specific materials are recommended for structural integrity.`;
    },

    budgetAnalysis: (projectName, totalBudget, spent, categoryList) => {
        return `Project: ${projectName || "Active Infrastructure Portfolio"}
Total Allocated Budget: ${totalBudget || "₹94,830 Cr"}
Current Spend: ${spent || "₹47,215 Cr"}
Breakdown Categories: ${JSON.stringify(categoryList || [])}

Tasks:
1. Analyze current project spending velocity.
2. Predict potential budget overrun risks or variances.
3. Recommend 3 practical cost optimization strategies.
4. Explain the prediction in clear language.`;
    },

    /**
     * AI Risk Analysis System Prompt
     */
    riskAssessment: (projectName, snapshotData) => {
        return `Project Name: ${projectName}
Project Telemetry & Snapshot Data:
${JSON.stringify(snapshotData || {}, null, 2)}

TASK: Generate a comprehensive, professional Construction Risk Analysis Report for executive project leadership based on the snapshot data above.

FORMAT YOUR RESPONSE IN THE FOLLOWING STRUCTURE:

# ${projectName}: Construction Risk Analysis Report

## Executive Summary
[Provide a thorough executive summary covering site location, current status, progress percentage, allocated budget, current spend percentage, Health Score percentage, and overall risk rating.]

## Major Risks

1. **[Major Risk Title]**: [Detailed explanation of risk root cause based on project telemetry]
   - **Probability**: [High / Medium / Low]
   - **Impact**: [High / Medium / Low]

2. **[Major Risk Title]**: [Detailed explanation of risk root cause based on project telemetry]
   - **Probability**: [High / Medium / Low]
   - **Impact**: [High / Medium / Low]

3. **[Major Risk Title]**: [Detailed explanation of risk root cause based on project telemetry]
   - **Probability**: [High / Medium / Low]
   - **Impact**: [High / Medium / Low]

## Budget & Schedule Analysis
[Provide detailed analysis of budget spend rate vs work completion velocity, schedule target deadline, and predicted overrun variance.]

## Risk Mitigation Plan
1. **[Mitigation Strategy 1]**: [Actionable PM step]
2. **[Mitigation Strategy 2]**: [Actionable PM step]
3. **[Mitigation Strategy 3]**: [Actionable PM step]
4. **[Mitigation Strategy 4]**: [Actionable PM step]`;
    },

    executiveReport: (projectName, auditLogs) => {
        return `Project: ${projectName || "Infrastructure Site"}
Audit & Progress Logs: ${JSON.stringify(auditLogs || {})}

Tasks:
1. Generate an executive summary of project status.
2. Summarize overall progress against milestones.
3. Highlight major operational issues or bottlenecks.
4. Provide actionable recommendations.`;
    },

    budgetEstimation: (params) => {
        return `Project Infrastructure Type: ${params.projectType}
Total Built-up Area: ${params.areaSqFt} Sq. Ft.
Location / City: ${params.city}
Specification & Quality Grade: ${params.qualityGrade}
Target Construction Duration: ${params.durationMonths} Months
Contingency Buffer: ${params.contingencyBuffer}

TASK: As an expert Civil Engineering Quantity Surveyor and AI Financial Cost Estimator, generate a comprehensive Project Budget Estimation Report based on the parameters above.

FORMAT YOUR RESPONSE IN THE FOLLOWING STRUCTURE:

# ${params.projectType}: AI Project Budget Estimation Report

## Executive Cost Overview
[Provide an executive summary of total estimated cost in ₹ Crores, estimated cost per sq. ft, and total duration feasibility.]

## Cost Component Allocation Breakdown
- **Civil & Structural Work (Steel, Concrete, Rebar)**: ₹XX Cr (XX%)
- **Architectural Finishes & Facade**: ₹XX Cr (XX%)
- **MEP Services (Electrical, Plumbing, HVAC, Firefighting)**: ₹XX Cr (XX%)
- **Labor, Plant & Equipment Telemetry**: ₹XX Cr (XX%)
- **Regulatory Permits, Design & Admin**: ₹XX Cr (XX%)
- **Contingency & Price Escalation Reserve (${params.contingencyBuffer})**: ₹XX Cr (XX%)

## Cashflow Spending Forecast
[Provide a phase-wise expenditure plan across Foundation, Superstructure, Services, and Handover.]

## AI Cost Optimization & Risk Mitigation
1. **[Optimization Strategy 1]**: [Actionable PM cost saving tip]
2. **[Optimization Strategy 2]**: [Actionable PM cost saving tip]
3. **[Optimization Strategy 3]**: [Actionable PM cost saving tip]`;
    }
};
