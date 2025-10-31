# 🧰 CodeMuse - AI Code Assistant

**Your offline AI mentor** — Get instant code explanations, refactoring suggestions, and code reviews without sending a single line to the cloud.

## 🎯 The Problem

Developers rely on tools like GitHub Copilot and ChatGPT for code assistance, but these services:
- **Send proprietary code to remote servers** - Major privacy and compliance risk
- **Expose client IP and trade secrets** - Unacceptable for many companies
- **Require internet connection** - Not available offline
- **Cost money** - Subscription fees add up
- **Data concerns** - Who owns your code? Where is it stored?

## 💡 The Solution

**CodeMuse** is a Chrome Extension that runs **100% offline** using Gemini Nano's on-device AI. It analyzes code directly in your browser without sending anything to external servers.

### Key Features:

🧠 **Explain Mode** - Get line-by-line code explanations
- Understand what each part does
- Learn key concepts and patterns
- Perfect for code reviews and onboarding

✨ **Refactor Mode** - Improve code quality
- Better variable names and structure
- Performance optimizations
- Follow best practices automatically

🔍 **Review Mode** - Find bugs before they ship
- Identify potential issues and edge cases
- Security vulnerability detection
- Get constructive improvement suggestions

📝 **Add Comments Mode** - Auto-generate documentation
- Function and parameter descriptions
- Inline explanations for complex logic
- Proper documentation format for your language

💬 **Ask AI Mode** - Get instant programming help (NEW!)
- Ask any programming question
- Get code examples and explanations
- Learn best practices and tips
- No code required - just ask!

## 🔒 Privacy-First Design

✅ **100% Offline** - All processing happens on your device
✅ **Zero Data Collection** - No code is ever sent anywhere
✅ **Open Source** - Inspect the code yourself
✅ **GDPR/HIPAA Compliant** - Perfect for regulated industries
✅ **Works on Proprietary Code** - Safe for NDAs and trade secrets

## ✨ Chrome Built-in AI APIs Used

### Primary API: **Prompt API (LanguageModel)**

CodeMuse demonstrates advanced use of the Prompt API across multiple developer workflows:

1. **Code Explanation** - Structured prompts for educational breakdowns
2. **Code Refactoring** - Context-aware code improvement
3. **Code Review** - Bug detection and security analysis
4. **Documentation Generation** - Comment and docstring creation

**Advanced Techniques:**
- Multi-step prompt engineering for different programming languages
- Context preservation across interactions
- Output formatting for code vs. prose
- Error handling and graceful degradation

### Future APIs (When Available):
- **Rewriter API** - For code refactoring
- **Proofreader API** - For comment quality checks
- **Writer API** - For commit message generation

## 🚀 Installation

### Prerequisites
- Chrome 128+ (Dev, Beta, or Canary)
- Chrome Built-in AI flags enabled

### Enable Chrome AI

1. Go to `chrome://flags`
2. Enable these flags:
   - **Prompt API for Gemini Nano** → Enabled
   - **Optimization Guide On Device Model** → Enabled
3. Restart Chrome
4. Go to `chrome://components`
5. Find "Optimization Guide On Device Model"
6. Click "Check for update" and wait for download

### Install Extension

```bash
# Clone repository
git clone https://github.com/PNejr10/Code-Muse
cd codemuse

# Load in Chrome
1. Open chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the codemuse folder
```

## 📖 How to Use


### Method 1: From Any Webpage
1. Select code on GitHub, Stack Overflow, documentation, etc.
2. Right-click → CodeMuse → Choose action
3. Get instant results!

### Method 2: Paste Code
1. Click CodeMuse extension icon
2. Paste your code into the textarea
3. Select language (or use auto-detect)
4. Choose action
5. View results and copy/insert back


## 🎯 Perfect For

### Individual Developers
- Learning new codebases quickly
- Understanding legacy code
- Improving code quality
- Writing better documentation

### Companies
- Secure code analysis without cloud exposure
- Training junior developers
- Code review assistance
- Maintaining coding standards

### Students
- Learning programming concepts
- Understanding homework/examples
- Improving coding skills
- Free alternative to paid tools

## 🌟 Works On

