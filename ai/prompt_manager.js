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

    materialEstimation: (params, legacySpecs = "") => {
        if (typeof params === 'string') {
            return `Project: ${params || "Active Job Site"}
Specifications: ${legacySpecs || "Standard civil infrastructure building specifications"}
Tasks: Estimate material quantities (Cement, Concrete, Steel Rebar, Sand, Aggregates, Paint) with wastage and INR costs.`;
        }

        const p = params || {};
        const projName   = p.projectName || p.projName || "Active Project Site";
        const loc        = p.location    || "Metro Infrastructure Zone";
        const pType      = p.projectType || p.pType    || "Commercial Infrastructure";
        const bType      = p.buildingType|| p.bType    || "RCC Frame Structure";
        const areaSqFtRaw   = Number(p.areaSqFt)  || 50000;
        const numFloors     = Number(p.numFloors) || 12;
        const totalSqFtRaw  = p.totalAreaSqFt ? Number(p.totalAreaSqFt) : areaSqFtRaw * numFloors;
        const totalSqM      = (totalSqFtRaw / 10.764).toFixed(0);
        const soil       = p.soil       || "Clayey Soil (High Plasticity)";
        const foundation = p.foundation || "Raft / Mat Foundation";
        const wastage    = p.wastageBuffer || "8%";
        const mixRatio   = p.mixRatio   || "M25 (1:1:2)";
        const unitSystem = p.unitSystem || "Metric (SI Units)";

        // Pre-compute concrete volume for reference
        const concreteM3 = Math.round(totalSqM * 0.15 * 1.3);  // slab + beam/column coefficient
        const cementBagsNet = Math.round(concreteM3 * 7.5);      // M25 = 7.5 bags/m³
        const steelMTnet    = Math.round(concreteM3 * 0.11);     // ~110 kg/m³ for RCC
        const sandCuFtNet   = Math.round(totalSqFtRaw * 0.25);
        const aggCuFtNet    = Math.round(totalSqFtRaw * 0.36);
        const extPaintLitNet= Math.round(totalSqFtRaw * 0.05);   // exterior walls
        const intPaintLitNet= Math.round(totalSqFtRaw * 0.12);   // interior 2 coats

        return `You are CIH Material AI — a Senior Chartered Quantity Surveyor (MRICS) and Civil Cost Engineer.

PROJECT INPUT:
- Project: ${projName} | Location: ${loc}
- Sector: ${pType} | Structure: ${bType}
- Base Area: ${areaSqFtRaw.toLocaleString()} sq ft | Floors: ${numFloors} | Total: ${totalSqFtRaw.toLocaleString()} sq ft (≈${totalSqM} m²)
- Concrete Mix: ${mixRatio} | Soil: ${soil} | Foundation: ${foundation}
- Wastage Allowance: ${wastage} | Units: ${unitSystem}

CALCULATION REFERENCE (use these as your starting basis, refine with engineering judgment):
- Concrete volume ≈ ${concreteM3} m³
- Cement net ≈ ${cementBagsNet} bags (7.5 bags/m³ for M25); Coarse Agg: 0.88 m³ per m³ concrete; Fine Agg: 0.44 m³ per m³
- Steel net ≈ ${steelMTnet} MT (110 kg/m³ for RCC Frame); adjust for ${bType}
- Sand ≈ ${sandCuFtNet} cu.ft net; Coarse Aggregates ≈ ${aggCuFtNet} cu.ft net
- Paint: Exterior ≈ ${extPaintLitNet} L; Interior ≈ ${intPaintLitNet} L (2 coats)

OUTPUT FORMAT — YOU MUST FOLLOW THIS EXACT STRUCTURE. DO NOT USE TABLES. DO NOT USE PLACEHOLDER TEXT.

---

# 🏗️ Material Estimation Report — ${projName}

I have completed the Quantity Survey and Material Estimation analysis for your **${areaSqFtRaw.toLocaleString()} sq. ft. ${pType} Project** (${bType}, ${numFloors} Floors). Below is the detailed material requirement breakdown:

---

## 🧱 Cement

**Quantity:** [NET bags] Bags ([NET bags] net requirement + [WASTAGE bags] bags wastage allowance)
**Grade:** OPC 53 (IS 8112) — recommended for [brief structural rationale specific to ${bType}].
**Estimated Cost:** ₹[SUBTOTAL] (@ ₹410 / bag)

---

## 🪨 Ready-Mix Concrete (${mixRatio})

**Quantity:** [NET] Cubic Meters ([NET] net requirement + [WASTAGE] cu. m wastage allowance)
**Grade:** ${mixRatio} — designed for [brief rationale: columns, beams, slabs].
**Estimated Cost:** ₹[SUBTOTAL] (@ ₹6,200 / cu. m)

---

## 🔩 Steel Rebar (Fe 500D TMT)

**Quantity:** [NET] Metric Tons ([NET] net requirement + [WASTAGE] MT wastage allowance)
**Grade:** Fe500D IS 1786 — [brief rationale: seismic ductility, tension reinforcement].
**Estimated Cost:** ₹[SUBTOTAL] (@ ₹63,500 / MT)

---

## 🪣 River Sand / Manufactured Sand (M-Sand)

**Quantity:** [NET] Cubic Feet ([NET] net requirement + [WASTAGE] cu. ft buffer)
**Grade:** Zone-II Double-Washed M-Sand — [brief rationale: plastering, concrete mix].
**Estimated Cost:** ₹[SUBTOTAL] (@ ₹55 / cu. ft)

---

## 🪨 Coarse Aggregates (20mm)

**Quantity:** [NET] Cubic Feet ([NET] net requirement + [WASTAGE] cu. ft buffer)
**Grade:** Well-graded 20mm Crushed Stone — [brief rationale].
**Estimated Cost:** ₹[SUBTOTAL] (@ ₹42 / cu. ft)

---

## 🎨 Exterior and Interior Paint

**Quantity:** [TOTAL] Litres Total ([EXT] Litres Exterior + [INT] Litres Interior)
**Specification:** 1 coat alkali-resistant primer + 2 coats weather-shield acrylic emulsion.
**Estimated Cost:** ₹[SUBTOTAL]

---

## 💧 Waterproofing Compound

**Quantity:** [QTY] Litres
**Specification:** Crystalline admixture for foundation, roof slab, and basement waterproofing.
**Estimated Cost:** ₹[SUBTOTAL] (@ ₹680 / L)

---

## 💰 Grand Total Estimated Material Budget

**₹[GRAND TOTAL]** *(Includes ${wastage} total site buffer and wastage allowance)*

---

## 📋 Executive Recommendations & Strategic Directives

**1. Storage and Moisture Management:**
[Specific advice for cement and aggregate storage on this site]

**2. Phased Procurement of Steel:**
[Specific phased delivery recommendation with tonnage splits for ${steelMTnet} MT]

**3. Quality Testing and Mix Verification:**
[Mandatory cube test schedule for ${mixRatio} concrete]

**4. Wastage Optimization:**
[Site monitoring protocol to stay within ${wastage} threshold for ${soil} site conditions]

---
IMPORTANT RULES:
- Replace every [bracketed placeholder] with a real calculated number
- Quantities must be consistent: wastage = net × wastage rate
- All INR amounts must use Indian number formatting (₹X,XX,XXX)
- Grand Total must equal sum of all subtotals`;
    },

    quantitySurveying: (params) => CIH_PROMPTS.materialEstimation(params),

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
    },

    /**
     * Helper to auto-detect document preset type if not explicitly supplied
     */
    detectDocumentPreset: (docTitle = "", docContent = "") => {
        const text = `${docTitle} ${docContent}`.toLowerCase();
        if (text.includes("boq") || text.includes("bill of quantities") || text.includes("quantities bill") || text.includes("schedule of rates") || text.includes("sor")) {
            return "boq";
        }
        if (text.includes("dpr") || text.includes("daily progress") || text.includes("site report") || text.includes("work completed today") || text.includes("manpower count") || text.includes("shift report")) {
            return "dpr";
        }
        if (text.includes("contract") || text.includes("agreement") || text.includes("clauses") || text.includes("liquidated") || text.includes("liability") || text.includes("indemnity") || text.includes("subcontractor")) {
            return "contract";
        }
        if (text.includes("invoice") || text.includes("tax invoice") || text.includes("bill to") || text.includes("amount payable") || text.includes("gstin") || text.includes("payment due")) {
            return "invoice";
        }
        return "general";
    },

    /**
     * AI Insights: Document Intelligence Prompt — unified executive report structure
     */
    documentAnalysis: (docTitle, docContent, presetType = "general") => {
        const detectedType = presetType || CIH_PROMPTS.detectDocumentPreset(docTitle, docContent);
        const title = docTitle || "Uploaded Construction Document";
        const timestamp = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const rawContent = (docContent || "").trim();
        const maxChars = 14000;
        const truncatedNote = rawContent.length > maxChars
            ? "\n\n[Document text truncated to fit model context. Analyze only the text provided.]"
            : "";
        const boundedContent = (rawContent.slice(0, maxChars) || "Not specified in document") + truncatedNote;

        const typeHints = {
            boq: "Bill of Quantities — emphasize quantities, unit rates, material specs, and cost totals found in the file.",
            dpr: "Daily Progress Report — emphasize site activity, manpower, equipment, and delay logs found in the file.",
            contract: "Legal Contract — emphasize clauses, penalties, milestones, liability, and governance found in the file.",
            invoice: "Commercial Invoice — emphasize line items, taxes, vendor details, and payment terms found in the file.",
            general: "General construction document — extract only contractual, technical, and operational facts present in the file."
        };
        const typeHint = typeHints[detectedType.toLowerCase()] || typeHints.general;

        return `You are CIH Document Intelligence AI — a Senior Construction Contract Auditor and Chartered Cost Engineer.

TASK:
Analyze ONLY the uploaded document text below. Generate a structured executive intelligence report. Every fact, number, date, party, quantity, and clause MUST come from the document. Do not invent data, typical industry values, or missing clauses.

DOCUMENT CONTEXT:
Document Name: "${title}"
Document Classification: ${detectedType.toUpperCase()}
Analysis Date: ${timestamp}
Document Type Focus: ${typeHint}

FULL DOCUMENT TEXT:
"""
${boundedContent}
"""

STRICT RULES:
1. Use ONLY information present in the document text above.
2. If a heading has no relevant data in the document, write "Not specified in document" for that item. Do not guess.
3. Do not mention APIs, databases, backends, or software architecture.
4. Follow the EXACT section headings and order below. Do not add extra top-level sections.

OUTPUT FORMAT (use this exact markdown structure):

# Document Intelligence Report

## Document Name
${title}

## Executive Summary
[Write 2–3 paragraphs covering document purpose, scope, key parties, and critical findings — derived only from the uploaded text.]

## Key Contractual Matrix & Specification
[Bullet list drawn only from the document. Cover these items when present; otherwise write "Not specified in document":
- Scope of work / deliverables
- Key quantities, rates, or budget figures (quote values from the document)
- Quality / material specifications and standards
- Milestones, deadlines, and delivery schedules
- Payment terms, penalties, and liquidated damages
- Parties, references, and governing terms]

## Identify Contract Risks
[Each risk MUST be a bullet in this exact pattern:
- **Risk:** [title] | **Severity:** High/Medium/Low | **Evidence:** [quote or paraphrase from document] | **Impact:** [consequence implied by the document]
List only risks supported by the uploaded text.]

## Practical Recommendation Set
[Numbered list of 5–8 actionable recommendations. Each recommendation must reference a finding or risk from this document. Be specific for site engineers, quantity surveyors, and project directors.]

---
*Generated by Construction Intelligent Hub AI via local Ollama inference • ${timestamp}*`;
    }
};
