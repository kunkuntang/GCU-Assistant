// const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
// var qqmapsdk;
const app = getApp()
const Bmob = app.Bmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapLatitude: 0,
    mapLongitude: 0,
    markers: [],
    polyline: [],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    locationList: [],
    selectedLocation: {}
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化腾讯地图API核心类
    // qqmapsdk = new QQMapWX({
    //   key: '27MBZ-XSH3X-K2X4N-7UW2F-BVFQE-OOFKA'
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },

  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let MapLocationList = Bmob.Object.extend('mapLocationList')
    let mapLocationQuery = new Bmob.Query(MapLocationList)

    mapLocationQuery.include('belongCate')
    mapLocationQuery.ascending("locationName");
    mapLocationQuery.find({
      success: function(results) {
        let cateArr = []
        let cateObj = {}
        let tempLocaList = []
        results.forEach(location => {
          let belongCate = location.get('belongCate').locationCateName
          let locaData = {
            locationName: location.get('locationName'),
            longitude: location.get('longitude'),
            latitude: location.get('latitude'),
            icon: '',
            selected: false
          }

          if (cateObj[belongCate]) {
            cateObj[belongCate].push(locaData)
          } else {
            cateObj[belongCate] = [locaData]
          }
        })

        Object.keys(cateObj).forEach( cateName => {
          cateArr.push({
            cateName: '教学楼',
            cateList: cateObj[cateName]
          })
        })

        that.setData({
          locationList: cateArr
        })
      }
    })

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        let tempPolyline = that.data.polyline
        tempPolyline.push({
          points: [{
            longitude: longitude,
            latitude: latitude
          }],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
        })

        that.setData({
          mapLongitude: longitude,
          mapLatitude: latitude,
          polyline: tempPolyline
        })
      }
    })

  },

  selectLocation: function(e) {
    console.log(e)
    let selectedLocation = []
    let cateIndex = e.currentTarget.dataset.cateindex
    let locationIndex = e.currentTarget.dataset.locationindex
    console.log('index', cateIndex)
    console.log('locationIndex', locationIndex)
    let locationList = this.data.locationList
    let cateList = locationList[cateIndex].cateList
    
    // 把所有的地点重置为未选中
    locationList.forEach((el, index) => {
      let locationCate = el.cateList
      locationCate.forEach(location => {
        location.selected = false
      })
    })

    cateList.forEach((el, idx) => {
      if (idx == locationIndex) {
        el.selected = true
        selectedLocation = {
          latitude: el.latitude,
          longitude: el.longitude
        }
      }
    })
    this.setData({
      markers: [{
        iconPath: "/resources/others.png",
        id: 0,
        width: 50,
        height: 50,
        ...selectedLocation
      }],
      locationList: locationList,
      selectedLocation: selectedLocation
    })

    this.mapCtx.includePoints({
      padding: [50],
      points: [selectedLocation]
    })
  },

  goLocation: function(e) {
    let mapCtx = this.mapCtx
    let selectedLocation = this.data.selectedLocation
    let curLatitude = this.data.mapLatitude
    let curLongitude = this.data.mapLongitude
    console.log("latitude", selectedLocation.latitude)
    console.log("longitude", selectedLocation.longitude)

    this.mapCtx.includePoints({
      padding: [50],
      points: [
        {
          latitude: curLatitude,
          longitude: curLongitude
        },
        {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }]
    })

    let tempPolyline = this.data.polyline
    if (tempPolyline[0].points.length < 2) {
      tempPolyline[0].points.push({
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude
      })
    } else {
      tempPolyline[0].points.splice(-1, 1, {
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude
      })
    }

    this.setData({
      polyline: tempPolyline
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