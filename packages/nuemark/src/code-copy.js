// Global function for copying code from code blocks
window.copyCode = function (button) {
  const codeBlock = button.parentNode.querySelector('pre code, pre');

  // Function to clean code by removing sup tags while preserving structure
  function removeSupTags(html) {
    if (!html || !html.includes('<sup')) {
      return html;
    }

    // Replace all sup tags and their content with empty string
    // This handles various formats of sup tags including self-closing ones
    return html
      .replace(/<sup[^>]*>.*?<\/sup>/g, '') // Standard sup tags with content
      .replace(/<sup[^>]*\/>/g, '')         // Self-closing sup tags
      .replace(/<sup[^>]*>/g, '');          // Orphaned opening sup tags
  }

  // Get cleaned code content
  let code;

  try {
    // Method 1: DOM manipulation approach (most reliable)
    if (typeof codeBlock.cloneNode === 'function') {
      const clone = codeBlock.cloneNode(true);
      const sups = clone.querySelectorAll('sup');
      sups.forEach(sup => sup.remove());
      code = clone.textContent;
    }
    // Method 2: Regex fallback approach
    else {
      const cleanedHtml = removeSupTags(codeBlock.innerHTML);
      const tempEl = document.createElement('div');
      tempEl.innerHTML = cleanedHtml;
      code = tempEl.textContent;
    }
  } catch (e) {
    // Ultimate fallback: if all else fails, just get the text and hope for the best
    console.error('Error cleaning code:', e);
    code = codeBlock.textContent;
  }

  // Use the Clipboard API to copy the text
  navigator.clipboard.writeText(code).then(() => {
    // Provide feedback by changing the button text
    const originalInnerHTML = button.innerHTML;
    const originalLabel = button.getAttribute('aria-label');

    // Update button content and attributes
    button.innerHTML = '<span>Copied!</span>';
    button.setAttribute('aria-label', 'Code copied to clipboard');

    // Add a success notification for screen readers
    const notification = document.createElement('div');
    notification.setAttribute('aria-live', 'assertive');
    notification.classList.add('visually-hidden');
    notification.textContent = 'Code copied to clipboard';
    document.body.appendChild(notification);

    // Reset button after 2 seconds
    setTimeout(() => {
      button.innerHTML = originalInnerHTML;
      button.setAttribute('aria-label', originalLabel);
      document.body.removeChild(notification);
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy code: ', err);

    // Notify user of error
    button.innerHTML = '<span>Error!</span>';
    setTimeout(() => {
      button.innerHTML = originalInnerHTML;
    }, 2000);
  });
};

// Initialize the copy button functionality - ensures it works without refresh
(function initCodeCopy() {
  let hasRun = false;

  // Main function to set up the copy button system
  function setupCodeCopy() {
    if (hasRun) return; // Prevent multiple initializations
    hasRun = true;

    // Add general styles first
    addStyles();

    // No need to run the positioner on initial load since we now have inline styles
    // Just set up listeners for future dynamic content
    setupEventListeners();
    setupMutationObserver();

    console.log('Code copy button system initialized');
  }

  // Add event listeners
  function setupEventListeners() {
    window.addEventListener('resize', positionCodeButtons);
    document.addEventListener('DOMContentLoaded', runPositioner);
    window.addEventListener('load', runPositioner);

    // For SPAs that might use history navigation
    window.addEventListener('popstate', runPositioner);
    window.addEventListener('hashchange', runPositioner);
  }

  // Run the positioner with a slight delay - only needed for dynamically added blocks
  function runPositioner() {
    setTimeout(positionCodeButtons, 50);
  }

  // Position the copy buttons - only used for dynamically added code blocks
  function positionCodeButtons() {
    try {
      document.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
        // Skip blocks that already have inline styles
        if (wrapper.querySelector('style')) return;

        const pre = wrapper.querySelector('pre');
        const button = wrapper.querySelector('.code-copy-btn');

        if (!pre || !button) return;

        // Get code block attributes
        const isNumbered = wrapper.getAttribute('data-numbered') === 'true';
        const language = wrapper.getAttribute('data-language') || '';

        // Add more padding if needed (especially for numbered code blocks)
        if (isNumbered) {
          pre.style.paddingRight = '60px';
          button.style.right = '2.5em';
        } else {
          pre.style.paddingRight = '40px';
          button.style.right = '0.5em';
        }

        // Special positioning for certain languages
        if (['bash', 'sh', 'shell'].includes(language)) {
          button.style.top = '0.8em';
        }
      });
    } catch (e) {
      console.error('Error positioning code buttons:', e);
    }
  }

  // Expose the function globally for other scripts to use
  window.positionCodeButtons = positionCodeButtons;

  // Listen for DOM changes to detect dynamically added code blocks
  function setupMutationObserver() {
    if (!window.MutationObserver) return;

    const observer = new MutationObserver((mutations) => {
      let shouldUpdatePositions = false;

      for (const mutation of mutations) {
        // Check for added nodes that might contain code blocks
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // ELEMENT_NODE
              if ((node.classList && node.classList.contains('code-block-wrapper')) ||
                (node.querySelectorAll && node.querySelectorAll('.code-block-wrapper').length > 0)) {
                shouldUpdatePositions = true;
                break;
              }
            }
          }
        }

        if (shouldUpdatePositions) break;
      }

      if (shouldUpdatePositions) {
        runPositioner();
      }
    });

    // Observe the entire document for changes
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function addStyles() {
    // Check if styles are already added
    if (document.getElementById('code-copy-styles')) return;

    const style = document.createElement('style');
    style.id = 'code-copy-styles';
    style.textContent = `
      .code-block-wrapper {
        position: relative;
      }
      
      .code-copy-btn {
        position: absolute;
        padding: 3px 6px;
        background-color: rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        z-index: 10;
        margin: 0;
        line-height: 1;
        font-size: 0.85em;
        min-width: 28px;
        min-height: 24px;
      }
      
      /* Position the button to appear inline with code */
      .code-block-wrapper:hover .code-copy-btn {
        opacity: 0.8;
      }
      
      .code-copy-btn:hover {
        background-color: rgba(0, 0, 0, 0.25);
        opacity: 1 !important;
      }
      
      .code-copy-btn:focus {
        outline: 2px solid rgba(255, 255, 255, 0.3);
        opacity: 1;
      }
      
      .code-copy-btn span {
        font-size: 12px;
        white-space: nowrap;
      }
      
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // Execute the setup function based on document readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCodeCopy);
  } else {
    setupCodeCopy();
  }

  // Final fallback: If nothing else works, try again after window load
  window.addEventListener('load', function () {
    setTimeout(setupCodeCopy, 0);
  });
})(); 