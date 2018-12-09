var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // An asynchronous "fetch" function. We use "setTimeout()"
  // to pass "callback()" some data after 1 second.
  function fetchAsync(callback) {
    setTimeout(() => {
      callback({ hello: "world" });
    }, 1000);
  }
  // The synchronous fetch simply returns the data.
  function fetchSync() {
    return { hello: "world" };
  }
  // A promise for the "fetchAsync()" call. We pass the
  // "resolve" function as the callback.
  var asyncPromise = new Promise((resolve, reject) => {
    fetchAsync(resolve);
  });
  // A promise for the "fetchSync()" call. This promise
  // is resolved immediately with the return value.
  var syncPromise = new Promise((resolve, reject) => {
    resolve(fetchSync());
  });
  // Creates a promise that'll wait for two promises
  // to complete before resolving. This allows us
  // to seamlessly mix synchronous and asynchronous
  // values.
  Promise.all([asyncPromise, syncPromise]).then(results => {
    var [asyncResult, syncResult] = results;
    console.log("async", asyncResult);
    // → async { hello: 'world' }
    console.log("sync", syncResult);
    // → sync { hello: 'world' }
  });
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // When we receive a message, we post a message with the
  // id, and the result of performing "work()" on "number".
  addEventListener("message", e => {
    postMessage({
      id: e.data.id,
      result: work(e.data.number)
    });
  });
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
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
  // This object holds the resolver functions from promises,
  // as results come back from workers, we look them up here,
  // based on ID.
  var resolvers = {};
  // Starts our worker...
  var worker = new Worker("worker1.js");
  worker.addEventListener("message", e => {
    // Finds the appropriate resolver function.
    var resolver = resolvers[e.data.id];
    // Deletes it from the "resolvers" object.
    delete resolvers[e.data.id];
    // Pass the worker data to the promise by calling
    // the resolver function.
    resolver(e.data.result);
  });
  // This is our helper function. It handles the posting of
  // messages to the worker, and tying the promise to the
  // worker responses.
  function square(number) {
    return new Promise((resolve, reject) => {
      // The ID that's used to tie together a web
      // worker response, and a resolver function.
      var msgId = id.next().value;
      // Stores the resolver so in can be used later, in
      // the web worker message callback.
      resolvers[msgId] = resolve;
      // Posts the message - the ID and the number
      // argument.
      worker.postMessage({
        id: msgId,
        number: number
      });
    });
  }
  square(10).then(result => {
    console.log("square(10)", result);
    // → square(10) 100
  });
  square(100).then(result => {
    console.log("square(100)", result);
    // → square(100) 10000
  });
  square(1000).then(result => {
    console.log("square(1000)", result);
    // → square(1000) 1000000
  });
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
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
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  // This object holds the resolver functions from promises,
  // as results comeback from workers, we look them up here,
  // based on ID.
  var resolvers = {};
  // Keep the original implementation of "postMessage()"
  // so we can call it later on, in our custom "postMessage()"
  // implementation.
  var postMessage = Worker.prototype.postMessage;
  // Replace "postMessage()" with our custom implementation.
  Worker.prototype.postMessage = function(data) {
    return new Promise((resolve, reject) => {
      // The ID that's used to tie together a web worker
      // response, and a resolver function.
      var msgId = id.next().value;

      // Stores the resolver so in can be used later, in
      // the web worker message callback.
      resolvers[msgId] = resolve;
      // Run the original "Worker.postMessage()"
      // implementation, which takes care of actually
      // posting the message to the worker thread.
      postMessage.call(
        this,
        Object.assign(
          {
            id: msgId
          },
          data
        )
      );
    });
  };
  // Starts our worker...
  var worker = new Worker("worker2.js");
  worker.addEventListener("message", e => {
    // Finds the appropriate resolver function.
    var resolver = resolvers[e.data.id];
    // Deletes it from the "resolvers" object.
    delete resolvers[e.data.id];
    // Pass the worker data to the promise by calling
    // the resolver function.
    resolver(e.data.value);
  });
  worker
    .postMessage({
      action: "echo",
      value: "Hello World"
    })
    .then(value => {
      console.log("echo", `"${value}"`);
      // → echo "Hello World"
    });
  worker
    .postMessage({
      action: "upper",
      value: "Hello World"
    })
    .then(value => {
      console.log("upper", `"${value}"`);
      // → upper "HELLO WORLD"
    });
  worker
    .postMessage({
      action: "lower",
      value: "Hello World"
    })
    .then(value => {
      console.log("lower", `"${value}"`);
      // → lower "hello world"
    });
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // Returns a map of the input array, by squaring
  // each number in the array.
  addEventListener("message", e => {
    postMessage({
      id: e.data.id,
      value: e.data.value.map(v => v * v)
    });
  });
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  var resolvers = {};
  var postMessage = Worker.prototype.postMessage;
  Worker.prototype.postMessage = function(data) {
    return new Promise((resolve, reject) => {
      var msgId = id.next().value;
      resolvers[msgId] = resolve;
      postMessage.call(
        this,
        Object.assign(
          {
            id: msgId
          },
          data
        )
      );
    });
  };
  function onMessage(e) {
    // Finds the appropriate resolver function.
    var resolver = resolvers[e.data.id];
    // Deletes it from the "resolvers" object.
    delete resolvers[e.data.id];
    // Pass the worker data to the promise by calling
    // the resolver function.
    resolver(e.data.value);
  }
  // Starts our workers...
  var worker1 = new Worker("worker3.js"),
    worker2 = new Worker("worker3.js");
  // Create some data to process.
  var array = new Array(50000).fill(null).map((v, i) => i);
  // Finds the appropriate resolver function to call,
  // when the worker responds with data.
  worker1.addEventListener("message", onMessage);
  worker2.addEventListener("message", onMessage);
  // Splits our input data in 2, giving the first half
  // to the first worker, and the second half to the
  // second worker. At this point, we have two promises.
  var promise1 = worker1.postMessage({
    value: array.slice(0, Math.floor(array.length / 2))
  });
  var promise2 = worker2.postMessage({
    value: array.slice(Math.floor(array.length / 2))
  });
  // Using "Promise.all()" to synchronize workers is
  // much easier than manually trying to reconcile
  // through worker callback functions.
  Promise.all([promise1, promise2]).then(values => {
    console.log("reduced", [].concat(...values).reduce((r, v) => r + v));
    // → reduced 41665416675000
  });
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // Post the result of calling "work()" back to the
  // main thread.
  addEventListener("message", e => {
    postMessage(work(e.data));
  });
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  function coroutine(func) {
    var gen = func();
    gen.next();
    return function(val) {
      gen.next(val);
    };
  }
  // Creates an "update()" coroutine that continuously
  // updates the UI as results are generated from the
  // worker.
  var update = coroutine(function*() {
    var input;
    while (true) {
      input = yield;
      console.log("result", input.data);
    }
  });
  // Creates the worker, and assigns the "update()"
  // coroutine as the "message" callback handler.
  var worker = new Worker("worker4.js");
  worker.addEventListener("message", update);
  // An array of progressively larger numbers.
  var array = new Array(10).fill(null).map((v, i) => i * 10000);
  // Iterate over the array, passing each number to the
  // worker as an individual message.
  for (let item of array) {
    worker.postMessage(item);
  }
  // →
  // result 1
  // result 100000000
  // result 400000000
  // result 900000000
  // result 1600000000
  // result 2500000000
  // result 3600000000
  // result 4900000000
  // result 6400000000
  // result 8100000000
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  addEventListener("message", e => {
    // Get the ports used to send and receive messages.
    var [port1, port2] = e.ports;
    // Listen for incoming messages of the first port.
    port1.addEventListener("message", e => {
      // Respond on the second port with the result of
      // calling "work()".
      port2.postMessage(work(e.data));
    });
    // Starts both ports.
    port1.start();
    port2.start();
  });
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  function coroutine(func) {
    var gen = func();
    gen.next();
    return function(val) {
      gen.next(val);
    };
  }
  // Starts our workers...
  var worker1 = new Worker("worker5.js");
  var worker2 = new Worker("worker5.js");
  // Creates the message channels necessary to communicate
  // between the 2 workers.
  var channel1 = new MessageChannel();
  var channel2 = new MessageChannel();
  var channel3 = new MessageChannel();
  // Our "update()" coroutine logs worker responses as they're
  // delivered.
  var update = coroutine(function*() {
    var input;
    while (true) {
      input = yield;
      console.log("result", input.data);
    }
  });
  // Connects "channel1" and "channel2" using "worker1".
  worker1.postMessage(null, [channel1.port2, channel2.port1]);
  // Connects "channel2" and "channel3" using "worker2".
  worker2.postMessage(null, [channel2.port2, channel3.port1]);
  // Connects our coroutine "update()" to any messages
  // received on "channel3".
  channel3.port2.addEventListener("message", update);
  channel3.port2.start();
  // Our input data - an array of numbers.
  var array = new Array(25).fill(null).map((v, i) => i * 10);
  // Posts each array item to "channel1".
  for (let item of array) {
    channel1.port1.postMessage(item);
  }
});

