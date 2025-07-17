export const lib = [ { tag: 'div',
    attr: [ { name: 'class', val: 'card' } ],
    script: function() { this.sort = function(by) {
      this.by = this.by == by ? this.by : by
      this.dir = this.by == by ? -this.dir || -1 : 1
      this.users.sort((a, b) => (a[by] > b[by] ? 1 : -1) * this.dir)
    }

    this.filter = function(e) {
      const val = e.target.value.trim().toLowerCase()
      this.subset = val ? this.users.filter(el => el.name.toLowerCase().includes(val)) : null
    } 
		},
    children:
     [ { tag: 'header',
         children:
          [ { tag: 'h1', children: [ { text: 'Table example' } ] },
            { tag: 'p',
              children: [ { text: 'A more compex table with filtering and sortable columns' } ] },
            { tag: 'input',
              attr:
               [ { name: 'type', val: 'search' },
                 { name: 'placeholder', val: 'Filter by name...' } ],
              handlers: [ { name: 'oninput', h_fn: (_,$e)=>_.filter($e) } ] } ] },
       { tag: 'table',
         children:
          [ { tag: 'tr',
              children:
               [ { tag: 'th',
                   children:
                    [ { tag: 'a',
                        handlers: [ { name: 'onclick', h_fn: (_,$e)=>_.sort('name') } ],
                        children: [ { text: 'Name' } ] } ] },
                 { tag: 'th',
                   children:
                    [ { tag: 'a',
                        handlers: [ { name: 'onclick', h_fn: (_,$e)=>_.sort('email') } ],
                        children: [ { text: 'Email' } ] } ] },
                 { tag: 'th',
                   children:
                    [ { tag: 'a',
                        handlers: [ { name: 'onclick', h_fn: (_,$e)=>_.sort('age') } ],
                        children: [ { text: 'Age' } ] } ] },
                 { tag: 'th',
                   children:
                    [ { tag: 'a',
                        handlers: [ { name: 'onclick', h_fn: (_,$e)=>_.sort('total') } ],
                        children: [ { text: 'Total' } ] } ] } ] },
            { tag: 'tr',
              for: { fn: _=>(_.subset || _.users), keys: [ 'user' ], is_entries: false },
              attr: [ { name: 'key', fn: _=>((_.user.id)) } ],
              children:
               [ { tag: 'td', children: [ { fn: _=>(_.user.name) } ] },
                 { tag: 'td', children: [ { fn: _=>(_.user.email) } ] },
                 { tag: 'td', children: [ { fn: _=>(_.user.age) } ] },
                 { tag: 'td',
                   children: [ { fn: _=>(new Intl.NumberFormat('en-US').format(_.user.total)) } ] } ] },
            { some:
               [ { tag: 'tr',
                   if: '_.subset && !_.subset[0]',
                   children:
                    [ { tag: 'td',
                        attr: [ { name: 'colspan', val: '4' } ],
                        children: [ { text: 'No results' } ] } ] } ] },
            { tag: 'caption',
              children: [ { fn: _=>(_.users.length) }, { text: ' people in total' } ] } ] } ] } ]