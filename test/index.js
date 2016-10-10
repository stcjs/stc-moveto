import fs from 'fs'
import test from 'ava'
import {execSync} from 'child_process'

const RESULT_PATH = '../misc/result.html'
const BUILD_PATH = '../misc/output/template/demo.html'
const result = fs.readFileSync(RESULT_PATH, 'utf8')

test('init', t => {
  execSync('npm run build-test')
  const build = fs.readFileSync(BUILD_PATH, 'utf8')
  t.is(build, result)
})
