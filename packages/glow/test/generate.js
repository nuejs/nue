import { promises as fs } from 'node:fs'

import { glow } from '../src/glow.js'


// Nue / html
const HTML = `
<figure @name="img" class=•"baz { foo } \${ bar }"•>
  <img loading="lazy" :alt="alt" :src="_ || src">

  <!-- HTML comment here -->
  <p>I finally made it to the public</p>

  <figcaption :if="caption">{{ caption }}</figcaption>

  <script>
    •constructor(data)• {
      this.caption = data.caption || ''
    }
  </script>
</figure>
`

const JSX = `
import { FormEvent } from 'react';

/*
  Multi-line comment goes here
*/
export default function Page() {
  async function onSubmit(event: FormEvent<Element>) {
+   const response = await fetch('/api/submit', {
+     method: 'POST',
      body: formData,
    });
  }

  return (
    <form onSubmit=•{onSubmit}•>
>     <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  );
}`

const CSS = `
@import "../css/dark.css";

/* Let's check out CSS code */
.syntax {
  border: 1px solid #fff1 !important;
  background-color: var(--base-600);
  border-radius: var(--radius);
  margin-bottom: 3em;

  @media(width < 900) {
    transform: scale(1.1);
    filter: blur(4px);
  }

  @starting-style {
    transition: transform 4s;
  }
}
`
const JAVASCRIPT = `
"use strict"

// import some UI stuff
import { layout } from 'components/layout'

// environment
const ENV = {
  scripts: ['lol.js'],
  styles: ['lma\\no.css'],
  desc: undefined
}

export default function({ val }) {
  const fooo = val.split('\\n') // 30px
  return \`<div class='node'></div>\`
}
`

// Markdown
const MARKDOWN = `
---
title: Lightning CSS might yield our thinking
tags: [ •css, design systems• ]
pubDate: 2024-02-12
---

# This is something about Lightning CSS
I'm baby else umami wolf yield batch iceland
adaptogen. Iceland **chambray** raclette stumptown

![Hey](/world.png)

> Air plant adaptogen artisan gastropub deep v dreamcatcher
> Pinterest intelligentsia gluten-free truffaut.

* first
* second

[grid]
  nollie: "Something"
  list: [ foo, bar ]
  foo: 10
  bar: 30

`

const YAML = `
title: Do this or else that yield happens
tags: [ function, default, const ]
date: 2024-02-12
more: "strings"
count: 10
xmas: true

# Comment here
Documentation:
  Hello World: /syntax-test
  Nothing goes: /morphine/boss "hello"
list:
  - Michelangelo "boost"
`


const NUEMARK = `
---
title: Noel's cringe content
|description: Not much to say
unlisted: true
---

# Lets get magical
I'm baby truffaut umami wolf small batch iceland
adaptogen. Iceland **chambray** raclette stumptown

// line comment here
[table head="Foo | Bar | Baz"]
  - Content first               | + | + | +
  - Content collections         | + | + | +
  - Hot-reloading               | + | + | +
  - AI content generation       | + | + | +

> This is my blockquote right here

[.listbox]
  * Nothing here to see
  * This one is a banger

  ![Hello](/banger.png)

[image loading="eager"]:
| small: "/img/explainer-tall.png"
  src: "/img/explainer.png"
  hidden: true
  width: 800
`


const MDX = `
import {Chart} from './snowfall.js'
export const year = 2023

# Last year’s snowfall

In {year}, the snowfall was above average.
It was followed by a warm spring which caused
flood conditions in many of the nearby rivers.

![Hey](/world.png)

> Air plant adaptogen artisan gastropub deep v dreamcatcher
> Pinterest intelligentsia gluten-free truffaut.

<Chart year={year} color="#fcb32c" />

<Elemment { ...attr }>
  <p class="epic">Yo</p>
</Element>
`



const SHELL = `
#!/bin/bash

myfile = 'cars.txt'

touch $myfile
if [ -f $myfile ]; then
   rm cars.txt
   echo "$myfile deleted"
fi

# open demo on the browser
open "http://localhost:8080"
`

