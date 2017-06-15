var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: 'xingkongus',
      avatarUrl: '../../images/home.png'
    },
    majorBtnText: '选择专业',
    collegeBtnText: '选择学院',
    majorArray: [
      ['软件', '计科', '网络', '信息'],
      ['国商', '英语']
    ],
    collegeArray: ['计算机', '外国语'],
    collegeIdx: 0,
    majorIdx: 0
  },
  bindSelectCollege: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      collegeIdx: e.detail.value,
      // collegeBtnText: '软件',
      collegeBtnText: this.data.collegeArray[e.detail.value],
      majorIdx: 0
    })
  },
  bindSelectMajor: function (e) {
    console.log('bindSelectMajor value', e.detail.value)
    this.setData({
      majorIdx: e.detail.value,
      majorBtnText: this.data.majorArray[this.data.collegeIdx][e.detail.value]
    })
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