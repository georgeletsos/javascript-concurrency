// Where we store the ports of connected
// pages so we can broadcast messages.
var ports = [];
// Fetches a resource from the API.
function fetch() {
  var request = new XMLHttpRequest();
  // When the response arrives, we only have
  // to parse the JSON string once, and then
  // broadcast it to any ports.
  request.addEventListener("load", e => {
    var resp = JSON.parse(e.target.responseText);
    for (let port of ports) {
      port.postMessage(resp);
    }
  });
  request.open("get", "https://jsonplaceholder.typicode.com/comments/1");
  request.send();
}
// When a page connects to this worker, we push the
// port to the "ports" array so the worker can keep
// track of it.
addEventListener("connect", e => {
  console.log("hello");
  ports.push(e.source);
  e.source.start();
});
// Now we can "poll" the API, and broadcast the result
// to any pages.
setInterval(fetch, 1000);
