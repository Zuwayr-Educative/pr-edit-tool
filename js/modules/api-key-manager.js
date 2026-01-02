import { apiKeyInput, saveKeyBtn, clearKeyBtn, keyStatus } from './dom-elements.js';
import { setStatus, updateProofreadButtonState } from './ui-helpers.js';
import { openApiKeyModal, closeApiKeyModalFunc } from './modal-manager.js';

function updateKeyStatus(isSet) {
    if (isSet) {
        keyStatus.classList.remove('hidden');
    } else {
        keyStatus.classList.add('hidden');
    }
    updateProofreadButtonState();
}

export function loadApiKey() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        updateKeyStatus(true);
    } else {
        // Auto-open modal if no key is found
        openApiKeyModal();
    }
}

export function initApiKeyHandlers() {
    // Save key button
    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            updateKeyStatus(true);
            setStatus('API key saved successfully', 'success');
            setTimeout(closeApiKeyModalFunc, 1000); // Close after 1s delay
        } else {
            setStatus('Please enter an API key', 'error');
        }
    });

    // Clear key button
    clearKeyBtn.addEventListener('click', () => {
        localStorage.removeItem('gemini_api_key');
        apiKeyInput.value = '';
        updateKeyStatus(false);
        setStatus('API key cleared', 'normal');
    });
}
