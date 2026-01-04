import { PERSONA_BLOG_PROMPT, MODEL_CHAIN } from './config.js';
import { fetchWithFallback } from './api-client.js';
import {
    personaBlogInputText,
    personaBlogOutputText,
    personaBlogProofreadBtn,
    personaBlogProofreadBtnText,
    personaBlogCopyBtn,
    personaBlogDiffBtn,
    personaBlogDiffContainer,
    personaBlogStatusInfo,
    personaBlogSensitivityBtn,
    personaBlogSensitivityBtnText,
    personaBlogSensitivityHintBanner,
    personaBlogSensitivityIssueCount,
    personaBlogDismissSensitivityHints,
    personaBlogSensitivityHighlights,
    personaBlogSensitivityPopup,
    personaBlogSensitivityPopupTitle,
    personaBlogSensitivityPopupMessage,
    personaBlogSensitivityPopupSuggestions,
    personaBlogSensitivityPopupDismiss,
    personaBlogSensitivityPopupClose
} from './dom-elements.js';
import { setStatus, updatePersonaBlogProofreadButtonState, escapeHtml } from './ui-helpers.js';
import { generatePersonaBlogDiff, initPersonaBlogDiffViewer } from './diff-viewer.js';

// Store current sensitivity issues
let currentPersonaBlogSensitivityIssues = [];
let personaBlogSensitivityPopupTimeout = null;
let currentPersonaBlogSensitivityIssue = null; // Track which issue the popup is showing

// Direct replacement words (RED - clear alternatives available)
const DIRECT_REPLACEMENTS = {
    'abort': ['stop', 'exit', 'cancel', 'end'],
    'blacklist': ['denylist', 'blocklist'],
    'whitelist': ['allowlist', 'trustlist'],
    'graylist': ['provisional list'],
    'master': ['primary', 'main', 'original', 'parent', 'controller'],
    'slave': ['replica', 'worker', 'secondary'],
    'guys': ['everyone', 'folks', 'team'],
    'crazy': ['complex', 'unexpected', 'chaotic'],
    'insane': ['unexpected', 'surprising', 'unusual'],
    'bonkers': ['confusing', 'complex'],
    'dumb': ['simplify', 'basic'],
    'kill': ['stop', 'exit', 'cancel', 'end'],
    'nuke': ['remove', 'delete'],
    'hang': ['stop responding', 'freeze'],
    'hung': ['stopped responding', 'frozen'],
    'cripple': ['slow down', 'impair', 'limit'],
    'lame': ['ineffective', 'limited'],
    'gimp': ['limited', 'restricted'],
    'gimpy': ['limited', 'restricted'],
    'blind': ['ignore', 'unaware of', 'overlook'],
    'dummy': ['placeholder', 'sample', 'test'],
    'sanity check': ['confidence check', 'coherence check', 'verification'],
    'grandfathered': ['legacy', 'exempted'],
    'blackhat': ['unethical', 'malicious'],
    'whitehat': ['ethical', 'authorized'],
    'man hours': ['person hours', 'work hours'],
    'manpower': ['staff', 'workforce', 'personnel'],
    'manned': ['staffed', 'crewed', 'operated'],
    'manmade': ['artificial', 'manufactured', 'synthetic'],
    'chairman': ['chair', 'chairperson'],
    'policeman': ['police officer'],
    'fireman': ['firefighter'],
    'mankind': ['humanity', 'humankind', 'people'],
    'you guys': ['everyone', 'you all', 'folks']
};

