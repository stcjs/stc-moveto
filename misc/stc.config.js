'use strict'
const stc = require('stc');
const moveto = require('../lib/index')

stc.config({
  include: ['template/', 'static/'],
  product: 'test'
})

stc.workflow({
  moveto: {
    plugin: moveto, include: {type: 'tpl'}, options: {
      debug: false
    }
  }
});

stc.start()
