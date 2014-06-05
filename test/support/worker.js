/*!
 * hot-restart - test/support/worker.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var restarter = require('../../worker');


setInterval(function () {
  // do nothing
}, 1000);

restarter({
  disconnectTime: 0,
  exitTime: 0
});
