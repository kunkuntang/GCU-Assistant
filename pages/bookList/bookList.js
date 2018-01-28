const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookListName: '',
    academyName: '',
    majorName: '',
    bookList: [],
    selected: [],
    sumPrice: 0,

    selectBookArr: [],
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    let sumPrice = 0
    var selectBookArr = this.data.selectBookArr, values = e.detail.value;
    for (var i = 0, lenI = selectBookArr.length; i < lenI; ++i) {
      selectBookArr[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (selectBookArr[i].objectId == values[j]) {
          selectBookArr[i].checked = true;
          sumPrice += selectBookArr[i].bookFinalPri
          break;
        }
      }
    }

    this.setData({
      selectBookArr: selectBookArr,
      sumPrice: sumPrice
    });
  },
  submitBill: function(){
    let BookBills = Bmob.Object.extend('bookBills')
    let bill = new BookBills()
    let tempData = []
    let sumPrice = this.data.sumPrice
    let selectBookArr = this.data.selectBookArr
    for (let i = 0; i < selectBookArr.length; i++) {
      let curBook = selectBookArr[i]
      if (curBook.checked)  {
        tempData.push({
          bookId: curBook.objectId,
          bookDisc: curBook.bookDisc,
          bookName: curBook.bookName,
          bookPrice: curBook.bookPrice,
          bookFinalPri: curBook.bookFinalPri
        })
      }
    }
    
    bill.save({
      belongUser: app.globalData.userBmobId,
      bookListName: app.globalData.bookListName,
      bookListId: app.globalData.bookListId,
      belongAcaName: app.globalData.belongAcaName,
      belongMajName: app.globalData.belongMajName,
      sumPrice: sumPrice,
      containBooks: JSON.stringify(tempData)
    }, {
      success: function(result) {
        console.log(result)
        wx.redirectTo({
          url: '/pages/bookBillPreview/bookBillPreview?bookBillId=' + result.id,
        })
      },
      error: function(result, error){
        console.log(error)
      }
    })
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
    let globalData = app.globalData
    let newBookList = globalData.booksArr
    newBookList.forEach((el) => {
      el.checked = false
      el.bookFinalPri = parseInt(el.bookPrice) * parseInt(el.bookDisc) * 0.1
    })
    this.setData({
      bookList: newBookList,
      selectBookArr: newBookList,
      bookListName: globalData.bookListName,
      majorName: globalData.belongMajName,
      academyName: globalData.belongAcaName
    })
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
  
})