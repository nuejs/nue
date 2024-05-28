// docs/main.js
import {$, $$} from "/@nue/page-router.js";
var getHeaders = function() {
  return $$("article > h2, article > h3");
};
var observer = new IntersectionObserver((entries) => {
  entries.forEach((el) => {
    if (el.isIntersecting) {
      $(".toc [aria-selected]")?.removeAttribute("aria-selected");
      $(`.toc [href="#${el.target.id}"]`)?.setAttribute("aria-selected", 1);
    }
  });
}, {
  rootMargin: "-50px"
});
addEventListener("route", function() {
  if (location.pathname.startsWith("/docs")) {
    getHeaders().forEach((el) => observer.observe(el));
    $(".switch input").onchange = function() {
      document.body.classList.toggle("zen", this.checked);
    };
  }
});
