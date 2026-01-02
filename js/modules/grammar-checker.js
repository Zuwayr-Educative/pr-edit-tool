import {
    inputText,
    grammarBtn,
    grammarBtnText,
    grammarPanel,
    grammarHighlights,
    grammarPopup,
    grammarPopupTitle,
    grammarPopupMessage,
    grammarPopupFix,
    grammarPopupDismiss,
    grammarPopupClose,
    grammarHintBanner,
    issueCount,
    dismissHints,
    acceptAllBtn,
    charCount
} from './dom-elements.js';
import { setStatus, escapeHtml, updateProofreadButtonState } from './ui-helpers.js';

// Initialize Harper Linter
let linter;

// Store current grammar issues globally
let currentGrammarIssues = [];
let dismissedIssueIndexes = new Set(); // Track dismissed issues

// Debounce timer for auto-recheck
let autoRecheckTimer = null;

// Store current issue index for dismiss functionality
let currentDismissIssueIndex = null;

export async function initGrammar() {
    try {
        // Import from CDN - using latest version 1.2.0
        const module = await import('https://unpkg.com/harper.js@1.2.0/dist/harper.js');
        const { WorkerLinter, binaryInlined } = module;

        linter = new WorkerLinter({ binary: binaryInlined });

        // Get and log actual version
        const config = await linter.getLintConfig();
        console.log('✅ Harper.js v1.2.0 loaded from CDN');
        console.log('📋 Available rules:', Object.keys(config).length);

        // Set up event listeners
        initGrammarEventListeners();
    } catch (e) {
        console.warn('Grammar Checker: Failed to load harper.js. This feature requires a local server (CORS restrictions on file://).', e);
        // Optionally update UI to indicate feature is unavailable
        if (grammarPanel) {
            grammarPanel.style.display = 'none';
        }
    }
}

function initGrammarEventListeners() {
    // Character Count
    inputText.addEventListener('input', (e) => {
        const length = inputText.value.length;
        charCount.textContent = `${length.toLocaleString()} characters`;
        updateProofreadButtonState();

        // Skip auto-recheck if this was triggered by applyGrammarFix
        if (e.skipAutoRecheck) {
            return;
        }

        // Auto-recheck grammar after user stops typing for 1.5 seconds
        if (grammarHighlights.innerHTML) {
            clearGrammarHighlights();

            // Clear previous timer
            if (autoRecheckTimer) {
                clearTimeout(autoRecheckTimer);
            }

            // Set new timer for auto-recheck
            autoRecheckTimer = setTimeout(() => {
                if (linter && inputText.value.trim()) {
                    runGrammarCheck();
                }
            }, 1500);
        }
    });

    // Keyboard shortcuts
    inputText.addEventListener('keydown', (e) => {
        // Esc key clears highlights
        if (e.key === 'Escape' && grammarHighlights.innerHTML) {
            e.preventDefault();
            clearGrammarHighlights();
            inputText.focus();
        }
    });

    // Dismiss hints button
    dismissHints.addEventListener('click', () => {
        clearGrammarHighlights();
        inputText.focus();
    });

    // Accept All button
    acceptAllBtn.addEventListener('click', async () => {
        if (currentGrammarIssues.length === 0) return;

        // Disable the button while processing
        acceptAllBtn.disabled = true;
        acceptAllBtn.textContent = '⏳ Applying...';

        // Collect all fixes (from end to start to avoid index shifting)
        const fixes = [];

        for (let i = 0; i < currentGrammarIssues.length; i++) {
            const issue = currentGrammarIssues[i];

            // Get the first (best) suggestion if available
            if (typeof issue.suggestions === 'function') {
                const suggs = issue.suggestions();
                if (suggs && suggs.length > 0) {
                    const bestSuggestionObj = suggs[0];
                    const suggText = typeof bestSuggestionObj.get_replacement_text === 'function'
                        ? bestSuggestionObj.get_replacement_text()
                        : bestSuggestionObj.toString();

                    const span = typeof issue.span === 'function' ? issue.span() : null;
                    if (span) {
                        fixes.push({
                            start: span.start,
                            end: span.end,
                            replacement: suggText
                        });
                    }
                }
            }
        }

        // Sort fixes from end to start (to avoid index shifting)
        fixes.sort((a, b) => b.start - a.start);

        // Apply all fixes
        let text = inputText.value;
        for (const fix of fixes) {
            text = text.substring(0, fix.start) + fix.replacement + text.substring(fix.end);
        }

        // Update textarea
        inputText.value = text;

        // Clear highlights
        clearGrammarHighlights();

        // Re-run grammar check after a short delay
        setTimeout(async () => {
            if (linter) {
                await runGrammarCheck();
            }

            // Re-enable button
            acceptAllBtn.disabled = false;
            acceptAllBtn.textContent = '✓ Accept All';
        }, 500);

        // Show success message
        setStatus(`Applied ${fixes.length} suggestion${fixes.length === 1 ? '' : 's'}`, 'success');
    });

    // Grammar Button Click Handler
    grammarBtn.addEventListener('click', runGrammarCheck);

    // Sync textarea scroll with highlights
    inputText.addEventListener('scroll', () => {
        grammarHighlights.scrollTop = inputText.scrollTop;
        grammarHighlights.scrollLeft = inputText.scrollLeft;
    });

    // Popup close handlers
    grammarPopupClose.addEventListener('click', closeGrammarPopup);

    // Dismiss button - mark issue as dismissed
    grammarPopupDismiss.addEventListener('click', () => {
        if (currentDismissIssueIndex !== null) {
            // Mark this issue as dismissed
            dismissedIssueIndexes.add(currentDismissIssueIndex);

            // Remove from current list
            currentGrammarIssues = currentGrammarIssues.filter((_, idx) => idx !== currentDismissIssueIndex);

            // Update UI smoothly
            if (currentGrammarIssues.length === 0) {
                clearGrammarHighlights();
            } else {
                issueCount.textContent = `${currentGrammarIssues.length} issue${currentGrammarIssues.length === 1 ? '' : 's'}`;
                updateGrammarUIWithoutFlash(currentGrammarIssues);
            }
        }

        closeGrammarPopup();
    });

    // Keyboard navigation for popup
    grammarPopup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGrammarPopup();
            inputText.focus();
        } else if (e.key === 'Enter') {
            // Click focused suggestion pill or dismiss button
            const focused = document.activeElement;
            if (focused && (focused.classList.contains('suggestion-pill') || focused === grammarPopupDismiss)) {
                focused.click();
            }
        }
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!grammarPopup.contains(e.target) &&
            !e.target.closest('mark') &&
            !e.target.closest('.grammar-hint-banner')) {
            closeGrammarPopup();
        }
    });
}

