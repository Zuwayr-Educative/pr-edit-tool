import { SYSTEM_PROMPT, CARD_LIMITS, MODEL_CHAIN } from './config.js';
import { fetchWithFallback } from './api-client.js';
import {
    inputText,
    outputText,
    proofreadBtn,
    proofreadBtnText,
    trimBtn,
    trimBtnText,
    copyBtn,
    diffBtn,
    diffContainer,
    statusInfo,
    cardTypeSelect,
    sensitivityBtn
} from './dom-elements.js';
import { setStatus, updateOutputCharCount, showCopyConfirmation, updateProofreadButtonState } from './ui-helpers.js';
import { generateDiff, initDiffViewer } from './diff-viewer.js';
import { clearSensitivityHighlights } from './sensitivity-checker.js';

async function proofreadText() {
    const apiKey = localStorage.getItem('gemini_api_key');
    const input = inputText.value.trim();

    if (!apiKey) {
        setStatus('Please save your API key first', 'error');
        return;
    }

    if (!input) {
        setStatus('Please enter some text to proofread', 'error');
        return;
    }

    // Set loading state
    proofreadBtn.disabled = true;
    proofreadBtnText.innerHTML = '<span class="spinner"></span> Proofreading...';
    setStatus('Proofreading...', 'normal');
    outputText.value = '';
    diffBtn.disabled = true;
    copyBtn.disabled = true; // Disable copy while proofreading
    sensitivityBtn.disabled = true; // Disable sensitivity checker while proofreading
    clearSensitivityHighlights(); // Clear any previous sensitivity highlights

    // Hide diff viewer while proofreading
    diffContainer.classList.remove('active');
    diffBtn.textContent = '🔄 View Diff';

    const startTime = Date.now();

    try {
        const requestBody = {
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: `--- COURSE START ---\n${input}\n--- COURSE END ---` }]
                }
            ],
            generationConfig: {
                temperature: 1.0,
                maxOutputTokens: 8192,
                thinkingConfig: {
                    thinkingLevel: "low"
                }
            }
        };

        // Use helper function with fallback support
        const { response, model } = await fetchWithFallback(apiKey, requestBody);

        // Notify user if fallback model is being used
        const modelIndex = MODEL_CHAIN.indexOf(model);
        if (modelIndex > 0) {
            const modelNames = {
                'gemini-3-pro-preview': 'Gemini 3 Pro',
                'gemini-3-flash-preview': 'Gemini 3 Flash',
                'gemini-2.5-flash': 'Gemini 2.5 Flash',
                'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
                'gemma-2-27b-it': 'Gemma 2 27B'
            };
            const fallbackName = modelNames[model] || model;
            setStatus(`Using ${fallbackName} (fallback model)`, 'normal');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonData = JSON.parse(line.slice(6));
                        const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            accumulatedText += text;
                            outputText.value = accumulatedText;
                            // Auto-scroll to bottom
                            outputText.scrollTop = outputText.scrollHeight;
                        }
                    } catch (e) {
                        // Ignore parsing errors for incomplete chunks
                    }
                }
            }
        }

        if (!accumulatedText) {
            throw new Error('No text received from API');
        }

        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        setStatus('Proofreading complete', 'success');
        statusInfo.textContent = `Completed in ${elapsedTime}s`;
        diffBtn.disabled = false;
        sensitivityBtn.disabled = false; // Enable sensitivity checker after proofreading

        // Check character limits (this will also enable copy button)
        updateOutputCharCount();

        // Auto-open diff viewer
        generateDiff();
        diffContainer.classList.add('active');
        diffBtn.textContent = '❌ Hide Diff';
        setTimeout(() => {
            diffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

    } catch (error) {
        console.error('Proofread error:', error);
        let errorMessage = 'An error occurred during proofreading';

        if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
            errorMessage = 'Invalid API key. Please check your key and try again.';
        } else if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        setStatus(errorMessage, 'error');
        outputText.value = `Error: ${errorMessage}`;

    } finally {
        // Reset button state
        proofreadBtn.disabled = false;
        proofreadBtnText.innerHTML = '✨ Proofread';
        updateProofreadButtonState();
    }
}

