import {
    outputText,
    sensitivityBtn,
    sensitivityBtnText,
    sensitivityHighlights,
    sensitivityPopup,
    sensitivityPopupTitle,
    sensitivityPopupMessage,
    sensitivityPopupSuggestions,
    sensitivityPopupDismiss,
    sensitivityPopupClose,
    sensitivityHintBanner,
    sensitivityIssueCount,
    dismissSensitivityHints
} from './dom-elements.js';
import { setStatus, escapeHtml } from './ui-helpers.js';

// Store current sensitivity issues
let currentSensitivityIssues = [];
let sensitivityPopupTimeout = null;
let currentSensitivityIssue = null; // Track which issue the popup is showing

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

export function initSensitivityChecker() {
    // Check if required elements exist
    if (!sensitivityBtn || !outputText || !sensitivityHighlights) {
        console.warn('Sensitivity checker elements not found, skipping initialization');
        return;
    }

    // Keep popup open when hovering over it
    if (sensitivityPopup) {
        sensitivityPopup.addEventListener('mouseenter', () => {
            // Clear the timeout so popup stays open
            if (sensitivityPopupTimeout) {
                clearTimeout(sensitivityPopupTimeout);
                sensitivityPopupTimeout = null;
            }
        });

        sensitivityPopup.addEventListener('mouseleave', () => {
            // Close popup when leaving it
            closeSensitivityPopup();
        });
    }

    // Sensitivity check button click handler
    sensitivityBtn.addEventListener('click', runSensitivityCheck);

    // Dismiss hints button
    dismissSensitivityHints.addEventListener('click', () => {
        clearSensitivityHighlights();
        outputText.focus();
    });

    // Popup close handlers
    sensitivityPopupClose.addEventListener('click', closeSensitivityPopup);

    // Dismiss button
    sensitivityPopupDismiss.addEventListener('click', closeSensitivityPopup);

    // Keyboard navigation for popup
    sensitivityPopup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSensitivityPopup();
            outputText.focus();
        }
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!sensitivityPopup.contains(e.target) &&
            !e.target.closest('mark.sensitivity-issue') &&
            !e.target.closest('.sensitivity-hint-banner')) {
            closeSensitivityPopup();
        }
    });

    // Sync textarea scroll with highlights
    outputText.addEventListener('scroll', () => {
        sensitivityHighlights.scrollTop = outputText.scrollTop;
        sensitivityHighlights.scrollLeft = outputText.scrollLeft;
    });
}

function runSensitivityCheck() {
    const text = outputText.value;

    if (!text.trim()) {
        setStatus('No text to check for sensitivity', 'error');
        return;
    }

    // Set loading state
    sensitivityBtn.disabled = true;
    sensitivityBtnText.innerHTML = '<span class="spinner"></span> Checking...';
    setStatus('Checking for sensitivity issues...', 'normal');

    try {
        const issues = findSensitivityIssues(text);
        currentSensitivityIssues = issues;

        if (issues.length === 0) {
            setStatus('No sensitivity issues found!', 'success');
            clearSensitivityHighlights();
        } else {
            updateSensitivityUI(issues, text);
            setStatus(`Found ${issues.length} potential sensitivity issue${issues.length === 1 ? '' : 's'}`, 'normal');
        }
    } catch (e) {
        console.error('Sensitivity check failed:', e);
        setStatus('Sensitivity check failed', 'error');
    } finally {
        // Reset button state
        sensitivityBtn.disabled = false;
        sensitivityBtnText.innerHTML = '🔍 Check Sensitivity';
    }
}

