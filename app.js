//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("6636a71c682fc816bf7f4d3678561cff", "05ea04f70d33f065e52ded897c5f4765");

App({
  onLaunch: function () {
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (cb) {
    let that = this;
    var user = new Bmob.User();//开始注册用户
    console.log(this.globalData)
    if (!this.globalData.userInfo) {
      wx.login({
        success: function (res) {
          wx.request({
            url: 'https://lenkuntang.cn/getSessionKey',
            method: 'POST',
            data: {
              jsCode: res.code
            },
            success: function (res) {
              console.log(res)
              var openid = res.data.openid;
              //保存用户其他信息
              wx.getUserInfo({
                success: function (result) {
                  console.log(result)
                  that.globalData.userInfo = result.userInfo

                  var User = Bmob.Object.extend("user");

                  var query = new Bmob.Query(User);
                  query.equalTo('openid', openid)
                  query.find({
                    success: function (res) {
                      console.log(res)
                      if (res.length) {
                        // 旧用户
                        var info = res[0].attributes
                        console.log(info)
                        console.log('already login')
                        cb({
                          nickName: info.nickName,
                          avatarUrl: info.avatarUrl
                        })
                      } else {
                        // 新用户
                        console.log('first login');
                        var userInfo = result.userInfo;
                        var nickName = userInfo.nickName;
                        var avatarUrl = userInfo.avatarUrl;

                        var user = new User();
                        // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                        user.save({
                          nickName: nickName,
                          avatarUrl: avatarUrl,
                          openid: openid
                        }, {
                            success: function (result) {
                              // 自动绑定之前的账号
                              console.log("user创建成功, objectId:" + result.id);
                            },
                            error: function (result, error) {
                              // 添加失败
                              console.log('创建日记失败');
                              console.log('result', result);
                              console.log('error', error);
                            }
                          });
                          console.log(that.globalData.userInfo)
                          // 把用户信息保存在全局变量里
                          cb({
                            nickName: info.nickName,
                            avatarUrl: info.avatarUrl
                          })
                      }
                    },
                    error: function () {
                      console.log('error')
                    }
                  })
                }
              });
            },
            fail: function (res) {
              console.log(res)
            }
          })
          console.log(that.globalData.userInfo)
        }
      })
    }
  },
  globalData:{
    userInfo: null
  }
})