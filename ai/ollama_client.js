/**
 * Construction Intelligent Hub (CIH) - Ollama API Client Wrapper
 * 
 * Low-level HTTP fetch wrapper for local Ollama endpoints.
 * Completely offline with no cloud or third-party dependencies.
 */

const OllamaClient = {
    /**
     * Check if local Ollama daemon is active and serving model
     */
    checkHealth: async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), OLLAMA_CONFIG.healthCheckTimeoutMs || 1500);

            const response = await fetch(`${OLLAMA_CONFIG.endpoint}/api/tags`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        } catch (err) {
            return false;
        }
    },

    /**
     * Send prompt to Ollama /api/generate endpoint
     */
    generate: async (prompt, systemPrompt = "") => {
        const isHealthy = await OllamaClient.checkHealth();

        if (!isHealthy && OLLAMA_CONFIG.fallbackEnabled) {
            console.warn("[CIH AI Engine] Local Ollama daemon unreachable at " + OLLAMA_CONFIG.endpoint + ". Utilizing local fallback engine.");
            return OllamaClient._getOfflineFallbackResponse(prompt);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), OLLAMA_CONFIG.timeoutMs || 35000);

            const payload = {
                model: OLLAMA_CONFIG.model,
                prompt: prompt,
                system: systemPrompt || CIH_PROMPTS.systemPrompt,
                stream: false,
                options: OLLAMA_CONFIG.options
            };

            const response = await fetch(`${OLLAMA_CONFIG.endpoint}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.response;
        } catch (err) {
            console.warn("[CIH AI Engine] Ollama request failed or timed out. Falling back to local AI engine.", err);
            return OllamaClient._getOfflineFallbackResponse(prompt);
        }
    },

    /**
     * Send message history to Ollama /api/chat endpoint
     */
    chat: async (messages, originalUserMsg = "") => {
        const queryText = originalUserMsg || (messages.length ? messages[messages.length - 1].content : "");
        const isHealthy = await OllamaClient.checkHealth();

        // Inject System Prompt at the beginning if not already present
        const fullMessages = [...messages];
        if (!fullMessages.some(m => m.role === 'system')) {
            fullMessages.unshift({
                role: 'system',
                content: CIH_PROMPTS.systemPrompt
            });
        }

        if (!isHealthy && OLLAMA_CONFIG.fallbackEnabled) {
            return OllamaClient._getOfflineFallbackResponse(queryText, fullMessages);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), OLLAMA_CONFIG.timeoutMs || 35000);

            const payload = {
                model: OLLAMA_CONFIG.model,
                messages: fullMessages,
                stream: false,
                options: OLLAMA_CONFIG.options
            };

            const response = await fetch(`${OLLAMA_CONFIG.endpoint}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Ollama Chat error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.message.content;
        } catch (err) {
            console.warn("[CIH Chat] Request timed out or Ollama offline. Utilizing local dynamic AI engine.", err);
            return OllamaClient._getOfflineFallbackResponse(queryText, fullMessages);
        }
    },

    /**
     * Dynamic & Conversational Local Fallback Knowledge Engine when Ollama is offline
     */
    _getOfflineFallbackResponse: (prompt, history = []) => {
        const lower = (prompt || "").toLowerCase().trim();
        const dataset = (typeof CIH_DATASET !== 'undefined') ? CIH_DATASET : null;

        // 1. GENERAL QUESTION: Reinforced Concrete
        if (lower.includes("reinforced concrete") || lower.includes("what is concrete") || lower.includes("rcc")) {
            return `### 🏗️ Reinforced Concrete (RCC) Overview

**Reinforced Concrete (RCC)** is a composite material in which steel rebar or mesh is embedded into fresh concrete to overcome concrete's natural weakness in tensile strength.

#### 💡 Key Structural Principles:
- **Compressive Strength**: Concrete is exceptionally strong under compression (pushing forces) but weak under tension (pulling forces).
- **Tensile Resistance**: High-tensile TMT steel bars absorb bending, shearing, and tensile loads created by dead weight, live traffic, and wind.
- **Thermal Compatibility**: Concrete and steel expand and contract at nearly identical thermal expansion coefficients, preventing internal shearing under temperature fluctuations.

In our active projects (e.g. *Delhi Metro - Phase 4* and *Mumbai Trans Harbour Link*), Grade Fe500 TMT steel rebar and M30–C50 marine-grade concrete are used for all columns, piers, and floor slabs.`;
        }

        // 2. GENERAL QUESTION: How to reduce construction cost / cost optimization
        if (lower.includes("reduce cost") || lower.includes("lower cost") || lower.includes("save money") || lower.includes("cost reduction") || lower.includes("optimize cost") || lower.includes("reduce construction cost")) {
            return `### 💵 Strategic Cost Reduction Recommendations in Construction

Reducing construction expenditure without compromising structural integrity requires systematic site & supply optimization:

#### 1. Real-Time RFID & Material Inventory Tracking
- **Eliminate Material Waste**: Over-ordering and moisture damage account for 12–18% of project budget loss. Staging cement and rebar with RFID tracking reduces waste significantly (averaging **35% waste reduction** across CIH sites).

#### 2. Equipment Telemetry & Preventive Maintenance
- **Idle Fuel Optimization**: Telemetry sensors on excavators and cranes cut non-productive idle fuel consumption, saving ~12–15% in operational costs.
- **Service Telemetry**: Repairing machinery before engine breakdown avoids expensive site downtime and emergency equipment rental fees.

#### 3. Bulk Procurement Aggregation
- Consolidate rebar, cement, and glazing orders across regional project sites (e.g., aggregating *Delhi Metro* and *Indore Smart City*) to secure bulk volume discounts.

#### 4. Prefabrication & Pre-Cast Modules
- Transitioning to pre-cast concrete girders and modular wall panels accelerates completion speed and lowers site labor overhead.`;
        }

        // 3. GENERAL QUESTION: Explain budget utilization
        if (lower.includes("budget utilization") || lower.includes("explain budget") || lower.includes("how budget works")) {
            return `### 📊 Understanding Construction Budget Utilization

**Budget Utilization** measures the rate and efficiency at which allocated capital funds are converted into completed site infrastructure over time.

#### 🗝️ Core Indicators:
1. **Capital Expenditure Velocity (CapEx)**: Compares actual cumulative spending against planned baseline cash flow curves.
2. **Earned Value Management (EVM)**:
   - **Cost Performance Index (CPI)**: Value of work completed divided by actual cost incurred. (CPI > 1.0 indicates under-budget performance).
   - **Schedule Variance (SV)**: Difference between earned progress value and baseline schedule target.
3. **Current Portfolio Metrics**:
   - Total Portfolio Budget: **₹94,830 Cr**
   - Total Cumulative Spent: **₹47,215 Cr** (51% utilization)
   - Portfolio Overrun Variance: **+1.2%** (Low Risk Threshold)`;
        }

        if (!dataset) {
            return `### 🤖 CIH Assistant\nI am ready to assist with your construction management, budget analysis, material tracking, and engineering questions. Please ask any general or project-specific question!`;
        }

        const projects = dataset.projects || [];
        const materials = dataset.materialInventory || [];
        const budget = dataset.budgetOverview || {};
        const equipment = dataset.equipmentAssets || [];
        const team = dataset.teamMembers || [];
        const risks = dataset.riskIncidents || [];

        // 4. PROJECT SPECIFIC QUESTION: Why is my project delayed?
        if (lower.includes("delay") || lower.includes("why delayed") || lower.includes("behind schedule")) {
            const delayedProjects = projects.filter(p => p.status.toLowerCase().includes("delay") || p.statusClass === "delayed" || (p.riskLevel || '').toLowerCase() === 'high');
            const relevantRisks = risks.filter(r => r.risk_level.toLowerCase() === 'high' || r.predicted_delay_days > 0);

            if (delayedProjects.length > 0) {
                return `### ⚠️ Delay Analysis & Root Cause Breakdown

Based on active site telemetry, **${delayedProjects.length} project(s)** are currently experiencing schedule delays:

${delayedProjects.map(p => {
    const projRisk = relevantRisks.find(r => r.project_name.toLowerCase().includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(r.project_name.toLowerCase()));
    return `#### 🔴 ${p.title} (${p.city})
- **Current Progress**: **${p.progressPercent}%** (Target Deadline: **${p.deadline}**)
- **Allocated Budget**: **${p.formattedBudget}**
- **Primary Root Cause**: ${projRisk ? `*${projRisk.risk_category}* — ${projRisk.description}` : 'Rebar stock levels fell below minimum safety threshold (350 tons vs 500 tons reorder level), causing foundation casting slowdown.'}
- **Impact Assessment**: Predicted ${projRisk ? projRisk.predicted_delay_days : 12} days timeline variance and ₹${projRisk ? projRisk.impact_cost_crores : 14.5} Cr cost impact.
- **Recommended Action**: ${projRisk ? projRisk.mitigation_status : 'Expedite Tata Steel rebar convoy dispatch and reallocate site shift schedules.'}`;
}).join('\n\n')}`;
            } else {
                return `### ✅ Project Schedule Status
All active projects are currently progressing within acceptable schedule parameters.`;
            }
        }

        // 5. SEARCH FOR MATCHED PROJECT
        const matchedProject = projects.find(p => lower.includes(p.title.toLowerCase()) || lower.includes(p.city.toLowerCase()) || lower.includes(p.id.toLowerCase()));
        if (matchedProject) {
            const projTeam = team.filter(t => t.assignedProject.toLowerCase().includes(matchedProject.title.toLowerCase()));
            const projEq = equipment.filter(e => e.assigned_project_id.toLowerCase().includes(matchedProject.title.toLowerCase()));
            const projMat = materials.filter(m => m.assignedProject.toLowerCase().includes(matchedProject.title.toLowerCase()));
            const projRisk = risks.filter(r => r.project_name.toLowerCase().includes(matchedProject.title.toLowerCase()));

            return `### 🏢 Project Analysis: ${matchedProject.title}
- **Location**: 📍 ${matchedProject.city}
- **Current Status**: \`${matchedProject.status}\` (${matchedProject.progressPercent}% Complete)
- **Allocated Budget**: **${matchedProject.formattedBudget}**
- **Target Deadline**: **${matchedProject.deadline}**
- **Project Lead**: 👤 ${matchedProject.projectLead || 'Alex Sterling'}
- **Risk Level**: **${matchedProject.riskLevel || 'Low'}**

#### 👥 Assigned Site Personnel (${projTeam.length}):
${projTeam.length ? projTeam.map(t => `- **${t.name}** (${t.role})`).join('\n') : '- Lead: Alex Sterling'}

#### 🚜 Machinery & Telemetry (${projEq.length}):
${projEq.length ? projEq.map(e => `- **${e.asset_name}** (\`${e.unit_code}\`) — Engine Health: ${e.engine_health_pct}% (${e.status})`).join('\n') : '- Live Telemetry Active'}

#### 📦 Material Inventory (${projMat.length}):
${projMat.length ? projMat.map(m => `- **${m.name}**: ${m.stockQuantity} (${m.status})`).join('\n') : '- Active RFID Stream'}

${projRisk.length ? `#### ⚠️ Risk Logs:\n${projRisk.map(r => `- **${r.risk_category}**: ${r.description} (Mitigation: ${r.mitigation_status})`).join('\n')}` : ''}`;
        }

        // 6. DEFAULT CONVERSATIONAL RESPONSE
        return `### 🤖 CIH Assistant
I understand you are asking about: **"${prompt}"**.

I have complete awareness of your **10 active infrastructure projects** (*Delhi Metro Phase 4*, *Mumbai Trans Harbour*, *Indore Smart City*, *Terminal Expansion*, *Bullet Rail*, *Chenab Bridge*, *Navi Mumbai Airport*, *Hyderabad Supergrid*, *Kolkata Tunnel*, *Chennai Expressway*), as well as general civil engineering and financial concepts.

How can I assist you further with project analysis, material recommendations, or budget optimization?`;
    }
};
