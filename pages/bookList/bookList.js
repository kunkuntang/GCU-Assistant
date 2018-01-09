Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [
      {
        bookId: 0,
        bookPic: '../../images/home.png',
        bookName: 'js',
        bookPrice: 100,
        bookDiscount: 0.7,
        isSelected: false
      },
      {
        bookId: 1,
        bookPic: '../../images/home.png',
        bookName: 'css',
        bookPrice: 100,
        bookDiscount: 0.7,
        isSelected: false
      },
      {
        bookId: 2,
        bookPic: '../../images/home.png',
        bookName: 'nodejs',
        bookPrice: 100,
        bookDiscount: 0.7,
        isSelected: false
      },
      {
        bookId: 3,
        bookPic: '../../images/home.png',
        bookName: 'html',
        bookPrice: 100,
        bookDiscount: 0.7,
        isSelected: false
      }
    ],
    selected: [],
    sumPrice: 0
  },
  selectBook: function (e) {
    var idx = e.currentTarget.dataset.index
    var tempData = this.data.bookList
    var bookId = tempData[idx].bookId
    var isBuy = tempData[idx].isSelected = !this.data.bookList[idx].isSelected

    var tempSelected = this.data.selected
    var tempSumPrice = this.data.sumPrice
    if (isBuy) {
      tempSelected.push(bookId)
      tempSumPrice += tempData[idx].bookPrice
    } else {
      tempSumPrice -= tempData[idx].bookPrice
      tempSelected.splice(tempSelected.indexOf(bookId), 1)
    }
    this.setData({
      bookList: tempData,
      selected: tempSelected,
      sumPrice: tempSumPrice
    })
    console.log(tempSelected)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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