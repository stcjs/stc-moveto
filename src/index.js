import Plugin from 'stc-plugin';
import jsonuri from 'jsonuri'
import {
  convert2Comment,
  findHeadIdx,
  findTailIdx,
  isMovetoDirective,
  isTag,
  sort,
  unique,
  delAttr,
  clone
} from './util'

const POINT_MAP = {head: true, tail: true}
export default class MovetoPlugin extends Plugin {
  async run() {
    let moveTask = {
      tasks: []
    }

    let tokens = await this.getAst()
    tokens.forEach((token, idx) => {
      let point, url, lang
      for (let type of ['script', 'link', 'style']) {
        if (isTag(token, type)) {
          [point, url, lang] = MovetoPlugin[`${type}Handler`](token)
          POINT_MAP[point] && moveTask.tasks.push({idx, lang, point, url, token: clone(token)})
          return
        }
      }
    })

    tokens = this.doMove(tokens, moveTask)
    return tokens
  }

  async update(tokens) {
    this.setAst(tokens)
  }

  /**
   * 0. 进行排序，head 在前，tail 在后
   * 1. 根据 url 去重, 标记要去重的 token idx
   * 2. 标记成功的 idx
   * 3. 标记失败和成功注释
   * 4. 先插入css, 再插入js
   */
   doMove(tokens, moveTask) {
    let uniqueIdx = [], succIdx = []
    let tasks = moveTask.tasks = sort(moveTask.tasks, 'point', ['head', 'tail'])
    unique(tasks, 'url', {skipNull: true, callback(o, i) {
      uniqueIdx.unshift(o.idx)
    }})
    tasks.forEach(o => {succIdx.push(o.idx)})

    uniqueIdx.forEach(idx => {
      convert2Comment(tokens, idx, `FAIL: unique`)
    })

    succIdx.forEach(idx => {
      convert2Comment(tokens, idx, `SUCC:`)
    })

    'css,js'.split(',').forEach(lang => {
      tasks.forEach(o => {
        let injectIdx
        if(o.lang === lang) {
          switch (o.point) {
            case 'head':
              injectIdx = findHeadIdx(tokens)
              break
            case 'tail':
              injectIdx = findTailIdx(tokens)
              break
            default:
          }
          delAttr(o.token, isMovetoDirective)
          tokens.splice(injectIdx, 0, o.token)
        }
      })
    })
    return tokens
  }

  static scriptHandler(token) {
    let attrs = jsonuri.get(token, 'ext/start/ext/attrs') || []
    let point, url
    for (let attr of attrs) {
      if (isMovetoDirective(attr.nameLowerCase)) {
        point = attr.value
        url = (attrs.filter((item) => item.name === 'src')[0] || []).value
        break
      }
    }

    return [point, url, 'js']
  }

  static linkHandler(token) {
    let attrs = jsonuri.get(token, 'ext/attrs') || []
    let point, url
    for (let attr of attrs) {
      if (isMovetoDirective(attr.nameLowerCase)) {
        point = attr.value
        url = (attrs.filter((item) => item.name === 'href')[0] || []).value
        break
      }
    }

    return [point, url, 'css']
  }

  static styleHandler(token) {
    let attrs = jsonuri.get(token, 'ext/start/ext/attrs') || []
    let point, url
    for (let attr of attrs) {
      if (isMovetoDirective(attr.nameLowerCase)) {
        point = attr.value
        url = (attrs.filter(item => item.name === 'href')[0] || []).value
        break
      }
    }

    return [point, url, 'css']
  }

  static cluster() {
    return false
  }

  static cache() {
    return false
  }
}
