var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // Generator functions use an asterisk to
  // denote a that a generator instance is returned.
  // We can return values from generators, but instead
  // of the caller getting that value, they'll always
  // get a generator instance.
  function* gen() {
    return "hello world";
  }
  // Creates the generator instance.
  var generator = gen();
  // Let's see what this looks like.
  console.log("generator", generator);
  // → generator Generator
  // Here's how we get the return value. Looks awkward,
  // because we would never use a generator function
  // that simply returns a single value.
  console.log("return", generator.next().value);
  // → return hello world
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // This function yields values, in order. There's no
  // container structure, like an array. Instead, each time
  // the yield statement is called, control is yielded
  // back to the caller, and the position in the function
  // is bookmarked.
  function* gen() {
    yield "first";
    yield "second";
    yield "third";
  }
  var generator = gen();
  // Each time we call "next()", control is passed back
  // to the generator function's execution context. Then,
  // the generator looks up the bookmark for where it
  // last yielded control.
  console.log(generator.next().value);
  console.log(generator.next().value);
  console.log(generator.next().value);
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  // A basic generator function that yields
  // sequential values.
  function* gen() {
    yield "first";
    yield "second";
    yield "third";
  }
  // Creates the generator.
  var generator = gen();
  // Loop till the sequence is finished.
  while (true) {
    // Gets the next item from the sequence.
    let item = generator.next();
    // Is there a next value, or are we done?
    if (item.done) {
      break;
    }
    console.log("while", item.value);
  }
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  // A basic generator function that yields
  // sequential values.
  function* gen() {
    yield "first";
    yield "second";
    yield "third";
  }
  // Creates the generator.
  var generator = gen();
  // The "for..of" loop removes the need to explicitly
  // call generator constructs, like "next()", "value",
  // and "done".
  for (let item of generator) {
    console.log("for..of", item);
  }
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  // Generates an infinite Fibonacci sequence.
  function* fib() {
    var seq = [0, 1],
      next;
    // This loop doesn't actually run infinitely,
    // only as long as items from the sequence
    // are requested using "next()".
    while (true) {
      // Yields the next item in the sequence.
      yield (next = seq[0] + seq[1]);
      // Stores state necessary to compute the
      // item in the next iteration.
      seq[0] = seq[1];
      seq[1] = next;
    }
  }
  // Launch the generator. This will never be "done"
  // generating values. However, it's lazy - it only
  // generates what we ask for.
  var generator = fib();
  // Gets the first 5 items of the sequence.
  for (let i = 0; i < 5; i++) {
    console.log("item", generator.next().value);
  }
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // A generic generator that will infinitely iterate
  // over the provided arguments, yielding each item.
  function* alternate(...seq) {
    while (true) {
      for (let item of seq) {
        yield item;
      }
    }
  }
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  function* alternate(...seq) {
    while (true) {
      for (let item of seq) {
        yield item;
      }
    }
  }
  // Create a generator that alternates between
  // the provided arguments.
  var alternator = alternate(true, false);
  console.log("true/false", alternator.next().value);
  console.log("true/false", alternator.next().value);
  console.log("true/false", alternator.next().value);
  console.log("true/false", alternator.next().value);
  // →
  // true/false true
  // true/false false
  // true/false true
  // true/false false
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  function* alternate(...seq) {
    while (true) {
      for (let item of seq) {
        yield item;
      }
    }
  }
  // Create a new generator instance, with new values
  // to alternate with each iteration.
  var alternator = alternate("one", "two", "three");
  // Gets the first 10 items from the infinite sequence.
  for (let i = 0; i < 10; i++) {
    console.log("one/two/three", `"${alternator.next().value}"`);
  }
  // →
  // one/two/three "one"
  // one/two/three "two"
  // one/two/three "three"
  // one/two/three "one"
  // one/two/three "two"
  // one/two/three "three"
  // one/two/three "one"
  // one/two/three "two"
  // one/two/three "three"
  // one/two/three "one"
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  // Generator that maps a collection of objects
  // to a specific property name.
  function* iteratePropertyValues(collection, property) {
    for (let object of collection) {
      yield object[property];
    }
  }
  // Generator that yields each value of the given object.
  function* iterateObjectValues(collection) {
    for (let key of Object.keys(collection)) {
      yield collection[key];
    }
  }
  // Generator that yields each item from the given array.
  function* iterateArrayElements(collection) {
    for (let element of collection) {
      yield element;
    }
  }
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  // This generator defers to other generators. But first,
  // it executes some logic to determine the best strategy.
  function* iterateNames(collection) {
    // Are we dealing with an array?
    if (Array.isArray(collection)) {
      // This is a heuristic where we check the first
      // element of the array. Based on what's there, we
      // make assumptions about the remaining elements.
      let first = collection[0];
      // Here is where we defer to other more specialized
      // generators, based on what we find out about the
      // first array element.
      if (first.hasOwnProperty("name")) {
        yield* iteratePropertyValues(collection, "name");
      } else if (first.hasOwnProperty("customerName")) {
        yield* iteratePropertyValues(collection, "customerName");
      } else {
        yield* iterateArrayElements(collection);
      }
    } else {
      yield* iterateObjectValues(collection);
    }
  }
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  function* iteratePropertyValues(collection, property) {
    for (let object of collection) {
      yield object[property];
    }
  }
  function* iterateObjectValues(collection) {
    for (let key of Object.keys(collection)) {
      yield collection[key];
    }
  }
  function* iterateArrayElements(collection) {
    for (let element of collection) {
      yield element;
    }
  }
  function* iterateNames(collection) {
    if (Array.isArray(collection)) {
      let first = collection[0];
      if (first.hasOwnProperty("name")) {
        yield* iteratePropertyValues(collection, "name");
      } else if (first.hasOwnProperty("customerName")) {
        yield* iteratePropertyValues(collection, "customerName");
      } else {
        yield* iterateArrayElements(collection);
      }
    } else {
      yield* iterateObjectValues(collection);
    }
  }

  var collection;
  // Iterates over an array of string names.
  collection = ["First", "Second", "Third"];
  for (let name of iterateNames(collection)) {
    console.log("array element", `"${name}"`);
  }
  // Iterates over an object, where the names
  // are the values - the keys aren't relevant here.
  collection = {
    first: "First",
    second: "Second",
    third: "Third"
  };
  for (let name of iterateNames(collection)) {
    console.log("object value", `"${name}"`);
  }
  // Iterates over the "name" property of each object
  // in the collection.
  collection = [{ name: "First" }, { name: "Second" }, { name: "Third" }];
  for (let name of iterateNames(collection)) {
    console.log("property value", `"${name}"`);
  }
});