/**
 * Snippet 12
 */
// eslint-disable-next-line
snippets.push(function snippet12() {
  // An input array of numbers.
  var array = new Array(2500).fill(null).map((v, i) => i);
  // Creates a new parallel job. No workers have been
  // created at this point - we only pass the constructor
  // the data we're working with.
  var job = new Parallel(array);
  // Start a timer for our "spawn()" job.
  console.time(`${array.length} items`);
  // Creates a new web worker, passing it our data and
  // this function. We're slowly mapping each number in
  // the array to it's square.
  job
    .spawn(coll => {
      return coll.map(n => {
        var i = 0;
        while (++i < n * n) {}
        return i;
      });
      // The return value of "spawn()" is a thenable. Meaning
      // we can assign a "then()" callback function, just as
      // though a promise were returned.
    })
    .then(results => {
      console.timeEnd(`${array.length} items`);
      // → 2500 items: 3408.078ms
    });
});

/**
 * Snippet 13
 */
// eslint-disable-next-line
snippets.push(function snippet13() {
  // An input array of numbers.
  var array = new Array(2500).fill(null).map((v, i) => i);
  // Creates a new parallel job. No workers have been
  // created at this point - we only pass the constructor
  // the data we're working with.
  var job1 = new Parallel(array);
  // Start a timer for our "spawn()" job.
  console.time("job1");
  // The problem here is that Parallel.js will
  // create a new worker for every array element, resulting
  // in parallel slowdown.
  job1
    .map(n => {
      var i = 0;
      while (++i < n * n) {}
      return i;
    })
    .reduce(pair => {
      // Reduces the array items to a sum.
      return pair[0] + pair[1];
    })
    .then(data => {
      console.log("job1 reduced", data);
      // → job1 reduced 5205208751
      console.timeEnd("job1");
      // → job1: 59443.863ms
    });
});

