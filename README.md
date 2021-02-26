# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

# 微信小程序之简易天气

## 功能
* 进入程序时通过云函数获取用户openid 自动更新信息。
* 自动获取当地城市的天气信息，包括七日天气和今日天气及其详情页。
* 点击上方**主目录**可进入我的城市页面，并可“添加城市”、“删除城市”。
* “删除城市”，采用批量选中删除的方式。
* "添加城市"，主要功能页在libs/citySelector中，本项目在137行 bindCounty函数中加入了保存数据的操作，对提示信息、常用城市的样式也稍作了修改。
## 项目展示
![图片1（信息页1）](https://github.com/KenelmQLH/Weather/raw/master/other/pic1.jpg)
![图片1（信息页2）](https://github.com/KenelmQLH/Weather/raw/master/other/pic2.jpg)
![图片1（编辑页）](https://github.com/KenelmQLH/Weather/raw/master/other/pic3.jpg)

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)


- [码云-qfr_bz](https://gitee.com/qfr_bz/citySelector)


