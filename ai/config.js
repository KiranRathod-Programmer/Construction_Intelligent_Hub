/**
 * Construction Intelligent Hub (CIH) - Ollama AI Configuration
 * 
 * Modular configuration for the local offline AI runtime.
 * Extensible for any Ollama supported model (llama3.2, deepseek-r1, mistral, codellama).
 */

const OLLAMA_CONFIG = {
    // Local Ollama API daemon endpoint
    endpoint: "http://localhost:11434",
    
    // Active Ollama model name
    model: "llama3.2",
    
    // Model inference parameters
    options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 800
    },

    // Response streaming toggle
    stream: false,

    // Intelligent dynamic fallback when Ollama service is offline
    fallbackEnabled: true,
    
    // Timeout for AI inference HTTP requests (35 seconds to allow full Llama 3.2 completion)
    timeoutMs: 35000,

    // Timeout for health check endpoint (1.5 seconds)
    healthCheckTimeoutMs: 1500
};
