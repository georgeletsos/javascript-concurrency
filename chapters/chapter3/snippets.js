var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // The executor function used by our promise.
  // The first argument is the resolver function,
  // which is called in 1 second to resolve the promise.
  function executor(resolve) {
    setTimeout(resolve, 1000);
  }
  // The fulfillment callback for our promise. This
  // simply stops the fullfillment timer that was
  // started after our executor function was run.
  function fulfilled() {
    console.timeEnd("fulfillment");
  }
  // Creates the promise, which will run the executor
  // function immediately. Then we start a timer to see
  // how long it takes for our fulfillment function to
  // be called.
  var promise = new Promise(executor);
  promise.then(fulfilled);
  console.time("fulfillment");
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // The executor function used by our promise.
  // Sets a timeout that calls "resolve()" one second
  // after the promise is created. It's resolving
  // a string value - "done!".
  function executor(resolve) {
    setTimeout(() => {
      resolve("done!");
    }, 1000);
  }
  // The fulfillment callback for our promise accepts
  // a value argument. This is the value that's passed
  // to the resolver.
  function fulfilled(value) {
    console.log("resolved", value);
  }
  // Create our promise, providing the executor and
  // fulfillment function callbacks.
  var promise = new Promise(executor);
  promise.then(fulfilled);
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  // This executor function rejects the promise after
  // a timeout of one second. It uses the rejector function
  // to change the state, and to provide the rejected
  // callbacks with a value.
  function executor(resolve, reject) {
    setTimeout(() => {
      reject("Failed");
    }, 1000);
  }
  // The function used as a rejected callback function. It
  // expects a reason for the rejection to be provided.
  function rejected(reason) {
    console.error(reason);
  }
  // Creates the promise, and runs the executor. Uses the
  // "catch()" method to assign the rejector callback function.
  var promise = new Promise(executor);
  promise.catch(rejected);
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  // This promise executor throws an error, and the rejected
  // callback function is called as a result.
  new Promise(() => {
    throw new Error("Problem executing promise");
  }).catch(reason => {
    console.error(reason);
  });
  // This promise executor catches an error, and rejects
  // the promise with a more useful message.
  new Promise((resolve, reject) => {
    try {
      var size = this.name.length;
    } catch (error) {
      reject(error instanceof TypeError ? 'Missing "name" property' : error);
    }
  }).catch(reason => {
    console.error(reason);
  });
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  // This promise is able to run the executor
  // function without issue. The "then()" callback
  // is never executed.
  new Promise(() => {
    console.log("executing promise");
  }).then(() => {
    console.log("never called");
  });
  // At this point, we have no idea what's
  // wrong with the promise.
  console.log("finished executing, promise hangs");
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // A wrapper for promise executor functions, that
  // throws an error after the given timeout.
  function executorWrapper(func, timeout) {
    // This is the function that's actually called by the
    // promise. It takes the resolver and rejector functions
    // as arguments.
    return function executor(resolve, reject) {
      // Setup our timer. When time runs out, we can
      // reject the promise with a timeout message.
      var timer = setTimeout(() => {
        reject(`Promise timed out after ${timeout}MS`);
      }, timeout);
      // Call the original executor function that we're
      // wrapping. We're actually wrapping the resolver
      // and rejector functions as well, so that when the
      // executor calls them, the timer is cleared.
      func(
        value => {
          clearTimeout(timer);
          resolve(value);
        },
        value => {
          clearTimeout(timer);
          reject(value);
        }
      );
    };
  }
  // This promise executor times out, and a timeout
  // error message is passed to the rejected callback.
  new Promise(
    executorWrapper((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }, 1000)
  ).catch(reason => {
    console.error(reason);
  });
  // This promise resolves as expected, since the executor
  // calls "resolve()" before time's up.
  new Promise(
    executorWrapper((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    }, 1000)
  ).then(value => {
    console.log("resolved", value);
  });
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  // Creates 5 promises that log when they're
  // executing, and when they're reacting to a
  // resolved value.
  for (let i = 0; i < 5; i++) {
    new Promise(resolve => {
      console.log("executing promise");
      resolve(i);
    }).then(value => {
      console.log("resolved", i);
    });
  }
  // This is called before any of the fulfilled
  // callbacks, because this call stack job needs
  // to complete before the interpreter reaches into
  // the promise resolution callback queue, where
  // the 5 "then()" callbacks are currently sitting.
  console.log("done executing");
  // →
  // executing promise
  // executing promise
  // ...
  // done executing
  // resolved 1
  // resolved 2
  // ...
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  // A generic function used to fetch resources
  // from the server, returns a promise.
  function get(path) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      // The promise is resolved with the parsed
      // JSON data when the data is loaded.
      request.addEventListener("load", e => {
        resolve(JSON.parse(e.target.responseText));
      });
      // When there's an error with the request, the
      // promise is rejected with the appropriate reason.
      request.addEventListener("error", e => {
        reject(e.target.statusText || "unknown error");
      });
      // If the request is aborted, we simply resolve the
      // request.
      request.addEventListener("abort", resolve);
      request.open("get", path);
      request.send();
    });
  }
  // We can attach our "then()" handler directly
  // to "get()" since it returns a promise. The
  // value used here was a true asynchronous operation
  // that had to go fetch a remote value, and parse it,
  // before resolving it here.
  get("https://jsonplaceholder.typicode.com/users/1").then(value => {
    console.log("hello", value.name, value);
  });
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  // This promise executor will randomly resolve
  // or reject the promise.
  function executor(resolve, reject) {
    cnt++;
    Math.round(Math.random())
      ? resolve(`fulfilled promise ${cnt}`)
      : reject(`rejected promise ${cnt}`);
  }
  // Make "log()" and "error()" functions for easy
  // callback functions.
  var log = console.log.bind(console),
    error = console.error.bind(console),
    cnt = 0;
  // Creates a promise, then assigns the error
  // callback via the "catch()" method.
  new Promise(executor).then(log).catch(error);
  // Creates a promise, then assigns the error
  // callback via the "then()" method.
  new Promise(executor).then(log, error);
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  // Extends the promise prototype with an "always()"
  // method. The given function will always be called,
  // whether the promise is fulfilled or rejected.
  Promise.prototype.always = function(func) {
    return this.then(func, func);
  };
  // Creates a promise that's randomly resolved or
  // rejected.
  var promise = new Promise((resolve, reject) => {
    Math.round(Math.random()) ? resolve("fulfilled") : reject("rejected");
  });
  // Give the promise fulfillment and rejection callbacks.
  promise.then(
    value => {
      console.log(value);
    },
    reason => {
      console.error(reason);
    }
  );
  // This callback is always called after the one of
  // the callbacks above.
  promise.always(value => {
    console.log("cleaning up...");
  });
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  // Keeps a list of resolver functions.
  var resolvers = [];
  // Creates 5 new promises, and in each executor
  // function, the resolver is pushed onto the
  // "resolvers" array. We also give each promise
  // a fulfillment callback.
  for (let i = 0; i < 5; i++) {
    new Promise(resolve => {
      resolvers.push(resolve);
    }).then(value => {
      console.log(`resolved ${i + 1}`, value);
    });
  }
  // Sets a timeout that runs the function after 2
  // seconds. When it runs, we iterate over every
  // resolver function in the "resolvers" array,
  // and we call it with a value.
  setTimeout(() => {
    for (let resolver of resolvers) {
      resolver(true);
    }
  }, 2000);
});

