# Coding Super Hub 🚀

An all-in-one developer workspace featuring **1,000 cataloged developer utilities (including production-ready utilities, references, demos, and AI-assisted helpers; 150 specialized UI tools plus 850 dynamically registered runners)**, a **multi-language virtual execution workspace**, an **AI coding copilot powered by Gemini**, and source export utilities with architecture and source-code documentation.

---

## ✨ Features

- **🛠️ 1,000 Cataloged Developer Utilities:**
  - **Text & Formatting:** JSON Formatter/Validator, Base64 Encoder/Decoder, URL Encoder/Decoder, Markdown Previewer, Regex Tester, Slug Generator, Text Diff Checker, Case Converters, and more.
  - **Security & Cryptography:** SHA-256 / SHA-512 / MD5-related tools, UUID v4 Generator, HMAC tools, AES-related utilities, RSA/JWK templates, JWT Token Decoder, and security references. Some security-heavy tools are explicitly labeled as demos/templates where a full standards-compliant implementation or live inspection is not available in the browser.
  - **Math & Calculators:** Unit Converters, Binary/Hex/Octal Number Base Converter, Timestamp/Epoch Converter, Percentage Calculator, Aspect Ratio Calculator.
  - **Web & CSS Utilities:** Color Picker & Palette Generator, CSS Flexbox & Grid Generator, Box Shadow Generator, Gradient Generator, Meta Tag Generator, Minifiers (HTML, CSS, JS).
  - **Data & APIs:** CSV to JSON & JSON to CSV Converters, SQL Query Formatter, Fake Data Generator, HTTP Status Codes Reference, Cron Expression Generator.
  - **Comprehensive Developer Suite (Tools 151–1000):** 850 dynamically registered utilities. These use deterministic/shared domain handlers where appropriate; the catalog is not represented as 850 separate React component files.
- **⚡ Live Code Editor & Multi-Language Runner:**
  - In-browser interactive sandbox for HTML, CSS, and JavaScript with console output.
  - Server/API-backed **virtual AI-assisted execution** for the languages in the catalog. This is not a native compiler farm; execution results are AI-assisted and should be validated before production use.
  - File drag-and-drop & local file import support.
  - Bidirectional wiring with the AI Assistant ("Apply Code to Editor").
- **🤖 Coding Super AI (Copilot):**
  - Context-aware coding assistant powered by `@google/genai`, with configured model fallback behavior.
  - Markdown rendering with syntax highlighting, one-click code copy, and direct editor insertion.
- **📄 Codebase PDF Export:**
  - Built-in PDFKit generator creating a vector PDF with line numbers, code gutter, and architecture overview.
  - Downloadable via top navigation bar (`Code PDF`) or `/api/download/codebase-pdf`.
- **🎨 Modern UI & UX:**
  - Clean light and dark mode toggles.
  - Real-time search and category filtering with instant empty-state suggestions.
  - Keyboard shortcuts modal (`?`).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, React Markdown.
- **Build Tool:** Vite 6.
- **Backend:** Node.js, Express 4.
- **AI Engine:** Google GenAI SDK (`@google/genai`).
- **PDF Generation:** PDFKit.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd New-project-
```

### 2. Install dependencies
Use the committed lockfile for reproducible installs:
```bash
npm ci
```

**Compatibility:** Node.js 22.x–24.x and npm 10+ are supported. The project intentionally uses React 19, Vite 6, and Tailwind CSS 4 because the current application and test suite are built around that stack; the committed lockfile provides exact resolved dependency versions.

### 3. Configure environment variables
Copy the example environment file and set your Gemini API key:
```bash
cp .env.example .env
```
Edit `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Run development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Production build
```bash
npm run build
npm start
```

`npm run build` automatically runs `npm run generate:pdf` before the Vite and server bundles are produced.

### 6. Generate Codebase PDF
```bash
npm run generate:pdf
```

Run this standalone only when you want to regenerate the source-code PDF without performing the full production build.

---

## 🌐 Deployment Guide (GitHub Pages, Vercel, Render)