// Context-dependent words (ORANGE - needs human judgment)
const CONTEXT_DEPENDENT = {
    'native': 'Consider if referring to people or technical term. Use "built-in" or "cloud-first" for technical contexts.',
    'primitive': 'Avoid when describing people or practices. OK for data types.',
    'abnormal': 'Avoid for people. Use specific technical description.',
    'deficient': 'Avoid for people. Use specific technical description.',
    'deformed': 'Avoid for people. Use specific technical description.',
    'disabled': 'Consider context: "turned off" for features, avoid for people.',
    'simple': 'Consider if condescending. Use "straightforward" or "basic".',
    'easy': 'May be condescending. Consider omitting or being specific.',
    'easily': 'May be condescending. Consider omitting.',
    'just': 'Often unnecessary. Consider omitting or using "only".',
    'simply': 'May be condescending. Consider omitting or being specific.',
    'obviously': 'Avoid. What\'s obvious to you may not be to others.',
    'clearly': 'Avoid. What\'s clear to you may not be to others.',
    'trivial': 'Avoid. What\'s trivial to you may not be to others.',
    'normal': 'Consider if excluding. Use "typical" or "expected".',
    'tribe': 'Can be culturally insensitive. Use "team" or "group".',
    'spirit animal': 'Culturally appropriative. Avoid.',
    'powwow': 'Culturally appropriative. Use "meeting" or "discussion".',
    'ninja': 'Can be culturally insensitive. Use "expert".',
    'guru': 'Can be culturally insensitive. Use "expert" or "teacher".',
    'sherpa': 'Can be culturally insensitive. Use "guide" or "mentor".',
    'female': 'As adjective for connectors, use "socket". For people, use "woman".',
    'male': 'As adjective for connectors, use "plug". For people, use "man".'
};

async function proofreadPersonaBlog() {
    const apiKey = localStorage.getItem('gemini_api_key');
    const input = personaBlogInputText.value.trim();

    if (!apiKey) {
        setStatus('Please save your API key first', 'error');
        return;
    }

    if (!input) {
        setStatus('Please enter some text to proofread', 'error');
        return;
    }

    // Set loading state
    personaBlogProofreadBtn.disabled = true;
    personaBlogProofreadBtnText.innerHTML = '<span class="spinner"></span> Proofreading...';
    setStatus('Proofreading persona blog...', 'normal');
    personaBlogOutputText.value = '';
    personaBlogDiffBtn.disabled = true;
    personaBlogCopyBtn.disabled = true;
    personaBlogSensitivityBtn.disabled = true;
    clearPersonaBlogSensitivityHighlights();

    // Hide diff viewer while proofreading
    personaBlogDiffContainer.classList.remove('active');
    personaBlogDiffBtn.textContent = '🔄 View Diff';

    const startTime = Date.now();

    try {
        const requestBody = {
            system_instruction: {
                parts: [{ text: PERSONA_BLOG_PROMPT }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: `--- PERSONA BLOG START ---\n${input}\n--- PERSONA BLOG END ---` }]
                }
            ],
            generationConfig: {
                temperature: 1.0,
                maxOutputTokens: 32768,
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
                            personaBlogOutputText.value = accumulatedText;
                            // Auto-scroll to bottom
                            personaBlogOutputText.scrollTop = personaBlogOutputText.scrollHeight;
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
        personaBlogStatusInfo.textContent = `Completed in ${elapsedTime}s`;
        personaBlogDiffBtn.disabled = false;
        personaBlogCopyBtn.disabled = false;
        personaBlogSensitivityBtn.disabled = false;

        // Update character count
        updatePersonaBlogCharCount();

        // Auto-open diff viewer
        generatePersonaBlogDiff();
        personaBlogDiffContainer.classList.add('active');
        personaBlogDiffBtn.textContent = '❌ Hide Diff';
        setTimeout(() => {
            personaBlogDiffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

    } catch (error) {
        console.error('Persona blog proofread error:', error);
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
        personaBlogOutputText.value = `Error: ${errorMessage}`;

    } finally {
        // Reset button state
        personaBlogProofreadBtn.disabled = false;
        personaBlogProofreadBtnText.innerHTML = '✨ Proofread Blog';
    }
}

function updatePersonaBlogCharCount() {
    const personaBlogInputCharCount = document.getElementById('personaBlogInputCharCount');
    const personaBlogOutputCharCount = document.getElementById('personaBlogOutputCharCount');

    if (personaBlogInputCharCount) {
        const inputLength = personaBlogInputText.value.length;
        personaBlogInputCharCount.textContent = `${inputLength.toLocaleString()} characters`;
    }

    if (personaBlogOutputCharCount) {
        const outputLength = personaBlogOutputText.value.length;
        personaBlogOutputCharCount.textContent = `${outputLength.toLocaleString()} characters`;
    }
}

function runPersonaBlogSensitivityCheck() {
    const text = personaBlogOutputText.value;

    if (!text.trim()) {
        setStatus('No text to check for sensitivity', 'error');
        return;
    }

    // Set loading state
    personaBlogSensitivityBtn.disabled = true;
    personaBlogSensitivityBtnText.innerHTML = '<span class="spinner"></span> Checking...';
    setStatus('Checking for sensitivity issues...', 'normal');

    try {
        const issues = findPersonaBlogSensitivityIssues(text);
        currentPersonaBlogSensitivityIssues = issues;

        if (issues.length === 0) {
            setStatus('No sensitivity issues found!', 'success');
            clearPersonaBlogSensitivityHighlights();
        } else {
            updatePersonaBlogSensitivityUI(issues, text);
            setStatus(`Found ${issues.length} potential sensitivity issue${issues.length === 1 ? '' : 's'}`, 'normal');
        }
    } catch (e) {
        console.error('Sensitivity check failed:', e);
        setStatus('Sensitivity check failed', 'error');
    } finally {
        // Reset button state
        personaBlogSensitivityBtn.disabled = false;
        personaBlogSensitivityBtnText.innerHTML = '🔍 Check Sensitivity';
    }
}

function findPersonaBlogSensitivityIssues(text) {
    const issues = [];

    // Check direct replacements
    for (const [word, suggestions] of Object.entries(DIRECT_REPLACEMENTS)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
            issues.push({
                type: 'direct',
                word: match[0],
                start: match.index,
                end: match.index + match[0].length,
                suggestions: suggestions
            });
        }
    }

    // Check context-dependent words
    for (const [word, message] of Object.entries(CONTEXT_DEPENDENT)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
            issues.push({
                type: 'context',
                word: match[0],
                start: match.index,
                end: match.index + match[0].length,
                message: message
            });
        }
    }

    // Sort by position
    issues.sort((a, b) => a.start - b.start);

    return issues;
}