const TOML = `
# This is a TOML document

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00

[database]
enabled = true
ports = [ 8000, 8001, 8002 ]
data = [ ["delta", "phi"], [3.14] ]
temp_targets = { cpu = 79.5, case = 72.0 }
`

const ZIG = `
const std = @import("std");
const parseInt = std.fmt.parseInt;

test "parse integers" {
    const input = "123 67 89,99";
    const ally = std.testing.allocator;

    // Ensure the list is freed at scope exit
    defer list.deinit();

    var it = std.mem.tokenizeAny(u8, input, " ,");
    while (it.next()) |num| {
        const n = try parseInt(u32, num, 10);
        try list.append(n); // EOL comment
    }
}
`

const CPP = `
#include <iostream>
using namespace std;

int main() {

  int first_number, second_number, sum;

  cout << "Enter two integers: ";
  cin >> first_number >> second_number;

  // sum of two numbers in stored
  sum = first_number + second_number;

  // prints sum
  cout << first_number << " + "
    <<  second_number << " = " << sum;

  return 0;
}
`

const GO = `
package main

import "fmt"

// fibonacci is a function that returns a function
func fibonacci() func() int {
  f2, f1 := 0, 1
  return func() int {
    f := f2
    f2, f1 = f1, f+f1
    return f
  }
}

func main() {
  f := fibonacci()
  for i := 0; i < 10; i++ {
    fmt.Println(f())
  }
}
`

const JSON = `
{
  "author": "John Doe <john.doe@gmail.com>",
  "keywords": ["json", "es5"],
  "version": 1.5,
  "keywords": ["json", "json5"],
  "version": 1.7,

  "scripts": {
    "test": "mocha --ui exports --reporter spec",
    "build": "./lib/cli.js -c package.json5",
  }
}
`

const JSON5 = `
{
  // this is a JSON5 snippet
  author: 'John Doe <john.doe@gmail.com>',
- keywords: ['json', 'es5'],
- version: 1.5,
+ keywords: ['json', 'json5'],
+ version: 1.7,

  scripts: {
    test: 'mocha --ui exports --reporter spec',
    build: './lib/cli.js -c package.json5',
  }
}
`

const TS = `
// user interface
interface User { name: string;  id: number; }

// account interface
class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
`


const STYLED = `
import styled from 'styled-components';

const Wrapper = styled.section\`
  background: papayawhip;
  color: \${aquasky},
  padding: 4em;
\`;

// Wrapper becomes a React component
render(
  <Wrapper defaultOpened="yes">
    <Title>
      Hello World!
    </Title>
  </Wrapper>
);
`

const ASTRO = `
---
import MyComponent from "./MyComponent.astro";
const items = ["Dog", "Cat", "Platypus"];
---

<ul>
> {items.map((item) => (
    <li>{item}</li>
  ))}
</ul>

<!-- renders as <div>Hello!</div> -->
<Element>
- <p>Hello</p>
+ <p>Hello!</p>
</Element>
`

const HASKELL = `
putTodo :: (Int, String) -> IO ()
putTodo (n, todo) = putStrLn (show n ++ ": " ++ todo)

prompt :: [String] -> IO ()
prompt todos = do
  putStrLn ""
  putStrLn "Current TODO list:"
  mapM_ putTodo (zip [0..] todos)

delete :: Int -> [a] -> Maybe [a]
`

const PYTHON = `
# Function definition
def find_square(num):
    result = num * num
    return result

'''
This is a multiline comment
'''
square = find_square(3) // 2

# Weirdoes
if (False) continue
elif (True) nonlocal + zoo
else None

print('Square:', square)
`


const JAVA = `
// Importing generic Classes/Files
import java.io.*;

class GFG {

  // Function to find the biggest of three numbers
  static int biggestOfThree(int x, int y, int z) {
    return z > (x > y ? x : y) ? z : ((x > y) ? x : y);
  }

  // Main driver function
  public static void main(String[] args) {
    int a, b, c;
    a = 5; b = 10; c = 3;

    // Calling the above function in main
    largest = biggestOfThree(a, b, c);
  }
}
`

