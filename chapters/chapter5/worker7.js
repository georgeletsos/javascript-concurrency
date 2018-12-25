// When a message arrays, post a response
// that contains the "name" property of
// the input data. The what if data isn't
// defined?
addEventListener("message", e => {
  postMessage(e.data.name);
});
