// pages/showAllBookBills/showAllBookBills.js
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookBillsArr: [],
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    let currentUser = Bmob.User.current();
    let User = new Bmob.User()
    User.id = currentUser.id

    let BookBills = Bmob.Object.extend('bookBills')
    let bookBillsQuery = new Bmob.Query(BookBills)

    bookBillsQuery.equalTo("belongUser", User)
    bookBillsQuery.include("belongBookList", "belongMajor", "belongAcademy")
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
            bookListName: bookBill.get('belongBookList').bookListName,
            belongAcaName: bookBill.get('belongAcademy').academyName,
            belongMajName: bookBill.get('belongMajor').majorName,
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

  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },

  navigateToBill: function (e) {
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (this.touchEndTime - this.touchStartTime < 350) {
      let bookBillId = e.currentTarget.dataset.billid
      console.log(e)
      console.log(bookBillId)
      wx.navigateTo({
        url: '/pages/bookBillPreview/bookBillPreview?bookBillId=' + bookBillId,
      })
    }
  },

  delBookBill: function(e) {
    let that = this
    let bookBillId = e.currentTarget.dataset.billid
    let Bills = Bmob.Object.extend('bookBills')
    let billsQuery = new Bmob.Query(Bills)
    let Books = Bmob.Object.extend('books')
    let booksQuery = new Bmob.Query(Books)
    wx.showModal({
      title: '确定要删除此书单？',
      content: '删除后请及时通知负责人且已删除的书单不能恢复！',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('bookBillId', bookBillId)
          billsQuery.get(bookBillId, {
            success: function (bookBill) {
              console.log('bookBill', bookBill)
              let containBooks = JSON.parse(bookBill.get('containBooks'))
              let containBooksId = []
              containBooks.forEach((book) => {
                containBooksId.push(book.bookId)
              })

              booksQuery.find({
                success: function (results) {
                  results.forEach((book) => {
                    if (containBooksId.includes(book.id)) {
                      book.increment('buyCount', -1)
                    }
                  })
                  Bmob.Object.saveAll(results)
                  bookBill.destroy({
                    success: function (bill) {
                      wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        mask: true
                      })
                      that.onLoad()
                    }
                  })
                }
              })


            }
          })
        } else {
          console.log('用户点击辅助操作')
        }
      }
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