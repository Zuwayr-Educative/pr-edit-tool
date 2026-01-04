import {
    inputText,
    outputText,
    diffBtn,
    diffContainer,
    diffContent,
    fileDiffBtn,
    fileDiffContainer,
    fileDiffContent,
    personaBlogInputText,
    personaBlogOutputText,
    personaBlogDiffBtn,
    personaBlogDiffContainer
} from './dom-elements.js';
import { escapeHtml } from './ui-helpers.js';

// State to track current view mode (per diff viewer)
let textDiffViewMode = 'inline'; // 'inline' or 'sidebyside'
let fileDiffViewMode = 'inline';
let personaBlogDiffViewMode = 'inline';

// Generate diff for text editor
export function generateDiff() {
    const input = inputText.value.trim();
    const output = outputText.value.trim();

    if (!input || !output) {
        diffContent.innerHTML = '<p style="color: var(--text-secondary);">No text to compare.</p>';
        return;
    }

    const html = textDiffViewMode === 'sidebyside'
        ? computeSideBySideDiff(input, output)
        : computeInlineDiff(input, output);

    diffContent.innerHTML = html;
}

// Generate diff for file processor
export function generateFileDiff(originalContent, markdownOutput) {
    if (!originalContent || !markdownOutput) {
        fileDiffContent.innerHTML = '<p style="color: var(--text-secondary);">No content to compare.</p>';
        return;
    }

    const html = fileDiffViewMode === 'sidebyside'
        ? computeSideBySideDiff(originalContent, markdownOutput)
        : computeInlineDiff(originalContent, markdownOutput);

    fileDiffContent.innerHTML = html;
}

// Toggle diff view mode for text editor
export function toggleTextDiffView() {
    textDiffViewMode = textDiffViewMode === 'inline' ? 'sidebyside' : 'inline';
    generateDiff();
    return textDiffViewMode;
}

// Toggle diff view mode for file processor
export function toggleFileDiffView() {
    fileDiffViewMode = fileDiffViewMode === 'inline' ? 'sidebyside' : 'inline';
    // Re-generate diff if content exists
    const diffContentElement = fileDiffContent;
    if (diffContentElement && diffContentElement.innerHTML && !diffContentElement.innerHTML.includes('No content to compare')) {
        // Trigger regeneration by calling from file-processor
        // This needs to be handled by the file processor module
    }
    return fileDiffViewMode;
}

// Generate diff for persona blog editor
export function generatePersonaBlogDiff() {
    const input = personaBlogInputText.value.trim();
    const output = personaBlogOutputText.value.trim();

    const personaBlogDiffContent = document.getElementById('personaBlogDiffContent');

    if (!input || !output) {
        personaBlogDiffContent.innerHTML = '<p style="color: var(--text-secondary);">No text to compare.</p>';
        return;
    }

    const html = personaBlogDiffViewMode === 'sidebyside'
        ? computeSideBySideDiff(input, output)
        : computeInlineDiff(input, output);

    personaBlogDiffContent.innerHTML = html;
}

// Toggle diff view mode for persona blog editor
export function togglePersonaBlogDiffView() {
    personaBlogDiffViewMode = personaBlogDiffViewMode === 'inline' ? 'sidebyside' : 'inline';
    generatePersonaBlogDiff();
    return personaBlogDiffViewMode;
}

// Get current view mode
export function getTextDiffViewMode() {
    return textDiffViewMode;
}

export function getFileDiffViewMode() {
    return fileDiffViewMode;
}

export function getPersonaBlogDiffViewMode() {
    return personaBlogDiffViewMode;
}