/**
 * Snippet 14
 */
// eslint-disable-next-line
snippets.push(function snippet14() {
  var array = new Array(2500).fill(null).map((v, i) => i);
  // A faster implementation.
  var job2 = new Parallel(array);

  console.time("job2");
  // Before mapping the array, split the array into chunks
  // of smaller arrays. This way, each Parallel.js worker is
  // processing an array instead of an array item. This avoids
  // sending thousands of web worker messages.
  job2
    .spawn(data => {
      var index = 0,
        size = 1000,
        results = [];
      while (true) {
        let chunk = data.slice(index, index + size);
        if (chunk.length) {
          results.push(chunk);
          index += size;
        } else {
          return results;
        }
      }
    })
    .map(array => {
      // Returns a mapping of the array chunk.
      return array.map(n => {
        var i = 0;
        while (++i < n * n) {}
        return i;
      });
    })
    .reduce(pair => {
      // Reduces array chunks, or numbers, to a sum.
      return (
        (Array.isArray(pair[0]) ? pair[0].reduce((r, v) => r + v) : pair[0]) +
        (Array.isArray(pair[1]) ? pair[1].reduce((r, v) => r + v) : pair[1])
      );
    })
    .then(data => {
      console.log("job2 reduced", data);
      // → job2 reduced 5205208751
      console.timeEnd("job2");
      // → job2: 2723.661ms
    });
});

/**
 * Snippet 15
 */
