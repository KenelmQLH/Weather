# 微信小程序之简易天气

## 功能
* 进入程序时通过云函数获取用户openid 自动更新信息。
* 自动获取当地城市的天气信息，包括七日天气和今日天气及其详情页。
* 点击上方**主目录**可进入我的城市页面，并可“添加城市”、“删除城市”。
* “删除城市”，采用批量选中删除的方式。
* "添加城市"，主要功能页在libs/citySelector中，本项目在137行 bindCounty函数中加入了保存数据的操作，对提示信息、常用城市的样式也稍作了修改。


## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

- [码云-qfr_bz](https://gitee.com/qfr_bz/citySelector)

