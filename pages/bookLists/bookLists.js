// pages/bookLists/bookLists.js
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookListId: '',
    hasSetInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.setData({
      hasSetInfo: app.userInfo.hasSetInfo,
    })

    if (!app.userInfo.hasSetInfo) {
      wx.showModal({
        title: '请完善信息',
        content: '完善信息后可以查看本班的通讯录',
        confirmText: "去完善",
        cancelText: "暂不",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            console.log('用户点击辅助操作')
          }
        }
      });

    }
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

  },
  bindBookListId: function(e) {
    this.setData({
      bookListId: e.detail.value
    })
  },
  getBookList: function() {
    wx.navigateTo({
      url: '/pages/bookList/bookList?bookListId=' + this.data.bookListId,
    })

  },
  getBooksFromBookList: function() {
    let Books = Bmob.Object.extend('books')
    let booksQuery = new Bmob.Query(Books)
    booksQuery.equalTo('belongBookList', this.data.bookListId)
    booksQuery.find({
      success: function(results) {
        let tempData = []
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          let bookDisc = parseInt(object.get('bookDisc'))
          let bookPrice = parseInt(object.get('bookPrice'))
          tempData.push({
            objectId: object.id,
            belongBookList: object.get('belongBookList'),
            bookDisc: bookDisc,
            bookName: object.get('bookName'),
            bookPrice: bookPrice
          })
        }
        app.globalData.booksArr = tempData

      }
    })
  }
})