const KOTLIN = `
@OptIn(DelicateCoroutinesApi::class)

fun main() = runBlocking {
  val job = GlobalScope.launch {
    // root coroutine with launch
    println("Throwing exception from launch")
    throw IndexOutOfBoundsException()
  }
  try {
    deferred.await()
    println("Unreached")
  } catch (e: ArithmeticException) {
    println("Caught ArithmeticException")
  }
}
`

const RUST = `
use std::fmt::{ Debug, Display };

// all drinks are emptied
fn compare_prints<T: Debug + Display>(t: &T) {
  println!("Debug: \`{:?}\`", t);
}

fn compare_types<T: Debug, U: Debug>(t: &T, u: &U) {
  println!("t: \`{:?}\`", t);
}
`
const PERL = `
#!/usr/bin/perl
use warnings;
use Path::Tiny;

# foo/bar
my $dir = path('foo','bar');

# Iterate over the content of foo/bar
my $iter = $dir->iterator;

while (my $file = $iter->()) {

  # Print out the file name and path
  print "$file";
}
`

const LUA = `
-- This here is a comment
function perm (a)
  local n = table.getn(a)
  return coroutine.wrap(function () permgen(a, n) end)
end


-- Another function
function printResult (a)
  for i,v in ipairs(a) do
    io.write(v, " ")
  end
  io.write("hello")
end
`

const RUBY = `

# line comment here
def get_numbers_stack(list)
  stack  = [[0, []]]
  output = []

  =begin
    Ruby multiline comments are pretty weirdoes
    Or maybe not??
  =end
  until stack.empty?
    index, taken = stack.pop
    next output << taken if index == list.size
    stack.unshift [index + 1, taken]
    stack.unshift [index + 1, taken + [list[index]]]
  end
  output
end
`

const PHP = `
<!DOCTYPE html>

<!-- HTML comment -->
<form method="get" action="target_proccessor.php">
  <input type="search" name="search">
  <input type="submit" name="submit" value="Search">

  <?php
    // inline PHP comment
    $camp = array("zero" => "free", "one" => "code" );
    print_r($camp);
  ?>
</form>
`

const CSHARP = `
public void MyTaskAsync(string[] files) {

  MyTaskWorker worker = new MyTaskWorker(MyTaskWorker);
  AsyncCallback fooback = new AsyncCallback(MyTask);

  lock (_sync) {
    if (_myTaskIsRunning)
      throw new OperationException(
        "The control is busy."
      );

    // one-line comment here
    AsyncOperation async = Async.CreateOperation(null);
    bool cancelled;

    worker.BeginInvoke(files, context, out cancelled);

    _myTaskIsRunning = true;
    _myTaskContext = context;
  }
}
`

const CLOJURE = `
(ns clojure.examples.hello
   (:genclass))

;; This program displays Hello World
(defn Example []
  (println [+ 1 2 3]))
(Example)

:dev-http {8080 "public"}
  :builds
  {:app
    {:target :browser
      :output-dir "public/app/js"
`

const NIM = `
import std/strformat

type
  Person = object
    name: string
    age: Natural # Ensures the age is positive

let people = [
  Person(name: "John", age: 45),
  Person(name: "Kate", age: 30)
]

for person in people:
  # Type-safe string interpolation,
  # evaluated at compile time.
  echo(fmt"{person.name} is {person.age} years old")
`

const CRYSTAL = `
# A very basic HTTP server
require "http/server"

server = HTTP::Server.new do |context|
  context.response.content_type = "text/plain"
  context.response.print "Hello world, got #{context}"
end

puts "Listening http://127.0.0.1:8080"
server.listen(8080)
`

const JULIA = `
function finalize_ref(r::AbstractRemoteRef)
  # Check if the finalizer is already run

  if islocked(client_refs) || 100
      # delay finalizer for later
      finalizer(finalize_ref, r)
      return nothing # really nothing
  end

  t = @task begin; sleep(5); println('done'); end

  # lock should always be followed by try
  Threads.@threads for i = 1:10
    a[i] = Threads.threadid()
  end
end
`

