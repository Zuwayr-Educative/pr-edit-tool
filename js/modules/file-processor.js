import { SYSTEM_PROMPT } from './config.js';
import { fetchWithFallback } from './api-client.js';
import { setStatus } from './ui-helpers.js';
import { generateFileDiff, computeDiff, initFileDiffViewer } from './diff-viewer.js';

// Module state
let currentFile = null;
let currentFileContent = null;
let currentMarkdownOutput = null;

export function initFileProcessor() {
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const browseFileBtn = document.getElementById('browseFileBtn');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const proofreadFileBtn = document.getElementById('proofreadFileBtn');
    const downloadMarkdownBtn = document.getElementById('downloadMarkdownBtn');
    const fileDiffBtn = document.getElementById('fileDiffBtn');

    // Initialize diff viewer with toggle button
    initFileDiffViewer();

    // Listen for diff regeneration event (triggered by toggle button)
    document.addEventListener('regenerateFileDiff', () => {
        generateFileDiffLocal();
    });

    // Browse button click
    browseFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    // Drop zone click
    fileDropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    fileDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropZone.classList.add('drag-over');
    });

    fileDropZone.addEventListener('dragleave', () => {
        fileDropZone.classList.remove('drag-over');
    });

    fileDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // Remove file
    removeFileBtn.addEventListener('click', () => {
        clearFile();
    });

    // Proofread file
    proofreadFileBtn.addEventListener('click', async () => {
        await proofreadFile();
    });

    // Download markdown
    downloadMarkdownBtn.addEventListener('click', () => {
        downloadMarkdown();
    });
}

async function handleFileSelect(file) {
    const validTypes = ['.txt', '.md', '.doc', '.docx'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(fileExt)) {
        setStatus('Invalid file type. Please upload TXT, MD, DOC, or DOCX', 'error');
        return;
    }

    currentFile = file;

    // Show file info
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('proofreadFileBtn').disabled = false;

    // Hide drop zone
    document.getElementById('fileDropZone').style.display = 'none';

    setStatus(`File loaded: ${file.name}`, 'success');
}

function clearFile() {
    currentFile = null;
    currentFileContent = null;
    currentMarkdownOutput = null;

    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('fileDropZone').style.display = 'block';
    document.getElementById('proofreadFileBtn').disabled = true;
    document.getElementById('downloadMarkdownBtn').style.display = 'none';
    document.getElementById('fileDiffBtn').style.display = 'none';
    document.getElementById('fileInput').value = '';

    // Hide diff viewer
    const fileDiffContainer = document.getElementById('fileDiffContainer');
    fileDiffContainer.classList.remove('active');
    document.getElementById('fileDiffBtn').textContent = '🔄 View Diff';

    const preview = document.getElementById('markdownPreview');
    preview.innerHTML = `
        <div class="file-preview-placeholder">
            <span class="preview-icon">📝</span>
            <p>Upload a file and click "Proofread" to see the markdown output here</p>
        </div>
    `;

    setStatus('Ready', 'normal');
}

