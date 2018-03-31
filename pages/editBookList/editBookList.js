const app = getApp()
const Bmob = app.bookBmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookListName: '',
    academyName: '',
    majorName: '',
    selectedBooksArr: [],
    sumPrice: 0,

    booksArr: [],
    bookBillId: ''
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    let sumPrice = 0
    var booksArr = this.data.booksArr,
      values = e.detail.value;
    for (var i = 0, lenI = booksArr.length; i < lenI; ++i) {
      booksArr[i].attributes.checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (booksArr[i].id == values[j]) {
          booksArr[i].attributes.checked = true;
          sumPrice += booksArr[i].attributes.bookFinalPri || 0
          break;
        }
      }
    }

    this.setData({
      booksArr: booksArr,
      sumPrice: sumPrice,
      selectedBooksArr: values
    });
  },
  submitBill: function() {
    let that = this
    let currentUser = Bmob.User.current();

    let BookBills = Bmob.Object.extend('bookBills')
    let billQuery = new Bmob.Query(BookBills)

    let tempData = []
    let booksArr = this.data.booksArr
    for (let i = 0; i < booksArr.length; i++) {
      let curBook = booksArr[i].attributes

      if (curBook.checked) {
        tempData.push({
          bookId: booksArr[i].id,
          bookDisc: curBook.bookDisc,
          bookName: curBook.bookName,
          bookPrice: curBook.bookPrice,
          bookFinalPri: curBook.bookFinalPri
        })
      }
    }

    billQuery.get(this.data.bookBillId, {
      success: function(result) {
        result.set("sumPrice", that.data.sumPrice)
        result.set("containBooks", JSON.stringify(tempData))
        result.save({
          success: function(res) {
            let selectedBooksArr = that.data.selectedBooksArr
            let books = that.data.booksArr
            console.log('selectedBooksArr', selectedBooksArr)
            console.log('books', books)
            books.forEach((book) => {
              // selectedBooksArr.forEach((el) => {
              console.log(selectedBooksArr.includes(book.id))
              if (selectedBooksArr.includes(book.id)) {
                if (!book.isBought) {
                  book.increment("buyCount")
                }
              } else {
                if (book.isBought) {
                  book.increment("buyCount", -1)
                }
              }
              // })
            })
            Bmob.Object.saveAll(books).then((books) => {
              console.log(books)
              wx.navigateTo({
                url: '/pages/bookBillPreview/bookBillPreview?bookBillId=' + result.id + '&isEdited=true',
              })
            })

            // console.log(that.data.selectedBooksArr)
            // that.data.selectedBooksArr.forEach((el) => {
            //     book.id = el
            //     book.increment("buyCount")

            //     book.save(null, {
            //       success: function () {
            //         wx.redirectTo({
            //           url: '/pages/bookBillPreview/bookBillPreview?bookBillId=' + result.id,
            //         })
            //       },
            //       error: function (error) {
            //         console.log(error)
            //       }
            //     })

            // })

          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let bookBillId = options.bookBillId

    let BookBills = Bmob.Object.extend('bookBills')
    let bookBillsQuery = new Bmob.Query(BookBills)

    bookBillsQuery.include("belongAcademy", "belongMajor", "belongBookList")
    bookBillsQuery.get(bookBillId, {
      success: function(result) {
        console.log(result)
        let belongBookList = result.get('belongBookList')
        let containBooks = JSON.parse(result.get('containBooks'))
        console.log("containBooks", containBooks)
        that.setData({
          academyName: result.get('belongAcademy').academyName,
          majorName: result.get('belongMajor').majorName,
          bookListName: belongBookList.bookListName,
        })

        that.getBookListInfo(belongBookList.objectId, containBooks, bookBillId)
      }
    })
  },

  getBookListInfo: function(bookListId, containBooks, bookBillId) {
    console.log(bookListId)
    let that = this
    let Books = Bmob.Object.extend('books')
    let books = new Bmob.Query(Books)
    let sumPrice = 0
    books.equalTo('belongBookList', bookListId)
    books.find({
      success: function(results) {
        console.log('books', results)
        let tempDta = []
        let boughtBookIdArr = []
        let sumPrice = 0
        containBooks.forEach((el) => {
          boughtBookIdArr.push(el.bookId)
          sumPrice += Number(el.bookFinalPri)
        })

        results.forEach((book) => {
          let isBought = boughtBookIdArr.includes(book.id)
          console.log('isBought', isBought)
          book.attributes.bookFinalPri = Number(book.get('bookPrice')) * Number(book.get('bookDisc')) * 0.1
          book.attributes.checked = isBought
          book.isBought = isBought
        })
        that.setData({
          booksArr: results,
          sumPrice: sumPrice,
          bookBillId: bookBillId
        })
      }
    })
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

  },

})