// const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
// var qqmapsdk;
const app = getApp()
const Bmob = app.bookBmob

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curLatitude: 0,
    curLongitude: 0,
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
  onLoad: function(options) {
    // 实例化腾讯地图API核心类
    // qqmapsdk = new QQMapWX({
    //   key: '27MBZ-XSH3X-K2X4N-7UW2F-BVFQE-OOFKA'
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('myMap')
  },

  getCenterLocation: function() {
    this.mapCtx.getCenterLocation({
      success: function(res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function() {
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
  onShow: function() {
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
        console.log(results)
        results.forEach(location => {
          let belongCate = location.get('belongCate').locationCateName
          let locaData = {
            locationName: location.get('locationName'),
            longitude: location.get('longitude'),
            latitude: location.get('latitude'),
            icon: '',
            id: location.id
          }

          if (cateObj[belongCate]) {
            cateObj[belongCate].push(locaData)
          } else {
            cateObj[belongCate] = [locaData]
          }
        })

        Object.keys(cateObj).forEach(cateName => {
          cateArr.push({
            cateName: cateName,
            cateList: cateObj[cateName],
            selected: false,
          })
        })

        that.setData({
          locationList: cateArr
        })
      }
    })

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
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

        // let i = 0
        // let tempMarkers = []
        // tempMarkers.push({
        //   iconPath: "/resources/others.png",
        //   id: i++,
        //   latitude: latitude,
        //   longitude: longitude,
        //   width: 50,
        //   height: 50,
        //   title: 'title',
        //   alpha: 0.9,
        //   callout: {
        //     content: 'this is a callout content',
        //     borderRadius: 4,
        //     bgColor: '#fff',
        //     padding: 3,
        //     display: 'ALWAYS',
        //     textAlign: 'left'
        //   },
        //   label: {
        //     content: 'this is a label',
        //     x: 8,
        //     y: 8,
        //     borderWidth: 3,
        //     borderColor: '#000',
        //     borderRadius: 2,

        //   }
        // })

        that.setData({
          curLongitude: longitude,
          curLatitude: latitude,
          polyline: tempPolyline
        })
      }
    })

  },

  selectLocation: function(e) {
    let that = this
    let selectedLocation = []
    let cateIndex = e.currentTarget.dataset.cateindex
    let locationList = this.data.locationList
    let cateList = locationList[cateIndex].cateList
    let markers = []
    let curLatitude = this.data.curLatitude
    let curLongitude = this.data.curLongitude
    let includeLatitude = 0
    let includeLongitude = 0
    let minDistance = 1000
    let tempPolyline = this.data.polyline

    // console.log(cateIndex)
    // console.log(locationList)
    // console.log(cateList)

    // 把所有的地点重置为未选中
    locationList.forEach((el, index) => {
      el.selected = false
    })

    locationList[cateIndex].selected = true

    console.log(locationList[cateIndex].cateList)


    selectedLocation = locationList[cateIndex].cateList
    selectedLocation.forEach(location => {
      let distance = Math.pow(Math.abs(location.latitude - curLatitude), 2) * Math.pow(Math.abs(location.longitude - curLongitude), 2)
      console.log(distance)
      if (minDistance > distance) {
        minDistance = distance
        includeLatitude = location.latitude
        includeLongitude = location.longitude
      }
      markers.push({
        label: {
          content: location.locationName,
          bgColor: '#FFFFFF',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#2C2C2C',
          padding: 3
        },
        iconPath: "/resources/others.png",
        id: location.id,
        width: 10,
        height: 10,
        ...location
      })
    })

    wx.request({
      // url: 'http://apis.map.qq.com/ws/direction/v1/walking/?from=39.915285,116.403857&to=39.915285,116.803857&key=27MBZ-XSH3X-K2X4N-7UW2F-BVFQE-OOFKA',
      url: 'http://apis.map.qq.com/ws/direction/v1/walking/?from=' + curLatitude + ',' + curLongitude + '&to=' + includeLatitude + ',' + includeLongitude + '&key=27MBZ-XSH3X-K2X4N-7UW2F-BVFQE-OOFKA',
      success: function({ data }) {
        console.log(data.result.routes)
        let polyLine = []
        let routes = data.result.routes
        let steps = routes[0].steps
        var coors = routes[0].polyline;
        console.log(steps)
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }

        for (var j = 0; j < coors.length - 2; j += 2) {
          polyLine.push({
            latitude: coors[j],
            longitude: coors[j + 1]
          })
        }

        tempPolyline[0].points = polyLine

        that.setData({
          markers: markers,
          locationList: locationList,
          polyline: tempPolyline
            // selectedLocation: selectedLocation
        })

      },
      error: function(e) {
        console.log(e)
      }
    })



    this.mapCtx.includePoints({
      padding: [50],
      points: [{
        latitude: curLatitude,
        longitude: curLongitude
      }, {
        latitude: includeLatitude,
        longitude: includeLongitude
      }]
    })
  },

  goLocation: function(e) {
    let mapCtx = this.mapCtx
    let selectedLocation = this.data.selectedLocation
    let curLatitude = this.data.curLatitude
    let curLongitude = this.data.curLongitude

    this.mapCtx.includePoints({
      padding: [5],
      points: [{
          latitude: curLatitude,
          longitude: curLongitude
        },
        {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }
      ]
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