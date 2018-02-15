// pages/bookBillPreview/bookBillPreview.js
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookBillId: '',
    sumPrice: '',
    booksArr: [],
    isEdited: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)    
    let that = this
    let bookBillId = option.bookBillId
    let BookBills = Bmob.Object.extend('bookBills')
    let bookBillsQuery = new Bmob.Query(BookBills)
    console.log(bookBillId)
    bookBillsQuery.get(bookBillId, {
      success: function (result) {
        console.log(result)
        let booksArr = result.get('containBooks')
        that.setData({
          sumPrice: result.get('sumPrice'),
          booksArr: JSON.parse(booksArr),
          isEdited: option.isEdited
        })
      },
      error: function(result, error) {
        console.log(error)
      }
    })
    this.setData({
      bookBillId: bookBillId
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