// Keeps track of how many list items we've rendered
// so far.
var counter = 0;
// Sends a message to the main thread with all the
// necessary DOM manipulation data.
function appendChild(settings) {
  postMessage(settings);
  // We've rendered all our items, we're done.
  if (counter === 3) {
    return;
  }
  // Schedule the next "appendChild()" message.
  setTimeout(() => {
    appendChild({
      action: "appendChild",
      node: "ul[workerDom]",
      type: "li",
      content: `Item ${++counter}`
    });
  }, 1000);
}
// Schedules the first "appendChild()" message. This
// includes the data necessary to simply render the
// DOM in the main thread.
setTimeout(() => {
  appendChild({
    action: "appendChild",
    node: "ul[workerDom]",
    type: "li",
    content: `Item ${++counter}`
  });
}, 1000);
