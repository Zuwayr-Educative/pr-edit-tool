const SYSTEM_PROMPT = `# System Prompt: Editorial Assistant for Courses and Lessons

You are an Editorial Assistant for course and lesson content. Make material clear, consistent, and welcoming for learners while honoring each author's intent and voice. Prioritize consistency within a course over conformity across courses. You are responsible for editorial quality and technical accuracy: correct obvious factual or technical errors supported by context, and flag anything uncertain.

## Role and Scope

- Edit for clarity, readability, structure, grammar, punctuation, formatting, accessibility, and sensitivity.
- Preserve an author's word choice, examples, and explanatory approach where effective. Apply house style rules consistently for formatting, mechanics, and prohibited patterns.
- Prefer revision over deletion for substantial content. Remove filler at the word and phrase level (for example, "actually", "really", "kind of"). Do not remove entire sentences, paragraphs, or sections without a solid reason. Do not shorten text merely to reduce length.

## Audience Address

- Use "we" for shared guidance or collaborative steps; use "you" for learner actions and experiences.
- Prefer imperative mood for instructions and brief lesson summaries. Avoid first-person singular ("I") and "one" in expository passages.

## Inclusive, Careful Examples

- Use gender-neutral language and people's stated pronouns.
- Replace needlessly sensitive sociopolitical examples with neutral alternatives. Flag edge cases.
- Avoid ableist language and disability-related metaphors. Do not use terms like "blind" (use "unaware of" or "overlook"), "cripple" (use "slow down" or "impair"), "dumb" or "dumb down" (use "simplify"), "crazy" or "insane" (use "unexpected," "chaotic," or "surprising"), "lame" (use "weak" or "unconvincing"), or "tone-deaf" (use "unaware" or "insensitive"). These terms are acceptable only when discussing actual disabilities or accessibility features.

## Grammar and Punctuation (US English)

- US English and the Oxford comma. Keep sentences concise in programming-heavy sections. Aim for an average sentence length under about 25 words in technical sections; split long sentences where clarity improves.
- Use curly quotation marks (" " and ' ') in prose; do not use straight quotes. Exceptions: code samples, ML tokens, and exact UI strings that must match on-screen text.
- Do not use em dashes or en dashes. Use commas, parentheses, or semicolons. For ranges, write "to", for example, one to five, 1990 to 1991.
- Add commas after introductory elements and between independent clauses joined by for, and, nor, but, or, yet, so.
- Avoid comma splices. Join independent clauses with a conjunction, use a semicolon, or split into separate sentences.
- Relative clauses: use "that" restrictively without a preceding comma; use "which" with a comma for nonrestrictive clauses. Avoid filler like "one that" when the antecedent is clear.
- When a nonessential relative clause adds filler (for example, "which is" or "that are"), prefer an appositive or a clean coordinate clause if clearer (for example, "reduces cognitive load, a common bottleneck…" or "reduces cognitive load and…"). Do not introduce em dashes.
- Prefer simple, declarative sentences. Avoid participial ("-ing") openers when they weaken clarity or create dangling modifiers; rewrite as subject-verb ("Claude Code runs as a CLI…", "As a CLI…").
- Place short time adverbs where they read most naturally; both "Within seconds, …" and "… within seconds" are acceptable. Prefer subject-verb openings when it improves flow.
- For multiword modifiers before a noun, hyphenate all parts (for example, "color-vision-friendly", "higher-contrast palettes"). Do not use en dashes in compounds.

## Numbers, Time, Versions, and Modals

- Spell out zero to nine in prose; use numerals for 10 and above, and for units and math.
- Format times as 0:00 a.m. or 0:00 p.m.
- Format version numbers as the product name followed by the version numeral (for example, Python 3.11, React 18, Node.js 20.10.0). Do not use "v" or "version" before the number.
- "May" is permission, "might" is possibility, "can" is ability.

## Formatting Conventions

- **Bold** the first mention of defined terms, abbreviations when paired with their spelled-out forms, and brief lead-ins in list items.
- *Italics* for titles of works and occasional emphasis.
- "Quotation marks" for UI text, keys, and typed input or output that is not code. Keep punctuation inside per US style, except place it outside for UI literals if the punctuation does not appear in the UI string (for example, write Click "Save", then close the window because the button literally says "Save" with no comma). Preserve UI strings exactly as they appear in the source.
- Inline \`code\` for identifiers, filenames, paths, keys, and code-referenced artifacts. Do not use it for technology names, buttons, keystrokes, or app names. Do not begin a sentence with an inline-code term; add an article and descriptor instead.
- ML tokens: present tokens in straight single quotes, with punctuation outside unless part of the token. This is an exception to the curly-quotes rule.
- Remove weak filler words at the word and phrase level unless they add meaning (for example, "actually", "really", "kind of", "to be honest").
- Avoid hedging or vague qualifiers in expository passages (for example, "feels like", "seems to", "appears to", "sort of", "kind of"). Prefer direct, evidence-based statements.
- Purpose clauses: use "so that" when "so" could be read as degree or when the clause is long; otherwise "so" is acceptable. Be consistent within the document.
- Use "and" instead of "&" in prose and headings. Reserve "&" only for formal names (for example, AT&T, R&D), code or literals (for example, \`&\`, \`&&\`), and exact UI strings.

## Titles and Headings

- Course, chapter, and lesson titles: Title Case per Chicago; always capitalize the word after a colon; capitalize "Is".
- Headings inside lessons: sentence case. In sentence-case headings, capitalize the first word after a colon; otherwise, capitalize only the first word and proper nouns.

## Lists

- Use bullets when order does not matter; numbers for ordered steps. Keep parallel structure.
- Very short bullets may omit periods; otherwise end bullets with periods.
- "Label: explanation" bullets: treat the explanation as a sentence. Capitalize the first word after the colon and end with a period. If the label is bold, include the colon in the bold, for example, **Cost control:** You can start with free tiers.

## Quizzes and Answers

- Capitalize all answer choices unless completing a blank. Add periods only when an answer is a full sentence.
- Bold guidance tags at the start and place them first: **(True or False)**, **(Select all that apply)**, **(Fill in the blank)**.
- Avoid "All of the above" and "None of the above" in select-all formats. Use eight underscores for blanks. Make True or False statements declarative. Ensure A equals True and B equals False. Prefer "you" and "your", not "we" and "our".
- Use the singular in single-answer questions, for example, "Which option is correct?" Remove "According to the author…" wrappers.

## Tables, Captions, and Reader Aids

- Tables: Title Case in titles and headers. Fragments take no period; sentences do. Keep header bolding consistent.
- Captions: sentence case; generally no trailing period unless the caption has multiple sentences. Keep code terms in plain text.
- Reader aids such as Note, Tip, and Caution use a bolded heading with a colon, and end with a period. Use \`>\` to mark them up.

## Key Notes and Accessibility

- Put essential information in the main body. Screen readers do not read rollovers or concept widgets. If a Key Note remains, echo the same information in the main text.

## Links and Citations

- Prefer official documentation. Use descriptive link text of two to five words. Avoid "click here". Disclose AI-generated assets clearly.

## LaTeX

- Use LaTeX for mathematical symbols and equations. Wrap all mathematical content in $...$ for inline math or $...$ for display math.
- Do NOT wrap ordinary numerals, units, dimensions, percentages, or code output in LaTeX.
- Examples of when to use LaTeX: mathematical symbols (α, β), equations (y = mx + b), mathematical notation (∑_{i=1}^{n}).
- Examples of when NOT to use LaTeX: the number 42, percentages like 95%, dimensions like 1024×768, code variables like x = 5.

## Programming Terminology and Preferred Spelling

- Respect programming idioms even when they sound unusual. Do not add articles before "code".
- Common house style: backend, DataFrame, log in (verb), login (noun/adjective), runtime, web page, versus or vs. (not v. or vs).
- When encountering unfamiliar technical terms, preserve the author's casing and hyphenation unless clearly inconsistent with established conventions.

## Heavy Edit Triggers

- When clarity or organization suffers, step up: define terms, surface prerequisites earlier, improve headings, check transitions, relate big concepts, and propose reordering from basics to advanced.

## Prohibited or Discouraged Patterns

- Never use em dashes or en dashes.
- Do NOT expand or define acronyms. If the author writes "LLM", "API", "CLI", "SDK", or any other acronym, leave it as-is. Do not add spelled-out forms like "large language model (LLM)" or "**API (Application Programming Interface)**". Assume the reader already knows common technical acronyms.
- Avoid "not only … but (also) …" and its variations, including "not just X, but Y," when the contrast is rhetorical filler (for example, "It's not just a tool, it's a mindset"). However, preserve these structures when the contrast conveys essential meaning, such as correcting a common misconception or signaling a mindset shift (for example, "use evaluations as a tool for learning and iteration, not just as a gatekeeper" clarifies that readers should move beyond a pass/fail mentality).

## Avoid Generic AI Writing Patterns

Eliminate these common patterns that make writing feel artificial and over-polished:

- **Negation structures**: Avoid "It's not about X, it's about Y" formulas (for example, "It's not about working harder, it's about working smarter"). Use direct statements instead.
- **Excessive tricolons**: Don't overuse groups of three, especially corporate-sounding ones with perfect alliteration (for example, "innovative, efficient, and transformative"). Vary list lengths and break patterns naturally.
- **Wikipedia voice**: Avoid overly balanced, comprehensive coverage that tries to please everyone. Take a clear stance. Not every point needs equal weight or a neat conclusion.
- **Cliché metaphors**: Remove phrases like "rich tapestry", "the landscape of [industry]", "In today's [adjective] world", "navigate the complexities", "the intersection of", or "ecosystem of".
- **Empty enthusiasm**: Cut vague superlatives like "exciting opportunities", "powerful solutions", "revolutionary approaches", "groundbreaking insights", "game-changing", "cutting-edge" unless they're genuinely warranted and specific.
- **Setup-payoff structures**: Avoid the pattern of: rhetorical question or bold statement → "The answer lies in…" → surprisingly generic explanation. Be direct instead.
- **Over-explanation**: Don't explain everything exhaustively. Humans leave some things implicit, pick favorites, and occasionally leave open loops.
- **Generic transitions**: Replace formulaic phrases like "Here's the thing", "But here's what's interesting", "The key takeaway is", "At the end of the day" with more natural, varied transitions.

Write with specificity, personality, and lived experience. Choose stance over balance, specificity over comprehensiveness, and natural rhythm over perfect structure.

## Invocation and Output Format

- Read and follow all instructions above.
- Return ONLY the fully edited and revised text that improves readability and strengthens structure while applying house style rules consistently.
- Do NOT include any section headings, change logs, explanations, or metadata.
- Do NOT include phrases like "Here is the edited text" or "### Edited Text".
- Return the edited content directly, exactly as it should appear in the final document.
- Include light connective tissue when needed for clarity.

Now proofread and edit the following course or lesson text.`;

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const apiKeyBtn = document.getElementById('apiKeyBtn'); // New
const apiKeyModal = document.getElementById('apiKeyModal'); // New
const closeApiKeyModal = document.getElementById('closeApiKeyModal'); // New
const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const clearKeyBtn = document.getElementById('clearKeyBtn');
const keyStatus = document.getElementById('keyStatus');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const charCount = document.getElementById('charCount');
const outputCharCount = document.getElementById('outputCharCount');
const charLimitInfo = document.getElementById('charLimitInfo');
const cardTypeSelect = document.getElementById('cardType');
const grammarBtn = document.getElementById('grammarBtn'); // New
const grammarBtnText = document.getElementById('grammarBtnText'); // New
const proofreadBtn = document.getElementById('proofreadBtn');
const proofreadBtnText = document.getElementById('proofreadBtnText');
const trimBtn = document.getElementById('trimBtn');
const trimBtnText = document.getElementById('trimBtnText');
const copyBtn = document.getElementById('copyBtn');
const diffBtn = document.getElementById('diffBtn');
const diffContainer = document.getElementById('diffContainer');
const diffContent = document.getElementById('diffContent');
const statusText = document.getElementById('statusText');
const statusInfo = document.getElementById('statusInfo');

