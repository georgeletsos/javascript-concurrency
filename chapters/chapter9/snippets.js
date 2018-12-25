var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  co(function*() {
    // TODO: coroutine amazeballs.
  });
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // This is the ES7 syntax, where the function is
  // marked as "async". Then, the "await" calls
  // pause execution till their operands resolve.
  (async function() {
    var result;
    result = await Promise.resolve("hello");
    console.log("async result", `"${result}"`);
    // → async result "hello"
    result = await Promise.resolve("world");
    console.log("async result", `"${result}"`);
    // → async result "world"
  })();
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  // The differences between the ES7 and "co()" are
  // subtle, the overall structure is the same. The
  // function is a generator, and we pause execution
  // by yielding generators.
  co(function*() {
    var result;
    result = yield Promise.resolve("hello");
    console.log("co result", `"${result}"`);
    // → co result "hello"
    result = yield Promise.resolve("world");
    console.log("co result", `"${result}"`);
    // → co result "world"
  });
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  co(function*() {
    // The promise that's yielded here isn't resolved
    // till 1 second later. That's when the yield statement
    // returns the resolved value.
    var first = yield new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(["First1", "First2", "First3"]);
      }, 1000);
    });
    // Same idea here, except we're waiting 2 seconds
    // before the "second" variable gets its value.
    var second = yield new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(["Second1", "Second2", "Second3"]);
      }, 2000);
    });
    // Both "first" and "second" are resolved at this
    // point, so we can use both to map a new array.
    return first.map((v, i) => [v, second[i]]);
  }).then(value => {
    console.log("zipped", value);
    // →
    // [
    // [ 'First1', 'Second1' ],
    // [ 'First2', 'Second2' ],
    // [ 'First3', 'Second3' ]
    // ]
  });
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  // A simple user collection.
  var users = [
    { name: "User1" },
    { name: "User2" },
    { name: "User3" },
    { name: "User4" }
  ];
  co(function*() {
    // The "userID" value is asynchronous, and execution
    // pauses at this yield statement till the promise
    // resolves.
    var userID = yield new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
    // At this point, we have a "userID" value. This
    // nested coroutine will look up the user based
    // on this ID. We nest coroutines like this because
    // "co()" returns a promise.
    var user = yield co(function*(id) {
      let user = yield new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(users[id]);
        }, 1000);
      });
      // The "co()" promise is resolved with the
      // "user" value.
      return user;
    }, userID);
    console.log(user);
    // → { name: 'User2' }
  });
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // A simple user collection.
  var users = [
    { name: "User1" },
    { name: "User2" },
    { name: "User3" },
    { name: "User4" }
  ];
  // The "getUser()" function will create a new
  // coroutine whenever it's called, forwarding
  // any arguments as well.
  var getUser = co.wrap(function*(id) {
    let user = yield new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(users[id]);
      }, 1000);
    });
    // The "co()" promise is resolved with the
    // "user" value.
    return user;
  });
  co(function*() {
    // The "userID" value is asynchronous, and execution
    // pauses at this yield statement till the promise
    // resolves.
    var userID = yield new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });
    // Instead of a nested coroutine, we have a function
    // that can now be used elsewhere.
    var user = yield getUser(userID);
    console.log(user);
    // → { name: 'User2' }
  });
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // Adds some functions to the event loop queue.
  process.nextTick(() => {
    var promises = [];
    // Creates 500 promises in the "promises"
    // array. They're each resolved after 1 second.
    for (let i = 0; i < 500; i++) {
      promises.push(
        new Promise(resolve => {
          setTimeout(resolve, 1000);
        })
      );
    }
    // When they're all resolved, log that
    // we're done handling them.
    Promise.all(promises).then(() => {
      console.log("handled requests");
    });
  });
  // This takes a lot longer than the 1 second
  // it takes to resolve all the promises that
  // get added to the queue. So this handler blocks
  // 500 user requests till it finishes..
  process.nextTick(() => {
    console.log("hogging the CPU...");
    work(100000);
  });
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  // We need the "child_process" to fork new
  // node processes.
  var child_process = require("child_process");
  // Forks our worker process.
  var child = child_process.fork(`${__dirname}/child`);
  // This event is emitted when the child process
  // responds with data.
  child.on("message", message => {
    // Displays the result, and kills the child
    // process since we're done with it.
    console.log("work result", message);
    child.kill();
  });
  // Sends a message to the child process. We're
  // sending a number on this end, and the
  // "child_process" ensures that it arrives as a
  // number on the other end.
  child.send(100000);
  console.log("work sent...");
  // Since the expensive computation is happening in
  // another process, normal requests flow through
  // the event loop like normal.
  process.nextTick(() => {
    console.log("look ma, no blocking!");
  });
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // The "message" event is emitted when the parent
  // process sends a message. We then respond with
  // the result of performing expensive CPU operations.
  process.on("message", message => {
    process.send(work(message));
  });
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  // Our required modules...
  var child_process = require("child_process");
  var os = require("os");
  // Spawns our child process - the "ls" system
  // command. The command line flags are passed
  // as an array.
  var child = child_process.spawn("ls", ["-lha", __dirname]);
  // Our output accumulator is an empty string
  // initially.
  var output = "";
  // Adds output as it arrives from process.
  child.stdout.on("data", data => {
    output += data;
  });
  // We're done getting output from the child
  // process - so log the output and kill it.
  child.stdout.on("end", () => {
    output = output.split(os.EOL);
    console.log(output.slice(1, output.length - 2));
    child.kill();
  });
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  var child_process = require("child_process");
  // Forks our "worker" process and creates a "resolvers"
  // object to store our promise resolvers.
  var worker = child_process.fork(`${__dirname}/worker`),
    resolvers = {};
  // When the worker responds with a message, pass
  // the message output to the appropriate resolver.
  worker.on("message", message => {
    resolvers[message.id](message.output);
    delete resolvers[message.id];
  });
  // IDs are used to map responses from the worker process
  // to the promise resolver functions.
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  // This function sends the given "input" to the worker,
  // and returns a promise. The promise is resolved with
  // the return value of the worker.
  function send(input) {
    return new Promise((resolve, reject) => {
      var messageID = id.next().value;
      // Store the resolver function in the "resolvers"
      // map.
      resolvers[messageID] = resolve;
      // Sends the "messageID" and the "input" to the
      // worker.
      worker.send({
        id: messageID,
        input: input
      });
    });
  }
  var array;
  // Builds an array of numbers to send to the worker
  // individually for processing.
  array = new Array(100).fill(null).map((v, i) => (i + 1) * 100);
  // Sends each number in "array" to the worker process
  // as a message. When each promise is resolved, we can
  // reduce the results.
  var first = Promise.all(array.map(send)).then(results => {
    console.log("first result", results.reduce((r, v) => r + v));
    // → first result 3383500000
  });
  // Creates a smaller array, with smaller numbers - it
  // should take less time to process than the previous
  // array.
  array = new Array(50).fill(null).map((v, i) => (i + 1) * 10);
  // Process the second array, log the reduced result.
  var second = Promise.all(array.map(send)).then(results => {
    console.log("second result", results.reduce((r, v) => r + v));
    // → second result 4292500
  });
  // When both arrays have finished being processed, we need
  // to kill the worker in order to exit our program.
  Promise.all([first, second]).then(() => {
    worker.kill();
  });
});

