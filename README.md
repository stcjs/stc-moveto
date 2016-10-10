# stc-moveto

标签移动指令
接收参数  head, tail

## 使用

```
<script stc-moveto="head"  src="xxx"></script>
<link stc-moveto="head">
<style stc-moveto="tail"></style>
```

## 规则
* head 将移动到 &lt;/head&gt; 处
* 同样的外链资源 url 将会只插入第一个插入点，其余过滤
* tail 将移动到 &lt;/body&gt;  处
* css 永远比 js 靠前
* 如果页面没有 &lt;/head&gt; ,  &lt;/body&gt;  标签，将不做处理
* 更多特性参见 [demo](misc/template/demo.html) [编译结果](misc/result.html)
