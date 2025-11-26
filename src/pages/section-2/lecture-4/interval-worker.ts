let time = 0;

onmessage = function () {
  setInterval(() => {
    time += 1;
    postMessage({ time });
  }, 100);
};