/**
 * Snippet 12
 */
// eslint-disable-next-line
snippets.push(function snippet12() {
  var child_process = require("child_process");
  // Forks our "worker" process and creates a "resolvers"
  // object to store our promise resolvers.
  var worker = child_process.fork(`${__dirname}/worker`),
    resolvers = {};
  // When the worker responds with a message, pass
  // the message output to the appropriate resolver.
  worker.on("message", message => {
    resolvers[message.id](message.output);
    delete resolvers[message.id];
  });
  // IDs are used to map responses from the worker process
  // to the promise resolver functions.
  function* genID() {
    var id = 0;
    while (true) {
      yield id++;
    }
  }
  var id = genID();
  // This function sends the given "input" to the worker,
  // and returns a promise. The promise is resolved with
  // the return value of the worker.
  function send(input) {
    return new Promise((resolve, reject) => {
      var messageID = id.next().value;
      // Store the resolver function in the "resolvers"
      // map.
      resolvers[messageID] = resolve;
      // Sends the "messageID" and the "input" to the
      // worker.
      worker.send({
        id: messageID,
        input: input
      });
    });
  }
  var array;
  // Builds an array of numbers to send to the worker
  // individually for processing.
  array = new Array(100).fill(null).map((v, i) => (i + 1) * 100);
  // Sends each number in "array" to the worker process
  // as a message. When each promise is resolved, we can
  // reduce the results.
  var first = Promise.all(array.map(send)).then(results => {
    console.log("first result", results.reduce((r, v) => r + v));
    // → first result 3383500000
  });
  // Creates a smaller array, with smaller numbers - it
  // should take less time to process than the previous
  // array.
  array = new Array(50).fill(null).map((v, i) => (i + 1) * 10);
  // Process the second array, log the reduced result.
  var second = Promise.all(array.map(send)).then(results => {
    console.log("second result", results.reduce((r, v) => r + v));
    // → second result 4292500
  });
  // When both arrays have finished being processed, we need
  // to kill the worker in order to exit our program.
  Promise.all([first, second]).then(() => {
    worker.kill();
  });
});

/**
 * Snippet 13
 */
// eslint-disable-next-line
snippets.push(function snippet13() {
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // Respond to the main process with the result of
  // calling "work()" and the message ID.
  process.on("message", message => {
    process.send({
      id: message.id,
      output: work(message.input)
    });
  });
});

/**
 * Snippet 14
 */
