// home/main.js
import {$$} from "/@nue/page-router.js";
var show = function(el) {
  if (el)
    el.classList.add("in-viewport");
};
var observer = new IntersectionObserver((entries) => {
  entries.forEach((el) => el.isIntersecting && show(el.target));
}, { rootMargin: "-100px" });
addEventListener("route", function() {
  if (location.pathname == "/") {
    $$(".grid").forEach((el) => observer.observe(el));
  }
});
addEventListener("reload", () => $$(".grid").forEach(show));