function findSensitivityIssues(text) {
    const issues = [];

    // Check direct replacements (case-insensitive word boundary matching)
    for (const [word, suggestions] of Object.entries(DIRECT_REPLACEMENTS)) {
        // Create regex with word boundaries, case-insensitive
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
            issues.push({
                type: 'direct',
                word: match[0], // Preserve original case
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

function updateSensitivityUI(issues, text) {
    const container = outputText.closest('.sensitivity-highlight-container');

    // Show hint banner with issue count
    sensitivityIssueCount.textContent = `${issues.length} issue${issues.length === 1 ? '' : 's'}`;
    sensitivityHintBanner.classList.add('active');

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

    sensitivityHighlights.innerHTML = highlightedHTML;

    // Add hover and click handlers to marks
    sensitivityHighlights.querySelectorAll('mark.sensitivity-issue').forEach(mark => {
        // Show popup on hover
        mark.addEventListener('mouseenter', (e) => {
            // Clear any existing timeout
            if (sensitivityPopupTimeout) {
                clearTimeout(sensitivityPopupTimeout);
                sensitivityPopupTimeout = null;
            }
            const issueIndex = parseInt(mark.dataset.issueIndex);
            showSensitivityPopup(currentSensitivityIssues[issueIndex], mark);
        });

        // Hide popup when leaving the mark
        mark.addEventListener('mouseleave', (e) => {
            // Small delay to allow moving to popup
            sensitivityPopupTimeout = setTimeout(() => {
                closeSensitivityPopup();
            }, 200);
        });

        // Also keep click handler for mobile devices
        mark.addEventListener('click', (e) => {
            e.stopPropagation();
            const issueIndex = parseInt(mark.dataset.issueIndex);
            showSensitivityPopup(currentSensitivityIssues[issueIndex], mark);
        });
    });
}

function showSensitivityPopup(issue, markElement) {
    // Store current issue for replacement
    currentSensitivityIssue = issue;

    // Set popup title based on type
    const icon = issue.type === 'direct' ? '🔴' : '🟠';
    const title = issue.type === 'direct' ? 'Direct Replacement Available' : 'Context Review Needed';

    sensitivityPopupTitle.textContent = `${icon} ${title}`;

    // Set message
    if (issue.type === 'direct') {
        sensitivityPopupMessage.textContent = `Click to replace "${issue.word}" with:`;
    } else {
        sensitivityPopupMessage.textContent = issue.message;
    }

    // Clear and populate suggestions
    sensitivityPopupSuggestions.innerHTML = '';

    if (issue.type === 'direct' && issue.suggestions) {
        issue.suggestions.forEach(suggestion => {
            const pill = document.createElement('button');
            pill.className = 'suggestion-pill suggestion-sensitivity-direct';
            pill.textContent = suggestion;
            pill.onclick = () => {
                replaceSensitivityWord(issue, suggestion);
                closeSensitivityPopup();
            };
            sensitivityPopupSuggestions.appendChild(pill);
        });
        sensitivityPopupSuggestions.style.display = 'flex';
    } else {
        sensitivityPopupSuggestions.style.display = 'none';
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

    sensitivityPopup.style.top = `${top}px`;
    sensitivityPopup.style.left = `${left}px`;

    // Show popup
    sensitivityPopup.classList.add('active');
}

function closeSensitivityPopup() {
    sensitivityPopup.classList.remove('active');
}

function replaceSensitivityWord(issue, replacement) {
    const text = outputText.value;
    const before = text.substring(0, issue.start);
    const after = text.substring(issue.end);

    // Replace the word
    outputText.value = before + replacement + after;

    // Update character count
    const event = new Event('input');
    outputText.dispatchEvent(event);

    // Re-run sensitivity check to update highlights
    setTimeout(() => {
        runSensitivityCheck();
    }, 100);

    setStatus(`Replaced "${issue.word}" with "${replacement}"`, 'success');
}

export function clearSensitivityHighlights() {
    sensitivityHighlights.innerHTML = '';
    closeSensitivityPopup();
    outputText.closest('.sensitivity-highlight-container').classList.remove('has-highlights');
    sensitivityHintBanner.classList.remove('active');
    currentSensitivityIssues = [];
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
