var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // Returns the "name" of the given user object,
  // but only if it's "enabled". This means that
  // the function is referentially-transparent if
  // the user passed to it never update the
  // "enabled" property.
  function getName(user) {
    if (user.enabled) {
      return user.name;
    }
  }
  // Toggles the value of the passed-in "user.enabled"
  // property. Functions like these that change the
  // state of objects make referential transparency
  // difficult to achieve.
  function updateUser(user) {
    user.enabled = !user.enabled;
  }
  // Our user object.
  var user = {
    name: "ES6",
    enabled: false
  };
  console.log("name when disabled", `"${getName(user)}"`);
  // → name when disabled "undefined"
  // Mutates the user state. Now passing this object
  // to functions means that they're no longer
  // referentially-transparent, because they could
  // produce different output based on this update.
  updateUser(user);
  console.log("name when enabled", `"${getName(user)}"`);
  // → name when enabled "ES6"
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  function getName(user) {
    if (user.enabled) {
      return user.name;
    }
  }
  var user = {
    name: "ES6",
    enabled: false
  };
  // The referentially-transparent version of "updateUser()",
  // which doesn't actually update anything. It creates a
  // new object with all the same property values as the
  // object that was passed in, except for the "enabled"
  // property value we're changing.
  function updateUserRT(user) {
    return Object.assign({}, user, {
      enabled: !user.enabled
    });
  }
  // This approach doesn't change anything about "user",
  // meaning that any functions that use "user" as input,
  // remain referentially-transparent.
  var updatedUser = updateUserRT(user);
  // We can call referentially-transparent functions at
  // any time, and expect to get the same result. When
  // there's no side-effects on our data, concurrency gets
  // much easier.
  setTimeout(() => {
    console.log("still enabled", `"${getName(user)}"`);
    // → still enabled "ES6"
  }, 1000);
  console.log("updated user", `"${getName(updatedUser)}"`);
  // → updated user "undefined"
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  // This function determines whether or not an
  // operation should be performed in parallel.
  // It takes as arguments - the data to process,
  // and a boolean flag, indicating that the task
  // performed on each item in the data is expensive
  // or not.
  function isConcurrent(data, expensiveTask) {
    var size,
      isSet = data instanceof Set,
      isMap = data instanceof Map;
    // Figures out the size of the data, depending
    // on the type of "data".
    if (Array.isArray(data)) {
      size = data.length;
    } else if (isSet || isMap) {
      size = data.size;
    } else {
      size = Object.keys(data).length;
    }
    // Determine whether or not the size of the
    // data surpasses the parallel processing
    // threshold. The threshold depends on the
    // "expensiveTask" value.
    return size >= (expensiveTask ? 100 : 1000);
  }
  var data = new Array(138);
  console.log("array with expensive task", isConcurrent(data, true));
  // → array with expensive task true
  console.log("array with inexpensive task", isConcurrent(data, false));
  // → array with inexpensive task false
  data = new Set(new Array(100000).fill(null).map((x, i) => i));
  console.log("huge set with inexpensive task", isConcurrent(data, false));
  // → huge set with inexpensive task true
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  // Returns the ideal number of web workers
  // to create.
  function getConcurrency(defaultLevel = 4) {
    // If the "navigator.hardwareConcurrency" property
    // exists, we use that. Otherwise, we return the
    // "defaultLevel" value, which is a sane guess
    // at the actual hardware concurrency level.
    return Number.isInteger(navigator.hardwareConcurrency)
      ? navigator.hardwareConcurrency
      : defaultLevel;
  }
  console.log("concurrency level", getConcurrency());
  // → concurrency level 4
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  // Simple function that returns the sum
  // of the provided arguments.
  function sum(...numbers) {
    return numbers.reduce((result, item) => result + item);
  }
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // Loads the generic task that's executed by
  // this worker.
  importScripts("task.js");
  addEventListener("message", e => {
    // If we get a message for a "sum" task,
    // then we call our "sum()" task, and post
    // the result, along with the operation ID.
    if (e.data.task === "sum") {
      postMessage({
        id: e.data.id,
        value: sum(...e.data.chunk)
      });
    }
  });
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  var results = [];
  function getConcurrency(defaultLevel = 4) {
    return Number.isInteger(navigator.hardwareConcurrency)
      ? navigator.hardwareConcurrency
      : defaultLevel;
  }
  // This generator creates a set of workers that match
  // the concurrency level of the system. Then, as the
  // caller iterates over the generator, the next worker
  // is yielded, until the end is reached, then we start
  // again from the beginning. It's like a round-robin
  // for selecting workers to send messages to.
  function* genWorkers() {
    var concurrency = getConcurrency();
    var workers = new Array(concurrency);
    var index = 0;
    // Creates the workers, storing each in the "workers"
    // array.
    for (let i = 0; i < concurrency; i++) {
      workers[i] = new Worker("worker1.js");
      // When we get a result back from a worker, we
      // place it in the appropriate response, based
      // on ID.
      workers[i].addEventListener("message", e => {
        var result = results[e.data.id];
        result.values.push(e.data.value);
        // If we've received the expected number of
        // responses, we can call the operation
        // callback, passing the responses as arguments.
        // We can also delete the response, since we're
        // done with it now.
        if (result.values.length === result.size) {
          result.done(...result.values);
          delete results[e.data.id];
        }
      });
    }
    // Continue yielding workers as long as they're
    // asked for.
    while (true) {
      yield workers[index] ? workers[index++] : workers[(index = 0)];
    }
  }
  // Creates the global "workers" generator.
  var workers = genWorkers();
  // This will generate unique IDs. We need them to
  // map tasks executed by web workers to the larger
  // operation that created them.
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  // Creates the global "id" generator.
  var id = genID();
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  function isConcurrent(data, expensiveTask) {
    var size,
      isSet = data instanceof Set,
      isMap = data instanceof Map;
    if (Array.isArray(data)) {
      size = data.length;
    } else if (isSet || isMap) {
      size = data.size;
    } else {
      size = Object.keys(data).length;
    }
    return size >= (expensiveTask ? 100 : 1000);
  }
  function getConcurrency(defaultLevel = 4) {
    return Number.isInteger(navigator.hardwareConcurrency)
      ? navigator.hardwareConcurrency
      : defaultLevel;
  }
  var results = [];
  function* genWorkers() {
    var concurrency = getConcurrency();
    var workers = new Array(concurrency);
    var index = 0;
    for (let i = 0; i < concurrency; i++) {
      workers[i] = new Worker("worker1.js");
      workers[i].addEventListener("message", e => {
        var result = results[e.data.id];
        result.values.push(e.data.value);
        if (result.values.length === result.size) {
          result.done(...result.values);
          delete results[e.data.id];
        }
      });
    }
    while (true) {
      yield workers[index] ? workers[index++] : workers[(index = 0)];
    }
  }
  var workers = genWorkers();
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  function sum(...numbers) {
    return numbers.reduce((result, item) => result + item);
  }
  // Builds a function that when called, runs the given task
  // in workers by splitting up the data into chunks.
  function parallel(expensive, taskName, taskFunc, doneFunc) {
    // The function that's returned takes the data to
    // process as an argument, as well as the chunk size,
    // which has a default value.
    return function(data, size = 250) {
      // If the data isn't large enough, and the
      // function isn't expensive, just run it in the
      // main thread.
      if (!isConcurrent(data, expensive)) {
        if (typeof taskFunc === "function") {
          return taskFunc(data);
        } else {
          throw new Error("missing task function");
        }
      } else {
        // A unique identifier for this call. Used
        // when reconciling the worker results.
        var operationID = id.next().value;
        // Used to track the position of the data
        // as we slice it into chunks.
        var index = 0;
        var chunk;
        // The global "results" object gets an
        // object with data about this operation.
        // The "size" property represents the
        // number of results we can expect back.
        // The "done" property is the callback
        // function that all the results are
        // passed to. And "values" holds the
        // results as they come in from the
        // workers.
        results[operationID] = {
          size: 0,
          done: doneFunc,
          values: []
        };

        while (true) {
          // Gets the next worker.
          let worker = workers.next().value;
          // Slice a chunk off the input data.
          chunk = data.slice(index, index + size);
          index += size;
          // If there's a chunk to process, we
          // can increment the size of the
          // expected results and post a
          // message to the worker. If there's
          // no chunk, we're done.
          if (chunk.length) {
            results[operationID].size++;
            worker.postMessage({
              id: operationID,
              task: taskName,
              chunk: chunk
            });
          } else {
            break;
          }
        }
      }
    };
  }
  // Creates an array to process, filled with integers.
  var array = new Array(2000).fill(null).map((v, i) => i);
  // Creates a "sumConcurrent()" function that when called,
  // will process the input data in workers.
  var sumConcurrent = parallel(true, "sum", sum, function(...results) {
    console.log("results", results.reduce((r, v) => r + v));
  });
  sumConcurrent(array);
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  // Counts the number of times "item" appears in
  // "collection".
  function count(collection, item) {
    var index = 0,
      occurrences = 0;
    while (true) {
      // Find the first index.
      index = collection.indexOf(item, index);
      // If we found something, increment the count, and
      // increment the starting index for the next
      // iteration. If nothing is found, break the loop.
      if (index > -1) {
        occurrences += 1;
        index += 1;
      } else {
        break;
      }
    }
    // Returns the number of occurrences found.
    return occurrences;
  }
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  function isConcurrent(data, expensiveTask) {
    var size,
      isSet = data instanceof Set,
      isMap = data instanceof Map;
    if (Array.isArray(data)) {
      size = data.length;
    } else if (isSet || isMap) {
      size = data.size;
    } else {
      size = Object.keys(data).length;
    }
    return size >= (expensiveTask ? 100 : 1000);
  }
  function getConcurrency(defaultLevel = 4) {
    return Number.isInteger(navigator.hardwareConcurrency)
      ? navigator.hardwareConcurrency
      : defaultLevel;
  }
  var results = [];
  function* genWorkers() {
    var concurrency = getConcurrency();
    var workers = new Array(concurrency);
    var index = 0;
    for (let i = 0; i < concurrency; i++) {
      workers[i] = new Worker("worker1.js");
      workers[i].addEventListener("message", e => {
        var result = results[e.data.id];
        result.values.push(e.data.value);
        if (result.values.length === result.size) {
          result.done(...result.values);
          delete results[e.data.id];
        }
      });
    }
    while (true) {
      yield workers[index] ? workers[index++] : workers[(index = 0)];
    }
  }
  var workers = genWorkers();
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  function count(collection, item) {
    var index = 0,
      occurrences = 0;
    while (true) {
      index = collection.indexOf(item, index);
      if (index > -1) {
        occurrences += 1;
        index += 1;
      } else {
        break;
      }
    }
    return occurrences;
  }
  function parallel(expensive, taskName, taskFunc, doneFunc) {
    return function(data, size = 250, item) {
      if (!isConcurrent(data, expensive)) {
        if (typeof taskFunc === "function") {
          return taskFunc(data, item);
        } else {
          throw new Error("missing task function");
        }
      } else {
        var operationID = id.next().value;
        var index = 0;
        var chunk;
        results[operationID] = {
          size: 0,
          done: doneFunc,
          values: []
        };

        while (true) {
          let worker = workers.next().value;
          chunk = data.slice(index, index + size);
          index += size;
          if (chunk.length) {
            results[operationID].size++;
            worker.postMessage({
              id: operationID,
              task: taskName,
              chunk: chunk,
              item: item
            });
          } else {
            break;
          }
        }
      }
    };
  }
  // Unstructured text where we might need to find patterns.
  var string = `Lorem ipsum dolor sit amet, mei zril aperiam sanctus id, duo wisi
    aeque molestiae ex. Utinam pertinacia ne nam, eu sed cibo senserit.
    Te eius timeam docendi quo, vel aeque prompta philosophia id, nec
    ut nibh accusamus vituperata. Id fuisset qualisque cotidieque sed,
    eu verterem recusabo eam, te agam legimus interpretaris nam. Eos
    graeco vivendo et, at vis simul primis.`;
  // Constucts a new function - "stringCount()" using our
  // "parallel()" utility. Logs the number of string
  // occurrances by reducing the worker counts into a result.
  var stringCount = parallel(true, "count", count, function(...results) {
    console.log("string", results.reduce((r, v) => r + v));
  });
  // Kicks off the substring counting operation.
  stringCount(string, 20, "en");
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  function isConcurrent(data, expensiveTask) {
    var size,
      isSet = data instanceof Set,
      isMap = data instanceof Map;
    if (Array.isArray(data)) {
      size = data.length;
    } else if (isSet || isMap) {
      size = data.size;
    } else {
      size = Object.keys(data).length;
    }
    return size >= (expensiveTask ? 100 : 1000);
  }
  function getConcurrency(defaultLevel = 4) {
    return Number.isInteger(navigator.hardwareConcurrency)
      ? navigator.hardwareConcurrency
      : defaultLevel;
  }
  var results = [];
  function* genWorkers() {
    var concurrency = getConcurrency();
    var workers = new Array(concurrency);
    var index = 0;
    for (let i = 0; i < concurrency; i++) {
      workers[i] = new Worker("worker1.js");
      workers[i].addEventListener("message", e => {
        var result = results[e.data.id];
        result.values.push(e.data.value);
        if (result.values.length === result.size) {
          result.done(...result.values);
          delete results[e.data.id];
        }
      });
    }
    while (true) {
      yield workers[index] ? workers[index++] : workers[(index = 0)];
    }
  }
  var workers = genWorkers();
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  function count(collection, item) {
    var index = 0,
      occurrences = 0;
    while (true) {
      index = collection.indexOf(item, index);
      if (index > -1) {
        occurrences += 1;
        index += 1;
      } else {
        break;
      }
    }
    return occurrences;
  }
  function parallel(expensive, taskName, taskFunc, doneFunc) {
    return function(data, size = 250, item) {
      if (!isConcurrent(data, expensive)) {
        if (typeof taskFunc === "function") {
          return taskFunc(data, item);
        } else {
          throw new Error("missing task function");
        }
      } else {
        var operationID = id.next().value;
        var index = 0;
        var chunk;
        results[operationID] = {
          size: 0,
          done: doneFunc,
          values: []
        };

        while (true) {
          let worker = workers.next().value;
          chunk = data.slice(index, index + size);
          index += size;
          if (chunk.length) {
            results[operationID].size++;
            worker.postMessage({
              id: operationID,
              task: taskName,
              chunk: chunk,
              item: item
            });
          } else {
            break;
          }
        }
      }
    };
  }
  // Creates an array of 10,000 integers between 1 and 5.
  var array = new Array(10000).fill(null).map(() => {
    return Math.floor(Math.random() * (5 - 1)) + 1;
  });
  // Creates a parallel function that uses the "count" task,
  // to count the number of occurances in the array.
  var arrayCount = parallel(true, "count", count, function(...results) {
    console.log("array", results.reduce((r, v) => r + v));
  });
  // We're looking for the number 2 - there's probably lots of
  // these.
  arrayCount(array, 1000, 2);
});

