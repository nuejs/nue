
  function loadCSS(path, fn) {
    if (document.querySelector(`[href="${path}"]`)) return fn()

    const el = document.createElement('link')
    el.rel = 'stylesheet'
    el.href = path
    document.head.appendChild(el)
    el.onload = fn
  }

  export async function showError(data) {
    const { createApp } = await import('/@nue/nue.js')
    const app = createApp(lib[0], data).append(document.body)
    loadCSS('/@nue/error.css', () => app.root.showModal())
  }

export const lib = [
{
  tagName: 'dialog',
  tmpl: '<dialog class="nuerr"> <a @click="0">&#xd7;</a> <h3><b :class="1">:2:</b>:3:</h3> <p>:4:</p> <pre>:5:</pre> <p> At <samp>:6:</samp> <small :if="7">:8:</small> </p></dialog>',
  fns: [
    (_,e) => { _.unmount.call(_, e) },
    _ => ['nue-',_.ext],
    _ => [_.ext],
    _ => [' ',_.title],
    _ => [_.text],
    _ => [_.lineText],
    _ => [_.path],
    _ => _.line,
    _ => ['line ',_.line,' / column ',_.column]
  ]
}]
export default lib[0]