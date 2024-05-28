
export const lib = [
{
  name: 'counter',
  tagName: 'div',
  tmpl: '<div class="demo card"> <h3>:0:</h3> <button @click="1">Decrement</button> <button @click="2">Increment</button> </div>',
  Impl: class { count = 0 },
  fns: [
    _ => ['You clicked ',_.count,' times!'],
    (_,e) => { _.count-- },
    (_,e) => { _.count++ }
  ]
},{
  name: 'simple-counter',
  tagName: 'div',
  tmpl: '<div class="demo card"> <button @click="0">:1:</button> </div>',
  Impl: class { count = 0 },
  fns: [
    (_,e) => { _.count++ },
    _ => [' Clicked ',_.count,' ',_.count == 1 ? 'time' : 'times',' ']
  ]
},{
  name: 'reactive-loop',
  tagName: 'div',
  tmpl: '<div class="demo card"> <p> <button @click="0">Add</button> <button @click="1" $disabled="2">Remove</button> </p> <img :for="3" :src="4"> </div>',
  Impl: class { 
    images = ['popcorn', 'peas', 'lemons', 'tomatoes']

    addFruit() {
      const img = this.images[Math.floor(Math.random() * 4)]
      this.images.push(img)
    }
   },
  fns: [
    (_,e) => { _.addFruit.call(_, e) },
    (_,e) => { _.images.pop() },
    _ => !_.images[4],
    _ => ['img', _.images, '$index'],
    _ => ['/img/',_.img,'.jpg']
  ]
},{
  name: 'user-update',
  tagName: 'div',
  tmpl: '<div class="demo card"> <img :src="0"> <h3>:1:</h3> <p>:2:</p> <button @click="3" $disabled="4">Load Jane</button> </div>',
  Impl: class { 
    user = {
      avatar: '/img/face-4.jpg',
      email: 'john@acme.org',
      name: 'John Doe',
    }

    async loadJane() {
      const req = await fetch('jane.json')
      this.user = await req.json()
      this.is_loaded = true
      this.update()
    }
   },
  fns: [
    _ => _.user.avatar,
    _ => [_.user.name],
    _ => [_.user.email],
    (_,e) => { _.loadJane.call(_, e) },
    _ => _.is_loaded
  ]
}]
export default lib[0]