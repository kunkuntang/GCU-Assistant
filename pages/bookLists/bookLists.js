// pages/bookLists/bookLists.js
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookListId: ''
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
    // let that = this
    // console.log(this.data.bookListId)
    // let BookList = Bmob.Object.extend('bookList')
    // let bookListQuery = new Bmob.Query(BookList)
    // bookListQuery.get(this.data.bookListId, {
    //   success: function (result){
    //     console.log(result)
    //     app.globalData.bookListName = result.get('bookListName')       
    //     app.globalData.bookListId = result.id       
    //     app.globalData.belongAcaName = result.get('belongAcaName')
    //     app.globalData.belongMajName = result.get('belongMajName')
    //     that.getBooksFromBookList()
    //   }
    // })
    // wx.request({
    //   method: 'GET',
    //   url: app.baseDevUrl + 'getBookListInfo?bookListId=' + that.data.bookListId,
    //   success: function(res) {
    //     app.globalData.bookListName = res.data.bookListName
    //     app.globalData.belongAcaName = res.data.belongAcaName
    //     app.globalData.belongMajName = res.data.belongMajName
    //     that.getBooksFromBookList()
    //   }
    // })
    
  },
  getBooksFromBookList: function() {
    let Books = Bmob.Object.extend('books')
    let booksQuery = new Bmob.Query(Books)
    booksQuery.equalTo('belongBookList', this.data.bookListId)
    booksQuery.find({
      success: function(results) {
        console.log(results)
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
    // let that = this
    // wx.request({
    //   url: app.baseDevUrl + "getBooks?bookListId=" + that.data.bookListId,
    //   method: "GET",
    //   success: function (res) {
    //     console.log(res)
    //     app.globalData.booksArr = res.data
    //     wx.navigateTo({
    //       url: '/pages/bookList/bookList',
    //     })
    //   }
    // })
  }
})