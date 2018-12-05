// Stores the ports of any connected pages.
var ports = [];
addEventListener("connect", e => {
  // The received message data is distributed to any
  // pages connected to this worker. The page code
  // decides how to handle the data.
  e.source.addEventListener("message", e => {
    for (let port of ports) {
      port.postMessage(e.data);
    }
  });
  // Store the port reference for the connected page,
  // and start communications using the "start()"
  // method.
  ports.push(e.source);
  e.source.start();
});
