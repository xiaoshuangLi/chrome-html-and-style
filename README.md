# Magi/Low-code 前端框架纪要

## 支持生成本地变量

本地变量，功能在于方便读取使用组件属性，用于接口请求的入参。一个页面可以创建多个本地变量，变量名不可重复，只允许输入英文字符。本地变量以页面纬度划分，页面之间变量相互独立存在。

本地变量数据来源于组件属性，当接口发起请求时候，通过接口入参于本地变量的绑定关系，生成接口入参数据，然后发起接口请求。

组件属性 ==> 本地变量 ==> 接口入参

### 底层实现
页面逻辑数据里定义本地变量逻辑：

1. 当页面初始化时，生成本地变量；

2. 当绑定组件属性修改时，修改对应绑定的本地变量；

### 交互操作

1. 点击页面顶栏 “变量” 按钮，弹出弹窗显示当前页面本地变量列表；

2. 本地变量列表展示，本地变量名对应组件属性值。文本框展示本地变量名，可以编辑。级联选择框展示组件属性，点击弹出下拉列表，方便用户选择对应组件属性。

3. 点击添加变量按钮，本地变量名必填，组件属性必填。

![变量列表](https://cdn-health.zhongan.com/magiccube/resource/rl/CAA-84QDoQ.png?1)

## 支持生成后端接口

部分后端接口可由用户操作前端页面生成。

**SQL 查询:** 支持输入 SQL 语句，生成查询数据接口，后端需要生成接口入参出参结构。

**Process:** 支持输入 Process 名称，选择本地可用变量，后端需要生成接口入参结构，出参结构后续开发手动补充。

### 底层实现
页面逻辑数据里定义接口入参与本地变量绑定逻辑：

1. 当页面初始化时，绑定接口入参属性与对应本地变量；

2. 发起请求，通过绑定关系，读取本地变量数据，生成接口入参，并发起请求；

### 交互操作 - 创建 SQL 查询

1. 点击页面顶栏 “SQL查询” 按钮，弹出创建 SQL查询 表单；

2. 接口标识，只允许英文字符，必填；接口名称，选填；SQL 语句必填。

![SQL 查询](https://cdn-health.zhongan.com/magiccube/resource/rl/FAhlC4WCST.png?1)

### 交互操作 - 创建 Process

1. 点击页面顶栏 “Process” 按钮，弹出创建 Process 表单；

2. 接口标识，只允许英文字符，必填；接口名称，选填；使用变量，从当前页面本地变量中选择，必填。

![Process](https://cdn-health.zhongan.com/magiccube/resource/rl/Qc1j7QIoYP.png?1)

## 支持组件数据绑定接口出参
选择组件属性值与对应的接口出参字段进行绑定。组件的每个属性，都可独立绑定数据来源。数据来源于不同接口的出参，包括 Process, Query。

### 底层实现
页面逻辑数据里定义接口出参与组件属性绑定逻辑：

1. 当渲染组件时，发现对应接口出参绑定逻辑，读取接口数据；

2. 当接口发起请求时，根据接口出参与组件属性绑定关系，刷新组件属性，还原页面数据。

### 交互操作
1. 选择需要绑定数据的组件；

2. 右边侧栏切换至 “数据” 栏；

3. “数据”栏，展示当前组件所有可以绑定的组件属性；

4. 组件属性对应一个级联选择框，可以选择接口的出参属性。

![绑定](https://cdn-health.zhongan.com/magiccube/resource/rl/PjmBUVdBaI.png?4)

## 支持事件逻辑绑定
通过快捷交互，绑定组件的触发事件。每个组件都会有通用的 “初始化事件”。可绑定的事件只有以下三种：

**执行脚本:** 调用本地开发的代码文件，拓展功能。需要输入文件名。
**接口请求:** 调用远程的接口。需要从 process, query 里，选择需要请求的接口。
**跳转页面:** 跳转内部路由或外部链接。内部路由指选择已创建的页面，外部链接指用户手动输入跳转地址。

### 底层实现
页面逻辑数据里定义触发组件事件时，需要执行的任务：

1. 当触发组件事件时，执行对应的任务队列；

### 交互 - 绑定事件
1. 选择需要绑定数据的组件；

2. 右边侧栏切换至 “事件” 栏；

3. “事件”栏，展示当前组件所有可以绑定的事件；

4. 点击对应事件右边的 “添加” 图标，可以选择想要添加的执行任务。

![事件](https://cdn-health.zhongan.com/magiccube/resource/rl/z9fKMRW6qD.png?1)