async function proofreadFile() {
    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
        setStatus('Please save your API key first', 'error');
        return;
    }

    if (!currentFile) {
        setStatus('Please upload a file first', 'error');
        return;
    }

    const proofreadFileBtn = document.getElementById('proofreadFileBtn');
    const proofreadFileBtnText = document.getElementById('proofreadFileBtnText');
    const progressInline = document.getElementById('fileProgressInline');
    const progressStatus = document.getElementById('fileProgressStatus');
    const progressFillInline = document.getElementById('fileProgressFillInline');
    const statusInfo = document.getElementById('statusInfo');

    // Set loading state
    proofreadFileBtn.disabled = true;
    proofreadFileBtnText.innerHTML = '<span class="spinner"></span> Processing...';
    setStatus('Reading file...', 'normal');

    // Show progress bar - Milestone 1: Reading file
    progressInline.style.display = 'block';
    progressStatus.textContent = '📄 Reading file...';
    progressFillInline.style.width = '25%';

    try {
        // Read file content
        const content = await readFileContent(currentFile);
        currentFileContent = content;

        console.log(`File content extracted: ${content.length} characters`);

        // Milestone 2: File read complete
        progressStatus.textContent = '✅ File read complete';
        progressFillInline.style.width = '40%';

        // Check if content is too large (Gemini has limits)
        const maxChars = 1000000; // ~1M chars (conservative limit)
        if (content.length > maxChars) {
            const shouldContinue = confirm(
                `This document is very large (${Math.round(content.length / 1024)}KB). ` +
                `It may be truncated or take a long time to process. Continue anyway?`
            );
            if (!shouldContinue) {
                clearFile();
                return;
            }
        }

        setStatus('Sending to AI...', 'normal');

        const startTime = Date.now();

        // Modified prompt for markdown output
        const markdownPrompt = SYSTEM_PROMPT + `\n\n**ADDITIONAL OUTPUT REQUIREMENT**: You MUST output the result as properly formatted Markdown. Use Markdown syntax for:
- Headings (# ## ###)
- Bold (**text**)
- Italic (*text*)
- Lists (- or 1.)
- Code blocks (\`\`\`)
- Links ([text](url))
- Block quotes (>)

The output should be clean, well-structured Markdown that can be saved as a .md file.`;

        // Smart token limit based on input size (input chars * 3, capped)
        const estimatedOutputTokens = Math.min(Math.max(content.length * 3, 8192), 65536);

        const requestBody = {
            system_instruction: {
                parts: [{ text: markdownPrompt }]
            },
            contents: [{
                role: "user",
                parts: [{ text: `--- DOCUMENT START ---\n${content}\n--- DOCUMENT END ---` }]
            }],
            generationConfig: {
                temperature: 1.0,
                maxOutputTokens: estimatedOutputTokens,
                thinkingConfig: {
                    thinkingLevel: "low"
                }
            }
        };

        // Milestone 3: Sending to AI
        progressStatus.textContent = '🤖 Waiting for AI response...';
        progressFillInline.style.width = '60%';

        console.log('Sending request to Gemini API...');
        console.log(`Input size: ${content.length} chars, Token limit: ${estimatedOutputTokens}`);

        const { response, model } = await fetchWithFallback(apiKey, requestBody);
        console.log('Got response from API, starting to stream...');

        // Milestone 4: AI generating content
        progressStatus.textContent = '✨ AI generating...';
        progressFillInline.style.width = '75%';

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        const preview = document.getElementById('markdownPreview');
        preview.textContent = '';

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
                            preview.textContent = accumulatedText;
                            preview.scrollTop = preview.scrollHeight;
                        }
                    } catch (e) {
                        // Ignore parsing errors
                    }
                }
            }
        }

        if (!accumulatedText) {
            throw new Error('No text received from API');
        }

        // Store markdown output for diff
        currentMarkdownOutput = accumulatedText;

        // Milestone 4: Complete!
        progressStatus.textContent = '✅ Complete!';
        progressFillInline.style.width = '100%';
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);

        setStatus('Processing complete', 'success');
        statusInfo.textContent = `Completed in ${elapsedTime}s`;

        // Show download and diff buttons
        document.getElementById('downloadMarkdownBtn').style.display = 'inline-flex';
        document.getElementById('downloadMarkdownBtn').disabled = false;
        document.getElementById('fileDiffBtn').style.display = 'inline-flex';
        document.getElementById('fileDiffBtn').disabled = false;

        // Auto-open diff viewer
        const fileDiffContainer = document.getElementById('fileDiffContainer');
        generateFileDiffLocal();
        fileDiffContainer.classList.add('active');
        document.getElementById('fileDiffBtn').textContent = '❌ Hide Diff';
        setTimeout(() => {
            fileDiffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

        // Hide progress bar after 2 seconds
        setTimeout(() => {
            progressInline.style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('File processing error:', error);
        setStatus(error.message || 'Error processing file', 'error');
        // Hide progress bar on error
        progressInline.style.display = 'none';
    } finally {
        proofreadFileBtn.disabled = false;
        proofreadFileBtnText.innerHTML = '✨ Proofread & Convert to Markdown';
    }
}

async function readFileContent(file) {
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (fileExt === '.txt' || fileExt === '.md') {
        return await file.text();
    } else if (fileExt === '.doc' || fileExt === '.docx') {
        return await readDOCXFile(file);
    }

    throw new Error('Unsupported file type');
}

// DOC/DOCX Reader using mammoth.js
async function readDOCXFile(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();

        // Use mammoth to extract text (mammoth is loaded via CDN in HTML)
        const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });

        if (!result.value || !result.value.trim()) {
            throw new Error('No text found in document.');
        }

        // Log any messages from mammoth (warnings, etc.)
        if (result.messages && result.messages.length > 0) {
            console.log('Mammoth messages:', result.messages);
        }

        return result.value;
    } catch (error) {
        console.error('DOC/DOCX parsing error:', error);
        throw new Error(`Failed to read DOC/DOCX: ${error.message}`);
    }
}

function downloadMarkdown() {
    const preview = document.getElementById('markdownPreview');
    const content = preview.textContent;

    if (!content) {
        setStatus('No content to download', 'error');
        return;
    }

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Use original filename but change extension to .md
    const originalName = currentFile ? currentFile.name : 'document';
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    a.download = `${baseName}_proofread.md`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus('Markdown file downloaded', 'success');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Generate diff for file processor (local version that uses module state)
function generateFileDiffLocal() {
    if (currentFileContent && currentMarkdownOutput) {
        generateFileDiff(currentFileContent, currentMarkdownOutput);
    }
}