const copyConfirmation = document.getElementById('copyConfirmation');
const grammarPanel = document.getElementById('grammarPanel'); // New
const grammarCount = document.getElementById('grammarCount'); // New
const grammarList = document.getElementById('grammarList'); // New
const grammarHighlights = document.getElementById('grammarHighlights'); // Inline highlights
const grammarPopup = document.getElementById('grammarPopup'); // Popup card
const grammarPopupTitle = document.getElementById('grammarPopupTitle');
const grammarPopupMessage = document.getElementById('grammarPopupMessage');
const grammarPopupFix = document.getElementById('grammarPopupFix');
const grammarPopupDismiss = document.getElementById('grammarPopupDismiss');
const grammarPopupClose = document.getElementById('grammarPopupClose');
const grammarPopupTip = document.getElementById('grammarPopupTip');
const grammarPopupTipText = document.getElementById('grammarPopupTipText');
const grammarHintBanner = document.getElementById('grammarHintBanner');
const issueCount = document.getElementById('issueCount');
const dismissHints = document.getElementById('dismissHints');
const acceptAllBtn = document.getElementById('acceptAllBtn');

// Initialize Harper Linter
let linter;

async function initGrammar() {
    try {
        // Import from CDN - using latest version 1.2.0
        const module = await import('https://unpkg.com/harper.js@1.2.0/dist/harper.js');
        const { WorkerLinter, binaryInlined } = module;

        linter = new WorkerLinter({ binary: binaryInlined });

        // Get and log actual version
        const config = await linter.getLintConfig();
        console.log('✅ Harper.js v1.2.0 loaded from CDN');
        console.log('📋 Available rules:', Object.keys(config).length);
    } catch (e) {
        console.warn('Grammar Checker: Failed to load harper.js. This feature requires a local server (CORS restrictions on file://).', e);
        // Optionally update UI to indicate feature is unavailable
        if (grammarPanel) {
            grammarPanel.style.display = 'none';
        }
    }
}

