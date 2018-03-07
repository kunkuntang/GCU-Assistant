const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSetInfo: false,
    belongMajName: '',
    belongAcaName: '',
    belongClass: '',
    contactListData: [],
    listStatus: -1
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
    this.setData({
      hasSetInfo: app.userInfo.hasSetInfo,
    })

    if (!app.userInfo.hasSetInfo) {
      wx.showModal({
        title: '请完善信息',
        content: '完善信息后可以查看本班的通讯录',
        confirmText: "去完善",
        cancelText: "暂不",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            console.log('用户点击辅助操作')
          }
        }
      });

    } else {
      let that = this
      let userQuery = new Bmob.Query(Bmob.User);
      let belongMajorId = app.userInfo.belongMajorId
      let belongClassId = app.userInfo.belongClass
      let majorList = Bmob.Object.createWithoutData('majorList', belongMajorId);
      userQuery.equalTo('belongMajor', majorList)
      userQuery.equalTo('belongClass', belongClassId)
      userQuery.select('stuName')
      userQuery.select('stuPhone')
      userQuery.select('stuShortPhone')
      userQuery.select('allowShowPhone')
      userQuery.find({
        success: function(results) {
          let tempDataArr = []
          results.forEach(el => {
            if (el.get('allowShowPhone')) {
              tempDataArr.push({
                stuName: el.get('stuName'),
                stuPhone: el.get('stuPhone') || '(未填写)',
                stuShortPhone: el.get('stuShortPhone') || '(未填写)'
              })
            }
          })
          that.setData({
            belongAcaName: app.userInfo.belongAcaName,
            belongMajorName: app.userInfo.belongMajorName,
            belongClass: app.userInfo.belongClass,
            contactListData: tempDataArr,
            listStatus: tempDataArr.length ? 1 : 0
          })

        }
      })
    }
  },
  makeCall: function(e) {
    let telNum = e.currentTarget.dataset.stunum
    wx.makePhoneCall({
      phoneNumber: telNum,
    })
  },

  addContact: function(e) {
    console.log(e)
    let index = e.target.dataset.itemindex
    let userInfo = this.data.contactListData[index]

    wx.addPhoneContact({
      firstName: userInfo.stuName,
      mobilePhoneNumber: userInfo.stuPhone
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