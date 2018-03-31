//app.js
const bookBmob = require('utils/bmob.js');
bookBmob.initialize("", "");

let app = null

App({
  onLaunch: function() {
    app = this
  },
  userInfo: {},
  globalData: {},
  bookBmob: bookBmob,
  baseDevUrl: "http://localhost:8010/",
})