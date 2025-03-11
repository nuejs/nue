
import { $, $$ } from '/@nue/view-transitions.js'

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

/*
  Implements a missing "close" event for dialogs
  Executes the callback function only once when dialog is closed,
  either via ESC key or popovertarget button. The function keeps
  listening until the first close event happens.
*/
export function onDialogClose(dialog, fn) {
 let handler = () => {
   if (!dialog.matches(':popover-open')) {
     fn()
     dialog.removeEventListener('toggle', handler)
   }
 }
 dialog.addEventListener('toggle', handler)
}


export function setSelected(query, attrname, value=true) {

  // remove previous selection
  for (const el of $$(`[${attrname}]`)) el.removeAttribute(attrname)

  // Mark the new selection
  $(query)?.setAttribute(attrname, value)

}