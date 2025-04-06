// Simple test of sup tag removal logic
const html = `<pre><code>function test() {<sup>1</sup>  return true;<sup>2</sup>}</code></pre>`;

// Create a DOM element to test with
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');
const codeBlock = doc.querySelector('pre code');

// Original content
console.log('Original HTML:', codeBlock.innerHTML);
console.log('Original text:', codeBlock.textContent);

// Clean the content (remove sup tags)
const clone = codeBlock.cloneNode(true);
const sups = clone.querySelectorAll('sup');
sups.forEach(sup => sup.remove());

// Show cleaned content
console.log('Cleaned text:', clone.textContent);

// Alternative regex approach
const cleanedHtml = codeBlock.innerHTML.replace(/<sup[^>]*>.*?<\/sup>/g, '');
const tempEl = document.createElement('div');
tempEl.innerHTML = cleanedHtml;
console.log('Regex cleaned text:', tempEl.textContent); 