// Clear grammar highlights helper function
export function clearGrammarHighlights() {
    grammarHighlights.innerHTML = '';
    closeGrammarPopup();
    inputText.closest('.grammar-highlight-container').classList.remove('has-highlights');
    grammarHintBanner.classList.remove('active');
    currentGrammarIssues = [];
    dismissedIssueIndexes.clear(); // Reset dismissed issues
}

// Update grammar UI without clearing (smooth transition)
function updateGrammarUIWithoutFlash(issues) {
    const text = inputText.value;
    let highlightedHTML = '';
    let lastIndex = 0;

    // Sort issues by position
    const sortedIssues = issues.slice().sort((a, b) => {
        const spanA = typeof a.span === 'function' ? a.span() : { start: 0 };
        const spanB = typeof b.span === 'function' ? b.span() : { start: 0 };
        return spanA.start - spanB.start;
    });

    sortedIssues.forEach((issue, index) => {
        if (typeof issue.span !== 'function') return;

        const span = issue.span();
        const start = span.start;
        const end = span.end;

        // Add text before this issue
        if (start > lastIndex) {
            highlightedHTML += escapeHtml(text.substring(lastIndex, start));
        }

        // Determine error type for color
        const errorType = getErrorType(issue);
        const errorText = text.substring(start, end);

        // Add highlighted error with data attributes for popup
        highlightedHTML += `<mark class="${errorType}" data-issue-index="${index}">${escapeHtml(errorText)}</mark>`;

        lastIndex = end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        highlightedHTML += escapeHtml(text.substring(lastIndex));
    }

    grammarHighlights.innerHTML = highlightedHTML;

    // Re-attach click handlers
    grammarHighlights.querySelectorAll('mark').forEach(mark => {
        mark.addEventListener('click', (e) => {
            e.stopPropagation();
            const issueIndex = parseInt(mark.dataset.issueIndex);
            showGrammarPopup(currentGrammarIssues[issueIndex], mark, issueIndex);
        });
    });
}

// Run grammar check in background without clearing UI
export async function runGrammarCheckInBackground() {
    if (!linter) return;

    const text = inputText.value;
    if (!text.trim()) return;

    try {
        const issues = await linter.lint(text);

        // Update current issues
        currentGrammarIssues = issues;

        // Update count and highlights smoothly
        if (issues.length === 0) {
            clearGrammarHighlights();
        } else {
            issueCount.textContent = `${issues.length} issue${issues.length === 1 ? '' : 's'}`;
            updateGrammarUIWithoutFlash(issues);
        }
    } catch (e) {
        console.error('Background grammar check failed:', e);
    }
}

// Grammar Check Logic
export async function runGrammarCheck() {
    if (!linter) {
        setStatus('Grammar checker not available (requires server)', 'error');
        return;
    }

    const text = inputText.value;
    if (!text.trim()) {
        setStatus('Please enter some text to check', 'error');
        grammarPanel.style.display = 'none';
        return;
    }

    // Set loading state
    grammarBtn.disabled = true;
    grammarBtnText.innerHTML = '<span class="spinner"></span> Checking...';
    setStatus('Checking grammar...', 'normal');

    try {
        const issues = await linter.lint(text);
        updateGrammarUI(issues);

        if (issues.length === 0) {
            setStatus('No grammar issues found!', 'success');
        } else {
            setStatus(`Found ${issues.length} grammar issue${issues.length === 1 ? '' : 's'}`, 'normal');
        }
    } catch (e) {
        console.error('Grammar check failed:', e);
        setStatus('Grammar check failed', 'error');
    } finally {
        // Reset button state
        grammarBtn.disabled = false;
        grammarBtnText.innerHTML = '✓ Quick Spell Check (Free)';
    }
}

function updateGrammarUI(issues) {
    // Store issues globally
    currentGrammarIssues = issues;

    // Hide old panel
    grammarPanel.style.display = 'none';

    const container = inputText.closest('.grammar-highlight-container');

    if (issues.length === 0) {
        grammarHighlights.innerHTML = '';
        container.classList.remove('has-highlights');
        grammarHintBanner.classList.remove('active');
        return;
    }

    // Show hint banner with issue count
    issueCount.textContent = `${issues.length} issue${issues.length === 1 ? '' : 's'}`;
    grammarHintBanner.classList.add('active');

    // Add class to enable transparent background
    container.classList.add('has-highlights');

    // Create inline highlights
    const text = inputText.value;
    let highlightedHTML = '';
    let lastIndex = 0;

    // Sort issues by position
    const sortedIssues = issues.slice().sort((a, b) => {
        const spanA = typeof a.span === 'function' ? a.span() : { start: 0 };
        const spanB = typeof b.span === 'function' ? b.span() : { start: 0 };
        return spanA.start - spanB.start;
    });

    sortedIssues.forEach((issue, index) => {
        if (typeof issue.span !== 'function') return;

        const span = issue.span();
        const start = span.start;
        const end = span.end;

        // Add text before this issue
        if (start > lastIndex) {
            highlightedHTML += escapeHtml(text.substring(lastIndex, start));
        }

        // Determine error type for color
        const errorType = getErrorType(issue);
        const errorText = text.substring(start, end);

        // Add highlighted error with data attributes for popup
        highlightedHTML += `<mark class="${errorType}" data-issue-index="${index}">${escapeHtml(errorText)}</mark>`;

        lastIndex = end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        highlightedHTML += escapeHtml(text.substring(lastIndex));
    }

    grammarHighlights.innerHTML = highlightedHTML;

    // Add click handlers to marks
    grammarHighlights.querySelectorAll('mark').forEach(mark => {
        mark.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the overlay click handler
            const issueIndex = parseInt(mark.dataset.issueIndex);
            showGrammarPopup(currentGrammarIssues[issueIndex], mark, issueIndex);
        });
    });
}

