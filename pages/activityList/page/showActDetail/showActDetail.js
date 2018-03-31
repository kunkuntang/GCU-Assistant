// pages/activityList/page/showActDetail/showActDetail.js
const app = getApp()
const Bmob = app.bookBmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    console.log(options)
    let that = this
    let actId = options.actId
    let Activity = Bmob.Object.extend('activity')
    let activityList = new Bmob.Query(Activity)

    activityList.get(actId, {
      success: function(result) {
        console.log(result)
        that.setData({
          activityName: result.get('activityName'),
          activityLocation: result.get('activityName'),
          organizer: result.get('organizer'),
          cancelPwd: result.get('cancelPwd'),
          beginDate: result.get('beginDate'),
          beginTime: result.get('beginTime'),
          endDate: result.get('endDate'),
          endTime: result.get('endTime'),
          activityDetail: result.get('activityDetail')
        })
      },
      error: function(object, err) {
        console.log('err', err)
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

  reservateAct: function(e) {
    console.log(e)
    let formId = e.detail.formId
    let data = this.data
    try {
      let openId = wx.getStorageSync('openid')
      wx.getStorage({
        key: 'acToken',
        success: function (res) {
          console.log('getStorage data', res.data)
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data,
            method: 'POST',
            data: {
              "touser": openId,
              "template_id": 'Gkj9vLgiV8AQArauNjWSZr6rF3YBPTfml2UeZajx_Lo',
              "data": {
                "keyword1": {
                  "value": data.activityName,
                  "color": "#173177"
                },
                "keyword3": {
                  "value": data.activityLocation,
                  "color": "#173177"
                },
                "keyword5": {
                  "value": data.organizer,
                  "color": "#173177"
                },
                "keyword2": {
                  "value": data.beginTime + data.beginDate,
                  "color": "#173177"
                }
              },
              "form_id": formId,
              "emphasis_keyword": "keyword1.DATA"
            },
            success: function (code) {
              console.log(code)
            }
          })
        }
      })
    } catch (e) {

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