// eslint-disable-next-line
snippets.push(function snippet14() {
  // The modules we need...
  var http = require("http");
  var cluster = require("cluster");
  var os = require("os");
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // Check which type of process this is. It's either
  // a master or a worker.
  if (cluster.isMaster) {
    // The level of parallelism that goes into
    // "workers".
    var workers = os.cpus().length;
    // Forks our worker processes.
    for (let i = 0; i < workers; i++) {
      cluster.fork();
    }
    console.log("listening at http://localhost:8081");
    console.log(`worker processes: ${workers}`);
    // If this process isn't the master, then it's
    // a worker. So we create the same HTTP server as
    // every other worker.
  } else {
    http
      .createServer((req, res) => {
        res.setHeader("Content-Type", "text/plain");
        res.end(`worker ${cluster.worker.id}: ${work(100000)}`);
      })
      .listen(8081);
  }
});

/**
 * Snippet 15
 */
// eslint-disable-next-line
snippets.push(function snippet15() {
  // The modules we need...
  var http = require("http"),
    httpProxy = require("http-proxy");
  // The "proxy" server is how we send
  // requests to other hosts.
  var proxy = httpProxy.createProxyServer();
  http
    .createServer((req, res) => {
      // If the request is for the site root, we
      // return some HTML with some links'.
      if (req.url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.end(`
          <html>
            <body>
              <p><a href="hello">Hello</a></p>
              <p><a href="world">World</a></p>
            </body>
          </html>
        `);
        // If the URL is "hello" or "world", we proxy
        // the request to the appropriate micro-service
        // using "proxy.web()".
      } else if (req.url === "/hello") {
        proxy.web(req, res, {
          target: "http://localhost:8082"
        });
      } else if (req.url === "/world") {
        proxy.web(req, res, {
          target: "http://localhost:8083"
        });
      } else {
        res.statusCode = 404;
        res.end();
      }
    })
    .listen(8081);
  console.log("listening at http://localhost:8081");
});

/**
 * Snippet 16
 */
// eslint-disable-next-line
snippets.push(function snippet16() {
  var http = require("http");
  // Get the port as a command line argument,
  // so we can run multiple instances of the
  // service.
  var port = process.argv[2];
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work() {
    var i = 0,
      min = 10000,
      max = 100000,
      n = Math.floor(Math.random() * (max - min)) + min;
    while (++i < n * n) {}
    return i;
  }
  // Responds with plain text, after blocking
  // the CPU for a random interval.
  http
    .createServer((req, res) => {
      res.setHeader("Content-Type", "text/plain");
      res.end(work().toString());
    })
    .listen(port);
  console.log(`listening at http://localhost:${port}`);
});

/**
 * Snippet 17
 */
// eslint-disable-next-line
snippets.push(function snippet17() {
  var http = require("http"),
    httpProxy = require("http-proxy");
  var proxy = httpProxy.createProxyServer();
  // These are the service targets. They have a "host",
  // and a "busy" property. Initially they're
  // not busy because we haven't sent any work.
  var targets = [
    {
      host: "http://localhost:8082",
      busy: false
    },
    {
      host: "http://localhost:8083",
      busy: false
    }
  ];
  // Every request gets queued here, in case all
  // our targets are busy.
  var queue = [];
  // Process the request queue, by proxying requests
  // to targets that aren't busy.
  function processQueue() {
    // Iterates over the queue of messages.
    for (let i = 0; i < queue.length; i++) {
      // Iterates over the targets.
      for (let [targetIndex, target] of targets.entries()) {
        // If the target is busy, skip it.
        if (target.busy) {
          continue;
        }
        // Marks the target as busy - from this
        // point forward, the target won't accept
        // any requests until it's unmarked.
        target.busy = true;
        // Gets the current item out of the queue.
        let item = queue.splice(i, 1)[0];
        // Mark the response, so we know which service
        // worker the request went to when it comes
        // back.
        item.res.setHeader("X-Target", targetIndex);
        // Sends the proxy request and exits the
        // loop.
        proxy.web(item.req, item.res, {
          target: target.host
        });
        break;
      }
    }
  }
  // Emitted by the http-proxy module when a response
  // arrives from a service worker.
  proxy.on("proxyRes", function(proxyRes, req, res) {
    // This is the value we set earlier, the index
    // of the "targets" array.
    var targetIndex = res.getHeader("X-Target");
    // We use this index to unmark it. Now it'll
    // expect new proxy requests.
    targets[targetIndex].busy = false;
    // The client doesn't need this internal
    // information, so remove it.
    res.removeHeader("X-Target");
    // Since a service worker just became available,
    // process the queue again, in case there's pending
    // requests.
    processQueue();
  });
  http
    .createServer((req, res) => {
      // All incoming requests are pushed onto the queue.
      queue.push({
        req: req,
        res: res
      });
      // Reprocess the queue, leaving the request there
      // if all the service workers are busy.
      processQueue();
    })
    .listen(8081);
  console.log("listening at http://localhost:8081");
});
