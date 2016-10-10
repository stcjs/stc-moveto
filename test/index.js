import fs from 'fs'
import test from 'ava'
import {execSync} from 'child_process'
import {resolve} from 'path'

const root = resolve(__dirname, '../')
const RESULT_PATH = resolve(root, 'misc/result.html')
const BUILD_PATH = resolve(root, 'misc/output/template/demo.html')
const result = fs.readFileSync(RESULT_PATH, 'utf8')

test(t => {
  process.chdir(resolve(root, 'misc'))
  const stc = require('stc')
  const moveto = require('../lib/index')

  stc.config({
    include: ['template/', 'static/'],
    product: 'test'
  })

  stc.workflow({
    moveto: {plugin: moveto, include: {type: 'tpl'}}
  })

  stc.start()

  setTimeout(() =>{
    const build = fs.readFileSync(BUILD_PATH, 'utf8')
    t.is(build, result)
  }, 20000)
})
