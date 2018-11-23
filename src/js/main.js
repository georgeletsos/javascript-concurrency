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
 * Terms - Tippy.js
 */
tippy.setDefaults({ // eslint-disable-line
  arrow: true
});

var terms = {
  parallelize:
    "The parallelize principle means taking advantage of modern CPU capabilities to compute results in less time. This is now possible in any modern browser or NodeJS environment. In the browser, we can achieve true parallelism using web workers. In Node, we can achieve true parallelism by spawning new processes.",
  synchronize:
    "The synchronize principle is about the mechanisms used to coordinate concurrent actions and the abstractions of those mechanisms. Callback functions are the obvious tool of choice when we need to run some code, but we don't want to run it now.",
  conserve:
    "The conserve principle is about saving on compute and memory resources. This is done by using lazy evaluation techniques. The name lazy stems from the idea that we don't actually compute a new value until we're sure we actually need it. "
};

tippy("[data-term='parallelize']", { content: terms.parallelize }); // eslint-disable-line
tippy("[data-term='synchronize']", { content: terms.synchronize }); // eslint-disable-line
tippy("[data-term='conserve']", { content: terms.conserve }); // eslint-disable-line

/*
 * Snippets
 */
snippets.forEach(function(snippet) { // eslint-disable-line
  // Clean "snippet toString" from the unnecessary first and last lines
  var snippetToString = snippet.toString();
  var cleanSnippetToString = snippetToString.slice(
    snippetToString.indexOf("{") + 3,
    snippetToString.lastIndexOf("}")
  );

  // Find parent snippet Element
  var snippetClass = snippet.name;
  var snippetElement = document.querySelector("." + snippetClass);

  // Find child code-block of snippet Element
  var codeBlock = snippetElement.querySelector(".code-block");
  // Set code-block content to clean snippet
  codeBlock.textContent = cleanSnippetToString;
  // Run highlight.js on code-block
  hljs.highlightBlock(codeBlock); // eslint-disable-line

  // Find child run-code button of snippet Element
  var runCodeButton = snippetElement.querySelector(".run-code-button");
  if (runCodeButton) {
    // (If it exists) Add EventHandler to run the code-block on click
    runCodeButton.addEventListener("click", function() {
      snippet();
    });
  }
});
