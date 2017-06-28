var app = getApp();

function _next() {
  var that = this;
  var speed = 1;
  if (this.data.progress >= this.data.stepArr[this.data.step]) {
    
    return true;
  }
  this.setData({
    progress: this.data.progress + speed
  });
  setTimeout(function () {
    _next.call(that);
  }, 20);
}

function _pre() {
  var that = this;
  var speed = 1;
  if (this.data.progress <= this.data.stepArr[this.data.step]) {
    return true
  }
  this.setData({
    progress: this.data.progress - speed
  });
  setTimeout(function () {
    _pre.call(that);
  }, 20);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    stepArr: [0, 50, 100],
    pageArr: ['codeInput', 'baseInfo', 'phoneInput'],
    progress: 0,
    userInfo: {
      nickName: 'xingkongus',
      avatarUrl: '../../images/home.png'
    }
  },
  pre: function (e) {
    if (this.data.step > 0 ) {
      this.setData({
        step: --this.data.step
      })
      _pre.call(this)
    }
  },
  next: function (e) {
    if (this.data.step === 2) {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else {
      this.setData({
        step: ++this.data.step
      })
      _next.call(this)
    }
  },
  login: function (e) {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({ userInfo: userInfo })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})