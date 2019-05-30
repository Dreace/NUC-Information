function check() {
  var app = getApp()
  var timeDelta = 15 - (new Date() - app.globalData.lastRequestTime) / 1000
  if (timeDelta > 0) {
    wx.showToast({
      title: '操作过于频繁，' + parseInt(timeDelta) + ' 秒后重试',
      icon: "none",
      duration: 2500
    })
    return false
  } else {
    return true
  }
}

module.exports = {
  check: check,
}