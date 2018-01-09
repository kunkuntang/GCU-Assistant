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
function login() {
  wx.login({
    success: (res) => {
      console.log('wx.login res', res)
      wx.request({
        url: 'https://lenkuntang.cn/getSessionKey',
        method: 'POST',
        data: {
          jsCode: res.code
        },
        success: function (res) {
          console.log('request node server res', res)
          getUserInfo(res.data.openid)
        },
        fail: function (res) {
          console.log(res)
        }
      })
      // console.log(that.globalData.userInfo)
    },
    fail: (err) => {
      console.log('login interface fail: ', err)
    }
  })
}

/**
 * 获取用户信息
 */
function getUserInfo(openId) {
  wx.getUserInfo({
    success: function (result) {
      console.log('wx.getUserInfo ', result)
      app.globalData.userInfo = result.userInfo
      createNewUser(openId)
    }
  });
}

/**
 * 保存用户信息
 */
function createNewUser(openId) {
  let User = Bmob.Object.extend("user");
  let query = new Bmob.Query(User);
  //bmob条件查询
  query.equalTo("openid", openId);
  query.find({
    success: function (res) {
      if (res.length) {
        // 旧用户
        let info = res[0].attributes
        app.globalData.userBombId = res[0].id
        console.log('res:', res)
        console.log(info)
        console.log('database already login')
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        // 新用户
        console.log('first login database');
        var userInfo = result.userInfo;
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;

        var user = new User();
        user.save({
          nickName: nickName,
          avatarUrl: avatarUrl,
          openid: openid
        }, {
            success: function (result) {
              // 自动绑定之前的账号
              console.log("user创建成功, objectId:" + result.id);
              app.globalData.userId = result.id
              
              wx.redirectTo({
                url: '/pages/login/login',
              })
            },
            error: function (result, error) {
              // 添加失败
              console.log('创建失败');
              console.log('result', result);
              console.log('error', error);
            }
          });
      }
    },
    error: function (result, err) {
      console.log('error', err)
    }
  })
}