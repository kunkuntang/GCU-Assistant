// pages/showAllBookBills/showAllBookBills.js
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookBillsArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let userBmobId = app.globalData.userBmobId
    let BookBills = Bmob.Object.extend('bookBills')
    let bookBillsQuery = new Bmob.Query(BookBills)
    bookBillsQuery.find({
      success: function(results) {
        console.log(results)
        console.log("共查询到 " + results.length + " 条记录");
        let tempData = []
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var bookBill = results[i];
          tempData.push({
            bookBillId: bookBill.id,
            bookListName: bookBill.get('bookListName'),
            belongAcaName: bookBill.get('belongAcaName'),
            belongMajName: bookBill.get('belongMajName'),
            updateTime: bookBill.updatedAt.split(' ')[0]
          })
        }
        that.setData({
          bookBillsArr: tempData
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })
  },
  
  navigateToBill: function (e) {
    let bookBillId = e.currentTarget.dataset.billid
    console.log(e)
    console.log(bookBillId)
    wx.navigateTo({
      url: '/pages/bookBillPreview/bookBillPreview?bookBillId=' + bookBillId,
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