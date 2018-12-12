var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // Eat some CPU cycles...
  // Taken from http://adambom.github.io/parallel.js/
  function work(n) {
    var i = 0;
    while (++i < n * n) {}
    return i;
  }
  // There's no handlers in the queue, so this is
  // executed immediately.
  process.nextTick(() => {
    console.log("first handler");
  });
  // The previous handler was quick to exit, so this
  // handler is executed without delay.
  process.nextTick(() => {
    console.log("second handler");
  });
  // Starts immediately because the previous handler
  // exited quickly. However, this handler executes
  // some CPU intensive code.
  process.nextTick(() => {
    console.log("hogging the CPU...");
    work(100000);
  });
  // This handler isn't run immediately, because the
  // handler before this one takes a while to complete.
  process.nextTick(() => {
    console.log("blocked handler");
  });
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // We need the "http" module for HTTP-related
  // code.
  var http = require("http");
  // Creates the server instance, and sets the
  // callback function that's called on every request
  // event for us.
  var server = http.createServer((req, res) => {
    // The response header is always going to be plain
    // text.
    res.setHeader("Content-Type", "text/plain");
    // If the request URL is "hello" or "world", we
    // respond with some text immediately. Otherwise,
    // if the request URL is "/", we simulate a slow
    // response by using "setTimeout()" to finish the
    // request after 5 seconds.
    if (req.url === "/hello") {
      res.end("Hello");
    } else if (req.url === "/world") {
      res.end("World");
    } else {
      setTimeout(() => {
        res.end("Hello World");
      }, 5000);
    }
  });
  // Starts the server.
  server.listen(8081);
  console.log("listening at http://localhost:8081");
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  // We need the "http" module.
  var http = require("http");
  // Creates some sample data, an array of
  // numbers.
  var array = new Array(1000).fill(null).map((v, i) => i);
  // Creates the HTTP server, and the request
  // callback function.
  var server = http.createServer((req, res) => {
    var size = 25,
      i = 0;
    // This function is called when we need to
    // schedule a chunk of data to be written to
    // the response.
    function schedule() {
      // Here's the actual scheduling,
      // "process.nextTick()" let's other handlers,
      // if any, run while we're streaming our writes
      // to the response.
      process.nextTick(() => {
        let chunk = array.slice(i, i + size);
        // If there's a chunk of data to write,
        // write it, then schedule the next round by
        // calling "schedule()". Otherwise, we can
        // "end()" the response.
        if (chunk.length) {
          res.write(chunk.toString() + "\n");
          i += size;
          schedule();
        } else {
          res.end();
        }
      });
    }
    // Kicks off the stream writing scheduler.
    schedule();
  });
  // Starts the server.
  server.listen(8081);
  console.log("listening at http://localhost:8081");
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  var http = require("http");
  // Our sample user data.
  var users = [
    { name: "User 1" },
    { name: "User 2" },
    { name: "User 3" },
    { name: "User 4" }
  ];
  var server = http.createServer((req, res) => {
    // We'll be returning JSON data.
    res.setHeader("Content-Type", "application/json");
    var id = /\/(\d+)/.exec(req.url),
      user;
    // If a user is found from the ID in the URL, return
    // a JSON string of it. Otherwise, respond with a 404.
    if (id && (user = users[+id[1]])) {
      res.end(JSON.stringify(user));
    } else {
      res.statusCode = 404;
      res.statusReason = http.STATUS_CODES[404];
      res.end();
    }
  });
  server.listen(8082);
  console.log("Users service at http://localhost:8082");
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  var http = require("http");
  // Our sample preference data.
  var preferences = [
    { spam: false },
    { spam: true },
    { spam: false },
    { spam: true }
  ];
  var server = http.createServer((req, res) => {
    // We'll be returning JSON data.
    res.setHeader("Content-Type", "application/json");
    var id = /\/(\d+)/.exec(req.url),
      preference;
    // If the ID in the URL finds a sample preference,
    // return the JSON string for it. Otherwise,
    // respond with a 404.
    if (id && (preference = preferences[+id[1]])) {
      res.end(JSON.stringify(preference));
    } else {
      res.statusCode = 404;
      res.statusMessage = http.STATUS_CODES[404];
      res.end();
    }
  });
  server.listen(8083);
  console.log("Preference service: http://localhost:8083");
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  var http = require("http");
  var server = http.createServer((req, res) => {
    // Looks for a user ID in the URL.
    var id = /\/(\d+)/.exec(req.url);
    // If there's no ID in the URL, don't
    // even try handling the request.
    if (!id) {
      res.end();
      return;
    }
    // This promise is resolved when the call to
    // the "users" service responds with data. This
    // service is another server, running on port
    // 8082.
    var user = new Promise((resolve, reject) => {
      http.get(
        {
          hostname: "localhost",
          port: 8082,
          path: `/${id[1]}`
        },
        res => {
          res.on("data", data => {
            resolve(JSON.parse(data.toString()));
          });
        }
      );
    });
    // This promise is resolved when the call to
    // the "preference" service responds with data. This
    // service is just another web server, running
    // on port 8083.
    var preference = new Promise((resolve, reject) => {
      http.get(
        {
          hostname: "localhost",
          port: 8083,
          path: `/${id[1]}`
        },
        res => {
          res.on("data", data => {
            resolve(JSON.parse(data.toString()));
          });
        }
      );
    });
    // Once both the user and the preference services have
    // responded, we have all the data we need to render
    // the page.
    Promise.all([user, preference]).then(results => {
      let user = results[0],
        preference = results[1];
      res.end(`
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Spam:</strong> ${preference.spam}</p>
      `);
    });
  });
  server.listen(8081);
  console.log("Listening at http://localhost:8081");
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  // We need the "fs" module to read files.
  var fs = require("fs");
  var path = require("path");
  // The file path we're working with.
  var filePath = path.join(__dirname, "words");
  // Starts the timer for reading our "words" file.
  console.time("reading words");
  // Reads the entire file into memory, then fires
  // a callback with the data.
  fs.readFile(filePath, (err, data) => {
    console.timeEnd("reading words");
    // → reading words: 5ms
    console.log("size", `${(data.length / 1024 / 1024).toFixed(2)}MB`);
    // → size 2.38MB
  });
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  // We need the "fs" module to read files.
  var fs = require("fs");
  var path = require("path");
  // The file path we're working with.
  var filePath = path.join(__dirname, "words");
  // Creates a promise that's resolved once all the
  // file chunks have been read into memory.
  var contents = new Promise((resolve, reject) => {
    // Opens the "filePath" for reading. The file
    // descriptor "fd", like a file identifier, is needed
    // when we call "fs.read()" later on.
    fs.open(filePath, "r", (err, fd) => {
      // Set up some variables needed for reading
      // a file one chunk at a time. We need to know
      // how big the file is, which does in "size". The
      // "buffer" is where the chunks go as they're
      // read. And we have the "chunk" size, and
      // "read" is the number of bytes read so far.
      var size = fs.fstatSync(fd).size,
        buffer = new Buffer(size),
        chunk = 1024,
        read = 0;
      // We wrap this reading iteration in a named
      // function because it's recursive.
      function schedule() {
        // The reading of a chunk always happens in
        // the next tick of the IO loop. This gives
        // other queued handlers a chance to run while
        // we're reading this file.
        process.nextTick(() => {
          // Makes sure the last chunk fits evenly
          // into the buffer.
          if (read + chunk > size) {
            chunk = size - read;
          }
          // Reads the chunk of data into the buffer,
          // and increments the "read" counter.
          fs.read(fd, buffer, read, chunk, read);
          read += chunk;
          // Check if there's still data to read. If
          // yes, "schedule()" the next "read()". If
          // no, resolve the promise with the "buffer".
          if (read < size) {
            schedule();
          } else {
            resolve(buffer);
          }
        });
      }
      // Kicks off the reading and scheduling process.
      schedule();
    });
  });
  // When the promise is resolved, show how many words
  // were read into the buffer by splitting them by
  // newlines.
  contents.then(buffer => {
    console.log("words read", buffer.toString().split("\n").length);
    // → words read 235887
  });
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  // We need the "fs" and the "path" modules for
  // working with files.
  var fs = require("fs");
  var path = require("path");
  // The file we'll be working with.
  var filePath1 = path.join(__dirname, "output1");
  // The sample array we'll be writing to files.
  var array = new Array(1000).fill(null).map((v, i) => i);
  // Starts a timer for writing the entire array to
  // the file in one shot.
  console.time("output1");
  // Performs the file write and stops the timer when
  // it's complete.
  fs.writeFile(filePath1, array.toString(), err => {
    console.timeEnd("output1");
  });
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  // We need the "fs" and the "path" modules for
  // working with files.
  var fs = require("fs");
  var path = require("path");
  // The file we'll be working with.
  var filePath2 = path.join(__dirname, "output2");
  // The sample array we'll be writing to files.
  var array = new Array(1000).fill(null).map((v, i) => i);
  // Creates a promise that's resolved when all chunks
  // have been written to file.
  var written = new Promise((resolve, reject) => {
    // Opens the file for writing, and the callback
    // starts writing chunks.
    fs.open(filePath2, "w", (err, fd) => {
      var chunk = 50,
        i = 0;
      // The recursive scheduler places the call
      // to perform the write, into the IO event loop
      // queue.
      function schedule() {
        process.nextTick(() => {
          // The chunk of data from "array" to
          // write.
          let slice = array.slice(i, i + chunk);
          // If there's a chunk to write, write it.
          // If not, close the file and resolve the
          // promise.
          if (slice.length) {
            fs.write(fd, slice.toString(), i);
            i += chunk;
            schedule();
          } else {
            fs.close(fd);
            resolve();
          }
        });
      }
      // Kicks of the chunk/write scheduler.
      schedule();
    });
  });
  // When the promise is resolved, it means the file has been
  // written.
  written.then(() => {
    console.log("finished writing");
  });
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  // All the modules we need.
  var fs = require("fs");
  var path = require("path");
  var stream = require("stream");
  // Creates a simple upper-case transformation
  // stream. Each chunk that's passed in, is
  // "pushed" to the next stream in upper-case.
  var transform = new stream.Transform({
    transform: function(chunk) {
      this.push(chunk.toString().toUpperCase());
    }
  });
  // The file names we're using.
  var inputFile = path.join(__dirname, "words"),
    outputFile = path.join(__dirname, "output");
  // Creates an "input" stream that reads from
  // "inputFile" and an "output" stream that writes
  // to "outputFile".
  var input = fs.createReadStream(inputFile),
    output = fs.createWriteStream(outputFile);
  // Starts the IO by building the following
  // pipeline: input -> transform -> output.
  input.pipe(transform);
  transform.pipe(output);
});
