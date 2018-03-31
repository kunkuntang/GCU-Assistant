// pages/user/pages/changePwd/changePwd.js
const app = getApp()
const Bmob = require('../../../../utils/bmob.js');
Bmob.initialize("6636a71c682fc816bf7f4d3678561cff", "05ea04f70d33f065e52ded897c5f4765");
const User = Bmob.Object.extend("user");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newPwd: '',
    confirmPwd: '',
    pwdNotMatch: false,
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
  bindNewPwdInput: function(e) {
    this.setData({
      newPwd: e.detail.value
    })
  },
  bindConfirmInput: function(e) {
    this.setData({
      confirmPwd: e.detail.value
    })
  },
  savePwd: function() {
    let _this = this
    if (this.data.newPwd && this.data.confirmPwd && this.data.newPwd === this.data.confirmPwd) {
      let userId = app.globalData.userId
      let userQuery = new Bmob.Query(User);
      userQuery.get(userId, {
        success: function(result) {
          result.set('password', _this.data.newPwd)
          result.save()
          _this.setData({
            pwdNotMatch: false
          })
          wx.navigateBack()
        },
        error: function() {

        }
      })
    } else {
      this.setData({
        pwdNotMatch: true
      })
      wx.showToast({
        title: '两次密码不匹配',
        duration: 3000
      });
    }
  }
})