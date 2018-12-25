// Listens for incoming messages.
addEventListener("message", e => {
  // Posts a result back to the worker.
  // We call "indexOf()" on the input
  // array, looking for the "search" data.
  postMessage({
    result: e.data.array.indexOf(e.data.search) > -1
  });
});