/**
 * Snippet 12
 */
// eslint-disable-next-line
snippets.push(function snippet12() {
  "use strict";
  // Utility function that converts the input array to a
  // generator by yielding each of it's values. If its
  // not an array, it assumes it's already a generator
  // and defers to it.
  function* toGen(array) {
    if (Array.isArray(array)) {
      for (let item of array) {
        yield item;
      }
    } else {
      yield* array;
    }
  }
  // Interweaves the given data sources (arrays or
  // generators) into a single generator source.
  function* weave(...sources) {
    // This controls the "while" loop. As long as
    // there's a source that's yielding data, the
    // while loop is still valid.
    var yielding = true;
    // We have to make sure that each of our
    // sources is a generator.
    var generators = sources.map(source => toGen(source));
    // Starts the main weaving loop. It makes it's
    // way through each source, yielding one item
    // from each, then starting over, till every
    // source is empty.
    while (yielding) {
      yielding = false;
      for (let source of generators) {
        let next = source.next();
        // As long as we're yielding data, the
        // "yielding" value is true, and the
        // "while" loop continues. As soon as
        // "done" is true for every source, the
        // "yielding" variable stays false, and
        // the "while loop exits.
        if (!next.done) {
          yielding = true;
          yield next.value;
        }
      }
    }
  }
  // A basic filter that generates values by
  // iterating over the given source, and yielding items
  // that are not disabled.
  function* enabled(source) {
    for (let item of source) {
      if (!item.disabled) {
        yield item;
      }
    }
  }
  // These are the two data sources we want to weave
  // together into one generator, which can then be
  // filtered by another generator.
  var enrolled = [
    { name: "First" },
    { name: "Sencond" },
    { name: "Third", disabled: true }
  ];
  var pending = [
    { name: "Fourth" },
    { name: "Fifth" },
    { name: "Sixth", disabled: true }
  ];
  // Creates the generator, which yields user objects
  // from two data sources.
  var users = enabled(weave(enrolled, pending));
  // Actually performs the weaving and filtering.
  for (let user of users) {
    console.log("name", `"${user.name}"`);
  }
});

/**
 * Snippet 13
 */