// eslint-disable-next-line
snippets.push(function snippet15() {
  // Represents a "pool" of web worker threads, hidden behind
  // the interface of a single web worker interface.
  function WorkerPool(script) {
    // The level of concurrency, or, the number of web
    // workers to create. This uses the
    // "hardwareConcurrency" property if it exists.
    // Otherwise, it defaults to 4, since this is
    // a reasonable guess at the most common CPU topology.
    var concurrency = navigator.hardwareConcurrency || 4;
    // The worker instances themselves are stored in a Map,
    // as keys. We'll see why in a moment.
    var workers = (this.workers = new Map());
    // The queue exists for messages that are posted while,
    // all workers are busy. So this may never actually be
    // used.
    var queue = (this.queue = []);
    // Used below for creating the worker instances, and
    // adding event listeners.
    var worker;
    for (var i = 0; i < concurrency; i++) {
      worker = new Worker(script);
      worker.addEventListener(
        "message",
        function(e) {
          // We use the "get()" method to lookup the
          // "resolve()" function of the promise. The
          // worker is the key. We call the resolver with
          // the data returned from the worker, and
          // can now reset this to null. This is important
          // because it signifies that the worker is free
          // to take on more work.
          workers.get(this)(e.data);
          workers.set(this, null);
          // If there's queued data, we get the first
          // "data" and "resolver" from the queue. Before
          // we call "postMessage()" with the data, we
          // update the "workers" map with the new
          // "resolve()" function.
          if (queue.length) {
            var [data, resolver] = queue.shift();
            workers.set(this, resolver);
            this.postMessage(data);
          }
        }.bind(worker)
      );
      // This is the initial setting of the worker, as a
      // key, in the "workers" map. It's value is null,
      // meaning there's no resolve function, and it can
      // take on work.
      this.workers.set(worker, null);
    }
  }
});

/**
 * Snippet 16
 */
// eslint-disable-next-line
snippets.push(function snippet16() {
  WorkerPool.prototype.getWorker = function() {
    for (let worker of this.workers) {
      let resolver = worker[1];
      if (resolver == null) {
        return worker[0];
      }
    }
  };
  WorkerPool.prototype.postMessage = function(data) {
    // The "workers" Map instance, where all the web workers
    // are stored.
    var workers = this.workers;
    // The "queue" where messages are placed when all the
    // workers are busy.
    var queue = this.queue;
    // Try finding an available worker.
    var worker = this.getWorker();
    // The promise is immediately passed back to the caller,
    // even if there's no worker available.
    return new Promise(function(resolve) {
      // If a worker is found, we can update the map,
      // using the worker as the key, and the "resolve()"
      // function as the value. If there's no worker, then
      // the message data, along with the "resolve()"
      // function get pushed to the "queue".
      if (worker) {
        workers.set(worker, resolve);
        worker.postMessage(data);
      } else {
        queue.push([data, resolve]);
      }
    });
  };
});

/**
 * Snippet 17
 */
// eslint-disable-next-line
snippets.push(function snippet17() {
  function WorkerPool(script) {
    var concurrency = navigator.hardwareConcurrency || 4;
    var workers = (this.workers = new Map());
    var queue = (this.queue = []);
    var worker;
    for (var i = 0; i < concurrency; i++) {
      worker = new Worker(script);
      worker.addEventListener(
        "message",
        function(e) {
          workers.get(this)(e.data);
          workers.set(this, null);
          if (queue.length) {
            var [data, resolver] = queue.shift();
            workers.set(this, resolver);
            this.postMessage(data);
          }
        }.bind(worker)
      );
      this.workers.set(worker, null);
    }
  }
  WorkerPool.prototype.getWorker = function() {
    for (let worker of this.workers) {
      let resolver = worker[1];
      if (resolver == null) {
        return worker[0];
      }
    }
  };
  WorkerPool.prototype.postMessage = function(data) {
    var workers = this.workers;
    var queue = this.queue;
    var worker = this.getWorker();
    return new Promise(function(resolve) {
      if (worker) {
        workers.set(worker, resolve);
        worker.postMessage(data);
      } else {
        queue.push([data, resolve]);
      }
    });
  };
  // Create a new pool, and a workload counter.
  var pool = new WorkerPool("worker4.js");
  var workload = 0;
  document.querySelector("button[work]").addEventListener("click", function(e) {
    // Get the data we're going to pass to the
    // worker, and create a timer for this workload.
    var amount = +document.querySelector("input[amount]").value,
      timer = "Workload " + ++workload;
    console.time(timer);
    // Pass the message to the pool, and when the promise
    // resolves, stop the timer.
    pool.postMessage(amount).then(function(result) {
      console.timeEnd(timer);
    });
    // If messages are getting queued, our pool is
    // overworked display a warning.
    if (pool.queue.length) {
      console.warn("Worker pool is getting busy...");
    }
  });
});
// Run Snippet 17
snippets[snippets.length - 1]();
