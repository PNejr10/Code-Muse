// CodeMuse - AI Code Assistant
// Uses Chrome Built-in AI for offline code analysis

const codeInput = document.getElementById('codeInput');
const explainBtn = document.getElementById('explainBtn');
const refactorBtn = document.getElementById('refactorBtn');
const reviewBtn = document.getElementById('reviewBtn');
const commentsBtn = document.getElementById('commentsBtn');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const outputSection = document.getElementById('outputSection');
const output = document.getElementById('output');
const outputTitle = document.getElementById('outputTitle');
const copyBtn = document.getElementById('copyBtn');
const insertBtn = document.getElementById('insertBtn');
const langButtons = document.querySelectorAll('.lang-btn');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFileBtn');

let aiSession = null;
let selectedLanguage = 'auto';
let lastAction = null;
let currentFile = null;

// Language selection
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    langButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedLanguage = btn.dataset.lang;
  });
});

// Mode tabs
codeTab.addEventListener('click', () => {
  codeTab.classList.add('active');
  chatTab.classList.remove('active');
  codeModeSection.style.display = 'block';
  chatModeSection.style.display = 'none';
  currentMode = 'code';
  
  // Show code-specific sections
  const languageSection = document.querySelector('.language-selector')?.parentElement;
  const actionGrid = document.querySelector('.action-grid');
  
  if (languageSection) languageSection.style.display = 'flex';
  if (actionGrid) actionGrid.style.display = 'grid';
});

chatTab.addEventListener('click', () => {
  chatTab.classList.add('active');
  codeTab.classList.remove('active');
  codeModeSection.style.display = 'none';
  chatModeSection.style.display = 'block';
  currentMode = 'chat';
  
  // Hide code-specific sections
  const languageSection = document.querySelector('.language-selector')?.parentElement;
  const actionGrid = document.querySelector('.action-grid');
  
  if (languageSection) languageSection.style.display = 'none';
  if (actionGrid) actionGrid.style.display = 'none';
});

// Action buttons
explainBtn.addEventListener('click', () => processCode('explain'));
refactorBtn.addEventListener('click', () => processCode('refactor'));
reviewBtn.addEventListener('click', () => processCode('review'));
commentsBtn.addEventListener('click', () => processCode('comments'));

// Ask button - with null check
if (askBtn) {
  askBtn.addEventListener('click', () => answerQuestion());
} else {
  console.error('Ask button not found!');
}

// Function to handle chat questions
async function answerQuestion() {
  const question = document.getElementById('chatInput').value.trim();
  
  if (!question) {
    showError('⚠️ Please enter your question first!');
    return;
  }

  setLoading(true, 'chat');
  output.innerHTML = '';
  outputSection.classList.remove('active');

  try {
    // Check AI availability
    if (typeof LanguageModel === 'undefined') {
      showError('❌ Chrome Built-in AI is not available.\n\nPlease:\n1. Use Chrome 128+\n2. Enable AI flags at chrome://flags\n3. Restart Chrome');
      return;
    }

    const availability = await LanguageModel.availability();
    
    if (availability === 'no') {
      showError('❌ Gemini Nano is not available on this device.');
      return;
    }

    // Create AI session if not exists
    if (!aiSession) {
      aiSession = await LanguageModel.create();
    }

    const prompt = `You are a helpful programming mentor. Answer the following programming question clearly and concisely.

Question: ${question}

Provide a focused answer with:
1. Direct response to the question
2. Short code examples if relevant
3. Best practices or common pitfalls if applicable`;

    const result = await aiSession.prompt(prompt);
    outputTitle.textContent = '💬 AI Response';
    displayResult(result);
    
    // Track usage
    chrome.runtime.sendMessage({
      action: 'trackUsage',
      type: 'chat'
    });

  } catch (error) {
    console.error('Chat error:', error);
    showError(`❌ Error: ${error.message}\n\nMake sure Chrome Built-in AI is properly configured.`);
  } finally {
    setLoading(false);
  }
}

// Copy button
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(output.textContent).then(() => {
    copyBtn.textContent = '✓ Copied!';
    copyBtn.classList.add('success');
    setTimeout(() => {
      copyBtn.textContent = '📋 Copy';
      copyBtn.classList.remove('success');
    }, 2000);
  });
});

// Insert button - sends code back to page
insertBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (code) => {
        // Try to insert into active element if it's a textarea or input
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
          activeElement.value = code;
          activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // Copy to clipboard as fallback
          navigator.clipboard.writeText(code);
          alert('Code copied to clipboard!');
        }
      },
      args: [output.textContent]
    });
    
    insertBtn.textContent = '✓ Inserted!';
    insertBtn.classList.add('success');
    setTimeout(() => {
      insertBtn.textContent = '⬅️ Insert';
      insertBtn.classList.remove('success');
    }, 2000);
  } catch (error) {
    console.error('Insert error:', error);
    // Fallback to copy
    navigator.clipboard.writeText(output.textContent);
    alert('Copied to clipboard instead!');
  }
});