// eslint-disable-next-line
snippets.push(function snippet13() {
  // This generator will keep generating even numbers.
  function* genEvens() {
    // The initial value is 2. But this can change based
    // on the input passed to "next()".
    var value = 2,
      input;
    while (true) {
      // We yield the value, and get the input. If
      // input is provided, this will serve as the
      // next value.
      input = yield value;
      if (input) {
        value = input;
      } else {
        // Make sure that the next value is even.
        // Handles the case when an odd value is
        // passed to "next()".
        value += value % 2 ? 1 : 2;
      }
    }
  }
  // Creates the "evens" generator.
  var evens = genEvens(),
    even;
  // Iterate over evens up to 10.
  while ((even = evens.next().value) <= 10) {
    console.log("even", even);
  }
  // →
  // even 2
  // even 4
  // even 6
  // even 8
  // even 10
  // Resets the generator. We don't need to
  // create a new one.
  evens.next(999);
  // Iterate over evens between 1000 - 1024.
  while ((even = evens.next().value) <= 1024) {
    console.log("evens from 1000", even);
  }
  // →
  // evens from 1000 1000
  // evens from 1000 1002
  // evens from 1000 1004
  // evens from 1000 1006
  // evens from 1000 1008
  // evens from 1000 1010
  // evens from 1000 1012
  // evens from 1000 1014
  // ...
});

/**
 * Snippet 14
 */
// eslint-disable-next-line
snippets.push(function snippet14() {
  // This generator will keep iterating, as
  // long as "next()" is called. It's expecting
  // a value as well, so that it can call the
  // "iteratee()" function on it, and yield the
  // result.
  function* genMapNext(iteratee) {
    var input = yield null;
    while (true) {
      input = yield iteratee(input);
    }
  }
  // Our array of values we want to map.
  var array = ["a", "b", "c", "b", "a"];
  // A "mapper" generator. We pass an iteratee
  // function as an argument to "genMapNext()".
  var mapper = genMapNext(x => x.toUpperCase());
  // Our starting point for the reduction.
  var reduced = {};
  // We have to call "next()" to bootstrap the
  // generator.
  mapper.next();
  // Now we can start iterating over the array.
  // The "mapped" value is yielded from the
  // generator. The value we want mapped is fed
  // into the generator by passing it to "next()".
  for (let item of array) {
    let mapped = mapper.next(item).value;
    // Our reduction logic takes the mapped value,
    // and adds it to the "reduced" object, counting
    // the number of duplicate keys.
    if (reduced.hasOwnProperty(mapped)) {
      reduced[mapped]++;
    } else {
      reduced[mapped] = 1;
    }
  }
  console.log("reduced", reduced);
  // → reduced { A: 2, B: 2, C: 1 }
});

/**
 * Snippet 15
 */
// eslint-disable-next-line
snippets.push(function snippet15() {
  // This generator is a more useful mapper than
  // "genMapNext()" because it doesn't rely on values
  // coming into the generator through "next()".
  //
  // Instead, this generator accepts an iterable, and
  // an iteratee function. The iterable is then
  // iterated-over, and the result of the iteratee
  // is yielded.
  function* genMap(iterable, iteratee) {
    for (let item of iterable) {
      yield iteratee(item);
    }
  }
  // Our array of values we want to map.
  var array = ["a", "b", "c", "b", "a"];
  // Creates our "mapped" generator, using an iterable
  // data source, and an iteratee function.
  var mapped = genMap(array, x => x.toUpperCase());
  var reduced = {};
  // Now we can simply iterate over our genrator, instead
  // of calling "next()". The job of each loop iteration
  // is to perform the reduction logic, instead of having
  // to call "next()".
  for (let item of mapped) {
    if (reduced.hasOwnProperty(item)) {
      reduced[item]++;
    } else {
      reduced[item] = 1;
    }
  }
  console.log("reduce improved", reduced);
  // → reduce improved { A: 2, B: 2, C: 1 }
});

/**
 * Snippet 16
 */
// eslint-disable-next-line
snippets.push(function snippet16() {
  function* genMap(iterable, iteratee) {
    for (let item of iterable) {
      yield iteratee(item);
    }
  }
  // This function composes a generator
  // function out of iteratees. The idea is to create
  // a generator for each iteratee, so that each item
  // from the original iterable, flows down, through
  // each iteratee, before mapping the next item.
  function composeGenMap(...iteratees) {
    // We're returning a generator function. That way,
    // the same mapping composition can be used on
    // several iterables, not just one.
    return function*(iterable) {
      // Creates the generator for each iteratee
      // passed to the function. The next generator
      // gets the previous generator as the "iterable"
      // argument.
      for (let iteratee of iteratees) {
        iterable = genMap(iterable, iteratee);
      }
      // Simply defer to the last iterable we created.
      yield* iterable;
    };
  }
  // Our iterable data source.
  var array = [1, 2, 3];
  // Creates a "composed" mapping generator, using 3
  // iteratee functions.
  var composed = composeGenMap(x => x + 1, x => x * x, x => x - 2);
  // Now we can iterate over the composed generator,
  // passing it our iterable, and lazily mapping
  // values.
  for (let item of composed(array)) {
    console.log("composed", item);
  }
  // →
  // composed 2
  // composed 7
  // composed 14
});

