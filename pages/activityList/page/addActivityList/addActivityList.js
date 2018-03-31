// pages/reservation/page/addReservation/addReservation.js
// const { vadidator } = require('/utils/util.js')
const { Vadidator } = require('../../../../utils/util.js')
const app = getApp()
const Bmob = app.bookBmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccPage: false,
    showErr: false,
    activityName: '',
    activityLocation: '',
    organizer: '',
    cancelPwd: '',
    beginDate: '',
    beginTime: '',
    endDate: '',
    endTime: '',
    activityDetail: ''
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

  bindActName: function(e) {
    this.setData({
      activityName: e.detail.value
    })
  },

  bindActLocation: function (e) {
    this.setData({
      activityLocation: e.detail.value
    })
  },

  bindOrganizer: function(e) {
    this.setData({
      organizer: e.detail.value
    })
  },

  bindPwd: function(e) {
    this.setData({
      cancelPwd: e.detail.value
    })
  },

  bindBeginDateChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      beginDate: e.detail.value
    })
  },

  bindBeginTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      beginTime: e.detail.value
    })
  },

  bindEndTimeChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },

  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  bindActDetail: function(e) {
    this.setData({
      activityDetail: e.detail.value
    })
  },
  
  reservate: function(e) {
    this.setData({
      showErr: true
    })
    let vadidator = Vadidator()
    vadidator.add(this.data.activityName, [{ strategy: 'required', errorMsg: '活动名称必填' }], )
    vadidator.add(this.data.activityLocation, [{strategy: 'required', errorMsg: '活动地址必填'}], )
    vadidator.add(this.data.organizer, [{strategy: 'required', errorMsg: '举办方必填'}], )
    vadidator.add(this.data.beginDate, [{strategy: 'required', errorMsg: '开始日期必填'}], )
    vadidator.add(this.data.beginTime, [{strategy: 'required', errorMsg: '开始时间必填'}], )
    vadidator.add(this.data.endDate, [{strategy: 'required', errorMsg: '结束日期必填'}], )
    vadidator.add(this.data.endTime, [{strategy: 'required', errorMsg: '结束时间必填'}], )
    vadidator.add(this.data.activityDetail, [{ strategy: 'required', errorMsg: '活动详情必填' }], )
    vadidator.add(this.data.cancelPwd, [{strategy: 'required', errorMsg: '取消密码必填'}], )
    let errMsg = vadidator.start()
    if (errMsg) {
      wx.showToast({
        title: errMsg,
      })
    } else {
      let currentUser = Bmob.User.current();
      let User = new Bmob.User()
      User.id = currentUser.id
      // let BelongMajor = Bmob.Object.extend('belongMajor')
      // let belongMajor = new BelongMajor()
      // belongMajor.id = app.userInfo.belongMajorId
      let belongMajor = Bmob.Object.createWithoutData('majorList', app.userInfo.belongMajorId)
      const Activity = Bmob.Object.extend('activity')
      const activity = new Activity()
      let _this = this
      activity.save({
        activityName: _this.data.activityName,
        activityLocation: _this.data.activityLocation,
        organizer: _this.data.organizer,
        beginDate: _this.data.beginDate,
        beginTime: _this.data.beginTime,
        endDate: _this.data.endDate,
        endTime: _this.data.endTime,
        activityDetail: _this.data.activityDetail,
        belongUser: User,
        belongGroup: belongMajor
      }, function (result) {
        if (result.id) {
          _this.setDate({
            showSuccPage: true
          })
        } else {
          wx.showToast({
            title: '保存失败',
          })
        }
      })
    }
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