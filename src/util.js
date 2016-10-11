import {TokenType} from 'flkit'
import fs from 'fs'
import jsonuri from 'jsonuri'

export function noop() {
}

export function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

export function isTag(token, tagname) {
  if (token.type) {
    switch (token.type) {
      case TokenType.HTML_TAG_START:
        return token.ext.tagLowerCase === tagname
      case TokenType.HTML_TAG_TEXTAREA:
        return tagname === "textarea"
      case TokenType.HTML_TAG_SCRIPT:
        return tagname === "script"
      case TokenType.HTML_TAG_STYLE:
        return tagname === "style"
      case TokenType.HTML_TAG_PRE:
        return tagname === "pre"
    }
  }

  return false;
}

/**
 *
 * @param token
 * @param injectPoint 'head' => </head> , 'tail' => </body>
 * @returns {boolean}
 */
export function isInject(token, injectPoint) {
  if (!(token && token.type === TokenType.HTML_TAG_END && token.ext && token.ext.tagLowerCase)) {
    return false
  }

  switch (injectPoint) {
    case 'head':
      return token.ext.tagLowerCase === 'head'
    case 'tail':
      return token.ext.tagLowerCase === 'body'
  }
}

/**
 * moveto, moveTo, move-to, stc-moveto, stc-moveTo, stc-move-to...
 */
export function isMovetoDirective(dirct) {
  return String(dirct).trim().replace(/-/g, '').replace(/^stc/, '').toLocaleLowerCase() === 'moveto'
}

/**
 * 简单数组去重，操作原数组
 * O(n^2)复杂度。保持稳定性 ([1,3,2,1]应该去掉第2个1，不进行sort)
 */
export function unique(arr, key, {
  skipNull = false,
  callback = noop
}) {
  // 有key，以数组的对象的key进行除重
  let i, j;
  for (i = arr.length - 1; i > -1; --i) {
    for (j = i - 1; j > -1; --j) {
      if (key) {
        if ((arr[i] && arr[i][key]) === (arr[j] && arr[j][key])) {
          if (skipNull && arr[i][key] == null) {
            continue
          }
          callback(arr[i], i)
          arr.splice(i, 1)
        }
      } else {
        if (arr[i] === arr[j]) {
          callback(arr[i], i)
          arr.splice(i, 1)
        }
      }
    }
  }
  return arr
}

/**
 * 严格 sort， 保持稳定性
 */
export function sort(arr, key, order) {
  let ret = []
  order.forEach(o => {
    arr.forEach(p => {
      if (p[key] === o) {
        ret.push(p)
      }
    })
  })

  return ret
}

export function convert2Comment(tokens, index, msg) {
  let token = tokens[index]
  if (!token) return
  const lt = [/<-+/g, '&lt;--']
  const gt = [/-+!?>/g, '--&gt;']

  token.type = TokenType.RESERVED_COMMENT
  token.value = `<!-- ${msg} ${token.value.replace(lt[0], lt[1]).replace(gt[0], gt[1])} -->\n`
  return tokens
}

/**
 * 找到 </head> 标签的 index
 * @param tokens
 * @returns {*}
 */
export function findHeadIdx(tokens) {
  return tokens.map((token, idx) => isInject(token, 'head') ? idx : 0).filter(Boolean)[0]
}

/**
 * 找到 </body> 标签的 index
 * @param tokens
 * @returns {*}
 */
export function findTailIdx(tokens) {
  return tokens.map((token, idx) => isInject(token, 'tail') ? idx : 0).filter(Boolean)[0]
}

export function var_dump(data, path = 'dump') {
  fs.writeFileSync(`${__dirname}/${path}.json`, JSON.stringify(data, null, 2), 'utf8')
}

export function delAttr(token, key) {
  let attrs = jsonuri.get(token, 'ext/attrs') || jsonuri.get(token, 'ext/start/ext/attrs') || []
  let newAttrs = []

  for (let attr of attrs) {
    if (typeof key === 'function') {
      if (key(attr.name)) {
        continue
      }
      newAttrs.push(attr)
    }
  }

  if (jsonuri.get(token, 'ext/attrs')) {
    jsonuri.set(token, 'ext/attrs', newAttrs)
  }
  if (jsonuri.get(token, 'ext/start/ext/attrs')) {
    jsonuri.set(token, 'ext/start/ext/attrs', newAttrs)
  }
  return token
}
