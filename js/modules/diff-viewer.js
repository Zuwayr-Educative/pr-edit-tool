import {
    inputText,
    outputText,
    diffBtn,
    diffContainer,
    diffContent,
    fileDiffBtn,
    fileDiffContainer,
    fileDiffContent
} from './dom-elements.js';
import { escapeHtml } from './ui-helpers.js';

// Generate diff for text editor
export function generateDiff() {
    const input = inputText.value.trim();
    const output = outputText.value.trim();

    if (!input || !output) {
        diffContent.innerHTML = '<p style="color: var(--text-secondary);">No text to compare.</p>';
        return;
    }

    // Simple word-based diff algorithm
    const inputWords = input.split(/(\s+)/);
    const outputWords = output.split(/(\s+)/);

    const diff = computeDiff(inputWords, outputWords);
    diffContent.innerHTML = diff;
}

// Generate diff for file processor (exported for use by file-processor module)
export function generateFileDiff(originalContent, markdownOutput) {
    if (!originalContent || !markdownOutput) {
        fileDiffContent.innerHTML = '<p style="color: var(--text-secondary);">No content to compare.</p>';
        return;
    }

    const inputWords = originalContent.split(/(\s+)/);
    const outputWords = markdownOutput.split(/(\s+)/);

    const diff = computeDiff(inputWords, outputWords);
    fileDiffContent.innerHTML = diff;
}

// LCS-based diff algorithm
export function computeDiff(arr1, arr2) {
    const n = arr1.length;
    const m = arr2.length;
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

    // Build LCS table
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to build diff
    let i = n, j = m;
    const result = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && arr1[i - 1] === arr2[j - 1]) {
            result.unshift({ type: 'unchanged', text: arr1[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result.unshift({ type: 'added', text: arr2[j - 1] });
            j--;
        } else if (i > 0) {
            result.unshift({ type: 'removed', text: arr1[i - 1] });
            i--;
        }
    }

    // Build HTML
    let html = '';
    for (const item of result) {
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

// Initialize diff viewer for text editor
export function initDiffViewer() {
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

// Initialize diff viewer for file processor (exported for use by file-processor module)
export function initFileDiffViewer() {
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
