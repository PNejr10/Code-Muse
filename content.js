// CodeMuse - Content Script
// Detects code on web pages and provides visual hints

// Detect if selection is likely code
function isLikelyCode(text) {
  if (!text || text.length < 10) return false;
  
  // Code indicators
  const codePatterns = [
    /function\s+\w+\s*\(/,
    /class\s+\w+/,
    /const\s+\w+\s*=/,
    /let\s+\w+\s*=/,
    /var\s+\w+\s*=/,
    /def\s+\w+\(/,
    /public\s+\w+/,
    /private\s+\w+/,
    /import\s+/,
    /from\s+['"].*['"]/,
    /\w+\.\w+\(/,
    /=>\s*{/,
    /if\s*\(/,
    /for\s*\(/,
    /while\s*\(/,
    /{[\s\S]*}/,
    /\/\/.*/,
    /\/\*[\s\S]*\*\//
  ];
  
  return codePatterns.some(pattern => pattern.test(text));
}

// Show CodeMuse hint when code is selected
let hintTimeout;

document.addEventListener('mouseup', () => {
  clearTimeout(hintTimeout);
  
  hintTimeout = setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();
    
    if (selectedText && selectedText.length > 20 && isLikelyCode(selectedText)) {
      showCodeMuseHint();
    } else {
      hideCodeMuseHint();
    }
  }, 300);
});

document.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.codemuse-hint')) {
    hideCodeMuseHint();
  }
});

function showCodeMuseHint() {
  hideCodeMuseHint();
  
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const hint = document.createElement('div');
  hint.className = 'codemuse-hint';
  hint.innerHTML = `
    <div class="codemuse-hint-content">
      <span class="codemuse-hint-icon">🧰</span>
      <span class="codemuse-hint-text">Right-click for CodeMuse AI</span>
    </div>
  `;
  
  hint.style.cssText = `
    position: absolute;
    left: ${rect.left + window.scrollX}px;
    top: ${rect.bottom + window.scrollY + 8}px;
    z-index: 999999;
  `;
  
  hint.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
    hideCodeMuseHint();
  });
  
  document.body.appendChild(hint);
  
  setTimeout(hideCodeMuseHint, 5000);
}

function hideCodeMuseHint() {
  const existingHint = document.querySelector('.codemuse-hint');
  if (existingHint) {
    existingHint.remove();
  }
}

// Keyboard shortcut hints
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Shift + E - Explain
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
    e.preventDefault();
    const selectedText = window.getSelection().toString().trim();
    if (selectedText && isLikelyCode(selectedText)) {
      chrome.runtime.sendMessage({
        action: 'openWithCode',
        code: selectedText,
        mode: 'explain'
      });
    }
  }
  
  // Ctrl/Cmd + Shift + R - Refactor
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
    e.preventDefault();
    const selectedText = window.getSelection().toString().trim();
    if (selectedText && isLikelyCode(selectedText)) {
      chrome.runtime.sendMessage({
        action: 'openWithCode',
        code: selectedText,
        mode: 'refactor'
      });
    }
  }
});

console.log('CodeMuse content script loaded ✓');