addEventListener("message", e => {
  // The result we're posting back to the main
  // thread - it should always contain the
  // message ID.
  var result = { id: e.data.id };
  // Based on the "action", compute the response
  // "value". The options are: leave the text alone,
  // convert it to upper case, or convert it to
  // lower case.
  if (e.data.action === "echo") {
    result.value = e.data.value;
  } else if (e.data.action === "upper") {
    result.value = e.data.value.toUpperCase();
  } else if (e.data.action === "lower") {
    result.value = e.data.value.toLowerCase();
  }
  // Simulate a longer-running worker by waiting
  // 1 second before posting the response back.
  setTimeout(() => {
    postMessage(result);
  }, 1000);
});