/**
 * Snippet 12
 */
// eslint-disable-next-line
snippets.push(function snippet12() {
  // A basic mapping that "plucks" the given
  // "prop" from each item in the array.
  function pluck(array, prop) {
    return array.map(x => x[prop]);
  }
  // Simple function that returns the sum
  // of the provided arguments.
  function sum(...numbers) {
    return numbers.reduce((result, item) => result + item);
  }
});

/**
 * Snippet 13
 */
// eslint-disable-next-line
snippets.push(function snippet13() {
  function isConcurrent(data, expensiveTask) {
    var size,
      isSet = data instanceof Set,
      isMap = data instanceof Map;
    if (Array.isArray(data)) {
      size = data.length;
    } else if (isSet || isMap) {
      size = data.size;
    } else {
      size = Object.keys(data).length;
    }
    return size >= (expensiveTask ? 100 : 1000);
  }
  function getConcurrency(defaultLevel = 4) {
    return Number.isInteger(navigator.hardwareConcurrency)
      ? navigator.hardwareConcurrency
      : defaultLevel;
  }
  var results = [];
  function* genWorkers() {
    var concurrency = getConcurrency();
    var workers = new Array(concurrency);
    var index = 0;
    for (let i = 0; i < concurrency; i++) {
      workers[i] = new Worker("worker1.js");
      workers[i].addEventListener("message", e => {
        var result = results[e.data.id];
        result.values.push(e.data.value);
        if (result.values.length === result.size) {
          result.done(...result.values);
          delete results[e.data.id];
        }
      });
    }
    while (true) {
      yield workers[index] ? workers[index++] : workers[(index = 0)];
    }
  }
  var workers = genWorkers();
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  function pluck(array, prop) {
    return array.map(x => x[prop]);
  }
  function sum(...numbers) {
    return numbers.reduce((result, item) => result + item);
  }
  function parallel(expensive, taskName, taskFunc, doneFunc) {
    return function(data, size = 250) {
      if (!isConcurrent(data, expensive)) {
        if (typeof taskFunc === "function") {
          return taskFunc(data);
        } else {
          throw new Error("missing task function");
        }
      } else {
        var operationID = id.next().value;
        var index = 0;
        var chunk;
        results[operationID] = {
          size: 0,
          done: doneFunc,
          values: []
        };

        while (true) {
          let worker = workers.next().value;
          chunk = data.slice(index, index + size);
          index += size;
          if (chunk.length) {
            results[operationID].size++;
            worker.postMessage({
              id: operationID,
              task: taskName,
              chunk: chunk
            });
          } else {
            break;
          }
        }
      }
    };
  }
  // Creates an array of 75,000 objects.
  var array = new Array(75000).fill(null).map((v, i) => {
    return {
      id: i,
      enabled: true
    };
  });
  // Creates a concurrent version of the "sum()"
  // function.
  var sumConcurrent = parallel(true, "sum", sum, function(...results) {
    console.log("total", sum(...results));
  });
  // parallel() function needs some changes now
  function parallel(expensive, taskName, taskFunc, doneFunc) {
    return function(data, size = 250, prop) {
      if (!isConcurrent(data, expensive)) {
        if (typeof taskFunc === "function") {
          return taskFunc(data, prop);
        } else {
          throw new Error("missing task function");
        }
      } else {
        var operationID = id.next().value;
        var index = 0;
        var chunk;
        results[operationID] = {
          size: 0,
          done: doneFunc,
          values: []
        };

        while (true) {
          let worker = workers.next().value;
          chunk = data.slice(index, index + size);
          index += size;
          if (chunk.length) {
            results[operationID].size++;
            worker.postMessage({
              id: operationID,
              task: taskName,
              chunk: chunk,
              prop: prop
            });
          } else {
            break;
          }
        }
      }
    };
  }
  // Creates a concurrent version of the "pluck()"
  // function. When the parallel jobs complete, we
  // pass the results to "sumConcurrent()".
  var pluckConcurrent = parallel(true, "pluck", pluck, function(...results) {
    sumConcurrent([].concat(...results));
  });
  // Kicks off the concurrent pluck operation.
  pluckConcurrent(array, 1000, "id");
});

