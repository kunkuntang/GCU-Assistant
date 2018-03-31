const app = getApp()
const Bmob = app.bookBmob
const user = new Bmob.User()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    setClassTxt: '小助手',
    src: '/images/userxhdpi.png',
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
  onLoad: function(options) {
    let that = this

    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function() {

      }
    })

    wx.login({
      success: (res) => {
        user.loginWithWeapp(res.code).then(function(user) {
          console.log(user)
          var openid = user.get("authData").weapp.openid;
          console.log(user.get("nickName"))
          if (user.get("nickName")) {
            // 第二次登录，打印用户之前保存的昵称
            that.setData({
              src: user.get('avatarUrl'),
              setClassTxt: user.get('nickName')
            })

            if (user.get('hasSetInfo')) {
              app.userInfo.belongMajName = user.get('belongMajorName')
              app.userInfo.belongMajorId = user.get('belongMajor').id
              app.userInfo.belongAcaName = user.get('belongAcaName')
              app.userInfo.belongAcademyId = user.get('belongAcademy').id
              app.userInfo.belongClass = user.get('belongClass')
              app.userInfo.avatarUrl = user.get('avatarUrl')
              app.userInfo.nickName = user.get('nickName')
            }
            app.userInfo.hasSetInfo = user.get('hasSetInfo')

            // 获取用户权限
            let UserRole = Bmob.Object.extend('userRole')
            let userRoleQuery = new Bmob.Query(UserRole)
            let User = new Bmob.User()
            User.id = user.id
            userRoleQuery.equalTo('belongUser', User)
            userRoleQuery.find({
              success: function(result) {
                console.log(result)
                let tempGrids = that.data.grids
                let uesrRole = result[0]
                let roleNum = uesrRole.get('roleNum')
                console.log(roleNum)
                if(roleNum > 9) {
                  tempGrids.push({
                    name: '活动助手',
                    imgUrl: '../../images/map.svg',
                    url: '/pages/activityList/activityList'
                  })
                }
                that.setData({
                  grids: tempGrids
                })
                
                wx.hideLoading()
              }
            })

            //更新openid
            wx.setStorageSync('openid', openid)
          } else { //注册成功的情况

            // var u = Bmob.Object.extend("_User");
            // var query = new Bmob.Query(u);
            // query.get(user.id, {
            //   success: function(result) {
            //     console.log('own', result)
            //     wx.setStorageSync('own', result.get("uid"));
            //   },
            //   error: function(result, error) {
            //     console.log("查询失败");
            //   }
            // });

            //保存用户其他信息，比如昵称头像之类的
            wx.getUserInfo({
              success: function(result) {
                console.log(result)
                var userInfo = result.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;

                var u = Bmob.Object.extend("_User");
                var query = new Bmob.Query(u);
                // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                query.get(user.id, {
                  success: function(result) {
                    // 自动绑定之前的账号
                    console.log(result)
                    result.set('nickName', nickName);
                    result.set("avatarUrl", avatarUrl);
                    result.set("password", '123456');
                    result.set("role", 1);
                    result.set("hasSetInfo", false);
                    result.set("allowShowPhone", true);
                    result.set("openid", openid);
                    
                    result.save();

                  },
                  error: function(err) {
                    console.log(err)
                  }
                });

                let User = new Bmob.User()
                User.id = user.id
                let UserRole = Bmob.Object.extend('userRole')
                let userRole = new UserRole()

                /**
                 * roleNum
                 * 9 普通用户
                 * 99 班级管理
                 * 100 社团管理
                 * 101 班级管理 + 社团管理
                 * 120 超级管理
                 */
                userRole.set('roleNum', 1)
                userRole.set('scoped', '[]')
                /**
                 * scopeStatus
                 * -1 初始值
                 * 0 拒绝 
                 * 1 待审核
                  * 2 通过
                  */
                userRole.set("scopeStatus", -1);
                userRole.set("belongUser", User);
                userRole.save(null, {
                  error: function(e) {
                    console.log(e)
                  }
                })

                that.setData({
                  src: avatarUrl,
                  setClassTxt: nickName
                })

                app.userInfo.hasSetInfo = false
                app.userInfo.avatarUrl = avatarUrl
                app.userInfo.nickName = nickName
                wx.hideLoading()

              }
            });
          }

        }, function(err) {
          console.log(err, 'errr');
        });
      },
      fail: (err) => {
        console.log('login interface fail: ', err)
      }
    })

    try {
      let acToken = wx.getStorageSync('acToken')
      let acTokenExpire = wx.getStorageSync('acTokenExpire')
      let isExpire = (Date.parse(new Date()) - parseInt(acTokenExpire)) > 7200000 ? true : false
      console.log('acToken', acToken)
      console.log('acTokenExpire', acTokenExpire)
      console.log('isExpire', isExpire)

      if (!acToken || isExpire) {
        wx.request({
          url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5b7c2e620cd2e7ea&secret=75ebd780c4aa483bce0dc23072dd40bf',
          method: 'GET',
          success: function ({data}) {
            console.log('getAcToken', data)
            wx.setStorage({
              key: 'acToken',
              data: data.access_token,
            })
            wx.setStorage({
              key: 'acTokenExpire',
              data: Date.parse(new Date())
            })
          }
        })
      }
    } catch(e) {

    }
    
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

  }
})