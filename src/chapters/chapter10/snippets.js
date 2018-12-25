var snippets = [];

/**
 * Snippet 1
 */
// eslint-disable-next-line
snippets.push(function snippet1() {
  // The core Node modules we'll need.
  var http = require("http");
  // Commander is an "npm" package, and is very helpful
  // with parsing command line arguments.
  var commander = require("commander");
  // Our request handler functions that respond to
  // requests.
  var handlers = require("./handlers");
  // The routes array contains route-handler pairings. That
  // is, when a given route RegExp matches against the
  // request URL, the associated handler function is
  // called.
  var routes = [
    [/^\/api\/chat\/(.+)\/message$/i, handlers.sendMessage],
    [/^\/api\/chat\/(.+)\/join$/i, handlers.joinChat],
    [/^\/api\/chat\/(.+)$/i, handlers.loadChat],
    [/^\/api\/chat$/i, handlers.createChat],
    [/^\/(.+)\.js$/i, handlers.staticFile],
    [/^\/(.*)$/i, handlers.index]
  ];
  // Adds command line options using the "commander" library,
  // and parses them. We're only interested in the "host" and
  // the "port" values right now. Both options have default
  // values.
  commander
    .option("-p, --port <port>", "The port to listen on", 8081)
    .option("-H --host <host>", "The host to serve from", "localhost")
    .parse(process.argv);
  // Creates an HTTP server. This handler will iterate over
  // our "routes" array, and test for a match. If found, the
  // handler is called with the request, the response, and
  // the regular expression result.
  http
    .createServer((req, res) => {
      for (let route of routes) {
        let result = route[0].exec(req.url);
        if (result) {
          route[1](req, res, result);
          break;
        }
      }
    })
    .listen(commander.port, commander.host);
  console.log(`listening at http://${commander.host}:${commander.port}`);
});

/**
 * Snippet 2
 */
// eslint-disable-next-line
snippets.push(function snippet2() {
  // This function returns a promise, which is resolved
  // with parsed form data as an object.
  function formFields(req) {
    return new Promise((resolve, reject) => {
      // Use the "IncomingForm" class from the
      // "formidable" lib to parse the data. This
      // "parse()" method is async, so we resolve or
      // reject the promise in the callback.
      new formidable.IncomingForm().parse(req, (err, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(fields);
        }
      });
    });
  }
});

/**
 * Snippet 3
 */
// eslint-disable-next-line
snippets.push(function snippet3() {
  // The "create chat" API. This endpoint
  // creates a new chat object and stores it in memory.
  exports.createChat = co.wrap(function*(req, res) {
    if (!ensureMethod(req, res, "POST")) {
      return;
    }
    // Yield the promise returned by "formFields()".
    // This pauses the execution of this handler because
    // it's a coroutine, created using "co.wrap()".
    var fields = yield formFields(req);
    // The ID for the new chat.
    var chatId = id();
    // The timestamp used for both the chat, and the
    // added user.
    var timestamp = new Date().getTime();
    // Creates the new chat object and stores it. The
    // "users" array is populated with the user that
    // created the chat. The "messages" array is empty
    // by default.
    var chat = (chats[chatId] = {
      timestamp: timestamp,
      topic: fields.topic,
      users: [
        {
          timestamp: timestamp,
          name: fields.user
        }
      ],
      messages: []
    });
    // The response is the JSON encoded version of the
    // chat object. The chat ID is added to the response
    // since it's stored as a key, not a chat property.
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        Object.assign(
          {
            id: chatId
          },
          chat
        )
      )
    );
  });
});

/**
 * Snippet 4
 */
// eslint-disable-next-line
snippets.push(function snippet4() {
  // This endpoint allows a user to join an existing
  // chat that's been shared with them (a URL).
  exports.joinChat = co.wrap(function*(req, res, id) {
    if (!ensureMethod(req, res, "POST")) {
      return;
    }
    // Load the chat from the memory - the "chats"
    // object.
    var chat = chats[id[1]];
    if (!ensureFound(req, res, chat)) {
      return;
    }
    // Yield to get the parsed form fields. This
    // function is a coroutine created using "co.wrap()".
    var fields = yield formFields(req);
    chat.timestamp = new Date().getTime();
    // Adds the new user to the chat.
    chat.users.push({
      timestamp: chat.timestamp,
      name: fields.user
    });
    // Responds with the JSON encoded chat string. We
    // need to add the ID separately as it's not a
    // chat property.
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        Object.assign(
          {
            id: id[1]
          },
          chat
        )
      )
    );
  });
});

