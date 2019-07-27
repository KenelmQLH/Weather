//app.js
App({
  globalData: {
    userInfo: null,
    currentIndex: 0,
    my_citys: [],
    openid: ""
  },

  //从数据库获取用户的，常用城市名称的信息
  onLaunch: function () {
    let _this = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    }
    else {
      wx.cloud.init({
        env: 'weauser-ljny5',
        traceUser: true,
      })
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          //console.log('callFunction login result: ', res)
          console.log('login result: openid= ', res.result.openid)
          let t = res.result.openid;
          _this.globalData.openid = t;
          //console.log("global:", _this.globalData)

          //----------向数据库查询用户的doc_id-----------//
          const db = wx.cloud.database({
            env: 'weauser-ljny5'
          })

          console.log("result.openid t:：", t)
          db.collection('users').where({
            _openid: t
          }).get({
            success: function (res) {
              console.log("find user，res：", res, ",res._id", res.data[0]._id)
              if (res.data[0]._id !== undefined) {
                _this.globalData.doc_id = res.data[0]._id;
                console.log("!!!doc_id:", res.data[0]._id)
                //-------初始化城市----------//
                _this.globalData.my_citys = res.data[0].user_citys;

              }
              else {
                _this.globalData.doc_id = "";
                console.log("no doc_id!!!:")
                //-------初始化城市----------//
                _this.globalData.my_citys = [];
              }

            }
          })
        }
      })
      console.log('完成初始化云环境！')
    }
  },
  onLoad: function () {

  }

})

