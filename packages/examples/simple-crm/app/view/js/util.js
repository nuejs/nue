
const TODAY = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
const THIS_YEAR = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const OLDER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function formatDate(date) {
 const now = new Date()

 return date.toDateString() === now.toDateString() ? TODAY.format(date)
   : date.getFullYear() === now.getFullYear() ? THIS_YEAR.format(date)
   : OLDER.format(date)
}

export function formatBody(body) {
  return body.split('\n').map(p => `<p>${p}</p>`).join('')
}