/**
 * Snippet 14
 */
// eslint-disable-next-line
snippets.push(function snippet14() {
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
});

/**
 * Snippet 15
 */
// eslint-disable-next-line
snippets.push(function snippet15() {
  // Starts the worker (the bottom-half).
  var worker = new Worker("worker2.js");
  worker.addEventListener("message", e => {
    // If we get a message for the "appendChild" action,
    // then we create the new element and append it to the
    // appropriate parent - all this information is found
    // in the message data. This handler does absolutely
    // nothing but talk to the DOM.
    if (e.data.action === "appendChild") {
      let child = document.createElement(e.data.type);
      child.textContent = e.data.content;
      document.querySelector(e.data.node).appendChild(child);
    }
  });
});

/**
 * Snippet 16
 */
// eslint-disable-next-line
snippets.push(function snippet16() {
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
});

/**
 * Snippet 17
 */
// eslint-disable-next-line
snippets.push(function snippet17() {
  // Starts the worker...
  var worker = new Worker("worker3.js");
  // When we get a message, that means the worker wants
  // to listen to a DOM event, so we have to setup
  // the proxying.
  worker.addEventListener("message", msg => {
    var data = msg.data;
    if (data.action === "addEventListener") {
      // Find the nodes the worker is looking for.
      var nodes = document.querySelectorAll(data.selector);
      // Add a new event handler for the given "event" to
      // each node we just found. When that event is
      // triggered, we simply post a message back to
      // the worker containing relevant event data.
      for (let node of nodes) {
        node.addEventListener(data.event, e => {
          worker.postMessage({
            selector: data.selector,
            value: e.target.value
          });
        });
      }
    }
  });
});
// Run Snippet 17
snippets[snippets.length - 1]();
