let events = {};

const on = function (name, self, callback) {
  const tuple = [self, callback];
  const callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.push(tuple);
  } else {
    events[name] = [tuple];
  }
};

const off = function (name, self) {
  const callbacks = events[name];
  if (Array.isArray(callbacks)) {
    events[name] = callbacks.filter(tuple => {
      return tuple[0] != self;
    });
  }
};

const emit = function (name, data) {
  const callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.map(tuple => {
      const self = tuple[0];
      const callback = tuple[1];
      callback.call(self, data);
    });
  }
};

module.exports = {
  on: on,
  off: off,
  emit: emit,
};