/**
 * Snippet 12
 */
// eslint-disable-next-line
snippets.push(function snippet12() {
  // The "Promise.resolve()" method can resolve thenable
  // objects. This is an object with a "then()" method
  // which serves as the executor. This executor will
  // randomly resolve or reject the promise.
  Promise.resolve({
    then: (resolve, reject) => {
      Math.round(Math.random()) ? resolve("fulfilled") : reject("rejected");
      // This method returns a promise, so we're able
      // to setup our fulfilled and rejected callbacks as
      // usual.
    }
  }).then(
    value => {
      console.log("resolved", value);
    },
    reason => {
      console.error("reason", reason);
    }
  );
});

/**
 * Snippet 13
 */
// eslint-disable-next-line
snippets.push(function snippet13() {
  // This executor function attempts to resolve the
  // promise twice, but the fulfilled callback is
  // only called once.
  new Promise((resolve, reject) => {
    resolve("fulfilled");
    resolve("fulfilled");
  }).then(value => {
    console.log("then", value);
  });
  // This executor function attempts to reject the
  // promise twice, but the rejected callback is
  // only called once.
  new Promise((resolve, reject) => {
    reject("rejected");
    reject("rejected");
  }).catch(reason => {
    console.error("reason");
  });
});

/**
 * Snippet 14
 */
