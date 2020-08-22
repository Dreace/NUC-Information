let storage = wx.getStorageSync('storage') || {};

function clear() {
  storage = {};
  this.save();
}

function getKey(key) {
  return storage[key];
}

function setKey(key, value) {
  storage[key] = value;
  wx.setStorage({
    data: storage,
    key: 'storage',
  });
}

function removeKey(key) {
  delete storage[key];
  wx.setStorage({
    data: storage,
    key: 'storage',
  });
}

function save() {
  wx.setStorage({
    data: storage,
    key: 'storage',
  });
}

module.exports = {
  getKey: getKey,
  setKey: setKey,
  removeKey: removeKey,
  save: save,
  clear: clear,
};
