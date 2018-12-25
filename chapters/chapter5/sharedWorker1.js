// This is the shared state between the pages that
// connect to this worker.
var connections = 0;
// Listen for pages that connect to this worker, so
// we can setup the message ports.
addEventListener("connect", e => {
  // The "source" property represents the
  // message port created by the page that's
  // connecting to this worker. We have to call
  // "start()" to actually establish the connection.
  e.source.start();
  // We post a message back to the page, the payload
  // is the updated number of connections.
  e.source.postMessage(++connections);
});
