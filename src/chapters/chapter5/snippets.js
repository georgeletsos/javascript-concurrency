var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // Loads the worker script, and starts the
  // worker thread.
  var worker = new Worker("worker1.js");
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // Imports the lodash library, making the global "_"
  // variable available in the worker context.
  importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js");
  // We can use the library within the worker now.
  console.log("in worker", _.at([1, 2, 3], 0, 2));
  // → in worker [1, 3]
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  // Launches the worker thread.
  var worker = new Worker("worker2.js");
  // Posts a message to the worker, triggering
  // any "message" event handlers.
  worker.postMessage("hello world");
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  // Setup an event listener for any "message"
  // events dispatched to this worker.
  addEventListener("message", e => {
    // The posted data is accessible through
    // the "data" property of the event.
    console.log(e.type, `"${e.data}"`);
    // → message "hello world"
  });
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  // Simply display the content of any
  // messages received.
  addEventListener("message", e => {
    console.log("message", e.data);
  });
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // Launches the worker.
  var worker = new Worker("worker3.js");
  // Sends a plain object.
  worker.postMessage({ hello: "world" });
  // → message { hello: "world" }
  // Sends an array.
  worker.postMessage([1, 2, 3]);
  // → message [ 1, 2, 3 ]
  // Tries to send a function, results in
  // an error being thrown.
  worker.postMessage(setTimeout);
  // → Uncaught DataCloneError
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  // After 2 seconds, post some data back to
  // the main thread using the "postMessage()"
  // function.
  setTimeout(() => {
    postMessage("hello world");
  }, 2000);
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  // Launches the new worker.
  var worker = new Worker("worker4.js");
  // Adds an event listener for the "message"
  // event. Notice that the "data" property
  // contains the actual message payload, the
  // same way messages sent to workers do.
  worker.addEventListener("message", e => {
    console.log("from worker", `"${e.data}"`);
  });
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  // This is the shared state between the pages that
  // connect to this worker.
  var connections = 0;
  // Listen for pages that connect to this worker, so
  // we can setup the message ports.
  addEventListener("connect", e => {
    // The "source" property represents the
    // message port created by the page that's
    // connecting to this worker. We have to call
    // "start()" to actually establish the connection.
    e.source.start();
    // We post a message back to the page, the payload
    // is the updated number of connections.
    e.source.postMessage(++connections);
  });
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  // Launches the shared worker.
  var worker = new SharedWorker("sharedWorker1.js");
  // Sets up our "message" event handler. By connecting
  // to the shared worker, we're actually causing a
  // a message to be posted to our messaging port.
  worker.port.addEventListener("message", e => {
    console.log("connections made", e.data);
  });
  // Starts the messaging port, indicating that we're
  // ready to start sending and receiving messages.
  worker.port.start();
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  // Where we store the ports of connected
  // pages so we can broadcast messages.
  var ports = [];
  // Fetches a resource from the API.
  function fetch() {
    var request = new XMLHttpRequest();
    // When the response arrives, we only have
    // to parse the JSON string once, and then
    // broadcast it to any ports.
    request.addEventListener("load", e => {
      var resp = JSON.parse(e.target.responseText);
      for (let port of ports) {
        port.postMessage(resp);
      }
    });
    request.open("get", "https://jsonplaceholder.typicode.com/comments/1");
    request.send();
  }
  // When a page connects to this worker, we push the
  // port to the "ports" array so the worker can keep
  // track of it.
  addEventListener("connect", e => {
    ports.push(e.source);
    e.source.start();
  });
  // Now we can "poll" the API, and broadcast the result
  // to any pages.
  setInterval(fetch, 1000);
});

/**
 * Snippet 12
 */
// eslint-disable-next-line
snippets.push(function snippet12() {
  // Launch the worker.
  var worker = new SharedWorker("sharedWorker2.js");
  // Listen to the "message" event, and log
  // any data that's sent back from the worker.
  worker.port.addEventListener("message", e => {
    console.log("from worker", e.data);
  });
  // Inform the shared worker that we're ready
  // to start receiving messages.
  worker.port.start();
});

