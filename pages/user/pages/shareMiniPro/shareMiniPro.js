// pages/user/pages/shareMiniPro/shareMiniPro.js
const app = getApp()
const Bmob = app.bookBmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    QECodeSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let path = 'pages/index/index'
    let width = 320
    Bmob.generateCode({ "path": path, "width": width, "type": 1 }).then(function(obj) {
      console.log(obj);
      that.setData({
        QECodeSrc: obj.url //二维码示例, 这里也可以返回二维码URL，请看上面参数
      })

    }, function(err) {

      //失败
    });

    // let ACCESS_TOKEN = 
    // wx.request({
    //   url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + ACCESS_TOKEN,
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})