// Improved inline diff algorithm
function computeInlineDiff(text1, text2) {
    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);

    const diff = computeWordDiff(words1, words2);

    // Count additions and removals
    let additions = 0;
    let removals = 0;
    for (const item of diff) {
        if (item.type === 'added') additions++;
        if (item.type === 'removed') removals++;
    }

    // Build improved inline HTML
    let html = '<div class="inline-diff">';

    // Statistics header
    html += '<div class="diff-stats-header">';
    if (removals > 0) {
        html += `<span class="stat-removals">− ${removals} ${removals === 1 ? 'change' : 'changes'}</span>`;
    }
    if (additions > 0) {
        html += `<span class="stat-additions">+ ${additions} ${additions === 1 ? 'change' : 'changes'}</span>`;
    }
    if (removals === 0 && additions === 0) {
        html += `<span class="stat-no-changes">No changes detected</span>`;
    }
    html += '</div>';

    // Diff content
    html += '<div class="inline-diff-content">';

    for (const item of diff) {
        const escapedText = escapeHtml(item.text);
        if (item.type === 'added') {
            html += `<span class="diff-inline-added" title="Added">${escapedText}</span>`;
        } else if (item.type === 'removed') {
            html += `<span class="diff-inline-removed" title="Removed">${escapedText}</span>`;
        } else {
            html += `<span class="diff-inline-unchanged">${escapedText}</span>`;
        }
    }

    html += '</div>'; // inline-diff-content
    html += '</div>'; // inline-diff

    return html;
}

// Side-by-side diff algorithm
function computeSideBySideDiff(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    const diff = computeLineDiff(lines1, lines2);

    // Build side-by-side HTML
    let html = '<div class="side-by-side-diff">';

    // Header
    html += '<div class="diff-header">';
    html += `<div class="diff-stats">`;
    html += `<span class="removals">− ${diff.removals} removal${diff.removals === 1 ? '' : 's'}</span>`;
    html += `<span class="additions">+ ${diff.additions} addition${diff.additions === 1 ? '' : 's'}</span>`;
    html += `</div>`;
    html += '</div>';

    // Two columns
    html += '<div class="diff-columns">';

    // Left column (original)
    html += '<div class="diff-column diff-column-left">';
    for (const line of diff.leftLines) {
        html += formatDiffLine(line, 'left');
    }
    html += '</div>';

    // Right column (edited)
    html += '<div class="diff-column diff-column-right">';
    for (const line of diff.rightLines) {
        html += formatDiffLine(line, 'right');
    }
    html += '</div>';

    html += '</div>'; // diff-columns
    html += '</div>'; // side-by-side-diff

    return html;
}

// Format a single diff line
function formatDiffLine(line, side) {
    const lineNumClass = line.type === 'removed' || line.type === 'added' ? 'diff-line-num-changed' : 'diff-line-num';
    const lineClass = line.type === 'removed' ? 'diff-line-removed' :
                      line.type === 'added' ? 'diff-line-added' :
                      'diff-line-unchanged';

    let html = `<div class="diff-line ${lineClass}">`;

    // Line number
    if (line.lineNum !== null) {
        html += `<span class="${lineNumClass}">${line.lineNum}</span>`;
    } else {
        html += `<span class="${lineNumClass}"></span>`;
    }

    // Line content with inline highlights
    html += `<span class="diff-line-content">${line.html}</span>`;

    html += '</div>';

    return html;
}

