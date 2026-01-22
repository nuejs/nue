
/*

  // page argument example
  {
    dir: "",
    base: "index.md",
    ext: ".md",
    name: "index",
    slug: "",
    url: "/",
    site: "acme",
    filepath: "sites/acme/index.md",
    folder: "sites",
    path: "index.md",
    mtime: 2025-10-31T07:06:58.153Z,
    text: [AsyncFunction: text],
    parse: [AsyncFunction: parse],
  }

  // data argument example
  {
    is_prod: false,
    og: "/acme-og.png",
    title: "Hello Acme",
    desc: "Acme desc",
    description: "Descriptionzon",
    dir: "",
    slug: "",
    url: "/",
  }

*/

export default async function(page, data) {
  return {
    processed: 'processed'
  }
}