// Main processing function
async function processCode(action) {
  const code = codeInput.value.trim();
  
  if (!code) {
    showError('⚠️ Please paste some code first!');
    return;
  }

  lastAction = action;
  setLoading(true, action);
  output.innerHTML = '';
  outputSection.classList.remove('active');

  try {
    // Check AI availability
    if (typeof LanguageModel === 'undefined') {
      showError('❌ Chrome Built-in AI is not available.\n\nPlease:\n1. Use Chrome 128+\n2. Enable AI flags at chrome://flags\n3. Restart Chrome');
      return;
    }

    const availability = await LanguageModel.availability();
    
    if (availability === 'no') {
      showError('❌ Gemini Nano is not available on this device.');
      return;
    }

    // Create AI session
    if (!aiSession) {
      aiSession = await LanguageModel.create();
    }

    let result;
    
    switch (action) {
      case 'explain':
        result = await explainCode(code);
        outputTitle.textContent = '🧠 Code Explanation';
        break;
      case 'refactor':
        result = await refactorCode(code);
        result = cleanCodeOutput(result); // Clean markdown
        outputTitle.textContent = '✨ Refactored Code';
        break;
      case 'review':
        result = await reviewCode(code);
        outputTitle.textContent = '🔍 Code Review';
        break;
      case 'comments':
        result = await addComments(code);
        result = cleanCodeOutput(result); // Clean markdown
        outputTitle.textContent = '📝 Commented Code';
        break;
    }

    displayResult(result);
    
    // Track usage
    chrome.runtime.sendMessage({
      action: 'trackUsage',
      type: action
    });
    
  } catch (error) {
    console.error('Error:', error);
    showError(`❌ Error: ${error.message}\n\nMake sure Chrome Built-in AI is properly configured.`);
  } finally {
    setLoading(false);
  }
}

// Explain Code - Line by line breakdown
async function explainCode(code) {
  const langHint = selectedLanguage !== 'auto' ? ` (${selectedLanguage})` : '';
  
  const prompt = `You are a code mentor helping a developer understand code${langHint}.

Analyze this code and provide:
1. **Overview**: What does this code do?
2. **Line-by-line explanation**: Explain each important line or block
3. **Key concepts**: Any important concepts or patterns used
4. **Potential issues**: Any bugs or improvements you notice

Code:
\`\`\`
${code}
\`\`\`

Provide a clear, educational explanation.`;

  return await aiSession.prompt(prompt);
}

// Refactor Code - Improve readability and performance
async function refactorCode(code) {
  const langHint = selectedLanguage !== 'auto' ? ` (${selectedLanguage})` : '';
  
  const prompt = `Refactor this code to improve quality${langHint}.

Improvements to make:
1. Better variable/function names (more descriptive)
2. Improve code structure and readability
3. Optimize performance where possible
4. Follow language best practices
5. Add helpful comments for clarity

CRITICAL RULES:
- DO NOT add markdown formatting (\`\`\` or language tags)
- DO NOT add explanatory text before or after code
- Return ONLY the refactored code
- Maintain the same functionality

Code:
${code}

Refactored code:`;

  return await aiSession.prompt(prompt);
}

// Review Code - Find bugs and suggest improvements
async function reviewCode(code) {
  const langHint = selectedLanguage !== 'auto' ? ` (${selectedLanguage})` : '';
  
  const prompt = `You are a senior code reviewer${langHint}.

Review this code and provide:

**🐛 Bugs/Issues:**
- List any bugs, errors, or logical problems

**⚠️ Potential Problems:**
- Edge cases not handled
- Performance issues
- Security concerns

**✅ Good Practices:**
- What's done well

**💡 Suggestions:**
- How to improve the code

Code:
\`\`\`
${code}
\`\`\`

Be constructive and specific.`;

  return await aiSession.prompt(prompt);
}

// Add Comments - Generate documentation
async function addComments(code) {
  const langHint = selectedLanguage !== 'auto' ? ` (${selectedLanguage})` : '';
  
  const prompt = `Add helpful comments to this code${langHint}.

RULES - VERY IMPORTANT:
1. DO NOT modify any code logic, structure, or syntax
2. DO NOT add markdown formatting like \`\`\`
3. DO NOT add explanatory text before or after the code
4. ONLY add comments using proper syntax (// or /* */ or # depending on language)
5. Add comments for: functions, complex logic, parameters, return values
6. Keep comments concise and helpful

Code to comment:
${code}

Output the exact same code with only comments added. Nothing else.`;

  return await aiSession.prompt(prompt);
}

