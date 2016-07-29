
var QPushPlugin = function () {}

// private plugin function

QPushPlugin.prototype.receiveMessage = {}
QPushPlugin.prototype.openNotification = {}
QPushPlugin.prototype.receiveNotification = {}

QPushPlugin.prototype.isPlatformIOS = function () {
  var isPlatformIOS = device.platform == 'iPhone'
    || device.platform == 'iPad'
    || device.platform == 'iPod touch'
    || device.platform == 'iOS'
  return isPlatformIOS
}

QPushPlugin.prototype.error_callback = function (msg) {
  console.log('Javascript Callback Error: ' + msg)
}

QPushPlugin.prototype.call_native = function (name, args, callback) {
  ret = cordova.exec(callback, this.error_callback, 'QPushPlugin', name, args)
  return ret
}

// public methods
QPushPlugin.prototype.init = function () {
  if (this.isPlatformIOS()) {
    var data = []
    this.call_native('initial', data, null)
  } else {
    data = []
    this.call_native('init', data, null)
  }
}

QPushPlugin.prototype.getRegistrationID = function (callback) {
  try {
    var data = []
    this.call_native('getRegistrationID', [data], callback)
  } catch(exception) {
    console.log(exception)
  }
}

// iOS methods
QPushPlugin.prototype.setApplicationIconBadgeNumber = function (badge) {
  if (this.isPlatformIOS()) {
    this.call_native('setApplicationIconBadgeNumber', [badge], null)
  }
}

QPushPlugin.prototype.getApplicationIconBadgeNumber = function (callback) {
  if (this.isPlatformIOS()) {
    this.call_native('getApplicationIconBadgeNumber', [], callback)
  }
}

// Android methods
//后台收到通知
QPushPlugin.prototype.receiveMessageInAndroidCallback = function (data) {
  try {
    data = JSON.stringify(data)
    console.log('QPushPlugin:receiveMessageInAndroidCallback: ' + data)
    this.onBackgoundNotification = JSON.parse(data)
    cordova.fireDocumentEvent('qpush.backgoundNotification', this.onBackgoundNotification)
  } catch(exception) {
    console.log('QPushPlugin:pushCallback ' + exception)
  }
}
//后台打开通知
QPushPlugin.prototype.openNotificationInAndroidCallback = function (data) {
  try {
    data = JSON.stringify(data)
    console.log('QPushPlugin:openNotificationInAndroidCallback: ' + data)
    this.onOpenNotification = JSON.parse(data)
    cordova.fireDocumentEvent('qpush.openNotification', this.onOpenNotification)
  } catch(exception) {
    console.log(exception)
  }
}
//前台收到通知
QPushPlugin.prototype.receiveNotificationInAndroidCallback = function (data) {
  try {
    data = JSON.stringify(data)
    console.log('QPushPlugin:receiveNotificationInAndroidCallback: ' + data)
    this.onReceiveNotification = JSON.parse(data)
    cordova.fireDocumentEvent('qpush.receiveNotification', this.onReceiveNotification)
  } catch(exception) {
    console.log(exception)
  }
}

if (!window.plugins) {
  window.plugins = {}
}

if (!window.plugins.QPushPlugin) {
  window.plugins.QPushPlugin = new QPushPlugin()
}

module.exports = new QPushPlugin()


