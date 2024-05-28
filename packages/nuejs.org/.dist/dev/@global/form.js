
export const lib = [
{
  name: 'join-list',
  tagName: 'div',
  tmpl: '<div class="join-list"> <h4 :if="0"> &#x2705; Nue mailing list joined </h4> <form :else @submit="1"> <p :if="2">:3:</p> <input type="email" name="email" placeholder="Your email" required> <textarea name="comment" placeholder="Feedback (optional)"></textarea> <button class="secondary">:4:</button> </form> </div>',
  Impl: class { 
    submit({ target }) {
      const data = Object.fromEntries(new FormData(target).entries())

      fetch('/public/members', {
        'Content-Type': 'application/json',
        body: JSON.stringify(data),
        method: 'POST',
      })

      sessionStorage.joined = true
    }
   },
  fns: [
    _ => sessionStorage.joined,
    (_,e) => { {e.preventDefault();_.submit.call(_, e)} },
    _ => _.desc,
    _ => [_.desc],
    _ => [_.cta || 'Join mailing list']
  ]
}]
export default lib[0]