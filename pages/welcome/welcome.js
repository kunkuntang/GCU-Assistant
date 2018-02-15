const Bmob = require('../../utils/bmob.js');
Bmob.initialize("6636a71c682fc816bf7f4d3678561cff", "05ea04f70d33f065e52ded897c5f4765");

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login()
  },

  login: function () {
    // login()
  }
})

/**
 * 登陆
 */
