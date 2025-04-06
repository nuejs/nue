// Utility script to ensure code copy buttons are properly initialized
// This script is meant to be inlined in the page head

(function () {
  // Execute immediately to ensure early initialization
  window.__nueCodeCopyInit = function () {
    // Check if code copy script is fully loaded
    function isCodeCopyScriptLoaded() {
      return typeof window.copyCode === 'function';
    }

    // Make buttons visible (we'll use CSS transitions for smooth appearance)
    function showButtons() {
      // If the positionCodeButtons function isn't available yet, 
      // apply a style to make buttons visible
      if (!window.positionCodeButtons) {
        const style = document.createElement('style');
        style.textContent = `
          .code-copy-btn {
            opacity: 0 !important;
            transition: opacity 0.2s ease;
          }
          .code-block-wrapper:hover .code-copy-btn {
            opacity: 0.8 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Initialize code-copy functionality - no positioning needed for static content
    // since we're using inline styles
    function initCopyFunctionality() {
      // The actual positioning happens through inline styles now
      if (typeof window.positionCodeButtons === 'function') {
        // Only run the positioner for dynamically added blocks
        window.positionCodeButtons();
      }
    }

    // Make sure buttons are visible immediately
    showButtons();

    // Check if code-copy.js is already loaded
    if (isCodeCopyScriptLoaded()) {
      initCopyFunctionality();
    } else {
      // Wait for the code-copy.js script to load
      const checkInterval = setInterval(function () {
        if (isCodeCopyScriptLoaded()) {
          clearInterval(checkInterval);
          initCopyFunctionality();
        }
      }, 50);
    }

    // Setup additional event listeners
    document.addEventListener('DOMContentLoaded', initCopyFunctionality);
    window.addEventListener('load', initCopyFunctionality);
  };

  // Run immediately
  window.__nueCodeCopyInit();
})(); 