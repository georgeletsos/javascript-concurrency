/*
 * Sidebar
 */
var sidebar = document.querySelector(".sidebar-main");
var sidebarHamburger = document.querySelector(".sidebar-mobile .hamburger");
sidebarHamburger.addEventListener("click", function() {
  sidebar.classList.toggle("show");
  sidebarHamburger.classList.toggle("is-active");
});

var tableOfContentsUl = document.querySelectorAll(
  ".sidebar ul.table-of-contents ul"
);
for (var li of tableOfContentsUl) {
  li.addEventListener("click", function() {
    sidebar.classList.remove("show");
    sidebarHamburger.classList.remove("is-active");
  });
}

/*
 * Snippets
 */
var snippets = []; // eslint-disable-line

/*
 * Principles - Tippy.js
 */
tippy.setDefaults({ // eslint-disable-line
  arrow: true
});

var principles = {
  parallelize:
    "The parallelize principle means taking advantage of modern CPU capabilities to compute results in less time. This is now possible in any modern browser or NodeJS environment. In the browser, we can achieve true parallelism using web workers. In Node, we can achieve true parallelism by spawning new processes.",
  synchronize:
    "The synchronize principle is about the mechanisms used to coordinate concurrent actions and the abstractions of those mechanisms. Callback functions are the obvious tool of choice when we need to run some code, but we don't want to run it now.",
  conserve:
    "The conserve principle is about saving on compute and memory resources. This is done by using lazy evaluation techniques. The name lazy stems from the idea that we don't actually compute a new value until we're sure we actually need it. "
};

tippy("[data-principle='parallelize']", { content: principles.parallelize }); // eslint-disable-line
tippy("[data-principle='synchronize']", { content: principles.synchronize }); // eslint-disable-line
tippy("[data-principle='conserve']", { content: principles.conserve }); // eslint-disable-line