async function trimText() {
    const apiKey = localStorage.getItem('gemini_api_key');
    const currentText = outputText.value.trim();
    const selectedCardType = cardTypeSelect.value;
    const limit = CARD_LIMITS[selectedCardType];

    if (!apiKey) {
        setStatus('Please save your API key first', 'error');
        return;
    }

    if (!currentText) {
        setStatus('No text to trim', 'error');
        return;
    }

    if (!limit) {
        setStatus('Please select a card type with a character limit', 'error');
        return;
    }

    // ADAPTIVE TARGET CALCULATION
    const currentLength = currentText.length;
    const overage = currentLength - limit;

    let targetLength;
    let trimStrategy;

    if (overage <= limit * 0.1) {
        // Slightly over (≤10% over limit): trim to 95% of limit
        targetLength = Math.floor(limit * 0.95);
        trimStrategy = 'conservative';
    } else if (overage <= limit * 0.3) {
        // Moderately over (10-30% over): trim to 90% of limit
        targetLength = Math.floor(limit * 0.90);
        trimStrategy = 'moderate';
    } else {
        // Significantly over (>30% over): trim to 80% of limit
        targetLength = Math.floor(limit * 0.80);
        trimStrategy = 'aggressive';
    }

    // Set loading state
    trimBtn.disabled = true;
    trimBtnText.innerHTML = '<span class="spinner"></span> Trimming...';
    setStatus(`Trimming text (${trimStrategy} trim)...`, 'normal');

    const startTime = Date.now();

    try {
        const trimPrompt = `You are an expert editor. Shorten the following text to approximately ${targetLength} characters while preserving the core message and maintaining quality.

IMPORTANT RULES:
- Target length: ${targetLength} characters (current: ${currentText.length} characters, limit: ${limit} characters)
- Preserve the main points and key information
- Maintain clarity and readability
- Use concise language without losing meaning
- Apply house style: US English, curly quotes, no em/en dashes, inclusive language
- Do NOT add any explanations, headers, or metadata
- Return ONLY the shortened text directly

Text to shorten:
${currentText}`;

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: trimPrompt }]
                }
            ],
            generationConfig: {
                temperature: 1.0,
                maxOutputTokens: 8192,
                thinkingConfig: {
                    thinkingLevel: "low"
                }
            }
        };

        // Use helper function with fallback support
        const { response, model } = await fetchWithFallback(apiKey, requestBody);

        // Notify user if fallback model is being used
        const modelIndex = MODEL_CHAIN.indexOf(model);
        if (modelIndex > 0) {
            const modelNames = {
                'gemini-3-pro-preview': 'Gemini 3 Pro',
                'gemini-3-flash-preview': 'Gemini 3 Flash',
                'gemini-2.5-flash': 'Gemini 2.5 Flash',
                'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
                'gemma-2-27b-it': 'Gemma 2 27B'
            };
            const fallbackName = modelNames[model] || model;
            setStatus(`Trimming with ${fallbackName} (fallback model)`, 'normal');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        // Store original text in case we need to revert
        const originalText = outputText.value;

        // Clear output for trimmed text
        outputText.value = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonData = JSON.parse(line.slice(6));
                        const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            accumulatedText += text;
                            outputText.value = accumulatedText;
                            // Auto-scroll to bottom
                            outputText.scrollTop = outputText.scrollHeight;
                            // Update character count in real-time
                            updateOutputCharCount();
                        }
                    } catch (e) {
                        // Ignore parsing errors for incomplete chunks
                    }
                }
            }
        }

        if (!accumulatedText) {
            throw new Error('No text received from API');
        }

        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        const finalLength = accumulatedText.length;

        if (finalLength <= limit) {
            setStatus('Text trimmed successfully', 'success');
            statusInfo.textContent = `Trimmed in ${elapsedTime}s (${originalText.length} → ${finalLength} chars)`;
        } else {
            setStatus('Text trimmed but still over limit', 'error');
            statusInfo.textContent = `Trimmed in ${elapsedTime}s (${originalText.length} → ${finalLength} chars, still ${finalLength - limit} over)`;
        }

        // Update character count display
        updateOutputCharCount();

        // Update diff viewer
        diffBtn.disabled = false;

    } catch (error) {
        console.error('Trim error:', error);
        let errorMessage = 'An error occurred while trimming';

        if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
            errorMessage = 'Invalid API key. Please check your key and try again.';
        } else if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        setStatus(errorMessage, 'error');

    } finally {
        // Reset button state
        trimBtn.disabled = false;
        trimBtnText.innerHTML = '✂️ Trim Text';
    }
}

export function initTextProcessor() {
    // Initialize diff viewer with toggle button
    initDiffViewer();

    // Proofread button click handler
    proofreadBtn.addEventListener('click', async () => {
        await proofreadText();
    });

    // Keyboard Shortcut (Ctrl/Cmd + Enter)
    inputText.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!proofreadBtn.disabled) {
                proofreadText();
            }
        }
    });

    // Trim button click handler
    trimBtn.addEventListener('click', async () => {
        await trimText();
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', async () => {
        const output = outputText.value;

        if (!output) {
            setStatus('No output to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            showCopyConfirmation();
            setStatus('Output copied to clipboard', 'success');
        } catch (error) {
            console.error('Copy error:', error);
            setStatus('Failed to copy to clipboard', 'error');
        }
    });

    // Listen to output changes
    outputText.addEventListener('input', updateOutputCharCount);

    // Listen to card type changes
    cardTypeSelect.addEventListener('change', updateOutputCharCount);
}
