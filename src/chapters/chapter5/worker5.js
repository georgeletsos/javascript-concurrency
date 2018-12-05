addEventListener("message", e => {
  // The array that we're going to divide into
  // 4 smaller chunks.
  var array = e.data.array;
  // Computes the size, roughly, of a quarter
  // of the array - this is our chunk size.
  var size = Math.floor(0.25 * array.length);
  // The search data we're looking for.
  var search = e.data.search;
  // Used to divide the array into chunks in
  // the "while" loop below.
  var index = 0;
  // Where our chunks go, once they've been sliced.
  var chunks = [];
  // We need to store references to our sub-workers,
  // so we can terminate them.
  var workers = [];
  // This is for counting the number of results
  // returned from sub-workers.
  var results = 0;
  // Splits the array into proportionally-sized chunks.
  while (index < array.length) {
    chunks.push(array.slice(index, index + size));
    index += size;
  }
  // If there's anything left over (a 5th chunk),
  // throw it into the chunk before it.
  if (chunks.length > 4) {
    chunks[3] = chunks[3].concat(chunks[4]);
    chunks = chunks.slice(0, 4);
  }
  for (let chunk of chunks) {
    // Launches our sub-worker and stores a
    // reference to it in "workers".
    let worker = new Worker("subWorker.js");
    workers.push(worker);
    // The sub-worker has a result.
    worker.addEventListener("message", e => {
      results++;
      // The the result is "truthy", we can post
      // a response back to the main thread.
      // Otherwise, we check if all the
      // responses are back yet. If so, we can
      // post a false value back. Either way, we
      // terminate all sub-workers.
      if (e.data.result) {
        postMessage({
          search: search,
          result: true
        });
        workers.forEach(x => x.terminate());
      } else if (results === 4) {
        postMessage({
          search: search,
          result: false
        });
        workers.forEach(x => x.terminate());
      }
    });
    // Give the worker a chunk of array to search.
    worker.postMessage({
      array: chunk,
      search: search
    });
  }
});
