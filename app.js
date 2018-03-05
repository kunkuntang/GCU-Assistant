//app.js
const Bmob = require('utils/bmob.js');
Bmob.initialize("6636a71c682fc816bf7f4d3678561cff", "05ea04f70d33f065e52ded897c5f4765");
let app = null

App({
  onLaunch: function () {
    app = this
  },
  userInfo: {},
  globalData: {},
  Bmob: Bmob,
  baseDevUrl: "http://localhost:8010/",
})
