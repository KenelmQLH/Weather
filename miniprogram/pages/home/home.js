// pages/home/home.js
const db = wx.cloud.database({
  env:'weauser-ljny5'
})/**/
const app = getApp()

//@@@@@@ Here to import func

var choose_del= [];  //判断有没有选择!!索引与citys_info一致
var choose_del_global = []  //索引与globalData.my_citys一致

Page({

  /**
   * 页面的初始数据
   */
  data: {
    citys_name: [],//名字只是方便我加载信息
    citys_info: [],
    local_city_info: {},
    page0:0,
    choose_del:[] //传递到WXML
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("page data:", this.data);
  },

  delete_tap:function(){
    let _this = this;
    let len = app.globalData.my_citys.length
    for (let i = 0,j=0; i < len; i++,j++) {
      if (choose_del_global[i] == true) {
        app.globalData.my_citys.splice(j,1);
        j--;
        console.log(" i delete a city:", app.globalData.my_citys[j])
        
      }
      //------判断完最后一个后---更新数据库------//
      //------删除数据库 对应城市--------//
      if (i == len - 1) {
        db.collection('users').doc(app.globalData.doc_id).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            user_citys: app.globalData.my_citys
          },
          success: function (res) {
            console.log("success delete,", res)
            _this.onShow();
          },
          fail: function (err) {
            console.log("fail delete,", err)
          }
        })
      }
      
    }
  },

  choose_tap:function(e){
    let indx = e.currentTarget.dataset.indx;
    console.log("i choose indx:", indx)
    let _this = this;

    let city = _this.data.citys_info[indx].city;
    console.log("i choose at:", city)


    //---切换citys_info选中状态---//
    if (choose_del[indx] == true) choose_del[indx] = false;
    else choose_del[indx] = true;
    _this.setData({
      choose_del: choose_del
    })

    for (let i = 0; i < app.globalData.my_citys.length;i++ ){
      if (app.globalData.my_citys[i] == city){
        //app.globalData.my_citys.splice(i,1);
        console.log(" i tap at:", app.globalData.my_citys[i])
        //---切换global选中状态---//
        if (choose_del_global[i] == true) choose_del_global[i] = false;
        else choose_del_global[i] = true;
        break;
      }
    }


  },

  jump_city:function(e){
    let id = e.currentTarget.dataset.id;
    let indx = e.currentTarget.dataset.indx;
    wx.reLaunch({
      url: "/pages/index/index?id="+id+"&indx="+indx,
    })
  },


  add_tap:function(){
    let _this = this;
      //-------添加城市--------//
      wx.navigateTo({
        url: "/libs/citySelector/switchcity/switchcity?back_url='/pages/home/home'",
        success:function(e){
        //----修改数据emmmm 这里修改改不了，只能在/libs/citySelector/switchcity/switchcity中修改-----//
          console.log("after choose city, _this.data.address: ", _this.data.address)
          //////
          console.log("Hi i am here! ")
          
        }
      });
  },
  /**
   * 生命周期函数--监听页面显示-------刷新城市、天气
   * !!!!!!!!!!!!!!!!!!!!---------func函数有问题，获取数据为未知------!!!!!!!!!!!!!!!!!!!1
   */
  onShow: function () {
    let _this = this;
    //直接从最初的全局变量中读取城市,所以要注意修改城市时除了数据库，还要改全局变量。
    _this.setData({
      citys_name: app.globalData.my_citys,
      citys_info:[],  //刷新数据一下
      local_city_info: {}
    })
    //-----更新选中删除状态---//
    let len = app.globalData.my_citys.length;
    for (let i = 0; i < len; i++) {
      choose_del[i] = false;
      choose_del_global[i] = false;
      if(i == len-1){
        console.log("choose_del = ", choose_del,";;choose_del_globa =",choose_del_global)
        _this.setData({
          choose_del:choose_del
        })
      }
    }

    console.log("on show start:: app.globalData.my_citys: ", app.globalData.my_citys)


    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Here to get ip's wea
    _this.get_ip_weathertoday()

    for (let i = 0; i < _this.data.citys_name.length; i++){
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Here to get citys wea,注意顺序可能是和cityname不一样
      _this.get_city_weathertoday(_this.data.citys_name[i]); 
    }

    console.log("onshow end:: _this.data:", _this.data)
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

  },

  //获取ip
  get_ip_weathertoday: function() {
    var _this = this;
    // 获取IP地址
    wx.request({
      url: 'https://www.tianqiapi.com/ip/',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // 获取IP
        //console.log("get ip success :ip=", res.data.ip);
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Here to use
        _this.weathertoday_byip(res.data.ip)
      }
    });
  },

// 根据IP获取, 天气api实况天气（今日）
  weathertoday_byip: function (ip) {
    let _this = this;
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v6',
      data: {
        'ip': ip
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log("res.data", res.data);
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Here to use 
        //将今日天气加入对应城市
        _this.setData({
          local_city_info: res.data,
          success: function(){
            console.log("_this.local_city_info ->", _this.data.local_city_info);
          }
        })
      }

    });
  },
  // 根据City获取, 天气api实况天气（今日）
  get_city_weathertoday: function (a_city) {
    var _this = this;
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v6',
      data: {
        //'ip': ip,
        'city': a_city
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log("success get citytoday :res.data", res.data);

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Here to use
        //将今日天气加入对应城市
        _this.setData({
          citys_info: _this.data.citys_info.concat(res.data),
          success: function () {
            console.log("_this.citys_info ->", _this.data.citys_info);
          }
        })
      },
      fail: function (err) {
        console.log("fail get citytoday :err", err);
      }

    })
  },

})