// browser/app-router.js
import {onclick, loadPage, setActive} from "./page-router.js";
async function fire(path) {
  for (const { pattern, fn } of fns) {
    const data = match(pattern, path);
    if (data)
      await fn(data);
  }
  setActive(path);
}
function match(pattern, path, is_global) {
  const keys = pattern.split("/").slice(1);
  const vals = path.split("/").slice(1);
  if (!is_global && keys.length != vals.length)
    return null;
  let is_valid = true;
  const data = {};
  keys.forEach((key, i) => {
    const val = vals[i];
    if (key[0] == ":") {
      if (val)
        data[key.slice(1)] = 1 * val || val;
    } else if (!is_global && key != val)
      is_valid = false;
  });
  return is_valid ? data : null;
}
var is_browser = typeof window == "object";
var fns = [];
is_browser && addEventListener("before:route", () => {
  fns.splice(0, fns.length);
});
var router = {
  on(pattern, fn) {
    fns.push({ pattern, fn });
  },
  start({ path, root }) {
    if (root)
      onclick(root, this.route);
    this.pattern = path;
    fire(location.pathname);
  },
  route(path) {
    scrollTo(0, 0);
    const is_page = path.endsWith(".html");
    history.pushState({ path, is_spa: !is_page }, 0, path);
    is_page ? loadPage(path) : fire(path);
  },
  set(key, val) {
    const args = new URLSearchParams(location.search);
    args.set(key, val);
    history.replaceState(router.data, 0, `?${args}`);
  },
  get data() {
    const { pattern } = this;
    const path_data = pattern ? match(pattern, location.pathname, true) : {};
    const args = Object.fromEntries(new URLSearchParams(location.search));
    return { ...path_data, ...args };
  }
};
export {
  router,
  match
};
