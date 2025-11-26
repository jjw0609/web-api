onmessage = function (event) {
  const { index } = event.data;
  setTimeout(() => {
    postMessage({ index });
  }, 1000);
};
