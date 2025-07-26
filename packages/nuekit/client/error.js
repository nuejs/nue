
function renderDialog(e) {
  return `
    <dialog id="error_modal">
      <header>
        <h2>${ e.title }</h2>
        <p>${ e.text } at ${ e.path } (${ e.line } / ${ e.column })</p>
      </header>

      <pre>
        ${ e.lineText }
      </pre>

      <footer>
        <button popovertarget="error_modal">Close</button>
      </footer>
    </dialog>
  `
}

export async function showError(error) {
  window.error_modal?.remove()
  document.body.insertAdjacentHTML('beforeend', renderDialog(error))
  window.error_modal.showPopover()
}