// eslint-disable-next-line
snippets.push(function snippet14() {
  // This executor function resolves the promise immediately.
  // By the time the "then()" callback is added, the promise
  // is already resolved. But the callback is still called
  // with the resolved value.
  new Promise((resolve, reject) => {
    resolve("done");
    console.log("executor", "resolved");
  }).then(value => {
    console.log("then", value);
  });
  // Creates a new promise that's resolved immediately by
  // the executor function.
  var promise = new Promise((resolve, reject) => {
    resolve("done");
    console.log("executor", "resolved");
  });
  // This callback is run immediately, since the promise
  // has already been resolved.
  promise.then(value => {
    console.log("then 1", value);
  });
  // This callback isn't added to the promise for another
  // second after it's been resolved. It's still called
  // right away with the resolved value.
  setTimeout(() => {
    promise.then(value => {
      console.log("then 2", value);
    });
  }, 1000);
});

/**
 * Snippet 15
 */
// eslint-disable-next-line
snippets.push(function snippet15() {
  // Creates a promise that's resolved immediately, and
  // is stored in "promise1".
  var promise1 = new Promise((resolve, reject) => {
    resolve("fulfilled");
  });
  // Use the "then()" method of "promise1" to create a
  // new promise instance, which is stored in "promise2".
  var promise2 = promise1.then(value => {
    console.log("then 1", value);
    // → then 1 fulfilled
  });
  // Create a "then()" callback for "promise2". This actually
  // creates a third promise instance, but we don't do anything
  // with it.
  promise2.then(value => {
    console.log("then 2", value);
    // → then 2 undefined
  });
  // Make sure that "promise1" and "promise2" are in fact
  // different objects.
  console.log("equal", promise1 === promise2);
  // → equal false
});

/**
 * Snippet 16
 */
// eslint-disable-next-line
snippets.push(function snippet16() {
  // Creates a new promise that's randomly resolved or
  // rejected.
  new Promise((resolve, reject) => {
    Math.round(Math.random()) ? resolve("fulfilled") : reject("rejected");
  })
    .then(value => {
      // Called when the original promise is resolved,
      // returns the value in case there's another
      // promise chained to this one.
      console.log("then 1", value);
      return value;
    })
    .catch(reason => {
      // Chained to the second promise, called
      // when it's rejected.
      console.error("catch 1", reason);
    })
    .then(value => {
      // Chained to the third promise, gets the
      // value as expected, and returns it for any
      // downstream promise callbacks to consume.
      console.log("then 2", value);
      return value;
    })
    .catch(reason => {
      // This is never called - rejections do not
      // proliferate through promise chains.
      console.error("catch 2", reason);
    });
});

/**
 * Snippet 17
 */
// eslint-disable-next-line
snippets.push(function snippet17() {
  // Simple utilty to compose a larger function, out
  // of smaller functions.
  function compose(...funcs) {
    return function(value) {
      var result = value;
      for (let func of funcs) {
        result = func(value);
      }
      return result;
    };
  }
  // Accepts a promise or a resolved value. If it's a promise,
  // it adds a "then()" callback and returns a new promise.
  // Otherwise, it performs the "update" and returns the
  // value.
  function updateFirstName(value) {
    if (value instanceof Promise) {
      return value.then(updateFirstName);
    }
    console.log("first name", value.first);
    return value;
  }
  // Works the same way as the above function, except it
  // performs a different UI "update".
  function updateLastName(value) {
    if (value instanceof Promise) {
      return value.then(updateLastName);
    }
    console.log("last name", value.last);
    return value;
  }
  // Works the same way as the above function, except it
  // performs a different UI "update".
  function updateAge(value) {
    if (value instanceof Promise) {
      return value.then(updateAge);
    }
    console.log("age", value.age);
    return value;
  }
  // A promise object that's resolved with a data object
  // after one second.
  var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        first: "John",
        last: "Smith",
        age: 37
      });
    }, 1000);
  });
  // We compose an "update()" function that updates the
  // various UI components.
  var update = compose(
    updateFirstName,
    updateLastName,
    updateAge
  );
  // Call our update function with a promise.
  update(promise);
});

/**
 * Snippet 18
 */
// eslint-disable-next-line
snippets.push(function snippet18() {
  // Utility to send a "GET" HTTP request, and return
  // a promise that's resolved with the parsed response.
  function get(path) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      // The promise is resolved with the parsed
      // JSON data when the data is loaded.
      request.addEventListener("load", e => {
        resolve(JSON.parse(e.target.responseText));
      });
      // When there's an error with the request, the
      // promise is rejected with the appropriate reason.
      request.addEventListener("error", e => {
        reject(e.target.statusText || "unknown error");
      });
      // If the request is aborted, we simply resolve the
      // request.
      request.addEventListener("abort", resolve);
      request.open("get", path);
      request.send();
    });
  }
  // For our request promises.
  var requests = [];
  // Issues 5 API requests, and places the 5 corresponding
  // promises in the "requests" array.
  for (let i = 0; i < 5; i++) {
    requests.push(get("https://jsonplaceholder.typicode.com/todos/" + (i + 1)));
  }
  // Using "Promise.all()" let's us pass in an array of
  // promises, returning a new promise that's resolved
  // when all promises resolve. Our callback gets an array
  // of resolved values that correspond to the promises.
  Promise.all(requests).then(values => {
    console.log("completed", values.map(x => x.completed));
    console.log("id", values.map(x => x.id));
    console.log("title", values.map(x => x.title));
    console.log("userId", values.map(x => x.userId));
  });
});

