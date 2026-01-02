import { MODEL_CHAIN } from './config.js';

// Helper function to make API calls with cascading fallbacks
export async function fetchWithFallback(apiKey, requestBody, fallbackLevel = 0) {
    // Select model based on fallback level
    const model = MODEL_CHAIN[fallbackLevel];

    if (!model) {
        throw new Error('All fallback models exhausted. Please try again later.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    console.log(`Trying model: ${model} (fallback level ${fallbackLevel})`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || '';
            console.error(`API Error: ${response.status} - ${errorMessage}`);

            // Check if error indicates model unavailability or quota issues
            const modelUnavailable = errorMessage.includes('not found') ||
                errorMessage.includes('not available') ||
                errorMessage.includes('does not exist') ||
                errorMessage.includes('overloaded') ||
                errorMessage.includes('capacity') ||
                response.status === 404 ||
                response.status === 503;

            const quotaExceeded = errorMessage.includes('quota exceeded') ||
                errorMessage.includes('Quota exceeded') ||
                errorMessage.includes('rate limit') ||
                errorMessage.includes('Rate limit') ||
                response.status === 429;

            // Try fallback models in sequence
            if ((modelUnavailable || quotaExceeded) && fallbackLevel < MODEL_CHAIN.length - 1) {
                const reason = quotaExceeded ? 'quota exceeded' :
                    (response.status === 503 || errorMessage.includes('overloaded')) ? 'overloaded' :
                        'unavailable';
                const nextModel = MODEL_CHAIN[fallbackLevel + 1];

                console.log(`Model ${model} ${reason}, trying fallback model (${nextModel})`);
                return fetchWithFallback(apiKey, requestBody, fallbackLevel + 1);
            }

            throw new Error(errorMessage || `API Error: ${response.status} ${response.statusText}`);
        }

        return { response, model };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