function updatePersonaBlogSensitivityUI(issues, text) {
    const container = personaBlogOutputText.closest('.sensitivity-highlight-container');

    // Show hint banner with issue count
    personaBlogSensitivityIssueCount.textContent = `${issues.length} issue${issues.length === 1 ? '' : 's'}`;
    personaBlogSensitivityHintBanner.classList.add('active');

    // Add class to enable transparent background
    container.classList.add('has-highlights');

    // Create inline highlights
    let highlightedHTML = '';
    let lastIndex = 0;

    issues.forEach((issue, index) => {
        // Add text before this issue
        if (issue.start > lastIndex) {
            highlightedHTML += escapeHtml(text.substring(lastIndex, issue.start));
        }

        // Determine color based on type
        const issueClass = issue.type === 'direct' ? 'sensitivity-direct' : 'sensitivity-context';
        const issueText = text.substring(issue.start, issue.end);

        // Add highlighted issue with data attributes for popup
        highlightedHTML += `<mark class="sensitivity-issue ${issueClass}" data-issue-index="${index}">${escapeHtml(issueText)}</mark>`;

        lastIndex = issue.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        highlightedHTML += escapeHtml(text.substring(lastIndex));
    }

    personaBlogSensitivityHighlights.innerHTML = highlightedHTML;

    // Add hover and click handlers to marks
    personaBlogSensitivityHighlights.querySelectorAll('mark.sensitivity-issue').forEach(mark => {
        // Show popup on hover
        mark.addEventListener('mouseenter', (e) => {
            // Clear any existing timeout
            if (personaBlogSensitivityPopupTimeout) {
                clearTimeout(personaBlogSensitivityPopupTimeout);
                personaBlogSensitivityPopupTimeout = null;
            }
            const issueIndex = parseInt(mark.dataset.issueIndex);
            showPersonaBlogSensitivityPopup(currentPersonaBlogSensitivityIssues[issueIndex], mark);
        });

        // Hide popup when leaving the mark
        mark.addEventListener('mouseleave', (e) => {
            // Small delay to allow moving to popup
            personaBlogSensitivityPopupTimeout = setTimeout(() => {
                closePersonaBlogSensitivityPopup();
            }, 200);
        });

        // Also keep click handler for mobile devices
        mark.addEventListener('click', (e) => {
            e.stopPropagation();
            const issueIndex = parseInt(mark.dataset.issueIndex);
            showPersonaBlogSensitivityPopup(currentPersonaBlogSensitivityIssues[issueIndex], mark);
        });
    });
}

function showPersonaBlogSensitivityPopup(issue, markElement) {
    // Store current issue for replacement
    currentPersonaBlogSensitivityIssue = issue;

    // Set popup title based on type
    const icon = issue.type === 'direct' ? '🔴' : '🟠';
    const title = issue.type === 'direct' ? 'Direct Replacement Available' : 'Context Review Needed';

    personaBlogSensitivityPopupTitle.textContent = `${icon} ${title}`;

    // Set message
    if (issue.type === 'direct') {
        personaBlogSensitivityPopupMessage.textContent = `Click to replace "${issue.word}" with:`;
    } else {
        personaBlogSensitivityPopupMessage.textContent = issue.message;
    }

    // Clear and populate suggestions
    personaBlogSensitivityPopupSuggestions.innerHTML = '';

    if (issue.type === 'direct' && issue.suggestions) {
        issue.suggestions.forEach(suggestion => {
            const pill = document.createElement('button');
            pill.className = 'suggestion-pill suggestion-sensitivity-direct';
            pill.textContent = suggestion;
            pill.onclick = () => {
                replacePersonaBlogSensitivityWord(issue, suggestion);
                closePersonaBlogSensitivityPopup();
            };
            personaBlogSensitivityPopupSuggestions.appendChild(pill);
        });
        personaBlogSensitivityPopupSuggestions.style.display = 'flex';
    } else {
        personaBlogSensitivityPopupSuggestions.style.display = 'none';
    }

    // Position popup
    const rect = markElement.getBoundingClientRect();
    const popupWidth = 400;
    const popupHeight = 200;

    let top = rect.bottom + 8;
    let left = rect.left;

    // Adjust horizontal position
    if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 20;
    }
    if (left < 20) {
        left = 20;
    }

    // Adjust vertical position
    if (top + popupHeight > window.innerHeight) {
        const topPosition = rect.top - popupHeight - 8;
        if (topPosition > 0) {
            top = topPosition;
        } else {
            top = Math.max(20, rect.bottom - popupHeight / 2);
        }
    }

    personaBlogSensitivityPopup.style.top = `${top}px`;
    personaBlogSensitivityPopup.style.left = `${left}px`;

    // Show popup
    personaBlogSensitivityPopup.classList.add('active');
}