- **GitHub** - Code review, pull requests
- **VS Code for Web** (vscode.dev)
- **Replit** - Online IDE
- **CodePen** - Frontend code
- **Stack Overflow** - Code examples
- **Documentation sites**
- **Any webpage with code!**


## 📊 Technical Architecture

```
codemuse/
├── manifest.json       # Extension configuration
├── popup.html         # Main UI (developer-themed dark mode)
├── popup.js           # Core logic (600+ lines)
│                      # - AI session management
│                      # - 4 code analysis modes
│                      # - Language detection
│                      # - Result formatting
├── background.js      # Service worker
│                      # - Context menus
│                      # - Keyboard shortcuts
│                      # - Usage tracking
├── content.js         # Content script
│                      # - Code detection
│                      # - Visual hints
│                      # - Selection handling
├── content.css        # Hint styling
└── README.md          # Documentation
```

## 🔬 Advanced Features

### Smart Language Detection
- Auto-detects JavaScript, Python, Java, C++, Go, Rust
- Adapts explanations to language-specific concepts
- Uses proper syntax in refactored code

### Context-Aware Analysis
- Understands code patterns and idioms
- Recognizes frameworks and libraries
- Provides language-specific best practices

### Multi-Mode Processing
- Each mode uses specialized prompts
- Different output formats (code vs. text)
- Optimized for specific use cases

## Why CodeMuse

### Problem-Solution Fit
- **Real Problem**: 67% of developers concerned about code privacy (Stack Overflow Survey)
- **Massive Market**: 27M+ developers worldwide
- **Clear Value**: Privacy + Free + Offline

### Technical Excellence
- Advanced prompt engineering for code analysis
- Multiple specialized AI workflows
- Clean, maintainable architecture
- Proper error handling throughout

### User Experience
- GitHub-inspired dark UI developers love
- Multiple interaction methods (popup, context menu, keyboard)
- Instant results (2-5 seconds typical)
- One-click copy/insert functionality

### Innovation
- First fully offline code AI assistant
- Zero-trust privacy model
- Novel approach to developer tooling
- Demonstrates Chrome AI capabilities

## 📝 APIs Used in Detail

### Prompt API Deep Dive

**Code Explanation Prompts:**
```javascript
// Structured prompt with role, task, and format
"You are a code mentor...
Analyze this code and provide:
1. Overview
2. Line-by-line explanation
3. Key concepts
4. Potential issues"
```

**Refactoring Prompts:**
```javascript
// Output-constrained prompt for code generation
"Refactor this code to improve:
1. Readability
2. Performance
3. Best practices
Provide ONLY the refactored code..."
```

**Review Prompts:**
```javascript
// Multi-category analysis prompt
"Review this code:
🐛 Bugs/Issues
⚠️ Potential Problems
✅ Good Practices
💡 Suggestions"
```

## 🔮 Future Enhancements

Potential additions:
- Diff-based commit message generation
- Multi-file context analysis
- Integration with GitHub API
- Custom prompt templates
- Team-shared knowledge base
- IDE plugin versions

## 🧪 Testing Instructions


1. **Quick Test** 
   - Go to any GitHub repository
   - Select a function
   - Right-click → CodeMuse → Explain
   - See instant, detailed explanation

2. **Refactoring Test** 
   - Copy messy code snippet
   - Open CodeMuse
   - Click "Refactor"
   - Compare original vs improved

3. **Review Test** 
   - Paste code with intentional bugs
   - Click "Review"
   - Verify bugs are identified
4. **AskAI Test** 
   - Switch to AskAI tab
   - Ask a technical question
   - Verify the output is correct

## 💻 Development

```bash
# No build process - vanilla JS
# Make changes and reload extension

# Testing
1. Modify files
2. Go to chrome://extensions
3. Click reload on CodeMuse
4. Test changes
```

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Built for Chrome Built-in AI Challenge
- Uses Google's Gemini Nano model
- Inspired by developer privacy needs

## 📧 Contact

[Paiman Nejrabi] - [paiman.nejrabi2000@gmail.com]
Project: [https://github.com/PNejr10/Code-Muse](https://github.com/PNejr10/Code-Muse)

---

**Built with ❤️ for developers who care about privacy**
**Powered by Chrome Built-in AI • 100% Offline • Zero Cloud**