/**
 * Snippet 19
 */
// eslint-disable-next-line
snippets.push(function snippet19() {
  // The resolver function used to cancel data requests.
  var cancelResolver;
  // A simple "constant" value, used to resolved cancel
  // promises.
  var CANCELLED = {};
  // Our UI components.
  var buttonLoad = document.querySelector("button[load]"),
    buttonCancel = document.querySelector("button[cancel]");
  // Requests data, returns a promise.
  function getDataPromise() {
    // Creates the cancel promise. The executor assigns
    // the "resolve" function to "cancelResolver", so
    // it can be called later.
    var cancelPromise = new Promise(resolve => {
      cancelResolver = resolve;
    });
    // The actual data we want. This would normally be
    // an HTTP request, but we're simulating one here
    // for brevity using setTimeout().
    var dataPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve({ hello: "world" });
      }, 3000);
    });
    // The "Promise.race()" method returns a new promise,
    // and it's resolved with whichever input promise is
    // resolved first.
    return Promise.race([cancelPromise, dataPromise]);
  }
  // When the cancel button is clicked, we use the
  // "cancelResolver()" function to resolve the
  // cancel promise.
  buttonCancel.addEventListener("click", () => {
    cancelResolver(CANCELLED);
  });
  // When the load button is clicked, we make a request
  // for data using "getDataPromise()".
  buttonLoad.addEventListener("click", () => {
    buttonLoad.disabled = true;
    getDataPromise().then(value => {
      buttonLoad.disabled = false;
      // The promise was resolved, but it was because
      // the user cancelled the request. So we exit
      // here by returning the CANCELLED "constant".
      // Otherwise, we have data to work with.
      if (Object.is(value, CANCELLED)) {
        return value;
      }
      console.log("loaded data", value);
    });
  });
});
// Run Snippet 19
snippets[snippets.length - 1]();

/**
 * Snippet 20
 */
// eslint-disable-next-line
snippets.push(function snippet20() {
  // Example function that returns "value" from
  // a cache, or "fetchs" it asynchronously.
  function getData(value) {
    // If it exists in the cache, we return
    // this value.
    var index = getData.cache.indexOf(value);
    if (index > -1) {
      return getData.cache[index];
    }
    // Otherwise, we have to go "fetch" it. This
    // "resolve()" call would typically be found in
    // a network request callback function.
    return new Promise(resolve => {
      getData.cache.push(value);
      resolve(value);
    });
  }
  // Creates the cache.
  getData.cache = [];
  console.log("getting foo", getData("foo"));
  // → getting foo Promise
  console.log("getting bar", getData("bar"));
  // → getting bar Promise
  console.log("getting foo", getData("foo"));
  // → getting foo foo
});

/**
 * Snippet 21
 */
// eslint-disable-next-line
snippets.push(function snippet21() {
  // Example function that returns "value" from
  // a cache, or "fetchs" it asynchronously.
  function getData(value) {
    var cache = getData.cache;
    // If there's no cache for this function, let's
    // reject the promise. Gotta have cache.
    if (!Array.isArray(cache)) {
      return Promise.reject("missing cache");
    }
    // If it exists in the cache, we return
    // a promise that's resolved using the
    // cached value.
    var index = getData.cache.indexOf(value);
    if (index > -1) {
      return Promise.resolve(getData.cache[index]);
    }
    // Otherwise, we have to go "fetch" it. This
    // "resolve()" call would typically be found in
    // a network request callback function.
    return new Promise(resolve => {
      getData.cache.push(value);
      resolve(value);
    });
  }
  // Creates the cache.
  getData.cache = [];
  // Each call to "getData()" is consistent. Even
  // when synchronous values are used, they still
  // get resolved as promises.
  ["foo", "bar", "foo"].forEach(function(el) {
    getData(el).then(
      value => {
        console.log(`getting ${el}`, `"${value}"`);
      },
      reason => {
        console.error(reason);
      }
    );
  });
});