// Compute line-based diff with word-level highlighting
function computeLineDiff(lines1, lines2) {
    const n = lines1.length;
    const m = lines2.length;
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

    // Build LCS table for lines
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (lines1[i - 1] === lines2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to build diff operations
    let i = n, j = m;
    const operations = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
            operations.unshift({ type: 'unchanged', line1: i - 1, line2: j - 1 });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            operations.unshift({ type: 'added', line2: j - 1 });
            j--;
        } else if (i > 0) {
            operations.unshift({ type: 'removed', line1: i - 1 });
            i--;
        }
    }

    // Build left and right line arrays
    const leftLines = [];
    const rightLines = [];
    let leftLineNum = 1;
    let rightLineNum = 1;
    let removals = 0;
    let additions = 0;

    for (const op of operations) {
        if (op.type === 'unchanged') {
            const text = lines1[op.line1];
            const escapedText = escapeHtml(text);

            leftLines.push({
                type: 'unchanged',
                lineNum: leftLineNum,
                html: escapedText,
                text: text
            });

            rightLines.push({
                type: 'unchanged',
                lineNum: rightLineNum,
                html: escapedText,
                text: text
            });

            leftLineNum++;
            rightLineNum++;

        } else if (op.type === 'removed') {
            const text = lines1[op.line1];
            const html = highlightWordsInLine(text, null);

            leftLines.push({
                type: 'removed',
                lineNum: leftLineNum,
                html: html,
                text: text
            });

            rightLines.push({
                type: 'empty',
                lineNum: null,
                html: '',
                text: ''
            });

            leftLineNum++;
            removals++;

        } else if (op.type === 'added') {
            const text = lines2[op.line2];
            const html = highlightWordsInLine(null, text);

            leftLines.push({
                type: 'empty',
                lineNum: null,
                html: '',
                text: ''
            });

            rightLines.push({
                type: 'added',
                lineNum: rightLineNum,
                html: html,
                text: text
            });

            rightLineNum++;
            additions++;
        }
    }

    // Second pass: detect modified lines (removed + added next to each other)
    for (let i = 0; i < leftLines.length; i++) {
        if (leftLines[i].type === 'removed' && rightLines[i].type === 'added') {
            // This is a modified line - highlight word-level differences
            const leftText = leftLines[i].text;
            const rightText = rightLines[i].text;

            const { leftHtml, rightHtml } = highlightWordDifferences(leftText, rightText);

            leftLines[i].html = leftHtml;
            rightLines[i].html = rightHtml;
        }
    }

    return {
        leftLines,
        rightLines,
        removals,
        additions
    };
}

