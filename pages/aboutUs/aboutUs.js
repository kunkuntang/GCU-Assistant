// pages/aboutUs/aboutUs.js
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSucPage: false
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

  formSubmit: function(e) {
    let that = this
    let curUser = Bmob.User.current()
    let feelBackContent = e.detail.value.textarea
    let FeelBackList = Bmob.Object.extend('feelBackList')
    let feelBack = new FeelBackList()
    console.log(curUser.get('stuName'))
    feelBack.set('feelBackContent', feelBackContent)
    feelBack.set('stuName', curUser.get('stuName'))
    feelBack.set('stuPhone', curUser.get('stuPhone'))
    feelBack.set('stuNum', curUser.get('stuNum'))
    feelBack.set('stuId', curUser.id)
    
    feelBack.save(null, {
      success: function(result) {
        if (result.id) {
          that.setData({
            showSucPage: true
          })
        } else {
          wx.showToast({
            title: '保存出错,请稍后重试',
            iamge: '/images/error.png',
          })
        }
      },
      error: function(e) {
        wx.showToast({
          title: '保存出错,请稍后重试',
          iamge: '/images/error.png',
        })
      }
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
  
  }
})