function closePersonaBlogSensitivityPopup() {
    personaBlogSensitivityPopup.classList.remove('active');
}

function replacePersonaBlogSensitivityWord(issue, replacement) {
    const text = personaBlogOutputText.value;
    const before = text.substring(0, issue.start);
    const after = text.substring(issue.end);

    // Replace the word
    personaBlogOutputText.value = before + replacement + after;

    // Update character count
    updatePersonaBlogCharCount();

    // Re-run sensitivity check to update highlights
    setTimeout(() => {
        runPersonaBlogSensitivityCheck();
    }, 100);

    setStatus(`Replaced "${issue.word}" with "${replacement}"`, 'success');
}

function clearPersonaBlogSensitivityHighlights() {
    if (!personaBlogSensitivityHighlights) return;

    personaBlogSensitivityHighlights.innerHTML = '';
    closePersonaBlogSensitivityPopup();
    const container = personaBlogOutputText.closest('.sensitivity-highlight-container');
    if (container) {
        container.classList.remove('has-highlights');
    }
    if (personaBlogSensitivityHintBanner) {
        personaBlogSensitivityHintBanner.classList.remove('active');
    }
    currentPersonaBlogSensitivityIssues = [];
}

async function copySuggestionToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        setStatus(`Copied "${text}" to clipboard`, 'success');
    } catch (error) {
        console.error('Copy error:', error);
        setStatus('Failed to copy to clipboard', 'error');
    }
}

