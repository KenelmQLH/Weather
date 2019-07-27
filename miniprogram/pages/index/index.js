//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

    weather: {},//实况天气
    weatherweek: [],//七日天气

    url_today:"",
    url_1: "",
    url_2: "",
    url_3: "",
  },
  onLoad: function (options) {
    console.log("options.id=", options.id, ",options.indx=", options.indx)
    let _this = this;
    if (options.id !== undefined) { //若是通过homejing'lai
      let city_id = options.id;
      console.log("type of indx:", typeof parseInt(options.indx))
      app.globalData.currentIndex = parseInt(options.indx);
      console.log("type of indx:", typeof app.globalData.currentIndex);

      _this.weathertoday_byCity(city_id);
      _this.weatherweekday_byCity(city_id);
      console.log("jummp from home, city id should be:", city_id)
    }
    else {  //若是第一次点击小程序进来;

      _this.getapi();  //一开始直接获取当前所在地的天气
      app.globalData.currentIndex = 0;
    }

    _this.animation = wx.createAnimation({ duration: 400, timingFunction: "ease-in-out" });
    console.log(_this.data);
  },
  onShow:function(){
  
  },
  //-------切换城市-上一个-----------//
  before_tap:function(){
    console.log("i tap before 0!!!,app.globalData.currentIndex= ", app.globalData.currentIndex)
    let _this = this;
    if(app.globalData.currentIndex == 0)
    {
      app.globalData.currentIndex = app.globalData.my_citys.length;
    }
    else{
      app.globalData.currentIndex = app.globalData.currentIndex -1;
    }
    console.log("i tap before 0.0!!")
    let index = app.globalData.currentIndex;
    //@@@@@@@@@@@注意到my_citys中不包括定位城市
    if (index == 0) {
      _this.getapi();
      console.log("i tap before here1!!!")
    }
    else {
      _this.weathertoday_byCity(app.globalData.my_citys[index - 1]);
      _this.weatherweekday_byCity(app.globalData.my_citys[index - 1]);
      console.log("i tap before here2!!!")

    }
  },
  //-------切换城市-下一个-----------//
  next_tap: function () {
    console.log("i tap before 0!!!,app.globalData.currentIndex= ", app.globalData.currentIndex)
    let _this = this;
    if (app.globalData.currentIndex == app.globalData.my_citys.length) {
      app.globalData.currentIndex = 0;
    }
    else {
      app.globalData.currentIndex = app.globalData.currentIndex +1;
    }
    console.log("i tap before 0.0!!!,app.globalData.currentIndex= ", app.globalData.currentIndex)
    let index = app.globalData.currentIndex;
    //@@@@@@@@@@@注意到my_citys中不包括定位城市
    if ( index == 0){
      _this.getapi();
      console.log("i tap before here1!!!")
    }
    else{
      _this.weathertoday_byCity(app.globalData.my_citys[index - 1]);
      _this.weatherweekday_byCity(app.globalData.my_citys[index - 1]);
      console.log("i tap before here2!!!")
     
    }
  },


 //一个思路，app init-> all cityname from base, a page a request
  home_tap: function(e){
    console.log("home_tap: ",e);
    wx.redirectTo({
      url: '/pages/home/home',
      success:function(res){
        console.log("jump to home: ", res);
      },
      
      fail:function(err){
        console.log("jump to home fail: ", err);
      }
    })
  },

  

  /*-------下拉刷新--------*/
  onPullDownRefresh: function () {
    let _this =this;
    // 标题栏加载刷新动画
    wx.showNavigationBarLoading();
    console.log("onPullDownRefresh");
    // 请求最新数据
    let index = app.globalData.currentIndex;
    if(index == 0){
      this.getapi();
    }
    else{
      _this.weathertoday_byCity(app.globalData.my_citys[ index- 1]);
      _this.weatherweekday_byCity(app.globalData.my_citys[index - 1]);
    }
    //清除动画,包括顶部和标题栏的刷新动画
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh();console.log("finish PullDownRefresh")}, 500);
  },

  //加载动画
  /*-------点击刷新---------*/
  fresh: function () {
    console.log("Refresh");
    let _this = this;
    let angle = 180;
    console.log("in");
    wx.showNavigationBarLoading();

    //设置定时器动画
    let timer = setInterval(function() {
      // 旋转
      _this.animation.rotate(angle).step();
      _this.setData({ animation: _this.animation.export() });
      if (angle === 180) angle = -180;
      else angle = 180;
    }, 400);
  
    // 请求最新数据
    let index = app.globalData.currentIndex;
    if (index == 0) {
      this.getapi();
    }
    else {
      _this.weathertoday_byCity(app.globalData.my_citys[index - 1]);
      _this.weatherweekday_byCity(app.globalData.my_citys[index - 1]);
    }

    setTimeout(function(){
      clearInterval(timer);
      wx.hideNavigationBarLoading();
      },1000);
    console.log("out2");

  },

  //查询ip，并通过ip查询天气
  getapi: function () {
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
        // 根据IP获取天气数据？？？？
        _this.weathertoday(res.data.ip); //调用函数得到今日天气
        _this.weatherweekday(res.data.ip);  //调用函数得到本周天气
        console.log("get api success :res=", res);
      }
    });
  },
  // 天气api实况天气（今日）
  weathertoday: function (ip) {
    var _this = this;
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v6',
      data: {
        'ip': ip,
        //city:"长沙"
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        _this.setData({
          weather: res.data, //添加今天的天气
          url_today: "/images/"+ res.data.wea_img +"_w.png" 
        });
        
        console.log(_this.data.weather);
      }
    });
  },
  // 天气api实况天气（本周）
  weatherweekday: function (ip) {
    var _this = this;
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v1',
      data: {
        'ip': ip
        //city: "长沙"
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        _this.setData({
          weatherweek: res.data, //设置本周天气信息
          url_1: "/images/" + res.data.data[1].wea_img + ".png",
          url_2: "/images/" + res.data.data[2].wea_img + ".png" ,
          url_3: "/images/" + res.data.data[3].wea_img+ ".png"
        });
        console.log(_this.data.weatherweek)
        //_this.process_data();
        //console.log(_this.data.weatherweek.data[2].wea_img);
      }
    });
  },

  // 天气api实况天气（今日）
  weathertoday_byCity: function (a_city) {
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
        _this.setData({
          weather: res.data, //添加今天的天气
          url_today: "/images/" + res.data.wea_img + "_w.png"
        });

        console.log(_this.data.weather);
      }
    });
  },
  // 天气api实况天气（本周）
  weatherweekday_byCity: function (a_city) {
    var _this = this;
    wx.request({
      url: 'https://www.tianqiapi.com/api/?version=v1',
      data: {
        //'ip': ip
        'city': a_city
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        _this.setData({
          weatherweek: res.data, //设置本周天气信息
          url_1: "/images/" + res.data.data[1].wea_img + ".png",
          url_2: "/images/" + res.data.data[2].wea_img + ".png",
          url_3: "/images/" + res.data.data[3].wea_img + ".png"
        });
        console.log(_this.data.weatherweek)
        //_this.process_data();
        //console.log(_this.data.weatherweek.data[2].wea_img);
      }
    });
  },
/*
  process_data:function(){
    let _this = this;
    let ra = "（";
    let rb = "）";
    for(let i=0;i<_this.data.weatherweek.data.length;i++)
    {
      let str = _this.data.weatherweek.data[i]["day"]
      console.log(i, " :str",str,typeof str);
      str.replace('日', "");
      str.replace(rb, "");
      console.log(i, " : newstr2", str);
      _this.data.weatherweek.data[i]["day"] = str;
      _this.setData({
        weatherweek: _this.data.weatherweek
      })
      console.log(_this.data.weatherweek.data[i]["day"]);
    }
  }
*/




})
