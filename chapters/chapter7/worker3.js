// Returns a map of the input array, by squaring
// each number in the array.
addEventListener("message", e => {
  postMessage({
    id: e.data.id,
    value: e.data.value.map(v => v * v)
  });
});
