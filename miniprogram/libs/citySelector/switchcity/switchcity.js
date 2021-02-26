const city = require('../city.js');
const cityObjs = require('../city.js');
const config = require('../config.default.js');
const appInstance = getApp();
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中",
    currentCityCode: '',
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' },  { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' }, ],
    commonCityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }],
    countyList: [{ cityCode: 110000, county: 'A区' }, { cityCode: 310000, county: 'B区' }, { cityCode: 440100, county: 'C区' }, { cityCode: 440300, county: 'D区' }, { cityCode: 330100, county: 'E县' }, { cityCode: 320100, county: 'F县' }, { cityCode: 420100, county: 'G县' }],
    inputName: '',
    completeList: [],
    county: '',
    condition: false,
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log("options: ",options)
    const back_url = options.back_url;
    const searchLetter = city.searchLetter;
    const cityList = city.cityList();
    const sysInfo = wx.getSystemInfoSync();
    console.log(sysInfo);
    const winHeight = sysInfo.windowHeight;
    const itemH = winHeight / searchLetter.length;
    let tempArr = [];

    searchLetter.map(
      (item,index) => {
        // console.log(item);
        // console.log(index);
        let temp = {};
        temp.name = item;
        temp.tHeight = index * itemH;
        temp.bHeight = (index + 1) * itemH;
        tempArr.push(temp)
      }
    );
    // console.log(tempArr);
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempArr,
      cityList: cityList,
      back_url: back_url,
    });

    this.getLocation();

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

  clickLetter: function (e) {
    // console.log(e);
    console.log(e.currentTarget.dataset.letter)
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    // const that = this;
    // wx.showToast({
    //   title: showLetter,
    //   disabled: true,
    //   duration: 500,
    //   complete: function() {
    //     that.setData({
    //       scrollTopId: showLetter,
    //     })
    //   }
    // })
    const that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)
  },
  reGetLocation: function() {
    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = this.data.county
    console.log(appInstance.globalData.defaultCity);
    //返回首页
    wx.switchTab({
      url: this.data.back_url
    })
  },
  //选择城市
  bindCity: function (e) {
    // console.log("bindCity");
    // console.log(e);
    this.setData({
      condition:true,
      city: e.currentTarget.dataset.city,
      currentCityCode: e.currentTarget.dataset.code,
      scrollTop: 0,
      completeList: [],
    })
    this.selectCounty()

    appInstance.globalData.defaultCity = this.data.city
    appInstance.globalData.defaultCounty = ''
    console.log(appInstance.globalData.defaultCity)
  },

  bindCounty: function(e) {
    /////console.log(e);
    this.setData({ county: e.currentTarget.dataset.city })
    ///// appInstance.globalData.defaultCounty = this.data.county
    ///// console.log(appInstance.globalData.defaultCounty);
    
    var address = this.data.city + this.data.county;
    console.log(address);
    wx.request({
        url: `https://apis.map.qq.com/ws/geocoder/v1/?address=${address}&key=${config.key}`,
        
        success: (res) => {
            console.log("请求地址解析成功" + `https://apis.map.qq.com/ws/geocoder/v1/?address=${address}&key=${config.key}`);
            console.log(res)
            //设置数据到上个页面
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            prevPage.setData({
                address: res.data.result.address_components
            });

            //------------用“市”作为city数据----------//
            let city = res.data.result.address_components.city;
            //////console.log("city before change", city)
            city = city.replace("市","");
            //////console.log("city after change", city)

            //------------向全局变量添加数据----------//
            appInstance.globalData.my_citys = appInstance.globalData.my_citys.concat(city)


            //------------向数据库添加数据----------//
            const db = wx.cloud.database({
              env: 'weauser-ljny5'
            })
            //------若是第一次添加数据
            console.log("!!!!!appInstance.globalData.doc_id = ", appInstance.globalData.doc_id)
            
            if(appInstance.globalData.doc_id == undefined){
              db.collection('users').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  user_citys: [city],
                },
                success: function (res) {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                  console.log("success add city to database!!!_id=",res._id)
                  appInstance.globalData.doc_id = res._id;
                  
                },
                fail: function (err) {
                  console.log("fail add city to database!!!#### now: ", err)
                }
              })
              
            }
            else{
              const _ = db.command
              db.collection('users').doc(appInstance.globalData.doc_id).update({
                data: {
                  user_citys: _.push(city)
                },
                success: function (res) {
                  console.log("success add city to database!!!@@ now: ",res.data)

                },
                fail:function(err){
                  console.log("fail add city to database!!!@@ now: ", err)
                }
              })
            }
            wx.navigateBack();
        },
        fail: (res) => {
            console.log("请求地址解析成功，请重试");
        }
    })
    
  },

  //点击热门城市回到顶部
  hotCity: function () {
    console.log("hotCity");
    this.setData({
      scrollTop: 0,
    })
  },
  bindScroll: function (e) {
  //  console.log(e.detail)
  },
  selectCounty: function() {
    console.log("正在定位区县");
    let code = this.data.currentCityCode
    // console.log(code);
    const that = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`,
      success: function(res) {
        // console.log(res.data)
        // console.log(res.data.result[0]);
        that.setData({
          countyList: res.data.result[0],
        })
        // console.log(that.data.countyList);
        console.log("请求区县成功"+`https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`);
        // console.log(res)
      },
      fail: function() {
        console.log("请求区县失败，请重试");
      }
    })
  },
  getLocation: function() {
    console.log("正在定位城市");
    this.setData({
      county: ''
    })
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`,
            success: res => {
              // console.log(res)
              // console.log(res.data.result.ad_info.city+res.data.result.ad_info.adcode);
              that.setData({
                city: res.data.result.ad_info.city,
                currentCityCode: res.data.result.ad_info.adcode,
                county: res.data.result.ad_info.district
              })
              that.selectCounty();
            }
        })
      }
    })
  },
  
  bindBlur: function(e) {
    this.setData({
      inputName: ''
    })
  },
  bindKeyInput: function(e) {
    // console.log("input: " + e.detail.value);
    this.setData({
      inputName: e.detail.value
    })
    this.auto()
  },
  auto: function () {
    let inputSd = this.data.inputName.trim()
    let sd = inputSd.toLowerCase()
    let num = sd.length
    const cityList = cityObjs.cityObjs
    // console.log(cityList.length)
    let finalCityList = []

    let temp = cityList.filter(
      item => {
        let text = item.short.slice(0, num).toLowerCase()
        return (text && text == sd)
      }
    )
    //在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    let tempShorter = cityList.filter(
      itemShorter => {
        if (itemShorter.shorter) {
          let textShorter = itemShorter.shorter.slice(0, num).toLowerCase()
        return (textShorter && textShorter == sd)
        }
        return
      }
    )

    let tempChinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.city.slice(0, num)
        return (textChinese && textChinese == sd)
      }
    )

    if (temp[0]) {
      temp.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      )
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempShorter[0]) {
      tempShorter.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        }
      );
      this.setData({
        completeList: finalCityList,
      })
    } else if (tempChinese[0]) {
      tempChinese.map(
        item => {
          let testObj = {};
          testObj.city = item.city
          testObj.code = item.code
          finalCityList.push(testObj)
        })
      this.setData({
        completeList: finalCityList,
      })
    } else {
      return
    }
  },
})