// Clean code output - remove markdown formatting
function cleanCodeOutput(text) {
  let cleaned = text;
  
  // Remove markdown code blocks with language tags
  cleaned = cleaned.replace(/```[\w]*\n?/g, '');
  cleaned = cleaned.replace(/```\n?/g, '');
  
  // Remove leading/trailing explanatory text (common AI responses)
  // Look for the actual code start
  const lines = cleaned.split('\n');
  let codeStartIndex = -1;
  let codeEndIndex = lines.length;
  
  // Find first line that looks like code (has typical code characters)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length > 0 && !line.startsWith('Here') && !line.startsWith('The ') && 
        (line.includes('{') || line.includes('(') || line.includes('import ') || 
         line.includes('class ') || line.includes('function ') || line.includes('const ') ||
         line.includes('let ') || line.includes('var ') || line.includes('def ') ||
         line.includes('//') || line.includes('/*'))) {
      codeStartIndex = i;
      break;
    }
  }
  
  // Find last line of code (stop at trailing explanations)
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.length > 0 && !line.startsWith('Note:') && !line.startsWith('Explanation:') &&
        !line.startsWith('The above') && !line.startsWith('This ')) {
      codeEndIndex = i + 1;
      break;
    }
  }
  
  if (codeStartIndex !== -1) {
    cleaned = lines.slice(codeStartIndex, codeEndIndex).join('\n');
  }
  
  return cleaned.trim();
}

// Display result
function displayResult(result) {
  outputSection.classList.add('active');
  
  // Clean up the result - remove markdown code blocks if present
  let cleanedResult = result;
  
  // Remove markdown code blocks (```language ... ```)
  cleanedResult = cleanedResult.replace(/```[\w]*\n/g, '').replace(/```$/g, '').trim();
  
  // For refactor and comments modes, show raw code
  if (lastAction === 'refactor' || lastAction === 'comments') {
    output.textContent = cleanedResult;
    output.style.whiteSpace = 'pre';
    output.style.fontFamily = "'Courier New', monospace";
  } else {
    // For explain and review modes, format with basic HTML
    const formatted = formatCodeOutput(cleanedResult);
    output.innerHTML = formatted;
    output.style.whiteSpace = 'pre-wrap';
  }
}

// Basic code formatting
function formatCodeOutput(text) {
  // Detect code blocks and format them
  const codeBlockRegex = /```[\s\S]*?```/g;
  
  let formatted = text;
  
  // Escape HTML
  formatted = formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Highlight code blocks
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Add line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}

// Show error
function showError(message) {
  outputSection.classList.add('active');
  output.innerHTML = message.replace(/\n/g, '<br>');
  output.style.color = '#f85149';
}

// Set loading state
function setLoading(isLoading, action = null) {
  const actionNames = {
    explain: 'Analyzing code...',
    refactor: 'Refactoring code...',
    review: 'Reviewing code...',
    comments: 'Generating comments...',
    chat: 'Thinking...'
  };
  
  explainBtn.disabled = isLoading;
  refactorBtn.disabled = isLoading;
  reviewBtn.disabled = isLoading;
  commentsBtn.disabled = isLoading;
  askBtn.disabled = isLoading;
  
  loading.classList.toggle('active', isLoading);
  
  if (isLoading && action) {
    loadingText.textContent = actionNames[action] || 'Processing...';
  }
  
  if (!isLoading) {
    output.style.color = '#c9d1d9';
  }
}

// Auto-load selected code from page
async function loadSelectedCode() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) return;
    
    // First check if there's stored code from context menu
    chrome.runtime.sendMessage({ action: 'getStoredCode' }, (response) => {
      if (response && response.code) {
        codeInput.value = response.code;
        if (response.language) {
          langButtons.forEach(btn => {
            if (btn.dataset.lang === response.language) {
              btn.click();
            }
          });
        }
        
        // Auto-process if action specified
        if (response.autoAction) {
          setTimeout(() => {
            processCode(response.autoAction);
          }, 300);
        }
      } else {
        // Try to get selected text
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => window.getSelection().toString()
        }, (results) => {
          if (results && results[0] && results[0].result) {
            codeInput.value = results[0].result;
          }
        });
      }
    });
  } catch (error) {
    console.log('Could not auto-load code:', error);
  }
}

loadSelectedCode();

// Cleanup
window.addEventListener('unload', () => {
  if (aiSession) {
    aiSession.destroy();
  }
});