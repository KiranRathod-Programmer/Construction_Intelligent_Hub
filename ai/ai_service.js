/**
 * Construction Intelligent Hub (CIH) - High-Level AI Service Facade
 * 
 * Exposes clean, modular business logic methods for all application pages.
 * Fully decoupled from UI DOM logic and Ollama network endpoints.
 * Primary Default Model: Llama 3.2 (llama3.2)
 */

const CIH_AI_SERVICE = {
    /**
     * File Validator for Document Uploads
     */
    validateUploadedDocumentFile: (file) => {
        if (!file) {
            return { valid: false, message: "No file selected." };
        }

        const maxSizeBytes = 15 * 1024 * 1024; // 15 MB limit
        if (file.size > maxSizeBytes) {
            return { valid: false, message: `File size exceeds 15 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).` };
        }

        if (file.size === 0) {
            return { valid: false, message: "Selected file is empty (0 bytes)." };
        }

        const allowedExtensions = ['.pdf', '.txt', '.json', '.csv', '.md', '.doc', '.docx'];
        const fileName = file.name.toLowerCase();
        const hasValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!hasValidExt) {
            return { valid: false, message: `Unsupported file format. Please upload a PDF, TXT, CSV, JSON, or MD document.` };
        }

        return { valid: true, message: "File validated successfully." };
    },

    /**
     * Extract readable text from uploaded files (PDF, TXT, JSON, CSV, MD)
     */
    extractTextFromFile: async (file) => {
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.pdf')) {
            const arrayBuffer = await file.arrayBuffer();

            // 1. Try PDF.js if available on window
            if (typeof window.pdfjsLib !== 'undefined') {
                try {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdfDoc = await loadingTask.promise;
                    let fullText = '';

                    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                        const page = await pdfDoc.getPage(pageNum);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
                    }

                    if (fullText.trim().length > 20) {
                        return fullText.trim();
                    }
                } catch (pdfErr) {
                    console.warn("[CIH PDF.js] Standard PDF.js worker extraction fallback.", pdfErr);
                }
            }

            // 2. Fallback Binary Stream PDF Text Extractor
            const textDecoder = new TextDecoder('latin1');
            const binaryString = textDecoder.decode(arrayBuffer);

            // Extract text tokens inside (text) Tj or [(text)] TJ
            const textMatches = [];
            const tjRegex = /\(([^()]+)\)\s*Tj/g;
            let match;
            while ((match = tjRegex.exec(binaryString)) !== null) {
                if (match[1] && match[1].trim().length > 1) {
                    textMatches.push(match[1].trim());
                }
            }

            const tjArrayRegex = /\[\s*\(([^()]+)\)[\s\S]*?\]\s*TJ/g;
            while ((match = tjArrayRegex.exec(binaryString)) !== null) {
                if (match[1] && match[1].trim().length > 1) {
                    textMatches.push(match[1].trim());
                }
            }

            if (textMatches.length > 5) {
                return textMatches.join(' ');
            }

            // Fallback plain text stream clean up
            const cleanedText = binaryString.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/stream[\s\S]*?endstream/g, ' ')
                .trim();

            if (cleanedText.length > 80) {
                return cleanedText.substring(0, 15000);
            }

            throw new Error(`Could not extract readable text from PDF "${file.name}". Try a text-based PDF or a TXT/CSV/JSON/MD file.`);
        } else {
            // Text-based files (.txt, .json, .csv, .md)
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result || '');
                reader.onerror = (e) => reject(e);
                reader.readAsText(file);
            });
        }
    },

    /**
     * Material Management AI: Quantity Estimation & Recommendations (Live Llama 3.2 Inference)
     */
    estimateMaterials: async (paramsOrProjectName, specs = "", modelName = "llama3.2") => {
        let prompt;
        let projTitle = "Active Infrastructure Site";

        if (typeof paramsOrProjectName === 'object' && paramsOrProjectName !== null) {
            prompt = CIH_PROMPTS.materialEstimation(paramsOrProjectName);
            projTitle = paramsOrProjectName.projectName || paramsOrProjectName.projName || "Active Infrastructure Site";
        } else {
            prompt = CIH_PROMPTS.materialEstimation(paramsOrProjectName, specs);
            projTitle = paramsOrProjectName || "Active Infrastructure Site";
        }

        const systemPrompt = `You are CIH Material AI — a Senior Chartered Quantity Surveyor (MRICS) and Civil Cost Engineer for Construction Intelligent Hub.

ABSOLUTE RULES — NEVER VIOLATE:
1. Replace EVERY [bracketed placeholder] with a real, calculated number. Zero placeholders allowed in output.
2. Each material section must show: net quantity + wastage quantity = total, plus INR cost.
3. Grand Total = arithmetic sum of all material subtotals. Show the number.
4. Use Indian number formatting: ₹X,XX,XXX (lakhs notation).
5. Executive Recommendations must be specific to the project parameters given — not generic advice.`;

        const response = await OllamaClient.generate(prompt, systemPrompt, modelName);
        return {
            projectName: projTitle,
            prompt: prompt,
            rawText: response,
            html: AIUtils.formatMarkdownToHTML(response)
        };
    },

    /**
     * Quantity Surveying Analysis Facade for Material Telemetry
     */
    generateQuantitySurveyingAnalysis: async (materialData, modelName = "llama3.2") => {
        return CIH_AI_SERVICE.estimateMaterials(materialData, "", modelName);
    },



    /**
     * Budget Management AI: Interactive Project Budget Estimation (Defaults to Llama 3.2)
     */
    estimateProjectBudget: async (params, modelName = "llama3.2") => {
        const p = params || {
            projectType: 'Commercial High-Rise Tower',
            areaSqFt: '250,000',
            city: 'Mumbai (Coastal / Metro)',
            qualityGrade: 'Standard Commercial',
            durationMonths: '24',
            contingencyBuffer: '10%'
        };

        const prompt = CIH_PROMPTS.budgetEstimation(p);
        const systemPrompt = `You are CIH Financial AI, an expert civil engineering quantity surveyor and cost estimator for Construction Intelligent Hub. Evaluate project parameters and generate structured, accurate budget estimations.`;

        const response = await OllamaClient.generate(prompt, systemPrompt, modelName);

        return {
            params: p,
            rawText: response,
            html: AIUtils.formatMarkdownToHTML(response)
        };
    },

    /**
     * Budget Management AI: Spending Analysis & Overrun Prediction (Defaults to Llama 3.2)
     */
    analyzeBudget: async (projectName, totalBudget, spent, categoryList, modelName = "llama3.2") => {
        const prompt = CIH_PROMPTS.budgetAnalysis(projectName, totalBudget, spent, categoryList);
        const response = await OllamaClient.generate(prompt, CIH_PROMPTS.systemPrompt, modelName);
        return {
            prompt: prompt,
            rawText: response,
            html: AIUtils.formatMarkdownToHTML(response)
        };
    },

    /**
     * Risk Analysis AI: Dynamic Llama 3.2 Risk Report & Mitigation Plan Generator (Defaults to Llama 3.2)
     */
    evaluateRisk: async (projectName, snapshotData, modelName = "llama3.2") => {
        const snap = snapshotData || (typeof CIH_DATASET !== 'undefined' ? CIH_DATASET.getProjectSnapshot(projectName) : { title: projectName, city: 'Site', status: 'Active', progressPercent: 50, formattedBudget: '₹1,000 Cr', deadline: 'Dec 2026' });

        const prompt = CIH_PROMPTS.riskAssessment(projectName, snap);
        const systemPrompt = `You are CIH Risk AI, an expert civil engineering risk analyst for Construction Intelligent Hub. Evaluate project telemetry and generate clean, structured, executive risk analysis reports.`;

        const response = await OllamaClient.generate(prompt, systemPrompt, modelName);

        return {
            projectName: snap.title,
            snapshot: snap,
            rawText: response,
            html: AIUtils.formatMarkdownToHTML(response)
        };
    },

    /**
     * Reports AI: Executive Project Performance & Audit Generator (Defaults to Llama 3.2)
     */
    generateExecutiveReport: async (projectName, reportFrequency = 'Weekly Report', modelName = "llama3.2") => {
        const snap = (typeof CIH_DATASET !== 'undefined' && typeof CIH_DATASET.getProjectSnapshot === 'function')
            ? CIH_DATASET.getProjectSnapshot(projectName)
            : { title: projectName, city: 'Site', status: 'Active', progressPercent: 50, formattedBudget: '₹1,000 Cr', deadline: 'Dec 2026' };

        const freq = reportFrequency || 'Weekly Report';

        const progressSummary = `${snap.progressPercent}% completion achieved against milestone targets for target completion date ${snap.deadline}. Current status is marked as '${snap.status}'.`;
        const budgetSummary = `Allocated portfolio budget: ${snap.budget}. Current capital spend stands at ${snap.spentPercent}% with an estimated variance of +1.8%.`;
        const riskSummary = `Overall project risk is evaluated as '${snap.suggestedRiskLevel || 'MEDIUM'}'. Active site environmental hazard: ${snap.weatherHazard}.`;
        const materialSummary = `Total inventory parcels tracked: ${snap.materialsCount || 3} items. ${(snap.lowStockMaterialsCount || 0) > 0 ? `⚠️ Low stock alert for ${snap.lowStockMaterialsCount} item(s) requiring re-order.` : 'All material inventory stock levels remain optimal.'}`;
        const teamSummary = `Site operations led by ${snap.projectLead || 'Alex Sterling'} with ${snap.teamCount || 1} assigned specialist(s) actively conducting on-site engineering supervision.`;
        const recommendations = [
            `Maintain regular supply re-order cycles to prevent stock bottlenecks at ${snap.title}.`,
            `Conduct milestone risk audits with lead engineers to ensure schedule compliance before ${snap.deadline}.`,
            `Optimize heavy equipment fuel telemetry and schedule preventive maintenance checks on-site.`
        ];

        return {
            projectName: snap.title,
            frequency: freq,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            snapshot: snap,
            sections: {
                progress: progressSummary,
                budget: budgetSummary,
                risks: riskSummary,
                materials: materialSummary,
                team: teamSummary,
                recommendations: recommendations
            }
        };
    },

    /**
     * AI Insights 1: PDF & Construction Document Analyzer (Mandates Llama 3.2)
     */
    analyzeUploadedDocument: async (docTitle, docContent, modelName = "llama3.2", presetType = null) => {
        const title = docTitle || "Uploaded Construction Document";
        const text = (docContent && String(docContent).trim()) ? String(docContent).trim() : "";

        if (!text) {
            throw new Error("No document content provided for analysis. Upload a readable PDF/TXT/CSV/JSON/MD file first.");
        }

        const detectedPreset = presetType || (typeof CIH_PROMPTS !== 'undefined' ? CIH_PROMPTS.detectDocumentPreset(title, text) : "general");
        const prompt = CIH_PROMPTS.documentAnalysis(title, text, detectedPreset);
        const systemPrompt = `You are CIH Document Intelligence AI — a Senior Construction Contract Auditor and Chartered Cost Engineer. Analyze only the uploaded document text. Never invent facts, rates, parties, or clauses. If information is missing, write "Not specified in document". Output the exact markdown headings requested in the user prompt.`;

        const activeModel = modelName || "llama3.2";
        const response = await OllamaClient.generate(prompt, systemPrompt, activeModel, true, {
            temperature: 0.2,
            top_p: 0.9,
            num_predict: 1800
        });

        if (!response || !String(response).trim()) {
            throw new Error("Ollama returned an empty report. Ensure the selected model is pulled and try Generate again.");
        }

        return {
            docTitle: title,
            presetType: detectedPreset,
            prompt: prompt,
            rawText: String(response).trim(),
            html: AIUtils.formatMarkdownToHTML(response)
        };
    },

    /**
     * AI Insights 1 (Chatbot): Document-Specific Q&A (Defaults to Llama 3.2)
     */
    chatWithUploadedDocument: async (docContent, userQuestion, modelName = "llama3.2") => {
        const text = docContent || "Construction Agreement & BOQ Document Context";
        const q = userQuestion || "What is the penalty for delay?";

        const systemPrompt = `You are a Document AI Assistant powered by Llama 3.2. You must answer questions STRICTLY based on the provided document text below. If the answer cannot be found in the document, state clearly that the document does not mention it.

DOCUMENT CONTENT:
"""
${text}
"""`;

        const prompt = `User Question: "${q}"\n\nAnswer strictly from the document content provided. Keep response concise, accurate, and structured with bullet points.`;

        const response = await OllamaClient.generate(prompt, systemPrompt, modelName);
        return {
            question: q,
            rawText: response,
            html: AIUtils.formatMarkdownToHTML(response)
        };
    },

    /**
     * AI Insights 3: Predictive AI Forecast — live Ollama (llama3.2) from project telemetry
     */
    generateProjectForecast: async (projectName, modelName = "llama3.2") => {
        const snap = (typeof CIH_DATASET !== 'undefined' && typeof CIH_DATASET.getProjectSnapshot === 'function')
            ? CIH_DATASET.getProjectSnapshot(projectName)
            : {
                title: projectName,
                city: 'Site',
                status: 'Active',
                progressPercent: 65,
                budget: '₹4,200 Cr',
                formattedBudget: '₹4,200 Cr',
                deadline: 'Dec 15, 2026',
                spentPercent: 45,
                teamCount: 1,
                lowStockMaterialsCount: 0,
                suggestedRiskLevel: 'MEDIUM'
            };

        const projectData = {
            title: snap.title || projectName || "Active Project",
            city: snap.city || "Not specified",
            progressPercent: snap.progressPercent,
            deadline: snap.deadline || "Not specified",
            formattedBudget: snap.formattedBudget || snap.budget || "Not specified",
            status: snap.status || "Not specified",
            riskLevel: snap.riskLevel || snap.suggestedRiskLevel || "Not specified",
            spentPercent: snap.spentPercent,
            teamCount: snap.teamCount,
            lowStockMaterialsCount: snap.lowStockMaterialsCount
        };

        const prompt = CIH_PROMPTS.predictiveForecast(projectData);
        const systemPrompt = `You are CIH Forecast AI, a Senior Construction Operations Analyst. Write a simple, owner-friendly project forecast using only the supplied project details. Do not invent numbers, dates, or project names. Do not use placeholders.`;
        const activeModel = modelName || "llama3.2";

        const response = await OllamaClient.generate(prompt, systemPrompt, activeModel, true, {
            temperature: 0.3,
            top_p: 0.9,
            num_predict: 900
        });

        if (!response || !String(response).trim()) {
            throw new Error("Ollama returned an empty forecast. Confirm llama3.2 (or the selected model) is running, then try again.");
        }

        const rawText = String(response).trim();
        const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        return {
            projectName: projectData.title,
            snapshot: snap,
            projectData: projectData,
            date: generatedDate,
            modelName: activeModel,
            prompt: prompt,
            rawText: rawText,
            html: AIUtils.formatMarkdownToHTML(rawText)
        };
    },

    /**
     * Global Chatbot AI Assistant (ChatGPT Style, Defaults to Llama 3.2)
     */
    chatWithAssistant: async (userMsg, history = [], modelName = "llama3.2") => {
        // Format history for Ollama chat API
        const messages = history.map(h => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.content
        }));

        messages.push({
            role: 'user',
            content: userMsg
        });

        const response = await OllamaClient.chat(messages, userMsg, modelName);
        return {
            userMessage: userMsg,
            rawText: response,
            html: AIUtils.formatMarkdownToHTML(response)
        };
    }
};
