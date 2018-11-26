var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // Creates a timer that calls our function in no less
  // than 300MS. We can use the "console.time()" and the
  // "console.timeEnd()" functions to see how long it actually
  // takes.
  //
  // This is typically around 301MS, which isn't at all
  // noticeable by the user, but is unreliable for
  // accurately scheduling function calls.
  var timer = setTimeout(() => {
    console.timeEnd("setTimeout");
  }, 300);
  console.time("setTimeout");
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // Be careful, this function hogs the CPU...
  function expensive(n = 25000) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // Creates a timer, the callback uses
  // "console.timeEnd()" to see how long we
  // really waited, compared to the 300MS
  // we were expecting.
  var timer = setTimeout(() => {
    console.timeEnd("setTimeout");
  }, 300);
  console.time("setTimeout");
  // This takes a number of seconds to
  // complete on most CPUs. All the while, a
  // task has been queued to run our callback
  // function. But the event loop can't get
  // to that task until "expensive()" completes.
  expensive();
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  function expensive(n = 25000) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // A counter for keeping track of which
  // interval we're on.
  var cnt = 0;
  // Set up an interval timer. The callback will
  // log which interval scheduled the callback.
  var timer = setInterval(() => {
    console.log("Interval", ++cnt);
  }, 3000);
  // Block the CPU for a while. When we're no longer
  // blocking the CPU, the first interval is called,
  // as expected. Then the second, when expected. And
  // so on. So while we block the callback tasks, we're
  // also blocking tasks that schedule the next interval.
  expensive(50000);
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  // A generic event callback, logs the event timestamp.
  function onClick(e) {
    console.log("click", new Date(e.timeStamp));
  }
  // The element we're going to use as the event
  // target.
  var button = document.querySelector("button[time]");
  // Setup our "onClick" function as the
  // event listener for "click" events on this target.
  button.addEventListener("click", onClick);
  // In addition to users clicking the button, the
  // EventTarget interface lets us manually dispatch
  // events.
  button.dispatchEvent(new Event("click"));
});
// Run Snippet 4
snippets[snippets.length - 1]();

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  // Keeps track of the number of "mousemove" events.
  var events = 0;
  // The "debounce()" takes the provided "func" an limits
  // the frequency at which it is called using "limit"
  // milliseconds.
  function debounce(func, limit) {
    var timer;
    return function debounced(...args) {
      // Remove any existing timers.
      clearTimeout(timer);
      // Call the function after "limit" milliseconds.
      timer = setTimeout(() => {
        timer = null;
        func.apply(this, args);
      }, limit);
    };
  }
  // Logs some information about the mouse event. Also log
  // the total number of events.
  function onMouseMove(e) {
    console.log(`X ${e.clientX} Y ${e.clientY}`);
    console.log("events", ++events);
  }
  // Log what's being typed into the text input.
  function onInput(e) {
    console.log("input", e.target.value);
  }
  // Listen to the "mousemove" event using the debounced
  // version of the "onMouseMove()" function. If we
  // didn't wrap this callback with "debounce()"
  window.addEventListener("mousemove", debounce(onMouseMove, 300));
  // Listen to the "input" event using the debounced version
  // of the "onInput()" function to prevent triggering events
  // on every keystroke.
  document
    .querySelector("input")
    .addEventListener("input", debounce(onInput, 250));
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // Callback for successful network request,
  // parses JSON data.
  function onLoad(e) {
    console.log("load", JSON.parse(this.responseText));
  }
  // Callback for problematic network request,
  // logs error.
  function onError() {
    console.error("network", this.statusText || "unknown error");
  }
  // Callback for a cancelled network request,
  // logs warning.
  function onAbort() {
    console.warn("request aborted...");
  }
  var request = new XMLHttpRequest();
  // Uses the "EventTarget" interface to attach event
  // listeners, for each of the potential conditions.
  request.addEventListener("load", onLoad);
  request.addEventListener("error", onError);
  request.addEventListener("abort", onAbort);
  // Sends a "GET" request for "api.json".
  request.open("get", "https://jsonplaceholder.typicode.com/posts/1");
  request.send();
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  // The function that's called when a response arrives ,
  // it's also responsible for coordinating responses.
  function onLoad() {
    // When the response is ready, we push the parsed
    // response onto the "responses" array, so that we
    // can use responses later on when the rest of them
    // arrive.
    responses.push(JSON.parse(this.responseText));
    // Have all the respected responses showed up yet?
    if (responses.length === 3) {
      // How we can do whatever we need to, in order
      // to render the UI component because we have
      // all the data.
      for (let response of responses) {
        console.log("hello", response);
      }
    }
  }
  // Creates our API request instances, and a "responses"
  // array used to hold out-of-sync responses.
  var req1 = new XMLHttpRequest(),
    req2 = new XMLHttpRequest(),
    req3 = new XMLHttpRequest(),
    responses = [];
  // Issue network requests for all our network requests.
  for (let req of [req1, req2, req3]) {
    req.addEventListener("load", onLoad);
    req.open("get", "https://jsonplaceholder.typicode.com/posts/2");
    req.send();
  }
});
