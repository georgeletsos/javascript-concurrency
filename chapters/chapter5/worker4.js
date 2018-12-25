// After 2 seconds, post some data back to
// the main thread using the "postMessage()"
// function.
setTimeout(() => {
  postMessage("hello world");
}, 2000);
