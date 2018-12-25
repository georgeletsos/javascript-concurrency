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
