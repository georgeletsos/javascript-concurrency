var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  var collection = ["a", "b", "c", "d"];
  var results = [];
  for (let item of collection) {
    results.push(String.fromCharCode(item.charCodeAt(0)));
  }

  console.log(results);
  // [ 'a', 'b', 'c', 'd' ]
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  var request = fetch("/foo");
  request.addEventListener(response => {
    // Do something with "response" now that it has arrived.
  });
  // Don't wait with the response, update the DOM immediately.
  updateUI();
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  var worker = new Worker("worker.js");
  var myElement = document.getElementById("myElement");
  worker.addEventListener("message", e => {
    myElement.textContent = "Done working!";
  });
  myElement.addEventListener("click", e => {
    worker.postMessage("work");
  });
});