// Determine error type for coloring
function getErrorType(issue) {
    const message = typeof issue.message === 'function' ? issue.message() : issue.message;
    const msgLower = message.toLowerCase();

    if (msgLower.includes('spell') || msgLower.includes('misspell')) {
        return 'spell-error';
    } else if (msgLower.includes('suggestion') || msgLower.includes('consider') || msgLower.includes('prefer')) {
        return 'style-suggestion';
    } else {
        return 'grammar-error';
    }
}

// Show grammar popup
function showGrammarPopup(issue, markElement, issueIndex) {
    const message = typeof issue.message === 'function' ? issue.message() : issue.message;
    const span = typeof issue.span === 'function' ? issue.span() : { start: 0, end: 0 };

    // Store current issue index for dismiss functionality
    currentDismissIssueIndex = issueIndex;

    // Set popup title based on error type with icon
    const errorType = getErrorType(issue);
    let title = 'Grammar Issue';
    let icon = '📝';
    if (errorType === 'spell-error') {
        title = 'Spelling';
        icon = '🔤';
    } else if (errorType === 'style-suggestion') {
        title = 'Word Choice';
        icon = '💡';
    } else {
        title = 'Grammar';
        icon = '✏️';
    }

    grammarPopupTitle.textContent = `${icon} ${title}`;
    grammarPopupMessage.textContent = message;

    // Get ALL suggestions if available
    const suggestionsContainer = document.getElementById('grammarSuggestions');
    suggestionsContainer.innerHTML = '';

    let hasSuggestions = false;
    if (typeof issue.suggestions === 'function') {
        const suggs = issue.suggestions();
        if (suggs && suggs.length > 0) {
            hasSuggestions = true;

            // Create suggestion pills for each option
            suggs.forEach((suggObj, index) => {
                const suggText = typeof suggObj.get_replacement_text === 'function'
                    ? suggObj.get_replacement_text()
                    : suggObj.toString();

                const pill = document.createElement('button');
                // Add error-type specific class for color
                pill.className = `suggestion-pill suggestion-${errorType}`;
                pill.textContent = suggText;

                // Store the current issue index in closure
                const currentIssueIndex = currentGrammarIssues.findIndex(iss => iss === issue);

                pill.onclick = () => {
                    applyGrammarFix(span.start, span.end, suggText, currentIssueIndex);
                    closeGrammarPopup();
                };

                suggestionsContainer.appendChild(pill);
            });
        }
    }

    // Show/hide suggestions section
    if (hasSuggestions) {
        suggestionsContainer.style.display = 'flex';
        grammarPopupFix.style.display = 'none'; // Hide old single-fix button
    } else {
        suggestionsContainer.style.display = 'none';
        grammarPopupFix.style.display = 'none';
    }

    // Smart positioning: position popup near the mark but keep it on screen
    const rect = markElement.getBoundingClientRect();
    const popupWidth = 400; // approximate popup width
    const popupHeight = 200; // approximate popup height (accounting for multiple suggestions)

    // Position relative to viewport (not page, since popup is fixed)
    let top = rect.bottom + 8;
    let left = rect.left;

    // Adjust horizontal position if popup would go off-screen
    if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 20;
    }
    if (left < 20) {
        left = 20;
    }

    // Position above mark if popup would go below visible viewport
    if (top + popupHeight > window.innerHeight) {
        // Try positioning above
        const topPosition = rect.top - popupHeight - 8;
        // Only position above if there's enough space
        if (topPosition > 0) {
            top = topPosition;
        } else {
            // Not enough space above or below, position at best available spot
            top = Math.max(20, rect.bottom - popupHeight / 2);
        }
    }

    grammarPopup.style.top = `${top}px`;
    grammarPopup.style.left = `${left}px`;

    // Show popup
    grammarPopup.classList.add('active');

    // Focus the first suggestion pill if available, otherwise focus dismiss button
    setTimeout(() => {
        const firstPill = suggestionsContainer.querySelector('.suggestion-pill');
        if (firstPill) {
            firstPill.focus();
        } else {
            grammarPopupDismiss.focus();
        }
    }, 100);
}

