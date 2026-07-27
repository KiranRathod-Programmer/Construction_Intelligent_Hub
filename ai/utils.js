/**
 * Construction Intelligent Hub (CIH) - AI Utility Helpers
 * 
 * Utility functions for response formatting, markdown rendering, and file downloading.
 */

const AIUtils = {
    /**
     * Download text content as a file on client machine
     */
    downloadAsFile: (filename, textContent, mimeType = "text/plain") => {
        try {
            const blob = new Blob([textContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download file:", err);
            alert("Download failed: " + err.message);
        }
    },

    /**
     * Format markdown strings to simple clean HTML for UI display
     */
    formatMarkdownToHTML: (mdText) => {
        if (!mdText) return "";
        let html = mdText
            .replace(/### (.*?)\n/g, '<h3 class="ai-heading-3">$1</h3>')
            .replace(/## (.*?)\n/g, '<h2 class="ai-heading-2">$1</h2>')
            .replace(/# (.*?)\n/g, '<h1 class="ai-heading-1">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/- (.*?)\n/g, '<li>$1</li>')
            .replace(/\n\n/g, '<br><br>');
        return html;
    },

    /**
     * Clean raw string output
     */
    cleanText: (str) => {
        if (!str) return "";
        return str.trim();
    }
};
