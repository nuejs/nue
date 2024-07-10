
# Settings and metadata


## Document head
The head section is auto-generated based on your [settings](settings.html) and [project structure](project-structure.html).


Let's add two empty files to the project root: `hello.css` and `hello.js`, and a `site.yaml` file with the following data:

``` yaml
favicon: /favicon.png
description: A Nue demo
```

Our head element is now rendered as follows:

```
<head>
  <!-- user data -->
  <title>Hello, World!</title>
  <meta name="description" content="A Nue demo">
  <link rel="icon" type="image/png" href="/favicon.png">

  <!-- scripts and styles -->
  <link rel="stylesheet" href="/hello.css">
  <script src="/hello.js" type="module"></script>

  <!-- system metadata -->
  <meta name="generator" content="Nue">
  <meta name="date.updated" content="...">
  <meta name="viewport" content="...">
  ...
</head>
```
