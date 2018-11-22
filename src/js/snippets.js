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
