![](https://img.shields.io/badge/Version-2.2.2-green.svg) ![GitHub](https://img.shields.io/github/license/Dreace/NUC-Information.svg)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FDreace%2FNUC-Information.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FDreace%2FNUC-Information?ref=badge_shield)

### 这是什么？
一个简单的课程表&成绩信息查询微信小程序
### 有什么用 & 谁可以用？ 
方便中北大学的同学更方便的查询各种信息
目前只适配了中北的教务系统（URP 综合教务系统）

### 目前实现什么功能？
* 课程表和成绩查询
* 自动识别验证码
* 蹭课
* 自习室查询
* 大物实验成绩查询
* 校园导览
* 中北新闻、学校通知、学术活动查询
### 正在做什么？
* 正计划将项目从微信脱离出来，开发独立的 Android 和 iOS 应用
* 逐步适配国内大部分学校的教务系统
* 继续保持开源
* 未来将会开放服务端（Python）源码（[NUC-Information-Backend](https://github.com/Dreace/NUC-Information-Backend)）

有想要一起完成这个项目的同学可以通过下面的方式联系我
* [知乎][zhihu]
* [博客][blog]
* [邮箱][email]
* [微博][weibo]
### 如何使用
使用微信扫描下方小程序码

<img height="30%" width="30%" src="https://s2.ax1x.com/2019/06/30/Z1RNXd.jpg"/>

QQ 小程序码

<img height="30%" width="30%" src="https://s2.ax1x.com/2019/07/22/eiQ7qg.jpg"/>

初次使用会提示设置教务系统账号密码

<img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqXyfx.png"/> <img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqX26O.png"/>

设置完成保存即可，返回到成绩或者课程表界面刷新即可查看信息，上部可以选择查看的学期

<img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqXB79.png"/> <img height="30%" width="30%" src="https://s2.ax1x.com/2019/06/30/Z1gdvd.png"/>

在“更多”页面还有其他小功能

<img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqXRXD.png"/> <img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqXjBQ.png"/> <img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqXv7j.png"/>

蹭课、空教室、校园导览等

<img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqX47d.png"/> <img height="30%" width="30%" src="https://s2.ax1x.com/2019/06/30/Z1gyUf.png"/> <img height="30%" width="30%" src="https://s2.ax1x.com/2019/11/23/MqXh0H.png"/>

*注：所有信息来自教务系统和学校官网，空教室、蹭课、安排等有时效性的信息只有本学期内容

### 版本日志
#### Version 2.2.2
  1. A 新增 空教室查询
#### Version 2.2.1
  1. A 新增 多账号管理
  2. F 修复几处小问题
#### Version 2.2.0
  1. U 更新 全新「我的」页面设计
  2. A 新增「中北指南」
  3. A 新增 缓存管理
  4. A 新增 成绩页显示滚动公告
  5. O 优化 账号管理
  6. O 优化 公告展示时机
  7. O 优化 整体结构调优
#### Version 2.1.12
  1. F 修复 部分同学无法添加账号
#### Version 2.1.11
  1. A 新增 异步成绩查询
#### Version 2.1.10
  1. A 新增 公告列表与置顶公告
  2. A 新增 重要公告直接显示
#### Version 2.1.9
  1. F 修复 体测成绩查询
#### Version 2.1.8
  1. O 优化 重叠课程显示
  2. O 优化 账号迁移提示
  3. F 修复 蹭课到课程表添加失败
#### Version 2.1.7
  1. U 更新 适配新版教务系统，需要重新登录
  2. A 新增 导出成绩
  3. R 移除 课程表学期切换
#### Version 2.1.6
  1. F 修复 课程表导出异常问题
#### Version 2.1.5
  1. A 新增 成绩查询模式二，仅供原有模式失效时使用
  2. R 移除 考试安排查询
#### Version 2.1.4
  1. U 更新 页面位置
  2. U 更新 完善鉴权机制
#### Version 2.1.3
  1. A 新增 游客模式
  2. U 更新 体测成绩页面 UI
#### Version 2.1.2
  1. A 新增 查询体测成绩
  2. A 新增 手动添加的课程表可修改
  3. U 更新 通知栏移动到课程表页面顶部
  4. F 修复 通知栏滚动失效
  5. F 修复 刷新成绩提示无数据后本地数据被暂时覆盖
#### Version 2.1.0
  1. A 新增 一卡通余额查询
  2. A 新增 图书馆藏书查询
  3. A 新增 班级课表查询
  4. A 新增 咨询内容可以转发
  5. U 更新 登陆界面
  6. U 更新 用户协议
  7. U 更新 课程详情弹窗
  8. U 更新 校园导览配色
  9. U 更新 咨询页面布局与配色
  10. F 修复 无法从分享的课表或成绩页面返回
#### Version 2.0.11
  1. 增加反馈接口
#### Version 2.0.10
  1. 统一视觉效果
  2. 调整一些功能入口
#### Version 2.0.9
  1. 对全部 API 进行重构提升兼容性
  2. 更新一些图标资源
#### Version 2.0.8
  1. 新增：咨询查询，包括中北新闻、学校通知和学术活动
  2. 注：数据来自学校官网，每十分钟更新一次，若涉及到附件下载需到官网下载
#### Version 2.0.7
  1. 课程表界面学期选择默认隐藏，可在左上角开启
  2. 不再有操作频繁的提示
  3. QQ 小程序即将上线
#### Version 2.0.6
  1. 调整学期切换方式
  2. 全新的成绩页面
  3. 服务器优化，连续查询加载时间减少 50%
#### Version 2.0.5
  1. 增加功能状态显示
  2. 发生特殊情况时展示更详细的信息
#### Version 2.0.4
  1. 新功能：校园导览
  2. 替换“更多”页面图标
  3. UI 调整
  4. 修复一些问题
#### Version 2.0.3
  1. 我的页面顶部增加滚动通知
  2. 可以通过观看视频广告来支持小程序
#### Version 2.0.1
  1. 课程表可以切换显示的周数并增加日期和上课事件显示
  2. “更多”页面布局调整
  3. UI 微调
#### Version 2.0.0
  1. 新功能：大物实验成绩查询，可在 更多->大物实验 找到该功能
  2. 注：仅可查询自行预约的大物实验成绩"
#### Version 1.9.9
  1. 新功能：全校无课教室查询
  2. 注：可在 更多->自习室 使用查询功能
#### Version 1.9.8
  1. bug 修复
#### Version 1.9.7
  1. 新增蹭课功能，可以搜索全校课程并添加到自己的课程表中，可以在“更多”页面找到
  2. “公告”页面替换为“更多”页面，公告、FAQ、版本、开源的等页面移入
  3. 注：蹭课功能还在测试中，如遇到问题请及时反馈
#### Version 1.9.5
  1. 新增手动添加课程表功能，点击课程表页面的“加号”可以找到
  2. 分享课程表和成绩时只分享当前查看的学期
#### Version 1.9.2
  1. bug 修复
  2. 课程表底部增加没有具体时间的课程显示
#### Version 1.9.0
  1. 新增公告页面
#### Version 1.8.9.5
  1. 账号切换逻辑优化 
  2. 服务端代码开源，可在 我的->关于->开源 查看项目地址
#### Version 1.8.9
  1. 修复课程表在特殊情况下显示异常
  2. 测试与保存按钮合并为登录按钮
  3. 新增账号切换功能
#### Version 1.8.8
  1. 增加导出课程表功能，具体使用方法可在导出页面查看
  2. 在最近一个学期成绩最后增加全部学期的 GPA 显示（全部和必修）
  3. 右下角的按钮可切换到左下角
#### Version 1.8.7
  1. 增加服务器负载显示
  2. 一些细微调整
  3. 开发中功能：1.计算全部课程绩点而不是只有一个学期绩点 2.导出课程表到日历（包含上下课时间），熟悉 iCal 的同学可以联系我共同完成
#### Version 1.8.6
  1. UI 配色修改
  2. 加粗显示当前周数
  3. 调整右下角刷新按钮
  4. 如果你希望共同开发小程序请到 GitHub 查看相关信息
  5. 开源代码转到另一个账号下，原有代码不再更新，新的地址可以在 我的->关于->开源 查看
  6. 注：由于发现一些比较严重的问题提前发布这个开发版本
#### Version 1.8.5
  1. 做了一些清理
  2. 修复几处遗留问题
#### Version 1.8.3
  1. 相同的课程表使用相同的颜色显示
  2. 稍微修改了课程表显示方式（需重新获取课程表并重启小程序）
  3. 常规修复
#### Version 1.8.0
  1. 增加广告显示，具体信息请查看“关于”页面
  2. 修复 iPad 课程表显示不正常
  3. 课程表左上角增加当前周数显示
  4. 增加服务器状态显示
  5. 修改登录提示
  6. 取消下拉刷新成绩
  7. UI 调整
#### Version 1.7.0
  1. 调整登录方式为个人门户，请及时更新信息
  2. 修复挂科成绩无法显示的 bug
  3. 账号设置页面增加测试登录按钮
  4. 提升信息获取速度
  5. 逻辑优化
  6. UI 调整
#### Version 1.6.0
  1. 优化课程表显示
  2. 调整打开分享逻辑
  3. 点击课程可以显示时间重复的课程（滑动查看）
  4. UI 调整
 #### Version 1.5.5
  1. tips:打开分享后，再次刷新查看自己的信息
  2. 调整打开分享卡片的逻辑
  3. 修复一个恶性 bug
  4. 修复加载数据时逻辑错误
  #### Version 1.5.3
  1. 加客服入口
  2. 可通过右上角进行转发操作
  3. 冷启动时主动检查更新
  4. UI 调整

[blog]:https://dreace.top
[zhihu]:https://www.zhihu.com/people/ni-xiang-42-96/
[weibo]:http://weibo.com/Dreace
[email]:mailto:Dreace@Foxmail.com


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FDreace%2FNUC-Information.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FDreace%2FNUC-Information?ref=badge_large)