// Highlight word-level differences between two lines
function highlightWordDifferences(text1, text2) {
    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);

    const n = words1.length;
    const m = words2.length;
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

    // Build LCS table for words
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (words1[i - 1] === words2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack
    let i = n, j = m;
    const result1 = [];
    const result2 = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
            result1.unshift({ type: 'unchanged', text: words1[i - 1] });
            result2.unshift({ type: 'unchanged', text: words2[j - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result2.unshift({ type: 'added', text: words2[j - 1] });
            j--;
        } else if (i > 0) {
            result1.unshift({ type: 'removed', text: words1[i - 1] });
            i--;
        }
    }

    // Build HTML for left side
    let leftHtml = '';
    for (const item of result1) {
        const escaped = escapeHtml(item.text);
        if (item.type === 'removed') {
            leftHtml += `<mark class="word-removed">${escaped}</mark>`;
        } else {
            leftHtml += escaped;
        }
    }

    // Build HTML for right side
    let rightHtml = '';
    for (const item of result2) {
        const escaped = escapeHtml(item.text);
        if (item.type === 'added') {
            rightHtml += `<mark class="word-added">${escaped}</mark>`;
        } else {
            rightHtml += escaped;
        }
    }

    return { leftHtml, rightHtml };
}

// Highlight words in a single line (for pure additions or removals)
function highlightWordsInLine(removedText, addedText) {
    if (removedText !== null) {
        return escapeHtml(removedText);
    } else if (addedText !== null) {
        return escapeHtml(addedText);
    }
    return '';
}

// Word-based diff for inline view
function computeWordDiff(words1, words2) {
    const n = words1.length;
    const m = words2.length;
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (words1[i - 1] === words2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    let i = n, j = m;
    const result = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
            result.unshift({ type: 'unchanged', text: words1[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result.unshift({ type: 'added', text: words2[j - 1] });
            j--;
        } else if (i > 0) {
            result.unshift({ type: 'removed', text: words1[i - 1] });
            i--;
        }
    }

    return result;
}

// Initialize diff viewer for text editor
export function initDiffViewer() {
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-secondary diff-toggle-btn';
    toggleBtn.innerHTML = '⇄ Toggle View';
    toggleBtn.style.marginLeft = '8px';

    // Insert toggle button next to diff button
    diffBtn.parentNode.insertBefore(toggleBtn, diffBtn.nextSibling);

    // Toggle button handler
    toggleBtn.addEventListener('click', () => {
        const newMode = toggleTextDiffView();
        // Update button text
        toggleBtn.innerHTML = newMode === 'inline' ? '⇄ Side-by-Side' : '⇄ Inline View';
    });

    diffBtn.addEventListener('click', () => {
        const isActive = diffContainer.classList.contains('active');

        if (isActive) {
            // Hide diff view
            diffContainer.classList.remove('active');
            diffBtn.textContent = '🔄 View Diff';
        } else {
            // Show diff view
            generateDiff();
            diffContainer.classList.add('active');
            diffBtn.textContent = '❌ Hide Diff';
            // Scroll to diff
            diffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Initialize diff viewer for file processor
export function initFileDiffViewer() {
    // Create toggle button for file diff
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-secondary diff-toggle-btn';
    toggleBtn.innerHTML = '⇄ Toggle View';
    toggleBtn.style.marginLeft = '8px';

    // Insert toggle button next to file diff button
    fileDiffBtn.parentNode.insertBefore(toggleBtn, fileDiffBtn.nextSibling);

    // Toggle button handler
    toggleBtn.addEventListener('click', () => {
        const newMode = toggleFileDiffView();
        toggleBtn.innerHTML = newMode === 'inline' ? '⇄ Side-by-Side' : '⇄ Inline View';

        // Need to trigger regeneration - this will be called from file-processor
        const event = new CustomEvent('regenerateFileDiff');
        document.dispatchEvent(event);
    });

    fileDiffBtn.addEventListener('click', () => {
        const isActive = fileDiffContainer.classList.contains('active');

        if (isActive) {
            // Hide diff view
            fileDiffContainer.classList.remove('active');
            fileDiffBtn.textContent = '🔄 View Diff';
        } else {
            // Show diff view - will be populated by file processor
            fileDiffContainer.classList.add('active');
            fileDiffBtn.textContent = '❌ Hide Diff';
            // Scroll to diff
            fileDiffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Initialize diff viewer for persona blog editor
export function initPersonaBlogDiffViewer() {
    // Create toggle button for persona blog diff
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-secondary diff-toggle-btn';
    toggleBtn.innerHTML = '⇄ Toggle View';
    toggleBtn.style.marginLeft = '8px';

    // Insert toggle button next to persona blog diff button
    personaBlogDiffBtn.parentNode.insertBefore(toggleBtn, personaBlogDiffBtn.nextSibling);

    // Toggle button handler
    toggleBtn.addEventListener('click', () => {
        const newMode = togglePersonaBlogDiffView();
        toggleBtn.innerHTML = newMode === 'inline' ? '⇄ Side-by-Side' : '⇄ Inline View';
    });

    personaBlogDiffBtn.addEventListener('click', () => {
        const isActive = personaBlogDiffContainer.classList.contains('active');

        if (isActive) {
            // Hide diff view
            personaBlogDiffContainer.classList.remove('active');
            personaBlogDiffBtn.textContent = '🔄 View Diff';
        } else {
            // Show diff view
            generatePersonaBlogDiff();
            personaBlogDiffContainer.classList.add('active');
            personaBlogDiffBtn.textContent = '❌ Hide Diff';
            // Scroll to diff
            personaBlogDiffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Legacy export for backward compatibility
export function computeDiff(arr1, arr2) {
    // Simple inline diff for compatibility
    const diff = computeWordDiff(arr1, arr2);

    let html = '';
    for (const item of diff) {
        const escapedText = escapeHtml(item.text);
        if (item.type === 'added') {
            html += `<span class="diff-added">${escapedText}</span>`;
        } else if (item.type === 'removed') {
            html += `<span class="diff-removed">${escapedText}</span>`;
        } else {
            html += `<span class="diff-unchanged">${escapedText}</span>`;
        }
    }

    return html;
}
