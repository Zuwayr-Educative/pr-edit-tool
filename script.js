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
    'gemini-3-pro-preview',        // Level 0: Primary (newest, most capable)
    'gemini-3-flash-preview',      // Level 1: First fallback (newer flash)
    'gemini-2.5-flash',            // Level 2: Second fallback (stable flash)
    'gemini-2.5-flash-lite',       // Level 3: Third fallback (lighter flash)
    'gemma-2-27b-it'               // Level 4: Final fallback (open source)
];

// Helper function to make API calls with cascading fallbacks
async function fetchWithFallback(apiKey, requestBody, fallbackLevel = 0) {
    // Select model based on fallback level
    const model = MODEL_CHAIN[fallbackLevel];

    if (!model) {
        throw new Error('All fallback models exhausted. Please try again later.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || '';

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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadApiKey();
    updateProofreadButtonState();
    updateOutputCharCount();
});

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

// Character Count
inputText.addEventListener('input', () => {
    const length = inputText.value.length;
    charCount.textContent = `${length.toLocaleString()} characters`;
    updateProofreadButtonState();
});

// Output Character Count and Limit Checking
function updateOutputCharCount() {
    const length = outputText.value.length;
    outputCharCount.textContent = `${length.toLocaleString()} characters`;

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
                'gemini-3-flash-preview': 'Gemini 3 Flash Preview',
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

        // Check character limits
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
                'gemini-3-flash-preview': 'Gemini 3 Flash Preview',
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
