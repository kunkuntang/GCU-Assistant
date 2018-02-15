const app = getApp()
const Bmob = app.Bmob
const user = new Bmob.User()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    setClassTxt: '点击设置班级',
    src: '/images/card.png',
    grids: [{
      name: '购书助手',
      imgUrl: '../../images/caculator1.svg',
      url: '/pages/bookLists/bookLists'
    }, {
      name: '通讯录',
      imgUrl: '../../images/contactCard.svg',
      url: '/pages/contacts/contacts'
    }, {
      name: '校园地图',
      imgUrl: '../../images/map.svg',
      url: '/pages/map/map'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.login({
      success: (res) => {
        console.log(res)
        user.loginWithWeapp(res.code).then(function (user) {
          var openid = user.get("authData").weapp.openid;
          console.log(user, 'user', user.id, res);

          that.setData({
            src: user.get('avatarUrl'),
            setClassTxt: user.get('nickName')
          })

          if (user.get("nickName")) {

            // 第二次登录，打印用户之前保存的昵称
            console.log(user.get("nickName"), 'res.get("nickName")');

            //更新openid
            wx.setStorageSync('openid', openid)
          } else {//注册成功的情况

            var u = Bmob.Object.extend("_User");
            var query = new Bmob.Query(u);
            query.get(user.id, {
              success: function (result) {
                wx.setStorageSync('own', result.get("uid"));
              },
              error: function (result, error) {
                console.log("查询失败");
              }
            });


            //保存用户其他信息，比如昵称头像之类的
            wx.getUserInfo({
              success: function (result) {

                var userInfo = result.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;

                var u = Bmob.Object.extend("_User");
                var query = new Bmob.Query(u);
                // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                query.get(user.id, {
                  success: function (result) {
                    // 自动绑定之前的账号

                    result.set('nickName', nickName);
                    result.set("avatarUrl", avatarUrl);
                    result.set("password", '123456');
                    result.set("openid", openid);
                    result.save();

                  }
                });
              }
            });


          }

        }, function (err) {
          console.log(err, 'errr');
        });
      },
      fail: (err) => {
        console.log('login interface fail: ', err)
      }
    })
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