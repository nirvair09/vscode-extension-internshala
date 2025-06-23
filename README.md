# AI Chat Assistant VS Code Extension

This is a Visual Studio Code extension that provides an AI-powered chat assistant inside a sidebar panel. The assistant supports contextual code awareness, file attachment via `@filename` syntax, and uses the Gemini API to generate intelligent code suggestions and explanations.

---

## ✨ Features

- 🌐 **React-based Chat UI** inside a WebView panel
- 📂 Mention workspace files via `@filename` to send context
- 🧠 AI-powered responses using **Google Gemini 2.0 Flash**
- 🌟 Syntax-highlighted markdown + chat history

---

## ⚡ How It Works

1. Launch the extension and open the chat panel.
2. Type a message. Optionally reference a file using `@filename`.
3. The extension collects that file's content and the prompt.
4. Sends it to Gemini and shows the response in the panel.

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/ai-chat-assistant-internshala.git
cd ai-chat-assistant-internshala
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Extension
```bash
npm run compile
```

This will generate:
- `dist/extension.js` for backend logic
- `media/bundle.js` for React frontend

### 4. Launch Extension in VS Code
- Open the project folder in VS Code
- Press `F5` or go to **Run & Debug > Launch Extension**

### 5. Use the Assistant
- Open the **Command Palette (Ctrl+Shift+P)**
- Run `AI Chat Assistant: Start`
- Ask something like:
  - "Summarize this code @app.ts"
  - "Write a sorting function"

---

## 🤒 Project Structure
```
.
├── media/               # React app (UI in WebView)
│   ├── index.tsx
│   ├── App.tsx
│   └── bundle.js (built)
├── src/                 # Extension backend
│   ├── extension.ts
│   ├── gemini.ts
│   └── getWebViewContent.ts
├── dist/                # Compiled extension bundle
│   └── extension.js
├── tsconfig.json
├── webpack.config.js
├── package.json
└── README.md
```

---

## 🚧 TODO
- Add streaming response support
- Add image preview from `@filename`
- Add command history / autocomplete

---

## 📄 License
MIT License

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
