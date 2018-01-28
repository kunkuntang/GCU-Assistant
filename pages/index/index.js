const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    setClassTxt: '点击设置班级',
    src: '/images/card.png',
    grids: [{
      name: '购书助手',
      url: '/pages/bookLists/bookLists'
    }, {
      name: '通讯录',
      url: '/pages/contacts/contacts'
    }, {
      name: '校园地图',
      url: '/pages/map/map'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    console.log('globalData', app.globalData)
    this.setData({
      src: app.globalData.userInfo.avatarUrl,
      setClassTxt: app.globalData.userInfo.nickName
    })
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