const app = getApp()
const Bmob = app.Bmob
const Academies = Bmob.Object.extend("academyList");
const acadeniesQuery = new Bmob.Query(Academies);
const Majors = Bmob.Object.extend("majorList")
const majorsQuery = new Bmob.Query(Majors)

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
      stuShortPhone: '',
      academyIdx: 0,
      academyArr: [{ academyName: '获取数据失败', academyId: '00000' }],
      majorIdx: 0,
      majorArr: ['软件工程', '计算机科学与技术'],
      classIdx: 0,
      classArr: [1, 2, 4, 5, 6,7,8,9,10,11,12,13,14],
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
      saveUserInfo(this.data.pickerData).then((value)=>{
        this.setData({
          isFinish: true
        })

      }, (value)=> {

      })
    } else {
      let isValidate = true
      let tipsMes = ''
      switch(curStep) {
        case 0: {
          if (this.data.pickerData.isAddClass) {
            if (!this.data.pickerData.belongClass){
              isValidate = false
              tipsMes = '班级不能为空'
            }
          }
          break;
        }
        case 1: {
          if (!this.data.pickerData.stuNum || !this.data.pickerData.stuName) {
            isValidate = false
            tipsMes = '学号或姓名不能为空'
          }
          break;
        }
      }
      if (isValidate) {
        this.setData({
          step: ++this.data.step
        })
        _next.call(this)
      } else {
        wx.showToast({
          title: tipsMes,
          icon: 'loading'
        })
      }
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
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function() {

      }
    })
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
      setTimeout(wx.hideLoading, 500)
    }, (value) => {
      console.warn('获取信息失败')
    })
    
    
  }
})

function saveUserInfo(userData) {
  return new Promise((reslove, reject) => {
    console.log(userData)
    let currentUser = Bmob.User.current();
    let userQuery = new Bmob.Query(Bmob.User);
    let belongAcaId = userData.academyArr[userData.academyIdx].academyId
    let belongAcaName = userData.academyArr[userData.academyIdx].academyName
    let belongMajorId = userData.majorArr[userData.majorIdx].majorId
    let belongMajorName = userData.majorArr[userData.majorIdx].majorName
    let belongClass = null
    if (userData.isAddClass) {
      belongClass = parseInt(userData.belongClass)
    } else {
      belongClass = userData.classArr[userData.classIdx]
    }
    userQuery.get(currentUser.id, {
      success: function (result) {
        let Major = Bmob.Object.createWithoutData("majorList", belongMajorId);
        let Academy = Bmob.Object.createWithoutData("academyList", belongAcaId);
        console.log('success', result.id)
        result.set('stuPhone', userData.stuPhone)
        result.set('stuShortPhone', userData.stuShortPhone)
        result.set('stuName', userData.stuName)
        result.set('stuNum', userData.stuNum)
        result.set('username', userData.stuNum)
        result.set('belongAcademy', Academy)
        result.set('belongAcaName', belongAcaName)
        result.set('belongMajor', Major)
        result.set('belongMajorName', belongMajorName)
        result.set('belongClass', belongClass)
        result.set('hasSetInfo', true)
        result.save()
        app.userInfo.belongAcademyId = belongAcaId
        app.userInfo.belongAcademyName = belongAcaName
        app.userInfo.belongMajor = belongMajorId
        app.userInfo.belongMajorName = belongMajorName
        app.userInfo.belongClass = belongClass
        app.userInfo.hasSetInfo = true
        reslove(userData)
      },
      error: function(result, error) {
        console.log('result', result)
        console.log('fail', error)
      }
    })
  })
}