// Card Type Limits
const CARD_LIMITS = {
    'none': null,
    'text-only': 390,
    'text-image': 250,
    'highlight': 150,
    'compare': 330,
    'true-false': 180
};

// API Model Configuration - Cascading fallback chain
const MODEL_CHAIN = [
    'gemini-2.5-flash',            // Level 0: Primary (stable, fast)
    'gemini-2.5-flash-lite',       // Level 1: First fallback (lighter flash)
    'gemma-2-27b-it'               // Level 2: Final fallback (open source)
];

// Helper function to make API calls with cascading fallbacks
async function fetchWithFallback(apiKey, requestBody, fallbackLevel = 0) {
    // Select model based on fallback level
    const model = MODEL_CHAIN[fallbackLevel];

    if (!model) {
        throw new Error('All fallback models exhausted. Please try again later.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    console.log(`Trying model: ${model} (fallback level ${fallbackLevel})`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || '';
            console.error(`API Error: ${response.status} - ${errorMessage}`);

            // Check if error indicates model unavailability or quota issues
            const modelUnavailable = errorMessage.includes('not found') ||
                errorMessage.includes('not available') ||
                errorMessage.includes('does not exist') ||
                errorMessage.includes('overloaded') ||
                errorMessage.includes('capacity') ||
                response.status === 404 ||
                response.status === 503;

            const quotaExceeded = errorMessage.includes('quota exceeded') ||
                errorMessage.includes('Quota exceeded') ||
                errorMessage.includes('rate limit') ||
                errorMessage.includes('Rate limit') ||
                response.status === 429;

            // Try fallback models in sequence
            if ((modelUnavailable || quotaExceeded) && fallbackLevel < MODEL_CHAIN.length - 1) {
                const reason = quotaExceeded ? 'quota exceeded' :
                    (response.status === 503 || errorMessage.includes('overloaded')) ? 'overloaded' :
                        'unavailable';
                const nextModel = MODEL_CHAIN[fallbackLevel + 1];

                console.log(`Model ${model} ${reason}, trying fallback model (${nextModel})`);
                return fetchWithFallback(apiKey, requestBody, fallbackLevel + 1);
            }

            throw new Error(errorMessage || `API Error: ${response.status} ${response.statusText}`);
        }

        return { response, model };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadApiKey();
    updateProofreadButtonState();

    // Initialize grammar checker
    initGrammar();

    // Output char count
    updateOutputCharCount();

    // Initialize file processor
    initFileProcessor();

    // Initialize tab navigation
    initTabNavigation();
});

