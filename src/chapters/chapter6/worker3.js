// Tell the main thread that we want to be notified
// when the "input" event is triggered on "input
// elements.
postMessage({
  action: "addEventListener",
  selector: "input[workerDom]",
  event: "input"
});
// Tell the main thread that we want to be notified
// when the "click" event is triggered on "button"
// elements.
postMessage({
  action: "addEventListener",
  selector: "button[workerDom]",
  event: "click"
});
// A DOM event was triggered.
addEventListener("message", e => {
  var data = e.data;
  // Log the event differently, depending on where
  // the event was triggered from.
  if (data.selector === "input[workerDom]") {
    console.log("worker", `typed "${data.value}"`);
  } else if (data.selector === "button[workerDom]") {
    console.log("worker", "clicked");
  }
});
