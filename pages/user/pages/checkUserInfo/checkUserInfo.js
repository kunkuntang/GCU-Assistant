// pages/user/pages/checkUserInfo/checkUserInfo.js
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    academyIdx: 0,
    academyList: [],
    majorIdx: 0,
    majorList: [],
    classIdx: 0,
    classList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    stuName: '',
    stuNum: '',
    stuPhone: '',
    stuShortPhone: '',
    allowShowPhone: true
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
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let currentUser = Bmob.User.current();
    let userQuery = new Bmob.Query(Bmob.User);
    userQuery.get(currentUser.id, {
      success: function(result) {
        that.setData({
          stuName: result.get('stuName'),
          stuNum: result.get('stuNum'),
          stuPhone: result.get('stuPhone'),
          stuShortPhone: result.get('stuShortPhone'),
          allowShowPhone: result.get('allowShowPhone')
        })
      }
    })
    let AcademyList = Bmob.Object.extend('academyList')
    let MajorList = Bmob.Object.extend('majorList')
    let academyListQuery = new Bmob.Query(AcademyList)
    academyListQuery.find({
      success: (results) => {
        let belongAcaId = app.userInfo.belongAcademyId
        let selectedIdx = 0
        results.forEach((el, idx) => {
          if (belongAcaId == el.id) {
            selectedIdx = idx
          }
        })
        that.setData({
          academyList: results,
          academyIdx: selectedIdx
        })
      }
    })
    let majorListQuery = new Bmob.Query(MajorList)
    let academyObject = new Bmob.Object.createWithoutData('academyList', app.userInfo.belongAcademyId)
    majorListQuery.equalTo('belongAcademy', academyObject)
    majorListQuery.find({
      success: function(results) {
        let belongMajorId = app.userInfo.belongMajorId
        let selectedIdx = 0
        results.forEach((el, idx) => {
          if (el.id == belongMajorId) {
            selectedIdx = idx
          }
        })
        that.setData({
            majorList: results,
            majorIdx: selectedIdx
          })
          // setTimeout(wx.hideLoading, 500)
        wx.hideLoading()
      }
    })
  },

  bindKeyInput: function(e) {
    let tempObject = this.data
    tempObject[e.target.dataset.field] = e.detail.value
    this.setData(tempObject)
  },

  bindAcademyChange: function(e) {
    let that = this
    let idx = e.detail.value
    let selectedAcaId = this.data.academyList[idx].id
    let academyObject = Bmob.Object.createWithoutData('academyList', selectedAcaId)
    let MajorList = Bmob.Object.extend('majorList')
    let majorListQuery = new Bmob.Query(MajorList)
    majorListQuery.equalTo('belongAcademy', academyObject)
    majorListQuery.find({
      success: function(results) {
        that.setData({
          academyIdx: idx,
          majorList: results
        })
      }
    })
  },

  bindMajorChange: function(e) {
    let idx = e.detail.value
    this.setData({
      majorIdx: idx
    })
  },

  bindClassChange: function(e) {
    let idx = e.detail.value
    this.setData({
      classIdx: idx
    })
  },

  bindShowPhoneChange: function(e) {
    let isShow = e.detail.value
    this.setData({
      allowShowPhone: isShow
    })
  },

  saveUserInfo: function() {
    let wxData = this.data
    let currentUser = Bmob.User.current();
    let userQuery = new Bmob.Query(Bmob.User);
    let belongAcaId = wxData.academyList[wxData.academyIdx].id
    let belongAcaName = wxData.academyList[wxData.academyIdx].get('academyName')
    let belongMajorId = wxData.majorList[wxData.majorIdx].id
    let belongMajorName = wxData.majorList[wxData.majorIdx].get('majorName')
    let belongClass = wxData.classList[wxData.classIdx]

    userQuery.get(currentUser.id, {
      success: function(result) {
        let Major = Bmob.Object.createWithoutData("majorList", belongMajorId);
        let Academy = Bmob.Object.createWithoutData("academyList", belongAcaId);
        result.set('stuPhone', wxData.stuPhone)
        result.set('stuShortPhone', wxData.stuShortPhone)
        result.set('stuName', wxData.stuName)
        result.set('stuNum', wxData.stuNum)
        result.set('belongAcademy', Academy)
        result.set('belongAcaName', belongAcaName)
        result.set('belongMajor', Major)
        result.set('belongMajorName', belongMajorName)
        result.set('belongClass', belongClass)
        result.set('allowShowPhone', wxData.allowShowPhone)
        result.save()
        app.userInfo.belongAcademyId = belongAcaId
        app.userInfo.belongAcademyName = belongAcaName
        app.userInfo.belongMajor = belongMajorId
        app.userInfo.belongMajorName = belongMajorName
        app.userInfo.belongClass = belongClass
        wx.navigateBack()
      },
      error: function(result, error) {
        console.log('result', result)
        console.log('fail', error)
      }
    })
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

  }
})