/**
 * Snippet 5
 */
// eslint-disable-next-line
snippets.push(function snippet5() {
  // This endpoint loads a chat. This function
  // isn't wrapped as a coroutine because there's
  // no asynchronous actions to wait for.
  exports.loadChat = function(req, res, id) {
    // Lookup the chat, using the "id" from the URL
    // as the key.
    var chat = chats[id[1]];
    if (!ensureFound(req, res, chat)) {
      return;
    }
    // Respond with the JSON encoded string version
    // of the chat.
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(chat));
  };
});

/**
 * Snippet 6
 */
// eslint-disable-next-line
snippets.push(function snippet6() {
  // This handler posts a new message to a given chat. It's
  // also a coroutine function since it needs to wait for
  // asynchronous actions to complete.
  exports.sendMessage = co.wrap(function*(req, res, id) {
    if (!ensureMethod(req, res, "POST")) {
      return;
    }
    // Load the chat and ensures that it's found.
    var chat = chats[id[1]];
    if (!ensureFound(req, res, chat)) {
      return;
    }
    // Gets the parsed form fields by yielding the
    // promise returned from "formFields()".
    var fields = yield formFields(req);
    chat.timestamp = new Date().getTime();
    // Pushes the new message object to the "messages"
    // property.
    chat.messages.push({
      timestamp: chat.timestamp,
      user: fields.user,
      message: fields.message
    });
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(chat));
  });
});

/**
 * Snippet 7
 */
// eslint-disable-next-line
snippets.push(function snippet7() {
  // Helper function used to serve static files.
  function serveFile(req, res, file) {
    // Creates a stream to read the file.
    var stream = fs.createReadStream(file);
    // End the response when there's no more input.
    stream.on("end", () => {
      res.end();
    });
    // Pipe the input file to the HTTP response,
    // which is a writable stream.
    stream.pipe(res);
  }
  // Serves the requested path as a static file.
  exports.staticFile = function(req, res) {
    serveFile(req, res, path.join(__dirname, req.url));
  };
  // By default, we want to serve the "index.html" file.
  exports.index = function index(req, res) {
    res.setHeader("ContentType", "text/html");
    serveFile(req, res, path.join(__dirname, "index.html"));
  };
});

/**
 * Snippet 8
 */
// eslint-disable-next-line
snippets.push(function snippet8() {
  // A generic function used to send HTTP requests to the
  // API. The "method" is the HTTP method, the "path" is
  // the request path, and the "data" is the optional
  // request payload.
  function api(method, path, data) {
    // Returns a promise to the caller, resolved with
    // the API response, or failure.
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      // Resolves the promise using the parsed JSON
      // object - usually a chat.
      request.addEventListener("load", e => {
        resolve(JSON.parse(e.target.responseText));
      });
      // Rejects the promise when there's a problem with
      // the API.
      request.addEventListener("error", e => {
        reject(e.target.statusText || "unknown error");
      });
      request.addEventListener("abort", resolve);
      request.open(method, path);
      // If there's no "data", we can simply "send()"
      // the request. Otherwise, we have to create a
      // new "FormData" instance to properly encode
      // the form data for the request.
      if (Object.is(data, undefined)) {
        request.send();
      } else {
        var form = new FormData();
        Object.keys(data).forEach(key => {
          form.append(key, data[key]);
        });
        request.send(form);
      }
    });
  }
});

/**
 * Snippet 9
 */
