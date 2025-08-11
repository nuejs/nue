
function renderDialog(e) {
  return `
    <dialog id="nuerror">
      <header>
        <h2>${ e.title }</h2>
        <p>${ e.text } at ${ e.path } (${ e.line } / ${ e.column })</p>
      </header>

      <pre>
        ${ e.lineText }
      </pre>

      <footer>
        <button popovertarget="nuerror">Close</button>
      </footer>
    </dialog>
  `
}

export async function showError(error) {
  window.nuerror?.remove()
  document.body.insertAdjacentHTML('beforeend', renderDialog(error))
  window.nuerror.showPopover()
}