/**
 * Snippet 13
 */
// eslint-disable-next-line
snippets.push(function snippet13() {
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
});

/**
 * Snippet 14
 */
// eslint-disable-next-line
snippets.push(function snippet14() {
  // Launch the shared worker, and store a reference
  // to the main UI element we're working with.
  var worker = new SharedWorker("sharedWorker3.js");
  var input = document.querySelector("input[sharedWorker3]");
  // Whenever the input value changes, post the input
  // value to the worker for other pages to consume.
  input.addEventListener("input", e => {
    worker.port.postMessage(e.target.value);
  });
  // When we receive input data, update the value of our
  // text input. That is, unless the value is already
  // updated.
  worker.port.addEventListener("message", e => {
    if (e.data !== input.value) {
      input.value = e.data;
    }
  });
  // Starts worker communications.
  worker.port.start();
});
// Run Snippet 14
snippets[snippets.length - 1]();

/**
 * Snippet 15
 */
// eslint-disable-next-line
snippets.push(function snippet15() {
  // Listens for incoming messages.
  addEventListener("message", e => {
    // Posts a result back to the worker.
    // We call "indexOf()" on the input
    // array, looking for the "search" data.
    postMessage({
      result: e.data.array.indexOf(e.data.search) > -1
    });
  });
});

/**
 * Snippet 16
 */
// eslint-disable-next-line
snippets.push(function snippet16() {
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
        // If the result is "truthy", we can post
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
});

/**
 * Snippet 17
 */
// eslint-disable-next-line
snippets.push(function snippet17() {
  // Launches the worker...
  var worker = new Worker("worker5.js");
  // Generates some input data, an array
  // of numbers for 0 - 1041.
  var input = new Array(1041).fill(true).map((v, i) => i);
  // When the worker responds, display the
  // results of our search.
  worker.addEventListener("message", e => {
    console.log(`${e.data.search} exists?`, e.data.result);
  });
  // Search for an item that exists.
  worker.postMessage({
    array: input,
    search: 449
  });
  // → 449 exists? true
  // Search for an item that doesn't exist.
  worker.postMessage({
    array: input,
    search: 1045
  });
  // → 1045 exists? false
});

/**
 * Snippet 18
 */
// eslint-disable-next-line
snippets.push(function snippet18() {
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
});

/**
 * Snippet 19
 */
// eslint-disable-next-line
snippets.push(function snippet19() {
  // Launches the worker.
  var worker = new Worker("worker6.js");
  // Listens for messages coming from the worker.
  // If we get back an error, we log the error
  // message. Otherwise, we log the successful result.
  worker.addEventListener("message", e => {
    if (e.data.error) {
      console.error(e.data.error);
    } else {
      console.log("result", e.data.result);
    }
  });
  worker.postMessage([3, 2, 1]);
  // → result 3
  worker.postMessage({});
  // → expecting an array
});

/**
 * Snippet 20
 */
// eslint-disable-next-line
snippets.push(function snippet20() {
  // When a message arrives, post a response
  // that contains the "name" property of
  // the input data. But what if the
  // input "data" property isn't defined?
  addEventListener("message", e => {
    postMessage(e.data.name);
  });
});

/**
 * Snippet 21
 */
// eslint-disable-next-line
snippets.push(function snippet21() {
  // Launches our worker.
  var worker = new Worker("worker7.js");
  // Listen to messages sent back from the worker,
  // and log the result.
  worker.addEventListener("message", e => {
    console.log("result", `"${e.data}"`);
  });
  // Listen to errors sent back from the worker,
  // and log the error message.
  worker.addEventListener("error", e => {
    console.error(e.message);
  });
  worker.postMessage(null);
  // → Uncaught TypeError: Cannot read property 'name' of null
  worker.postMessage({ name: "JavaScript" });
  // → result "JavaScript"
});
