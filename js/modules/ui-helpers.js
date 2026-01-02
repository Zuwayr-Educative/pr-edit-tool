import { CARD_LIMITS } from './config.js';
import {
    statusText,
    outputText,
    outputCharCount,
    charLimitInfo,
    cardTypeSelect,
    trimBtn,
    copyBtn,
    copyConfirmation,
    proofreadBtn,
    inputText
} from './dom-elements.js';

// Output Character Count and Limit Checking
export function updateOutputCharCount() {
    const length = outputText.value.length;
    outputCharCount.textContent = `${length.toLocaleString()} characters`;

    // Enable/disable copy button based on output
    copyBtn.disabled = length === 0;

    const selectedCardType = cardTypeSelect.value;
    const limit = CARD_LIMITS[selectedCardType];

    if (limit === null) {
        charLimitInfo.textContent = '';
        charLimitInfo.classList.remove('over-limit');
        trimBtn.style.display = 'none';
        return;
    }

    if (length > limit) {
        const excess = length - limit;
        charLimitInfo.textContent = `⚠️ ${excess} chars over limit (max: ${limit})`;
        charLimitInfo.classList.add('over-limit');
        trimBtn.style.display = 'inline-flex';
        trimBtn.disabled = false;
    } else {
        charLimitInfo.textContent = `✓ Within limit (${limit - length} chars remaining)`;
        charLimitInfo.classList.remove('over-limit');
        trimBtn.style.display = 'none';
    }
}

// Show copy confirmation message
export function showCopyConfirmation() {
    copyConfirmation.classList.add('show');
    setTimeout(() => {
        copyConfirmation.classList.remove('show');
    }, 2000);
}

// Status Management
export function setStatus(message, type = 'normal') {
    statusText.textContent = `Status: ${message}`;
    statusText.className = 'status-text';

    if (type === 'error') {
        statusText.classList.add('error');
    } else if (type === 'success') {
        statusText.classList.add('success');
    }
}

// HTML escape utility
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update Proofread Button State
export function updateProofreadButtonState() {
    const hasApiKey = localStorage.getItem('gemini_api_key');
    const hasInput = inputText.value.trim().length > 0;
    proofreadBtn.disabled = !hasApiKey || !hasInput;
}
