// When a message arrives, check if the provided
// data is an array. If not, post a response
// with the "error" property set. Otherwise,
// compute and respond with the result.
addEventListener("message", e => {
  if (!Array.isArray(e.data)) {
    postMessage({
      error: "expecting an array"
    });
  } else {
    postMessage({
      result: e.data[0]
    });
  }
});