const HB = `
{#
  Mixed Django style comment
#}

<h1>
  {{#if quotaFull}}
    Please come back tomorrow.
  {{/if}}
</h1>

<!-- handlebars example -->
<ul>
  {{#each serialList}}
    <li>{{this}}</li>
  {{/each}}
</ul>
`

const SVELTE = `
<script>
  // line comment
  import Info from './Info.svelte';

  const pkg = {
    name: 'svelte',
    version: 3,
    speed: 'blazing',
    website: 'https://svelte.dev'
  };
</script>

<!-- layout goes here -->
<p>These styles...</p>
<Nested />
<Info {...pkg} />

<style>
  /* CSS comment */
  p {
    color: purple;
    font-family: 'Comic Sans MS', cursive;
    font-size: 2em;
  }
</style>
`

const SQL = `
SELECT
  date_trunc('week', orderdate),
  •count(1)•

FROM orders

•WHERE orderdate between• '2024-01-01' AND '2024-02-01'

RANK() OVER (ORDER ••BY __ order_amount DESC••)

INNER JOIN payment_status p ON o.status_id = p.id;
`

async function renderPage(items) {
  const html = ['<link rel="stylesheet" href="glow-test.css">']

  html.push('<body class="is-dark">')

  items.forEach(opts => {
    const { title } = opts
    const language = opts.lang || title.toLowerCase()
    const code = glow(opts.code, { language, numbered: true })

    html.push(`
      <div class="syntax ${opts.class || ''}">
        <header><h2>${opts.title || language}</h2></header>
        <pre glow>${code}</pre>
      </div>
    `)
  })

  html.push('</body>')

  // save
  const path = 'glow-test.html'
  await fs.writeFile(path, html.join('\n'), 'utf-8')
  console.info('wrote', path)
}


await renderPage([
  { title: 'Astro', code: ASTRO, },
  { title: 'C#', code: CSHARP },
  { title: 'C++', code: CPP, lang: 'cpp', },
  { title: 'Clojure Script', code: CLOJURE, lang: 'clojure' },
  { title: 'Crystal', code: CRYSTAL, lang: 'crystal' },
  { title: 'CSS', lang: 'css', code: CSS },
  { title: 'GO', code: GO, lang: 'go', },
  { title: 'Handlebars', code: HB, lang: 'hb' },
  { title: 'Haskell', code: HASKELL, },
  { title: 'HTML', lang: 'html', code: HTML, },
  { title: 'Java', code: JAVA, lang: 'java' },
  { title: 'JavaScript', code: JAVASCRIPT, lang: 'js', },
  { title: 'JSON', code: JSON, lang: 'json', },
  { title: 'JSON5', code: JSON5, lang: 'json5', },
  { title: 'JSX', code: JSX, lang: 'jsx' },
  { title: 'Julia', code: JULIA, lang: 'julia' },
  { title: 'Kotlin', code: KOTLIN, lang: 'java' },
  { title: 'Lua', code: LUA, lang: 'lua' },
  { title: 'Markdown', code: MARKDOWN, lang: 'md', },
  { title: 'MDX', code: MDX, lang: 'mdx', },
  { title: 'Nim', code: NIM, lang: 'nim' },
  { title: 'Nuemark', code: NUEMARK, lang: 'nuemark', },
  { title: 'Perl', code: PERL, lang: 'perl' },
  { title: 'PHP', code: PHP, lang: 'php' },
  { title: 'Python', code: PYTHON, lang: 'python', },
  { title: 'Ruby', code: RUBY, lang: 'ruby' },
  { title: 'Rust', code: RUST, lang: 'rust' },
  { title: 'Shell', code: SHELL, lang: 'sh', },
  { title: 'SQL', code: SQL, class: '_editing-demo' },
  { title: 'Styled component', code: STYLED, lang: 'jsx', },
  { title: 'Svelte', code: SVELTE },
  { title: 'TOML', code: TOML, lang: 'toml', },
  { title: 'TypeScript', code: TS, lang: 'ts', },
  { title: 'ZIG', code: ZIG, lang: 'zig', },
  { title: 'YAML', code: YAML, lang: 'yaml', },

].filter(el => ['md'].includes(el.lang))
  // ]
)