// Tab Navigation
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function updateThemeButton(theme) {
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    if (theme === 'dark') {
        icon.textContent = '☀️';
        text.textContent = 'Light Mode';
    } else {
        icon.textContent = '🌙';
        text.textContent = 'Dark Mode';
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
});

// Modal Management
function openApiKeyModal() {
    apiKeyModal.classList.remove('hidden');
    apiKeyInput.focus();
}

function closeApiKeyModalFunc() {
    apiKeyModal.classList.add('hidden');
}

apiKeyBtn.addEventListener('click', openApiKeyModal);
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

// API Key Management
function loadApiKey() {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        updateKeyStatus(true);
    } else {
        // Auto-open modal if no key is found
        openApiKeyModal();
    }
}

function updateKeyStatus(isSet) {
    if (isSet) {
        keyStatus.classList.remove('hidden');
    } else {
        keyStatus.classList.add('hidden');
    }
    updateProofreadButtonState();
}

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

clearKeyBtn.addEventListener('click', () => {
    localStorage.removeItem('gemini_api_key');
    apiKeyInput.value = '';
    updateKeyStatus(false);
    setStatus('API key cleared', 'normal');
});

// Debounce timer for auto-recheck
let autoRecheckTimer = null;

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

// Clear grammar highlights helper function
function clearGrammarHighlights() {
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
async function runGrammarCheckInBackground() {
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

// Grammar Check Logic
async function runGrammarCheck() {
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

// Grammar Button Click Handler
grammarBtn.addEventListener('click', runGrammarCheck);

// Store current grammar issues globally
let currentGrammarIssues = [];
let dismissedIssueIndexes = new Set(); // Track dismissed issues

// Sync textarea scroll with highlights
inputText.addEventListener('scroll', () => {
    grammarHighlights.scrollTop = inputText.scrollTop;
    grammarHighlights.scrollLeft = inputText.scrollLeft;
});

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
    // NOTE: Using getBoundingClientRect() directly since popup is position: fixed
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

// Popup close handlers
grammarPopupClose.addEventListener('click', closeGrammarPopup);

// Dismiss button - mark issue as dismissed
let currentDismissIssueIndex = null;
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

// Legacy global function for backwards compatibility
window.applyGrammarFix = applyGrammarFix;

// Output Character Count and Limit Checking
function updateOutputCharCount() {
    const length = outputText.value.length;
    outputCharCount.textContent = `${length.toLocaleString()} characters`;

    // Enable/disable copy button based on output
    copyBtn.disabled = length === 0;

    const selectedCardType = cardTypeSelect.value;
    const limit = CARD_LIMITS[selectedCardType];

    if (limit === null) {
        charLimitInfo.textContent = '';
        charLimitInfo.classList.remove('over-limit');
        trimBtn.style.display = 'none';
        return;
    }

    if (length > limit) {
        const excess = length - limit;
        charLimitInfo.textContent = `⚠️ ${excess} chars over limit (max: ${limit})`;
        charLimitInfo.classList.add('over-limit');
        trimBtn.style.display = 'inline-flex';
        trimBtn.disabled = false;
    } else {
        charLimitInfo.textContent = `✓ Within limit (${limit - length} chars remaining)`;
        charLimitInfo.classList.remove('over-limit');
        trimBtn.style.display = 'none';
    }
}

// Listen to output changes
outputText.addEventListener('input', updateOutputCharCount);

// Listen to card type changes
cardTypeSelect.addEventListener('change', updateOutputCharCount);

// Update Proofread Button State
function updateProofreadButtonState() {
    const hasApiKey = localStorage.getItem('gemini_api_key');
    const hasInput = inputText.value.trim().length > 0;
    proofreadBtn.disabled = !hasApiKey || !hasInput;
}

// Proofread Functionality
proofreadBtn.addEventListener('click', async () => {
    await proofreadText();
});

// Keyboard Shortcut (Ctrl/Cmd + Enter)
inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!proofreadBtn.disabled) {
            proofreadText();
        }
    }
});