// eslint-disable-next-line
snippets.push(function snippet9() {
  // Filters the "chat" object to include only new users
  // and new messages. That is, data with a newer
  // "timestamp" than when we last checked.
  function filterChat(chat) {
    Object.assign(chat, {
      // Assigns the filtered arrays to the
      // corresponding "chat" properties.
      users: chat.users.filter(user => user.timestamp > timestamp),
      messages: chat.messages.filter(message => message.timestamp > timestamp)
    });
    // Reset the "timestamp" so we can look for newer
    // data next time around. We return the modified
    // chat instance.
    timestamp = chat.timestamp;
    return chat;
  }
  // Creates a chat using the given "topic" and "user".
  // The returned promise is resolved with the created
  // chat data.
  function createChat(topic, user) {
    return api("post", "api/chat", {
      topic: topic,
      user: user
    });
  }
  // Joins the given "user" to the given chat "id".
  // The returned promise is resolved with the
  // joined chat data.
  function joinChat(id, user) {
    return api("post", `api/chat/${id}/join`, {
      user: user
    }).then(filterChat);
  }
  // Loads the given chat "id". The returned promise
  // is resolved with filtered chat data.
  function loadChat(id) {
    return api("get", `api/chat/${id}`).then(filterChat);
  }
  // Posts a "message" from the given "user" to the given
  // chat "id". The returned promise is resolved with
  // filtered chat data.
  function sendMessage(id, user, message) {
    return api("post", `api/chat/${id}/message`, {
      user: user,
      message: message
    }).then(filterChat);
  }
});

/**
 * Snippet 10
 */
// eslint-disable-next-line
snippets.push(function snippet10() {
  // Updates the given "chat" in the DOM.
  function drawChat(chat) {
    // Our main DOM components. "$users" is the
    // list of users in the chat. "$messages" is the
    // list of messages in the chat. "$view" is the
    // container element for both lists.
    var $users = document.getElementById("users"),
      $messages = document.getElementById("messages"),
      $view = document.getElementById("view");
    // Update the document title to reflect the chat
    // "topic", display the chat container by removing
    // the "hide" class, and update the title of the
    // chat in bold heading.
    document.querySelector("title").textContent = chat.topic;
    $view.classList.remove("hide");
    $view.querySelector("h1").textContent = chat.topic;
    // Iterates over the messages, making no assumptions
    // about filtering or anything like that.
    for (var message of chat.messages) {
      // Constructs the DOM elements we'll need for
      // the user portion of the message.
      var $user = document.createElement("li"),
        $strong = document.createElement("strong"),
        $em = document.createElement("em");
      // Assemble the DOM structure...
      $user.appendChild($strong);
      $user.appendChild($em);
      $user.classList.add("user");
      // Add content - the user name, and time the message
      // was posted.
      $strong.textContent = message.user + " ";
      $em.textContent = new Date(message.timestamp).toLocaleString();
      // The message itself...
      var $message = document.createElement("li");
      $message.textContent = message.message;
      // Attach the user portion and the message portion,
      // to the DOM.
      $messages.appendChild($user);
      $messages.appendChild($message);
    }
    // Iterates over the users in the chat, making no
    // assumptions about the data, only displaying it.
    for (var user of chat.users) {
      var $user = document.createElement("li");
      $user.textContent = user.name;
      $users.appendChild($user);
    }
    // Make sure that the user can see the newly-rendered
    // content.
    $messages.scrollTop = $messages.scrollHeight;
    // Return the chat so that this function can be used
    // as a resolver in a promise resolution chain.
    return chat;
  }
});

/**
 * Snippet 11
 */
// eslint-disable-next-line
snippets.push(function snippet11() {
  // When the page loads...
  window.addEventListener("load", e => {
    // The "chatId" comes from the page URL. The "user"
    // might already exist in localStorage.
    var chatId = location.pathname.slice(1),
      user = localStorage.getItem("user"),
      $create = document.getElementById("create"),
      $join = document.getElementById("join");
    // If there's no chat ID in the URL, then we display
    // the create chat screen, populating the user
    // input if it was found in localStorage.
    if (!chatId) {
      $create.classList.remove("hide");
      if (user) {
        document.getElementById("create-user").value = user;
      }
      return;
    }
    // If there's no user name found in localStorage,
    // we display the join screen which allows them
    // to enter their name before joining the chat.
    if (!user) {
      $join.classList.remove("hide");
      return;
    }
    // We load the chat, draw it using drawChat(), and
    // start the chat polling process.
    api
      .postMessage({
        action: "loadChat",
        chatId: chatId
      })
      .then(drawChat)
      .then(chat => {
        // If the user isn't part of the chat already,
        // we join it. This happens when the user name
        // is cached in localStorage. If the user creates
        // a chat, then loads it, they'll already belong
        // to the chat.
        if (chat.users.map(u => u.name).indexOf(user) < 0) {
          api
            .postMessage({
              action: "joinChat",
              chatId: chatId,
              user: user
            })
            .then(drawChat)
            .then(() => {
              poll(chatId);
            });
        } else {
          poll(chatId);
        }
      });
  });
});