export function initPersonaBlogProcessor() {
    // Check if all required elements exist
    if (!personaBlogInputText || !personaBlogOutputText || !personaBlogProofreadBtn ||
        !personaBlogCopyBtn || !personaBlogDiffBtn || !personaBlogDiffContainer) {
        console.warn('Persona blog elements not found, skipping initialization');
        return;
    }

    // Initialize diff viewer with toggle button
    initPersonaBlogDiffViewer();

    // Proofread button click handler
    personaBlogProofreadBtn.addEventListener('click', async () => {
        await proofreadPersonaBlog();
    });

    // Keyboard Shortcut (Ctrl/Cmd + Enter)
    personaBlogInputText.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const hasApiKey = localStorage.getItem('gemini_api_key');
            const hasInput = personaBlogInputText.value.trim().length > 0;
            if (hasApiKey && hasInput) {
                proofreadPersonaBlog();
            }
        }
    });

    // Copy to Clipboard
    personaBlogCopyBtn.addEventListener('click', async () => {
        const output = personaBlogOutputText.value;

        if (!output) {
            setStatus('No output to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            setStatus('Output copied to clipboard', 'success');

            // Show visual confirmation
            const originalText = personaBlogCopyBtn.textContent;
            personaBlogCopyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
                personaBlogCopyBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            console.error('Copy error:', error);
            setStatus('Failed to copy to clipboard', 'error');
        }
    });

    // Keep popup open when hovering over it
    if (personaBlogSensitivityPopup) {
        personaBlogSensitivityPopup.addEventListener('mouseenter', () => {
            // Clear the timeout so popup stays open
            if (personaBlogSensitivityPopupTimeout) {
                clearTimeout(personaBlogSensitivityPopupTimeout);
                personaBlogSensitivityPopupTimeout = null;
            }
        });

        personaBlogSensitivityPopup.addEventListener('mouseleave', () => {
            // Close popup when leaving it
            closePersonaBlogSensitivityPopup();
        });
    }

    // Sensitivity check button
    if (personaBlogSensitivityBtn) {
        personaBlogSensitivityBtn.addEventListener('click', runPersonaBlogSensitivityCheck);
    }

    // Dismiss sensitivity hints button
    if (personaBlogDismissSensitivityHints) {
        personaBlogDismissSensitivityHints.addEventListener('click', () => {
            clearPersonaBlogSensitivityHighlights();
            personaBlogOutputText.focus();
        });
    }

    // Sensitivity popup close handlers
    if (personaBlogSensitivityPopupClose) {
        personaBlogSensitivityPopupClose.addEventListener('click', closePersonaBlogSensitivityPopup);
    }

    if (personaBlogSensitivityPopupDismiss) {
        personaBlogSensitivityPopupDismiss.addEventListener('click', closePersonaBlogSensitivityPopup);
    }

    // Keyboard navigation for sensitivity popup
    if (personaBlogSensitivityPopup) {
        personaBlogSensitivityPopup.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePersonaBlogSensitivityPopup();
                personaBlogOutputText.focus();
            }
        });
    }

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (personaBlogSensitivityPopup && !personaBlogSensitivityPopup.contains(e.target) &&
            !e.target.closest('mark.sensitivity-issue') &&
            !e.target.closest('.sensitivity-hint-banner')) {
            closePersonaBlogSensitivityPopup();
        }
    });

    // Sync textarea scroll with highlights
    if (personaBlogOutputText && personaBlogSensitivityHighlights) {
        personaBlogOutputText.addEventListener('scroll', () => {
            personaBlogSensitivityHighlights.scrollTop = personaBlogOutputText.scrollTop;
            personaBlogSensitivityHighlights.scrollLeft = personaBlogOutputText.scrollLeft;
        });
    }

    // Update character count on input
    personaBlogInputText.addEventListener('input', () => {
        updatePersonaBlogCharCount();
        updatePersonaBlogProofreadButtonState();
    });
    personaBlogOutputText.addEventListener('input', updatePersonaBlogCharCount);

    // Initial character count update and button state
    updatePersonaBlogCharCount();
    updatePersonaBlogProofreadButtonState();
}