async function proofreadText() {
    const apiKey = localStorage.getItem('gemini_api_key');
    const input = inputText.value.trim();

    if (!apiKey) {
        setStatus('Please save your API key first', 'error');
        return;
    }

    if (!input) {
        setStatus('Please enter some text to proofread', 'error');
        return;
    }

    // Set loading state
    proofreadBtn.disabled = true;
    proofreadBtnText.innerHTML = '<span class="spinner"></span> Proofreading...';
    setStatus('Proofreading...', 'normal');
    outputText.value = '';
    diffBtn.disabled = true;
    copyBtn.disabled = true; // Disable copy while proofreading

    // Hide diff viewer while proofreading
    diffContainer.classList.remove('active');
    diffBtn.textContent = '🔄 View Diff';

    const startTime = Date.now();

    try {
        const requestBody = {
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: `--- COURSE START ---\n${input}\n--- COURSE END ---` }]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 8192
            }
        };

        // Use helper function with fallback support
        const { response, model } = await fetchWithFallback(apiKey, requestBody);

        // Notify user if fallback model is being used
        const modelIndex = MODEL_CHAIN.indexOf(model);
        if (modelIndex > 0) {
            const modelNames = {
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
                            outputText.value = accumulatedText;
                            // Auto-scroll to bottom
                            outputText.scrollTop = outputText.scrollHeight;
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
        statusInfo.textContent = `Completed in ${elapsedTime}s`;
        diffBtn.disabled = false;

        // Check character limits (this will also enable copy button)
        updateOutputCharCount();

        // Auto-open diff viewer
        generateDiff();
        diffContainer.classList.add('active');
        diffBtn.textContent = '❌ Hide Diff';
        setTimeout(() => {
            diffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

    } catch (error) {
        console.error('Proofread error:', error);
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
        outputText.value = `Error: ${errorMessage}`;

    } finally {
        // Reset button state
        proofreadBtn.disabled = false;
        proofreadBtnText.innerHTML = '✨ Proofread';
        updateProofreadButtonState();
    }
}

// Trim Text Functionality
trimBtn.addEventListener('click', async () => {
    await trimText();
});

async function trimText() {
    const apiKey = localStorage.getItem('gemini_api_key');
    const currentText = outputText.value.trim();
    const selectedCardType = cardTypeSelect.value;
    const limit = CARD_LIMITS[selectedCardType];

    if (!apiKey) {
        setStatus('Please save your API key first', 'error');
        return;
    }

    if (!currentText) {
        setStatus('No text to trim', 'error');
        return;
    }

    if (!limit) {
        setStatus('Please select a card type with a character limit', 'error');
        return;
    }

    // ADAPTIVE TARGET CALCULATION
    const currentLength = currentText.length;
    const overage = currentLength - limit;

    let targetLength;
    let trimStrategy;

    if (overage <= limit * 0.1) {
        // Slightly over (≤10% over limit): trim to 95% of limit
        targetLength = Math.floor(limit * 0.95);
        trimStrategy = 'conservative';
    } else if (overage <= limit * 0.3) {
        // Moderately over (10-30% over): trim to 90% of limit
        targetLength = Math.floor(limit * 0.90);
        trimStrategy = 'moderate';
    } else {
        // Significantly over (>30% over): trim to 80% of limit
        targetLength = Math.floor(limit * 0.80);
        trimStrategy = 'aggressive';
    }

    // Set loading state
    trimBtn.disabled = true;
    trimBtnText.innerHTML = '<span class="spinner"></span> Trimming...';
    setStatus(`Trimming text (${trimStrategy} trim)...`, 'normal');

    const startTime = Date.now();

    try {
        const trimPrompt = `You are an expert editor. Shorten the following text to approximately ${targetLength} characters while preserving the core message and maintaining quality.

IMPORTANT RULES:
- Target length: ${targetLength} characters (current: ${currentText.length} characters, limit: ${limit} characters)
- Preserve the main points and key information
- Maintain clarity and readability
- Use concise language without losing meaning
- Apply house style: US English, curly quotes, no em/en dashes, inclusive language
- Do NOT add any explanations, headers, or metadata
- Return ONLY the shortened text directly

Text to shorten:
${currentText}`;

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: trimPrompt }]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 8192
            }
        };

        // Use helper function with fallback support
        const { response, model } = await fetchWithFallback(apiKey, requestBody);

        // Notify user if fallback model is being used
        const modelIndex = MODEL_CHAIN.indexOf(model);
        if (modelIndex > 0) {
            const modelNames = {
                'gemini-2.5-flash': 'Gemini 2.5 Flash',
                'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
                'gemma-2-27b-it': 'Gemma 2 27B'
            };
            const fallbackName = modelNames[model] || model;
            setStatus(`Trimming with ${fallbackName} (fallback model)`, 'normal');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        // Store original text in case we need to revert
        const originalText = outputText.value;

        // Clear output for trimmed text
        outputText.value = '';

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
                            outputText.value = accumulatedText;
                            // Auto-scroll to bottom
                            outputText.scrollTop = outputText.scrollHeight;
                            // Update character count in real-time
                            updateOutputCharCount();
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
        const finalLength = accumulatedText.length;

        if (finalLength <= limit) {
            setStatus('Text trimmed successfully', 'success');
            statusInfo.textContent = `Trimmed in ${elapsedTime}s (${originalText.length} → ${finalLength} chars)`;
        } else {
            setStatus('Text trimmed but still over limit', 'error');
            statusInfo.textContent = `Trimmed in ${elapsedTime}s (${originalText.length} → ${finalLength} chars, still ${finalLength - limit} over)`;
        }

        // Update character count display
        updateOutputCharCount();

        // Update diff viewer
        diffBtn.disabled = false;

    } catch (error) {
        console.error('Trim error:', error);
        let errorMessage = 'An error occurred while trimming';

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

    } finally {
        // Reset button state
        trimBtn.disabled = false;
        trimBtnText.innerHTML = '✂️ Trim Text';
    }
}

