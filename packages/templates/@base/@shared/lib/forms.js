
// generic form handler
document.querySelectorAll('form').forEach(form => {
  form.onsubmit = async (e) => {
    e.preventDefault()
    const data = new FormData(form)

    // const res = await fetch(form.action, { method: 'POST', body: data })
    const res = { ok: true }

    if (res.ok) form.innerHTML = '<p>Thanks for your feedback!</p>'
  }
})
