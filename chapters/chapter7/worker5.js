function work(n) {
  var i = 0;
  while (++i < n * n) {}
  return i;
}
addEventListener("message", e => {
  // Get the ports used to send and receive messages.
  var [port1, port2] = e.ports;
  // Listen for incoming messages of the first port.
  port1.addEventListener("message", e => {
    // Respond on the second port with the result of
    // calling "work()".
    port2.postMessage(work(e.data));
  });
  // Starts both ports.
  port1.start();
  port2.start();
});