/**
 * Snippet 17
 */
// eslint-disable-next-line
snippets.push(function snippet17() {
  // Taken from: http://syzygy.st/javascript-coroutines/
  // This utility takes a generator function, and returns
  // a coroutine function. Any time the coroutine is invoked,
  // it's job is to call "next()" on the generator.
  //
  // The effect is that the generator function can run
  // indefinitely, pausing when it hits "yield" statements.
  function coroutine(func) {
    // Creates the generator, and moves the function
    // ahead to the first "yield" statement.
    var gen = func();
    gen.next();
    // The "val" is passed to the generator function
    // through the "yield" statement. It then resumes
    // from there, till it hits another yield.
    return function(val) {
      gen.next(val);
    };
  }
});

/**
 * Snippet 18
 */
// eslint-disable-next-line
snippets.push(function snippet18() {
  function coroutine(func) {
    var gen = func();
    gen.next();
    return function(val) {
      gen.next(val);
    };
  }
  // Creates a coroutine function that when called,
  // advances to the next yield statement.
  var coFirst = coroutine(function*() {
    var input;
    // Input comes from the yield statement, and is
    // the argument value passed to "coFirst()".
    input = yield;
    console.log("step1", input);
    input = yield;
    console.log("step3", input);
  });
  // Works the same as the coroutine created above...
  var coSecond = coroutine(function*() {
    var input;
    input = yield;
    console.log("step2", input);
    input = yield;
    console.log("step4", input);
  });
  // The two coroutines cooperating with one another,
  // to produce the expected output. We can see that
  // the second call to each coroutine picks up where
  // the last yield statement left off.
  coFirst("the money");
  coSecond("the show");
  coFirst("get ready");
  coSecond("go");
  // →
  // step1 the money
  // step2 the show
  // step3 get ready
  // step4 go
});

/**
 * Snippet 19
 */
// eslint-disable-next-line
snippets.push(function snippet19() {
  function coroutine(func) {
    var gen = func();
    gen.next();
    return function(val) {
      gen.next(val);
    };
  }
  // Coroutine function that's used with mousemove
  // events.
  var onMouseMove = coroutine(function*() {
    var e;
    // This loop continues indefinitely. The event
    // object comes in through the yield statement.
    while (true) {
      e = yield;
      // If the element is disabled, do nothing.
      // Otherwise, log a message.
      if (e.target.disabled) {
        continue;
      }
      console.log("mousemove", e.target.textContent);
    }
  });
  // Coroutine function that's used with click events.
  var onClick = coroutine(function*() {
    // Store references to our two buttons. Since
    // coroutines are stateful, they'll always be
    // available.
    var first = document.querySelector("button[coroutine]:first-of-type");
    var second = document.querySelector("button[coroutine]:last-of-type");
    var e;
    while (true) {
      e = yield;
      // Disables the button that was clicked.
      e.target.disabled = true;
      // If the first button was clicked, toggle
      // the state of the second button.
      if (Object.is(e.target, first)) {
        second.disabled = !second.disabled;
        continue;
      }
      // If the second button was clicked, toggle
      // the state of the first button.
      if (Object.is(e.target, second)) {
        first.disabled = !first.disabled;
      }
    }
  });
  // Sets up the event handlers - our coroutine functions.
  for (let button of document.querySelectorAll("button[coroutine]")) {
    button.addEventListener("mousemove", onMouseMove);
    button.addEventListener("click", onClick);
  }
});
// Run Snippet 19
snippets[snippets.length - 1]();

/**
 * Snippet 20
 */
// eslint-disable-next-line
snippets.push(function snippet20() {
  function coroutine(func) {
    var gen = func();
    gen.next();
    return function(val) {
      gen.next(val);
    };
  }
  // An array of promises.
  var promises = [];
  // Our resolution callback is a coroutine. This means
  // that every time it's called, a new resolved promise
  // value shows up here.
  var onFulfilled = coroutine(function*() {
    var data;
    // Continue to process resolved promise values
    // as they arrive.
    while (true) {
      data = yield;
      console.log("data", data);
    }
  });
  // Create 5 promises that resolve at random times,
  // between 1 and 5 seconds.
  for (let i = 0; i < 5; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(i);
        }, Math.floor(Math.random() * (5000 - 1000)) + 1000);
      })
    );
  }
  // Attach our fulfillment coroutine as a "then()" callback.
  for (let promise of promises) {
    promise.then(onFulfilled);
  }
});
