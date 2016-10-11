# stc-moveto

<!--[![Build Status](https://travis-ci.org/stcjs/stc-moveto.svg?branch=master)](https://travis-ci.org/stcjs/stc-moveto/branches)-->
[![dependencies Status](https://david-dm.org/stcjs/stc-moveto/status.svg)](https://david-dm.org/stcjs/stc-moveto)
[![devDependencies Status](https://david-dm.org/stcjs/stc-moveto/dev-status.svg)](https://david-dm.org/stcjs/stc-moveto?type=dev)
<!--[![NPM version](https://img.shields.io/npm/v/stc-helper.svg?style=flat-square)](http://badge.fury.io/js/stc-helper)-->
<!--[![Coverage Status](https://coveralls.io/repos/github/stcjs/stc-helper/badge.svg?branch=master&v=1)](https://coveralls.io/github/stcjs/stc-helper?branch=master)-->
<!--[![codecov](https://codecov.io/gh/stcjs/stc-moveto/branch/master/graph/badge.svg)](https://codecov.io/gh/stcjs/stc-moveto)-->

## Install

```sh
npm install stc-moveto
```

## How to use

```
const csslint = require('stc-moveto')

stc.workflow({
  moveto: {plugin: moveto, include: {type: 'tpl'}}
})

```


```
<script stc-moveto="head"  src="xxx"></script>
<link stc-moveto="head">
<style stc-moveto="tail"></style>
```

## 规则
* head 将移动到 &lt;/head&gt; 处
* tail 将移动到 &lt;/body&gt;  处
* 同样的外链资源 url 将会只插入第一个插入点，其余过滤
* css 永远比 js 靠前
* 如果页面没有 &lt;/head&gt; ,  &lt;/body&gt;  标签，将不做处理
* stc-moveto, moveto, moveTo, move-to 等写法均可，推荐 stc-moveto
* 更多特性参见 [demo](misc/template/demo.html) [编译结果](misc/result.html)
