// Main application entry point
import { initTheme } from './modules/theme-manager.js';
import { initModalHandlers } from './modules/modal-manager.js';
import { loadApiKey, initApiKeyHandlers } from './modules/api-key-manager.js';
import { initTabNavigation } from './modules/tab-navigation.js';
import { initGrammar } from './modules/grammar-checker.js';
import { initTextProcessor } from './modules/text-processor.js';
import { initFileProcessor } from './modules/file-processor.js';
import { initDiffViewer, initFileDiffViewer } from './modules/diff-viewer.js';
import { updateOutputCharCount, updateProofreadButtonState } from './modules/ui-helpers.js';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme
    initTheme();

    // Load API key
    loadApiKey();

    // Initialize modal handlers
    initModalHandlers();

    // Initialize API key handlers
    initApiKeyHandlers();

    // Update proofread button state
    updateProofreadButtonState();

    // Initialize grammar checker
    await initGrammar();

    // Update output char count
    updateOutputCharCount();

    // Initialize file processor
    initFileProcessor();

    // Initialize text processor
    initTextProcessor();

    // Initialize diff viewers
    initDiffViewer();
    initFileDiffViewer();

    // Initialize tab navigation
    initTabNavigation();
});