// Close grammar popup
function closeGrammarPopup() {
    grammarPopup.classList.remove('active');
}

// Apply grammar fix
function applyGrammarFix(start, end, replacement, issueIndex) {
    const text = inputText.value;
    // Basic splice
    const newText = text.substring(0, start) + replacement + text.substring(end);
    inputText.value = newText;

    // Remove this specific issue from current list immediately
    currentGrammarIssues = currentGrammarIssues.filter((_, idx) => idx !== issueIndex);

    // Update the banner count immediately (smooth transition)
    if (currentGrammarIssues.length === 0) {
        clearGrammarHighlights();
    } else {
        issueCount.textContent = `${currentGrammarIssues.length} issue${currentGrammarIssues.length === 1 ? '' : 's'}`;

        // Regenerate highlights without the fixed issue
        updateGrammarUIWithoutFlash(currentGrammarIssues);
    }

    // Trigger input event to update character counts
    const event = new Event('input');
    event.skipAutoRecheck = true; // Flag to skip auto-recheck
    inputText.dispatchEvent(event);

    // Restore focus
    inputText.focus();

    // Re-run grammar check in background (smooth, no flash)
    setTimeout(() => {
        if (linter) {
            runGrammarCheckInBackground();
        }
    }, 100);
}

// Export for legacy global compatibility
export { applyGrammarFix };
