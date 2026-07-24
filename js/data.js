/**
 * Construction Intelligent Hub (CIH) - Centralized Dummy Dataset
 * 
 * Modular dataset structured to mirror production REST API responses.
 * In the future, replace these objects with async fetch() calls to your backend API endpoints.
 */

// Global App Dataset State
const CIH_DATASET = {
    // Platform Overall Statistics (Landing Page & Global Dashboard)
    metrics: [
        { id: "stat-1", value: "$12B+", label: "PROJECTS MANAGED", subtext: "Total infrastructure portfolio volume" },
        { id: "stat-2", value: "35%", label: "AVG. WASTE REDUCTION", subtext: "Driven by RFID & material AI" },
        { id: "stat-3", value: "500+", label: "ACTIVE JOB SITES", subtext: "Monitored across 18 countries" },
        { id: "stat-4", value: "150%", label: "RETURN ON INVESTMENT", subtext: "Average client ROI in Year 1" }
    ],

    // AI Intelligence Modules
    aiModules: [
        {
            id: "mod-cost",
            title: "AI Cost Estimation",
            description: "Predict budget overruns with 98% accuracy using historical data and real-time fluctuations of raw materials.",
            icon: "📊",
            theme: "light",
            type: "chart",
            bars: [35, 55, 42, 92, 48, 75]
        },
        {
            id: "mod-material",
            title: "Material Tracking",
            description: "Live RFID & Computer Vision tracking for every parcel on-site. Eliminate supply chain bottlenecks in real-time.",
            icon: "📦",
            theme: "light",
            type: "stream",
            statusBadge: { text: "📡 RFID Sensor Gate #4", state: "● LIVE STREAM", color: "#10B981" }
        },
        {
            id: "mod-risk",
            title: "Risk Prediction",
            description: "Automated safety, audit and delay forecasting using neural networks trained on 10,000+ site incident logs.",
            icon: "⚠️",
            theme: "dark",
            type: "status",
            statusBadge: { label: "Status: Monitoring", status: "✓ All Clear", color: "#10B981" }
        },
        {
            id: "mod-equip",
            title: "Equipment Intelligence",
            description: "Predictive maintenance schedules for heavy machinery based on engine telemetry and operator usage patterns.",
            icon: "🚜",
            theme: "wide",
            type: "wide_image",
            linkText: "Explore Analytics →",
            image: "assets/equipment.png"
        }
    ],

    // Active Infrastructure Projects (Logged-In Dashboard Dataset)
    projects: [
        {
            id: "proj-delhi-metro",
            title: "Delhi Metro - Phase 4",
            city: "New Delhi, India",
            icon: "🚆",
            status: "On Track",
            statusClass: "on-track",
            budgetCrores: 4200,
            formattedBudget: "₹4,200 Cr",
            deadline: "Oct 24, 2025",
            progressPercent: 68,
            teamAvatars: ["AS", "RK", "AM"],
            totalTeamCount: 15
        },
        {
            id: "proj-mumbai-trans",
            title: "Mumbai Trans Harbour",
            city: "Mumbai, India",
            icon: "📄",
            status: "In Review",
            statusClass: "in-review",
            budgetCrores: 18000,
            formattedBudget: "₹18,000 Cr",
            deadline: "Dec 15, 2024",
            progressPercent: 92,
            teamAvatars: ["AS", "VS"],
            totalTeamCount: 10
        },
        {
            id: "proj-indore-smart",
            title: "Indore Smart City Hub",
            city: "Indore, India",
            icon: "🏢",
            status: "Delayed",
            statusClass: "delayed",
            budgetCrores: 850,
            formattedBudget: "₹850 Cr",
            deadline: "Jan 10, 2026",
            progressPercent: 35,
            teamAvatars: ["AS"],
            totalTeamCount: 6
        },
        {
            id: "proj-bangalore-airport",
            title: "International Terminal Exp.",
            city: "Bangalore, India",
            icon: "✈️",
            status: "On Track",
            statusClass: "on-track",
            budgetCrores: 12400,
            formattedBudget: "₹12,400 Cr",
            deadline: "Aug 30, 2025",
            progressPercent: 52,
            teamAvatars: ["AS", "PD"],
            totalTeamCount: 26
        }
    ],

    // Live RFID Supply Chain Feed Dataset
    rfidFeed: [
        { id: "MAT-901", description: "Structural Steel Beams (Grade A572)", location: "Zone 4 - Crane B", status: "On-Site Verified", statusClass: "green" },
        { id: "MAT-902", description: "Ready-Mix Concrete Batch #14", location: "Gate 2 Transit (0.4 mi)", status: "In Transit", statusClass: "amber" },
        { id: "MAT-903", description: "Double-Pane Facade Glass Panels", location: "Bay A Warehouse", status: "Staged", statusClass: "green" },
        { id: "MAT-904", description: "Rebar Bundles #22", location: "Zone 1 Foundation", status: "Consuming", statusClass: "green" }
    ],

    // Equipment Telemetry Dataset
    equipmentAssets: [
        {
            id: "EQ-09",
            name: "CAT 349 Excavator",
            unitCode: "Unit #EX-09",
            engineHealth: "99%",
            healthStatus: "Optimal",
            fuelConsumption: "14.2 L/hr",
            predictiveMaintenance: "In 280 operating hours"
        },
        {
            id: "CR-02",
            name: "Liebherr LTM 1250 Crane",
            unitCode: "Unit #CR-02",
            engineHealth: "96%",
            healthStatus: "Good",
            fuelConsumption: "18.5 L/hr",
            predictiveMaintenance: "In 140 operating hours"
        }
    ]
};

// API Helper Mock Functions (Ready for real fetch() replacement)
const CIH_API = {
    getProjects: () => Promise.resolve(CIH_DATASET.projects),
    getMetrics: () => Promise.resolve(CIH_DATASET.metrics),
    getModules: () => Promise.resolve(CIH_DATASET.aiModules),
    getRfidFeed: () => Promise.resolve(CIH_DATASET.rfidFeed),
    getEquipment: () => Promise.resolve(CIH_DATASET.equipmentAssets),
    
    // Create new project dynamically in state
    addProject: (newProject) => {
        CIH_DATASET.projects.push(newProject);
        return Promise.resolve(newProject);
    },

    // Delete project dynamically from state
    deleteProject: (projectId) => {
        CIH_DATASET.projects = CIH_DATASET.projects.filter(p => p.id !== projectId);
        return Promise.resolve(true);
    }
};
