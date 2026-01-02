import { apiKeyBtn, apiKeyModal, closeApiKeyModal, apiKeyInput } from './dom-elements.js';

export function openApiKeyModal() {
    apiKeyModal.classList.remove('hidden');
    apiKeyInput.focus();
}

export function closeApiKeyModalFunc() {
    apiKeyModal.classList.add('hidden');
}

export function initModalHandlers() {
    // Open modal button
    apiKeyBtn.addEventListener('click', openApiKeyModal);

    // Close modal button
    closeApiKeyModal.addEventListener('click', closeApiKeyModalFunc);

    // Close modal when clicking outside
    apiKeyModal.addEventListener('click', (e) => {
        if (e.target === apiKeyModal) {
            closeApiKeyModalFunc();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !apiKeyModal.classList.contains('hidden')) {
            closeApiKeyModalFunc();
        }
    });
}
