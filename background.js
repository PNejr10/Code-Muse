// CodeMuse - Background Service Worker

// Create context menus on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CodeMuse installed successfully!');
  
  // Remove any existing menus first
  chrome.contextMenus.removeAll(() => {
    // Parent menu
    chrome.contextMenus.create({
      id: 'codemuse-parent',
      title: '🧰 CodeMuse - AI Code Assistant',
      contexts: ['selection']
    });

    // Submenu items
    chrome.contextMenus.create({
      id: 'codemuse-explain',
      parentId: 'codemuse-parent',
      title: '🧠 Explain Code',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'codemuse-refactor',
      parentId: 'codemuse-parent',
      title: '✨ Refactor Code',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'codemuse-review',
      parentId: 'codemuse-parent',
      title: '🔍 Review Code',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'codemuse-comments',
      parentId: 'codemuse-parent',
      title: '📝 Add Comments',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'codemuse-separator',
      parentId: 'codemuse-parent',
      type: 'separator',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'codemuse-open',
      parentId: 'codemuse-parent',
      title: '✨ Open CodeMuse',
      contexts: ['selection']
    });
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedCode = info.selectionText;
  
  if (!selectedCode) return;

  let action = null;
  
  switch (info.menuItemId) {
    case 'codemuse-explain':
      action = 'explain';
      break;
    case 'codemuse-refactor':
      action = 'refactor';
      break;
    case 'codemuse-review':
      action = 'review';
      break;
    case 'codemuse-comments':
      action = 'comments';
      break;
    case 'codemuse-open':
      // Just open popup
      break;
  }

  // Store selected code and action
  chrome.storage.local.set({
    selectedCode: selectedCode,
    selectedAction: action,
    timestamp: Date.now()
  });

  // Open extension popup
  chrome.action.openPopup();
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'explain-code' || command === 'refactor-code') {
    chrome.action.openPopup();
  }
});

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStoredCode') {
    chrome.storage.local.get(['selectedCode', 'selectedAction', 'timestamp'], (result) => {
      const isRecent = result.timestamp && (Date.now() - result.timestamp < 5000);
      
      if (isRecent && result.selectedCode) {
        sendResponse({
          code: result.selectedCode,
          autoAction: result.selectedAction
        });
        
        // Clear after use
        chrome.storage.local.remove(['selectedCode', 'selectedAction', 'timestamp']);
      } else {
        sendResponse({ code: null });
      }
    });
    
    return true;
  }
  
  if (request.action === 'trackUsage') {
    // Track usage statistics
    chrome.storage.local.get(['usageStats'], (result) => {
      const stats = result.usageStats || {
        totalUses: 0,
        explain: 0,
        refactor: 0,
        review: 0,
        comments: 0
      };
      
      stats.totalUses++;
      stats[request.type] = (stats[request.type] || 0) + 1;
      
      chrome.storage.local.set({ usageStats: stats });
    });
    
    sendResponse({ success: true });
  }
  
  return true;
});

// Badge to show AI status
async function updateBadge() {
  try {
    if (typeof LanguageModel !== 'undefined') {
      const availability = await LanguageModel.availability();
      
      if (availability === 'readily' || availability === 'available') {
        chrome.action.setBadgeText({ text: '✓' });
        chrome.action.setBadgeBackgroundColor({ color: '#238636' });
      } else if (availability === 'downloadable') {
        chrome.action.setBadgeText({ text: '⚠' });
        chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
      } else {
        chrome.action.setBadgeText({ text: '✗' });
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
      }
    }
  } catch (error) {
    console.log('Could not check AI availability:', error);
  }
}

// Update badge periodically
setInterval(updateBadge, 30000);
updateBadge();