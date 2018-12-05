// Setup an event listener for any "message"
// events dispatched to this worker.
addEventListener("message", e => {
  // The posted data is accessible through
  // the "data" property of the event.
  console.log(e.type, `"${e.data}"`);
  // → message "hello world"
});