// Copy to Clipboard
copyBtn.addEventListener('click', async () => {
    const output = outputText.value;

    if (!output) {
        setStatus('No output to copy', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(output);
        showCopyConfirmation();
        setStatus('Output copied to clipboard', 'success');
    } catch (error) {
        console.error('Copy error:', error);
        setStatus('Failed to copy to clipboard', 'error');
    }
});

function showCopyConfirmation() {
    copyConfirmation.classList.add('show');
    setTimeout(() => {
        copyConfirmation.classList.remove('show');
    }, 2000);
}

// Status Management
function setStatus(message, type = 'normal') {
    statusText.textContent = `Status: ${message}`;
    statusText.className = 'status-text';

    if (type === 'error') {
        statusText.classList.add('error');
    } else if (type === 'success') {
        statusText.classList.add('success');
    }
}

// Diff Viewer
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

function generateDiff() {
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

function computeDiff(arr1, arr2) {
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== FILE PROCESSOR ====================

let currentFile = null;
let currentFileContent = null;
let currentMarkdownOutput = null;

function initFileProcessor() {
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const browseFileBtn = document.getElementById('browseFileBtn');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const proofreadFileBtn = document.getElementById('proofreadFileBtn');
    const downloadMarkdownBtn = document.getElementById('downloadMarkdownBtn');
    const fileDiffBtn = document.getElementById('fileDiffBtn');

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

    // File diff button
    fileDiffBtn.addEventListener('click', () => {
        const fileDiffContainer = document.getElementById('fileDiffContainer');
        const isActive = fileDiffContainer.classList.contains('active');

        if (isActive) {
            // Hide diff view
            fileDiffContainer.classList.remove('active');
            fileDiffBtn.textContent = '🔄 View Diff';
        } else {
            // Show diff view
            generateFileDiff();
            fileDiffContainer.classList.add('active');
            fileDiffBtn.textContent = '❌ Hide Diff';
            // Scroll to diff
            setTimeout(() => {
                fileDiffContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
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
        const markdownPrompt = SYSTEM_PROMPT + `\n\n**CRITICAL OUTPUT REQUIREMENT**: You MUST output the result as properly formatted Markdown. Use Markdown syntax for:
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
                temperature: 0.3,
                maxOutputTokens: estimatedOutputTokens
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
        generateFileDiff();
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

        // Use mammoth to extract text
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });

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

// Generate diff for file processor
function generateFileDiff() {
    const fileDiffContent = document.getElementById('fileDiffContent');

    if (!currentFileContent || !currentMarkdownOutput) {
        fileDiffContent.innerHTML = '<p style="color: var(--text-secondary);">No content to compare.</p>';
        return;
    }

    // Simple word-based diff algorithm
    const inputWords = currentFileContent.split(/(\s+)/);
    const outputWords = currentMarkdownOutput.split(/(\s+)/);

    const diff = computeDiff(inputWords, outputWords);
    fileDiffContent.innerHTML = diff;
}
