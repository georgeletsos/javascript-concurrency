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
