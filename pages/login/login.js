const Bmob = require('../../utils/bmob.js');
Bmob.initialize("6636a71c682fc816bf7f4d3678561cff", "05ea04f70d33f065e52ded897c5f4765");
const Academies = Bmob.Object.extend("academyList");
const acadeniesQuery = new Bmob.Query(Academies);
const Majors = Bmob.Object.extend("majorList")
const majorsQuery = new Bmob.Query(Majors)
const app = getApp();

function _next() {
  var that = this;
  var speed = 1;
  if (this.data.progress >= this.data.stepArr[this.data.step]) {

    return true;
  }
  this.setData({
    progress: this.data.progress + speed
  });
  setTimeout(function () {
    _next.call(that);
  }, 20);
}

let acaToMaj = [
  {
    academy: '计算机工程学院',
    major: ['软件工程', '计算机科学与技术']
  }, {
    academy: '珠宝学院',
    major: ['珠宝鉴定', '珠宝设计']
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    stepArr: [0, 33.3, 66.6, 100],
    pageArr: ['classInput', 'baseInfo', 'phoneInput', 'finishedPage'],
    progress: 0,
    isFinish: false,
    pickerData: {
      stuName: "",
      stuNum: "",
      stuPhone: "",
      academyIdx: 0,
      academyArr: [{ academyName: '获取数据失败', academyId: '00000' }],
      majorIdx: 0,
      majorArr: ['软件工程', '计算机科学与技术'],
      classIdx: 0,
      classArr: [1, 2, 4, 5],
      isAddClass: false,
      belongClass: 0
    },
    userInfo: {
      nickName: 'xingkongus',
      avatarUrl: '../../images/home.png'
    }
  },
  cancel: function (e) {
    let curStep = this.data.step
    if (curStep != 2) {
      wx.navigateBack()
    } else {
      let nextStep = curStep + 1
      this.setData({
        step: nextStep
      })
    }
  },
  next: function (e) {
    let curStep = this.data.step     
    let lastStep = this.data.pageArr.length - 2
    console.log(lastStep)
    if (curStep === lastStep) {
      // wx.navigateTo({
      //   url: '/pages/index/index',
      // })
      
      saveUserInfo(this.data.pickerData).then((value)=>{
        // app.globalData.mesInfo.title = '添加成功'
        // app.globalData.mesInfo.mainBtnTxt = '完成'
        // wx.redirectTo({
        //   url: '/pages/messagePage/messagePage',
        // })  
        this.setData({
          isFinish: true
        })

      }, (value)=> {

      })
    } else {
      this.setData({
        step: ++this.data.step
      })
      _next.call(this)
    }
  },
  bindKeyInput: function (e) {
    console.log(e)
    let tmpPickerData = this.data.pickerData
    tmpPickerData[e.target.dataset.field] = e.detail.value
    this.setData({
      pickerData: tmpPickerData
    })
  },
  bindAcademyChange: function (e) {
    console.log(e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let _this = this
    let tmpPickerData = this.data.pickerData
    let curSelectIdx = e.detail.value
    tmpPickerData.academyIdx = curSelectIdx
    let curSelMajId = this.data.pickerData.academyArr[curSelectIdx].academyId
    this.setData({
      pickerData: tmpPickerData
    })
    this.getMajorList(curSelMajId)
  },
  getMajorList: function (curSelMajId) {
    let _this = this
    majorsQuery.equalTo('belongAca', curSelMajId)
    new Promise((resolve, reject) => {
      majorsQuery.find({
        success: (results) => {
          let tempArr = []
          console.log("共查询到 " + results.length + " 条记录");
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.id + ' - ' + object.get('majorName'));
            tempArr.push({
              majorName: object.get('majorName'),
              majorId: object.id
            })
          }
          resolve(tempArr)
        }
      })
    }).then((value) => {
      let tempPickerData = _this.data.pickerData
      console.log(value)
      tempPickerData.majorArr = value
      _this.setData({
        pickerData: tempPickerData
      })
    }, (value) => {
      console.warn('获取信息失败')
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let tmpObj = this.data.pickerData
    tmpObj[e.target.dataset.type] = e.detail.value
    this.setData({
      pickerData: tmpObj
    })
    // this.setData({
    //   classIdx: e.detail.value
    // })
  },
  login: function (e) {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  addClass: function(e) {
    let tmpObj = this.data.pickerData
    tmpObj.isAddClass = true
    this.setData({
      pickerData: tmpObj
    })    
  },
  mainBtnAction: function() {
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    new Promise((resolve, reject)=> {
      acadeniesQuery.find({
        success: function (results) {
          let tempArr = []
          console.log("共查询到 " + results.length + " 条记录");
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.id + ' - ' + object.get('academyName'));
            tempArr.push({
                academyName: object.get('academyName'),
                academyId: object.id
            })
          }
          resolve(tempArr)
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
          reject(error)
        }
      });
    }).then((value) => {
      let tempPickerData = _this.data.pickerData
      console.log(value)
      let initMajorId = value[0].majorId
      this.getMajorList(initMajorId)
      tempPickerData.academyArr = value
      _this.setData({
        userInfo: app.globalData.userInfo,
        pickerData: tempPickerData
      })
    }, (value) => {
      console.warn('获取信息失败')
    })
    
    
  }
})

function saveUserInfo(userData) {
  return new Promise((reslove, reject) => {
    console.log(userData)
    let User = Bmob.Object.extend("user");
    let userQuery = new Bmob.Query(User);
    let user = new User();
    let userId = app.globalData.userId
    let belongAcaId = userData.academyArr[userData.academyIdx].academyId
    let belongMajorId = userData.majorArr[userData.majorIdx].majorId
    let belongClass = null
    if (userData.isAddClass) {
      belongClass = parseInt(userData.belongClass)
    } else {
      belongClass = userData.classArr[userData.classIdx]
    }
    console.log('belongAcaId: ', belongAcaId)
    console.log('belongMajorId: ', belongMajorId)
    userQuery.get(userId, {
      success: function (result) {
        console.log('success', result.id)
        result.set('stuPhone', userData.stuPhone)
        result.set('stuName', userData.stuName)
        result.set('stuNum', userData.stuNum)
        result.set('belongAcaId', belongAcaId)
        result.set('belongMajorId', belongMajorId)
        result.set('belongClass', belongClass)
        result.save()
        reslove()
      },
      error: function(result, error) {
        console.log('result', result)
        console.log('fail', error)
      }
    })
  })
}