/**
 * Snippet 12
 */
// eslint-disable-next-line
snippets.push(function snippet12() {
  // Starts polling the API for the given chat "id".
  function poll(chatId) {
    setInterval(() => {
      api
        .postMessage({
          action: "loadChat",
          chatId: chatId
        })
        .then(drawChat);
    }, 3000);
  }
});

/**
 * Snippet 13
 */
// eslint-disable-next-line
snippets.push(function snippet13() {
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
  // This object holds the resolver/rejector functions from promises,
  // as results come back from workers, we look them up here,
  // based on ID.
  var resolvers = {};
  var rejectors = {};
  // Keep the original implementation of "postMessage()"
  // so we can call it later on, in our custom "postMessage()"
  // implementation.
  var postMessage = Worker.prototype.postMessage;
  // Replace "postMessage()" with our custom implementation.
  Worker.prototype.postMessage = function(data) {
    return new Promise((resolve, reject) => {
      // The ID that's used to tie together a web worker
      // response, and a resolver/rejector function.
      var msgId = id.next().value;
      // Stores the resolver/rejector so in can be used later, in
      // the web worker message callback.
      resolvers[msgId] = resolve;
      rejectors[msgId] = reject;
      // Run the original "Worker.postMessage()"
      // implementation, which takes care of
      // actually posting the message to the
      // worker thread.
      postMessage.call(
        this,
        Object.assign(
          {
            msgId: msgId
          },
          data
        )
      );
    });
  };
  // Starts our worker...
  var api = new Worker("ui-api.js");
  // Resolves the promise that was returned by
  // "postMessage()" when the worker responds.
  api.addEventListener("message", e => {
    // If the data is in an error state, then
    // we want the rejector function, and we call
    // that with the error. Otherwise, call the
    // regular resolver function with the data returned
    // from the worker.
    var source = e.data.error ? rejectors : resolvers,
      callback = source[e.data.msgId],
      data = e.data.error ? e.data.error : e.data;
    callback(data);
    // Don't need'em, delete'em.
    delete resolvers[e.data.msgId];
    delete rejectors[e.data.msgId];
  });
});

/**
 * Snippet 14
 */
// eslint-disable-next-line
snippets.push(function snippet14() {
  // Listens for messages coming from the main thread.
  addEventListener("message", e => {
    // The generic promise resolver function. Its
    // job is to post data back to the main thread
    // using "postMessage()". It also returns the
    // data so that it may be used further down in
    // the promise resolution chain.
    function resolve(data) {
      postMessage(
        Object.assign(
          {
            msgId: e.data.msgId
          },
          data
        )
      );
      return data;
    }
    // The generic rejector function posts data back
    // to the main thread. The difference here is that
    // it marks the data as an error. This allows the
    // promise on the other end to be rejected.
    function reject(error) {
      postMessage({
        msgId: e.data.msgId,
        error: error.toString()
      });
      return error;
    }
    // This switch decides which function to call based
    // on the "action" message property. The "resolve()"
    // function is passed as the resolver to each returned
    // promise.
    switch (e.data.action) {
      case "createChat":
        createChat(e.data.topic, e.data.user).then(resolve, reject);
        break;
      case "joinChat":
        joinChat(e.data.chatId, e.data.user).then(resolve, reject);
        break;
      case "loadChat":
        loadChat(e.data.chatId).then(resolve, reject);
        break;
      case "sendMessage":
        sendMessage(e.data.chatId, e.data.user, e.data.message).then(
          resolve,
          reject
        );
        break;
    }
  });
});
