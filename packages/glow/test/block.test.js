
test('captioned block', () => {
  const opts = { language: 'html', caption: 'foo.html', show_tag: true }
  const html = createBlock('<!-- hey -->', opts)
  expect(html).toStartWith('<figure><figcaption>')
  expect(html).toInclude('<mark>html</mark><span>foo.html</span>')
  expect(html).toInclude('<pre><code class="language-html"><b class=hl-comment>')
})

const CODE = `import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return (
      <p>This is first JSX Element!</p>
      <p>This is another JSX Element</p>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
`

test.only('codetabs', () => {
  const blocks = [
    { caption: 'hello.jsx', code: CODE, language: 'jsx', show_tag: true },
    { caption: 'hello.css', code: '/* world */', language: 'css', show_tag: true  },
  ]

  const attr = { is: 'nuemark-tabs', class: 'codetabs' }

  const html = createTabs({ blocks, attr })

  console.info(html)
})