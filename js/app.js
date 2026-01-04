// Main application entry point
import { initTheme } from './modules/theme-manager.js';
import { initModalHandlers } from './modules/modal-manager.js';
import { loadApiKey, initApiKeyHandlers } from './modules/api-key-manager.js';
import { initTabNavigation } from './modules/tab-navigation.js';
import { initGrammar } from './modules/grammar-checker.js';
import { initTextProcessor } from './modules/text-processor.js';
import { initFileProcessor } from './modules/file-processor.js';
import { updateOutputCharCount, updateProofreadButtonState, updatePersonaBlogProofreadButtonState } from './modules/ui-helpers.js';
import { initSensitivityChecker } from './modules/sensitivity-checker.js';
import { initPersonaBlogProcessor } from './modules/persona-blog-processor.js';

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
    updatePersonaBlogProofreadButtonState();

    // Initialize grammar checker
    await initGrammar();

    // Update output char count
    updateOutputCharCount();

    // Initialize file processor
    initFileProcessor();

    // Initialize text processor
    initTextProcessor();

    // Initialize sensitivity checker
    initSensitivityChecker();

    // Initialize persona blog processor
    initPersonaBlogProcessor();

    // Initialize tab navigation
    initTabNavigation();
});
