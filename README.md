# Editorial Assistant

A powerful, client-side AI tool designed to help course authors and editors proofread, format, and shorten educational content using Google's Gemini models.

### Web App (No Installation)
Visit [https://zuwayr-educative.github.io/pr-edit-tool/](https://zuwayr-educative.github.io/pr-edit-tool/)

## Features

- **🛡️ Privacy-First**: Your Gemini API key is stored locally in your browser (`localStorage`) and sent directly to Google. No intermediate backend server.
- **✨ AI Proofreading**: Automatically formats text according to a strict "Editorial House Style" (US English, Oxford commas, inclusive language, anti-marketing fluff).
- **📏 Smart Trimming**: Need to fit text into a specific UI card? The "Trim" feature intelligently rewrites content to fit character limits while preserving meaning.
- **🔄 Visual Diff**: Built-in diff viewer shows exactly what changed (additions in green, deletions in red).
- **📝 Card Templates**: Preset character limits for common UI components:
  - Text-only (390 chars)
  - Text+Image (250 chars)
  - Highlight Card (150 chars)
  - Compare Cards (330 chars)
  - True/False (180 chars)
- **📄 File Processing**: Upload TXT, MD, DOC, or DOCX files and get proofread markdown output.
- **🌓 Dark Mode**: Fully responsive UI with toggleable dark/light themes.
- **💪 Robust API Handling**: Automatically falls back to lighter models (`Gemini Flash Lite` → `Gemma 2`) if the primary model hits rate limits.

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Open the tool**:
   Simply open `index.html` in your web browser. No `npm install` or build process required!

## Usage

1. **Set API Key**: Click the "Key" button in the top right and paste your [Google Gemini API Key](https://aistudio.google.com/app/apikey).
2. **Input Text**: Paste your draft lesson or course content into the left panel.
3. **Proofread**: Click "Proofread" to apply the house style.
4. **Trim (Optional)**: Select a "Card Type" dropdown to check against character limits. If over the limit, click "Trim Text" to shorten it.
5. **Review**: Use the "Diff" toggle to verify changes before copying the final output.

## Tech Stack

- **HTML5 & CSS3**: Custom responsive design with CSS variables for theming.
- **Vanilla JavaScript**: Zero dependencies. Uses ES6+ features (Async/Await, SSE).
- **Google Gemini API**: Direct integration via `fetch` for AI processing.
- **Harper.js v1.2.0 (CDN)**: Grammar checking with 500+ rules for spelling, grammar, and style.

## License

MIT