### Option A: GitHub Pages (Automatic with GitHub Actions)
The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Push this code to your GitHub repository.
2. On GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **`GitHub Actions`** (instead of "Deploy from a branch").
4. Go to the **Actions** tab. You will see the **Deploy to GitHub Pages** workflow run automatically.
5. Once complete, your site will be live at `https://<your-username>.github.io/<repo-name>/`.
> *Note: The core tool UI and the HTML/CSS/JS sandbox can work without a backend. Network-dependent features such as AI, the virtual multi-language runner, and external-data tools require the configured backend/network connection. A Gemini API key may be entered in the AI panel for supported hosting modes.*

---

### Option B: Free Full-Stack Hosting on Render
To run both the **Frontend and the Node.js / Gemini AI backend**:
1. Create a free account at [render.com](https://render.com).
2. Click **New +** > **Web Service** and connect your GitHub repository.
3. Render will automatically detect the included `render.yaml`:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variable `GEMINI_API_KEY` in Render settings.
5. Click **Deploy Web Service**.

---

### Option C: 1-Click Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New...** > **Project**.
2. Select your GitHub repository.
3. Vercel can detect the Vite application from the repository configuration; no `vercel.json` file is required for the current setup.
4. Click **Deploy**.

---

## ❓ Troubleshooting: "Website Chalu Nahi Ho Raha"

| Problem | Cause | Solution |
|---|---|---|
| **Directly opening `index.html` shows a blank white page** | Modern React/Vite applications require a bundler server; `file:///` URLs cannot execute raw `.tsx` or modules. | Open terminal in the project folder and run `npm install` then `npm run dev`. Then open `http://localhost:3000`. |
| **GitHub Pages shows 404 or Blank Page** | GitHub Pages source was set to "Deploy from a branch" instead of "GitHub Actions", or base path was missing. | Go to **Repo Settings > Pages > Source** and choose **GitHub Actions**. The current Vite configuration uses `base: './'`. |
| **`npm start` fails locally right after cloning** | `dist/server.cjs` hasn't been built yet. | For development, always use **`npm run dev`**. For production start, run **`npm run build`** first, then **`npm start`**. |
| **Port 3000 is already in use** | Another local process is using port 3000. | Change the port in the local server configuration or stop the process currently using port 3000. |

---

## 📁 Project Structure

```
├── public/                 # Static assets and generated PDF documentation
├── scripts/                # Audit, smoke-test, PDF generator and build helpers
├── src/
│   ├── components/         # UI components
│   │   ├── tools/          # Specialized tools + DynamicToolsRenderer
│   │   ├── AIAssistant.tsx # Copilot chat with Markdown & Editor sync
│   │   ├── CodeEditor.tsx  # Code editor and multi-language runner
│   │   ├── LanguageHub.tsx # Language catalog and starter library
│   │   ├── Navbar.tsx      # Search, category filter & navigation
│   │   └── ToolCard.tsx    # Reusable tool container
│   ├── data/               # Languages catalogue & 1,000-tool registry/metadata
│   ├── utils/              # Conversion, crypto, and string helpers
│   ├── App.tsx             # Main application orchestrator
│   ├── main.tsx            # React entry point
│   ├── types.ts            # Global TypeScript definitions
│   └── index.css           # Tailwind v4 styles
├── server.ts               # Express server with Vite middleware & Gemini endpoints
├── package.json            # Project manifest and supported Node/npm engines
├── vite.config.ts          # Vite configuration
├── vercel.json             # Production security headers
└── .github/workflows/      # CI / regression checks
```

---

## 📄 License
MIT License. Free to use and customize!


## Security configuration

Production AI and virtual code-run endpoints use distributed rate limiting backed by Upstash Redis. Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as server-only environment variables.

Custom Gemini API keys are validated for type, length, and control characters and are held in memory only for the browser session; they are not persisted to browser storage. The production Content Security Policy removes `unsafe-inline` from both `script-src` and `style-src`.

## Testing and release gate

`npm run test` runs the TypeScript-aware Node test suite and `npm run test:coverage` runs Node's built-in coverage instrumentation. Existing 1,000-tool integrity, semantic, runtime, performance, and Playwright desktop/mobile checks remain part of the CI workflow.

A release is not considered ready when a required test or security verification is missing, blocked, or failing.
