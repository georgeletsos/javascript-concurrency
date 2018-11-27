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
    "The parallelize principle means taking advantage of modern CPU capabilities to compute results in less time. This is now possible in any modern browser, by using web workers, or NodeJS environment, by spawning new processes. The real benefit is that we can compute using larger data sets as input, and have a smaller opportunity of an unresponsive user experience due to long-running JavaScript.",
  synchronize:
    "The synchronize principle is about the mechanisms used to coordinate concurrent actions and the abstractions of those mechanisms. Callback functions is the obvious tool of choice when we need to run some code, but we don't want to run it now. Keep in mind that callbacks fall apart when there are plenty them, and lots of dependencies between them.",
  conserve:
    "The conserve principle is about saving on compute and memory resources. This is done by using lazy evaluation techniques, meaning we don't actually compute a new value until we're sure we actually need it. ",
  executionEnvironment:
    "This container gets created whenever a new web page is opened. It's the all-encompassing environment, which has everything that our JavaScript code will interact with. It also serves as a sandbox—our JavaScript code can't reach outside of this environment.",
  javascriptInterpreter:
    "This is the component that's responsible for parsing and executing our JavaScript source code. It's the browser's job to augment the interpreter with globals, such as window, and XMLHttpRequest.",
  taskQueue:
    "Tasks are queued whenever something needs to happen. An execution environment has at least one of these queues, but typically, it has several of them.",
  eventLoop:
    "An execution environment has a single event loop that's responsible for servicing all task queues. There's only one event loop, because there's only one thread."
};

Object.keys(terms).forEach(function(name) {
  var term = terms[name];
  tippy("[data-term='" + name +"']", { content: term }); // eslint-disable-line
});

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
  if (!snippetElement) {
    return;
  }

  // Find child code-block of snippet Element
  var codeBlock = snippetElement.querySelector(".code-block");
  // Set code-block content to clean snippet
  codeBlock.textContent = cleanSnippetToString;
  // Run highlight.js on code-block
  hljs.highlightBlock(codeBlock); // eslint-disable-line

  // Find child run-code button of snippet Element
  var runCodeButton = snippetElement.querySelector(".run-code-button");
  if (!runCodeButton) {
    return;
  }

  // (If it exists) Add EventHandler to run the code-block on click
  runCodeButton.addEventListener("click", function() {
    snippet();
  });
});
